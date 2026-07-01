// Módulo pedro-aguiar — consumo da API REST do JSON Server (db/db.json)

function apiUrl(path) {
  if (window.SITE_CONFIG && typeof SITE_CONFIG.api === 'function') {
    return SITE_CONFIG.api(path);
  }
  return '/' + String(path || '').replace(/^\/+/, '');
}

const API_PRODUTOS = apiUrl('produtos');
const API_PEDIDOS = apiUrl('pedidos');

function obterUsuarioCorrenteLoja() {
  var json = sessionStorage.getItem('usuarioCorrente');
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function carregarProdutosDaApi() {
  return fetch(API_PRODUTOS).then(function (response) {
    if (!response.ok) {
      throw new Error('Falha ao carregar produtos: ' + response.status);
    }
    return response.json();
  });
}

function carregarProdutoPorIdDaApi(id) {
  return fetch(API_PRODUTOS + '/' + id).then(function (response) {
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Falha ao carregar produto: ' + response.status);
    }
    return response.json();
  });
}

function registrarPedidoNaApi(pedido) {
  return fetch(API_PEDIDOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  }).then(function (response) {
    if (!response.ok) {
      throw new Error('Falha ao registrar pedido: ' + response.status);
    }
    return response.json();
  });
}
