function apiUrl(path) {
  if (window.SITE_CONFIG && typeof SITE_CONFIG.api === 'function') {
    return SITE_CONFIG.api(path);
  }
  return '/' + String(path || '').replace(/^\/+/, '');
}

function alternarMenu() {
  document.getElementById('menuMobile').classList.toggle('aberto');
}

document.addEventListener('DOMContentLoaded', async () => {
  const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente') || 'null');

  if (!usuarioCorrente) {
    alert('Você precisa estar logado para acessar o perfil.');
    window.location.href = (window.SITE_CONFIG && SITE_CONFIG.loginUrl) || '/modulos/login/login.html';
    return;
  }

  await carregarPerfil(usuarioCorrente);
  await carregarAnimais(usuarioCorrente.id);
});

async function carregarPerfil(usuarioCorrente) {
  try {
    const resposta = await fetch(apiUrl(`usuarios/${usuarioCorrente.id}`));
    if (!resposta.ok) throw new Error('Usuário não encontrado');
    const usuario = await resposta.json();

    document.querySelector('.info-usuario h1').textContent = usuario.nome || 'Nome do Usuário';
    document.querySelector('.arroba').textContent = '@' + (usuario.login || 'usuario');

    if (usuario.tipo)        document.querySelector('.badge-tipo').textContent = usuario.tipo;
    if (usuario.bio)         document.querySelector('.bio').textContent = usuario.bio;

    const itensInfo = document.querySelectorAll('.lista-info li');
    if (usuario.localizacao) itensInfo[0].innerHTML = '<span class="info-icone">📍</span> ' + usuario.localizacao;
    if (usuario.telefone)    itensInfo[2].innerHTML = '<span class="info-icone">📞</span> ' + usuario.telefone;
    if (usuario.email)       itensInfo[3].innerHTML = '<span class="info-icone">✉️</span> ' + usuario.email;

  } catch (erro) {
    console.error('Erro ao carregar perfil:', erro.message);
  }
}

async function carregarAnimais(usuarioId) {
  const gradeAnimais = document.querySelector('.grade-animais');

  try {
    const resposta = await fetch(apiUrl(`animais?usuarioId=${usuarioId}`));
    if (!resposta.ok) throw new Error('Erro ao buscar animais');
    const animais = await resposta.json();

    const totalResgates = animais.length;
    const totalAdocoes  = animais.filter(a => a.status === 'Adotado').length;
    const taxa = totalResgates > 0 ? Math.round((totalAdocoes / totalResgates) * 100) : 0;

    document.querySelectorAll('.stat-numero')[0].textContent = totalResgates;
    document.querySelectorAll('.stat-numero')[1].textContent = totalAdocoes;
    document.querySelector('.taxa-adocao strong').textContent = taxa + '%';

    if (animais.length === 0) {
      gradeAnimais.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:2rem; color:#6b7280;">
          <p>Nenhum animal cadastrado ainda.</p>
          <a href="registroPet.html" class="botao-adicionar" style="display:inline-block; margin-top:1rem;">Cadastrar Primeiro Animal</a>
        </div>
      `;
      return;
    }

    gradeAnimais.innerHTML = animais.map(animal => `
      <a href="#" class="cartao-animal" data-id="${animal.id}">
        <div class="animal-foto">
          <div style="width:100%; aspect-ratio:1; background:#e5e7eb; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:2rem;">🐾</div>
          <span class="animal-status ${animal.status === 'Adotado' ? 'adotado' : 'disponivel'}">${animal.status}</span>
        </div>
        <div class="animal-info">
          <h3>${animal.nome}</h3>
          <p style="font-size:0.8rem; color:#6b7280;">${animal.tipo} • ${animal.idade} • ${animal.porte}</p>
          <p style="font-size:0.8rem; color:#6b7280;">${animal.localizacao}</p>
        </div>
      </a>
    `).join('');

  } catch (erro) {
    gradeAnimais.innerHTML = '<p style="color:red; padding:1rem;">Erro ao carregar animais.</p>';
    console.error('Erro ao carregar animais:', erro.message);
  }
}
