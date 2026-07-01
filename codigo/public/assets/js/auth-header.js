const AUTH_LOGIN_URL = (window.SITE_CONFIG && SITE_CONFIG.loginUrl) || '/modulos/login/login.html';

const AUTH_LOGOUT_ICON = `<span class="icone-sair" aria-hidden="true">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
</span>`;

const NAV_LINK_SELECTOR =
  '.cabecalho .navegacao-desktop a, .cabecalho .navegacao-mobile a, header .header-inner nav a';

const NAV_LINK_IGNORE = ['link-auth', 'botao-perfil', 'botao-perfil-mobile', 'botao-sair'];

function normalizarPath(pathname) {
  try {
    pathname = decodeURIComponent(pathname);
  } catch (e) {
    /* mantém pathname original */
  }

  pathname = pathname.toLowerCase();

  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  return pathname;
}

function obterPathAtual() {
  let path = normalizarPath(window.location.pathname);

  if (path.endsWith('/produto.html')) {
    path = path.replace('/produto.html', '/index.html');
  }

  return path;
}

function linkEhItemNav(link) {
  if (!link || !link.getAttribute('href')) return false;

  const href = link.getAttribute('href').trim();
  if (!href || href === '#') return false;
  if (href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return false;

  return !NAV_LINK_IGNORE.some(function (classe) {
    return link.classList.contains(classe);
  });
}

function marcarNavAtivo() {
  const pathAtual = obterPathAtual();

  document.querySelectorAll(NAV_LINK_SELECTOR).forEach(function (link) {
    link.classList.remove('ativo', 'active');

    if (!linkEhItemNav(link)) return;

    try {
      const pathLink = normalizarPath(new URL(link.getAttribute('href'), window.location.href).pathname);

      if (pathLink === pathAtual) {
        link.classList.add('ativo', 'active');
      }
    } catch (e) {
      /* ignora href inválido */
    }
  });
}

function logoutUser() {
  sessionStorage.removeItem('usuarioCorrente');
  window.location.href = AUTH_LOGIN_URL;
}

function updateHeaderAuth() {
  const loggedIn = !!sessionStorage.getItem('usuarioCorrente');

  document.querySelectorAll('.link-auth').forEach((link) => {
    const loginHref = link.dataset.loginHref || link.getAttribute('href');

    if (loggedIn) {
      link.href = '#';
      link.classList.add('botao-sair');
      link.innerHTML = `${AUTH_LOGOUT_ICON} Sair`;
      link.onclick = (e) => {
        e.preventDefault();
        logoutUser();
      };
    } else {
      link.href = loginHref;
      link.classList.remove('botao-sair');
      link.textContent = 'Entrar';
      link.onclick = null;
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  marcarNavAtivo();
  updateHeaderAuth();
});
