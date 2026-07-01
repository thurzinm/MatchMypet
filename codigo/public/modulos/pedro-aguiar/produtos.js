let todosProdutos = [];

document.addEventListener('DOMContentLoaded', function () {
  carregarProdutos();

  document.getElementById('filtro-categoria').addEventListener('change', function () {
    let categoria = this.value;
    filtrarPorCategoria(categoria);
  });
});

function carregarProdutos() {
  carregarProdutosDaApi()
    .then(function (produtos) {
      todosProdutos = produtos;
      exibirProdutos(produtos);
    })
    .catch(function (erro) {
      console.error('Erro ao carregar produtos via JSON Server:', erro);
      document.getElementById('produtos-grid').innerHTML =
        '<p style="padding: 20px; color: red;">Erro ao carregar produtos. Execute <code>npm start</code> na pasta codigo.</p>';
    });
}

function exibirProdutos(produtos) {
  let grid = document.getElementById('produtos-grid');
  let contador = document.getElementById('contador-produtos');

  contador.textContent = produtos.length + ' produtos disponíveis';

  if (produtos.length === 0) {
    grid.innerHTML = '<p style="padding: 20px; color: #999;">Nenhum produto encontrado nesta categoria.</p>';
    return;
  }

  let html = '';
  for (let i = 0; i < produtos.length; i++) {
    let produto = produtos[i];
    html += criarCardProduto(produto);
  }
  grid.innerHTML = html;
}

function criarCardProduto(produto) {
  let precoFormatado = 'R$ ' + produto.preco.toFixed(2).replace('.', ',');

  return `
    <div class="produto-card" onclick="window.location.href='produto.html?id=${produto.id}'">
      <img src="${produto.imagem}" alt="${produto.nome}">
      <div class="produto-info">
        <span class="produto-categoria">${produto.categoria}</span>
        <div class="produto-nome">${produto.nome}</div>
        <div class="produto-avaliacao">⭐ ${produto.avaliacao}</div>
        <div class="produto-bottom">
          <span class="produto-preco">${precoFormatado}</span>
          <button type="button" class="btn-carrinho" onclick="event.stopPropagation(); adicionarAoCarrinho(${produto.id})" title="Adicionar ao carrinho">
            🛒
          </button>
        </div>
      </div>
    </div>
  `;
}

function filtrarPorCategoria(categoria) {
  let select = document.getElementById('filtro-categoria');

  if (categoria === 'todos') {
    exibirProdutos(todosProdutos);
    select.value = 'todos';
    return;
  }

  select.value = categoria;

  let filtrados = [];
  for (let i = 0; i < todosProdutos.length; i++) {
    if (todosProdutos[i].categoria === categoria) {
      filtrados.push(todosProdutos[i]);
    }
  }
  exibirProdutos(filtrados);
}

function adicionarAoCarrinho(produtoId) {
  let produto = null;
  for (let i = 0; i < todosProdutos.length; i++) {
    if (todosProdutos[i].id === produtoId) {
      produto = todosProdutos[i];
      break;
    }
  }

  if (!produto) return;

  adicionarItemAoCarrinho({
    id: produto.id,
    nome: produto.nome,
    preco: produto.preco
  });

  alert(produto.nome + ' adicionado ao carrinho!');
}
