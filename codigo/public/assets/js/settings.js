const API_PATH = '';
const LOGIN_URL = '/index.html';

const texts = {
    pt: {
        title: 'Configurações',
        preferences: 'Preferências',
        darkMode: 'Modo Escuro',
        language: 'Idioma',
        profile: 'Perfil',
        personalInfo: 'Informações Pessoais',
        fullName: 'Nome Completo',
        username: 'Nome de Usuário',
        bio: 'Bio',
        contact: 'Contato',
        email: 'E-mail',
        phone: 'Telefone',
        security: 'Segurança',
        securityHint: 'Deixe em branco se não quiser alterar a senha.',
        currentPassword: 'Senha Atual',
        newPassword: 'Nova Senha',
        confirmPassword: 'Confirmar Senha',
        save: 'Salvar Alterações',
        saved: 'Alterações salvas com sucesso!',
        errorLoad: 'Erro ao carregar seus dados.',
        errorSave: 'Erro ao salvar. Tente novamente.',
        loginRequired: 'Você precisa estar logado para acessar as configurações.',
        wrongPassword: 'Senha atual incorreta.',
        passwordMismatch: 'As senhas não coincidem.',
        passwordTooShort: 'A nova senha deve ter pelo menos 3 caracteres.',
        fillRequired: 'Preencha nome, usuário e e-mail.'
    },
    en: {
        title: 'Settings',
        preferences: 'Preferences',
        darkMode: 'Dark Mode',
        language: 'Language',
        profile: 'Profile',
        personalInfo: 'Personal Information',
        fullName: 'Full Name',
        username: 'Username',
        bio: 'Bio',
        contact: 'Contact',
        email: 'E-mail',
        phone: 'Phone',
        security: 'Security',
        securityHint: 'Leave blank if you do not want to change your password.',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        save: 'Save Changes',
        saved: 'Changes saved successfully!',
        errorLoad: 'Error loading your data.',
        errorSave: 'Error saving. Please try again.',
        loginRequired: 'You must be logged in to access settings.',
        wrongPassword: 'Current password is incorrect.',
        passwordMismatch: 'Passwords do not match.',
        passwordTooShort: 'New password must be at least 3 characters.',
        fillRequired: 'Please fill in name, username and email.'
    }
};

let usuarioCorrente = null;
let usuarioCompleto = null;

const darkModeToggle = document.getElementById('darkModeToggle');
const langFilter = document.getElementById('langFilter');
const saveBtn = document.getElementById('saveBtn');
const saveBtnMobile = document.getElementById('saveBtnMobile');
const feedback = document.getElementById('feedback');

function t(key) {
    const lang = langFilter?.value || localStorage.getItem('settings-lang') || 'pt';
    return texts[lang][key] || texts.pt[key];
}

function applyLanguage(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-br';
    document.getElementById('pageTitle').textContent = texts[lang].title;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[lang][key]) el.textContent = texts[lang][key];
    });
    saveBtn.textContent = texts[lang].save;
    if (saveBtnMobile) saveBtnMobile.textContent = texts[lang].save;
    localStorage.setItem('settings-lang', lang);
}

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback-message ${type}`;
    feedback.hidden = false;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideFeedback() {
    feedback.hidden = true;
    feedback.textContent = '';
}

function applyDarkMode(isDark) {
    if (window.setDarkMode) {
        window.setDarkMode(isDark);
        return;
    }
    document.documentElement.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('dark-mode', isDark ? 'true' : 'false');
    if (darkModeToggle) darkModeToggle.checked = isDark;
}

function updateProfileBanner(usuario) {
    const inicial = (usuario.nome || usuario.login || '?').charAt(0).toUpperCase();
    document.getElementById('profileAvatar').textContent = inicial;
    document.getElementById('profileName').textContent = usuario.nome || 'Usuário';
    document.getElementById('profileLogin').textContent = '@' + (usuario.login || 'usuario');

    const roleEl = document.getElementById('profileRole');
    if (roleEl && usuario.tipo) {
        roleEl.textContent = usuario.tipo;
    }
}

function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').substring(0, 11);

    if (numeros.length > 6) {
        return numeros.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    }
    if (numeros.length > 2) {
        return numeros.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    if (numeros.length > 0) {
        return numeros.replace(/^(\d{0,2})/, '($1');
    }
    return '';
}

async function carregarUsuario() {
    const resposta = await fetch(`${API_PATH}/usuarios/${usuarioCorrente.id}`);
    if (!resposta.ok) throw new Error('Usuário não encontrado');
    return resposta.json();
}

function preencherFormulario(usuario) {
    document.getElementById('nomeCompleto').value = usuario.nome || '';
    document.getElementById('nomeUsuario').value = usuario.login ? '@' + usuario.login : '';
    document.getElementById('bio').value = usuario.bio || '';
    document.getElementById('email').value = usuario.email || '';
    document.getElementById('campo-telefone').value = usuario.telefone || '';

    if (usuario.tipo) {
        const roleFilter = document.getElementById('roleFilter');
        const option = Array.from(roleFilter.options).find(opt => opt.value === usuario.tipo);
        if (option) roleFilter.value = usuario.tipo;
    }

    updateProfileBanner(usuario);
}

async function salvarAlteracoes() {
    hideFeedback();

    const nome = document.getElementById('nomeCompleto').value.trim();
    const loginRaw = document.getElementById('nomeUsuario').value.trim().replace(/^@/, '');
    const email = document.getElementById('email').value.trim();

    if (!nome || !loginRaw || !email) {
        showFeedback(t('fillRequired'), 'error');
        return;
    }

    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    const dados = {
        nome,
        login: loginRaw,
        bio: document.getElementById('bio').value.trim(),
        email,
        telefone: document.getElementById('campo-telefone').value.trim(),
        tipo: document.getElementById('roleFilter').value
    };

    if (novaSenha || confirmarSenha || senhaAtual) {
        if (senhaAtual !== usuarioCompleto.senha) {
            showFeedback(t('wrongPassword'), 'error');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            showFeedback(t('passwordMismatch'), 'error');
            return;
        }
        if (novaSenha.length < 3) {
            showFeedback(t('passwordTooShort'), 'error');
            return;
        }
        dados.senha = novaSenha;
    }

    saveBtn.disabled = true;
    if (saveBtnMobile) saveBtnMobile.disabled = true;

    try {
        const resposta = await fetch(`${API_PATH}/usuarios/${usuarioCorrente.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) throw new Error('Falha ao salvar');

        usuarioCompleto = await resposta.json();

        usuarioCorrente.nome = usuarioCompleto.nome;
        usuarioCorrente.login = usuarioCompleto.login;
        usuarioCorrente.email = usuarioCompleto.email;
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));

        updateProfileBanner(usuarioCompleto);

        document.getElementById('senhaAtual').value = '';
        document.getElementById('novaSenha').value = '';
        document.getElementById('confirmarSenha').value = '';

        showFeedback(t('saved'), 'success');
    } catch (erro) {
        console.error(erro);
        showFeedback(t('errorSave'), 'error');
    } finally {
        saveBtn.disabled = false;
        if (saveBtnMobile) saveBtnMobile.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente') || 'null');

    if (!usuarioCorrente) {
        alert(texts.pt.loginRequired);
        window.location.href = LOGIN_URL;
        return;
    }

    updateProfileBanner(usuarioCorrente);

    const savedLang = localStorage.getItem('settings-lang') || 'pt';
    langFilter.value = savedLang;
    applyLanguage(savedLang);

    if (localStorage.getItem('dark-mode') === 'true') {
        applyDarkMode(true);
    }

    darkModeToggle.addEventListener('change', () => {
        applyDarkMode(darkModeToggle.checked);
    });

    langFilter.addEventListener('change', (e) => {
        applyLanguage(e.target.value);
    });

    document.getElementById('campo-telefone').addEventListener('input', (e) => {
        e.target.value = formatarTelefone(e.target.value);
    });

    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
        });
    });

    saveBtn.addEventListener('click', salvarAlteracoes);
    if (saveBtnMobile) saveBtnMobile.addEventListener('click', salvarAlteracoes);

    document.querySelectorAll('.config-aba').forEach(aba => {
        aba.addEventListener('click', () => {
            document.querySelectorAll('.config-aba').forEach(a => a.classList.remove('ativo'));
            aba.classList.add('ativo');
        });
    });

    try {
        usuarioCompleto = await carregarUsuario();
        preencherFormulario(usuarioCompleto);
    } catch (erro) {
        console.error(erro);
        showFeedback(t('errorLoad'), 'error');
    }
});
