const TOAST_ICONS = {
    erro: '✕',
    sucesso: '✓',
    info: 'i'
};

function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }
    return container;
}

function showToast(mensagem, tipo = 'info', duracao = 4500) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${tipo}`;
    toast.setAttribute('role', 'alert');

    toast.innerHTML = `
        <span class="toast-icone" aria-hidden="true">${TOAST_ICONS[tipo] || TOAST_ICONS.info}</span>
        <div class="toast-conteudo">
            <p class="toast-mensagem"></p>
        </div>
        <button type="button" class="toast-fechar" aria-label="Fechar notificação">&times;</button>
    `;

    toast.querySelector('.toast-mensagem').textContent = mensagem;

    const fechar = () => {
        if (toast.classList.contains('saindo')) return;
        toast.classList.add('saindo');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    toast.querySelector('.toast-fechar').addEventListener('click', fechar);

    container.appendChild(toast);

    if (duracao > 0) {
        setTimeout(fechar, duracao);
    }

    return fechar;
}
