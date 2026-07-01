(function () {
  if (window.SITE_CONFIG) return;

  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1';
  var repoName = 'MatchMypet';
  var basePath = '/';

  if (!isLocal && host.endsWith('github.io')) {
    var segments = window.location.pathname.split('/').filter(Boolean);
    if (segments.length && segments[0].toLowerCase() === repoName.toLowerCase()) {
      basePath = '/' + segments[0] + '/';
    }
  }

  // Atualize após publicar a API (Render, Railway, etc.)
  var apiBaseUrl = isLocal ? '' : 'https://matchmypet-api.onrender.com';

  function joinUrl(base, path) {
    var normalizedPath = String(path || '').replace(/^\/+/, '');
    if (!base) return '/' + normalizedPath;
    return base.replace(/\/+$/, '') + '/' + normalizedPath;
  }

  window.SITE_CONFIG = {
    basePath: basePath,
    apiBaseUrl: apiBaseUrl,
    loginUrl: joinUrl(basePath, 'modulos/login/login.html'),
    homeUrl: joinUrl(basePath, 'about.html'),
    profileUrl: joinUrl(basePath, 'modulos/henrique-souza-telas/userPerfil.html'),
    api: function (path) {
      return joinUrl(apiBaseUrl, path);
    },
    site: function (path) {
      return joinUrl(basePath, path);
    }
  };
})();
