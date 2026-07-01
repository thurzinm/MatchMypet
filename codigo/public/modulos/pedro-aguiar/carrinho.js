function obterCarrinho() {
  return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function salvarCarrinho(itens) {
  localStorage.setItem('carrinho', JSON.stringify(itens));
}

function adicionarItemAoCarrinho(item) {
  var carrinho = obterCarrinho();
  carrinho.push({
    id: item.id,
    nome: item.nome,
    preco: item.preco
  });
  salvarCarrinho(carrinho);
  atualizarBadge();
}

function removerDoCarrinho(index) {
  var carrinho = obterCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  atualizarBadge();
  renderizarCarrinho();
}

function atualizarBadge() {
  var badge = document.getElementById('badge-carrinho');
  if (!badge) return;
  var carrinho = obterCarrinho();
  if (carrinho.length > 0) {
    badge.style.display = 'flex';
    badge.textContent = carrinho.length;
  } else {
    badge.style.display = 'none';
  }
}

function abrirCarrinho() {
  var modal = document.getElementById('modal-carrinho');
  if (modal) {
    modal.classList.add('ativo');
    renderizarCarrinho();
  }
}

function fecharCarrinho() {
  var modal = document.getElementById('modal-carrinho');
  if (modal) {
    modal.classList.remove('ativo');
  }
}

function renderizarCarrinho() {
  var lista = document.getElementById('lista-carrinho');
  var totalDiv = document.getElementById('carrinho-total');
  var valorTotal = document.getElementById('valor-total');
  if (!lista || !totalDiv || !valorTotal) return;

  var carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
    totalDiv.style.display = 'none';
    return;
  }

  var html = '';
  var total = 0;

  for (var i = 0; i < carrinho.length; i++) {
    var item = carrinho[i];
    total += item.preco;
    var precoFormatado = 'R$ ' + item.preco.toFixed(2).replace('.', ',');
    html +=
      '<div class="item-carrinho">' +
      '<span class="item-nome">' +
      item.nome +
      '</span>' +
      '<span class="item-preco">' +
      precoFormatado +
      '</span>' +
      '<button class="btn-remover" onclick="removerDoCarrinho(' +
      i +
      ')">✕</button>' +
      '</div>';
  }

  lista.innerHTML = html;
  totalDiv.style.display = 'flex';
  valorTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function finalizarCompra() {
  var carrinho = obterCarrinho();
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  var usuario = obterUsuarioCorrenteLoja();
  if (!usuario || !usuario.id) {
    alert('Faça login para finalizar a compra.');
    window.location.href = '../../modulos/login/login.html';
    return;
  }

  var itens = [];
  var total = 0;
  for (var i = 0; i < carrinho.length; i++) {
    var item = carrinho[i];
    total += item.preco;
    itens.push({
      produtoId: item.id,
      nome: item.nome,
      preco: item.preco
    });
  }

  var pedido = {
    usuarioId: usuario.id,
    usuarioNome: usuario.nome,
    itens: itens,
    total: total,
    data: new Date().toISOString()
  };

  registrarPedidoNaApi(pedido)
    .then(function () {
      salvarCarrinho([]);
      atualizarBadge();
      renderizarCarrinho();
      fecharCarrinho();
      alert('Pedido registrado com sucesso! Obrigado pela compra.');
    })
    .catch(function (err) {
      console.error('Erro ao finalizar compra via JSON Server:', err);
      alert('Não foi possível registrar o pedido. Verifique se o servidor está rodando (npm start).');
    });
}

document.addEventListener('DOMContentLoaded', function () {
  atualizarBadge();
  var modal = document.getElementById('modal-carrinho');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        fecharCarrinho();
      }
    });
  }
});
