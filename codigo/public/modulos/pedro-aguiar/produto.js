function obterIdProdutoDaUrl() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  if (id === null || id === '') return null;
  var num = parseInt(id, 10);
  if (isNaN(num)) return null;
  return num;
}

function formatarPreco(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function renderizarProduto(produto) {
  var root = document.getElementById('produto-detalhe-root');
  var bannerTitulo = document.getElementById('produto-banner-titulo');
  if (bannerTitulo) {
    bannerTitulo.textContent = produto.nome;
  }
  document.title = produto.nome + ' | MatchMyPet';

  var detalhada =
    produto.descricaoDetalhada ||
    produto.descricao ||
    'Descrição em breve.';
  var specs = produto.especificacoes || [];
  var listaSpecs = '';
  for (var s = 0; s < specs.length; s++) {
    listaSpecs += '<li>' + specs[s] + '</li>';
  }
  var blocoSpecs =
    specs.length > 0
      ? '<div class="produto-detalhe-especificacoes"><h2>O que você precisa saber</h2><ul>' +
        listaSpecs +
        '</ul></div>'
      : '';

  root.innerHTML =
    '<div class="produto-detalhe-main">' +
    '<div class="produto-detalhe-imagem-wrap">' +
    '<img src="' +
    produto.imagem +
    '" alt="' +
    produto.nome +
    '">' +
    '</div>' +
    '<div class="produto-detalhe-conteudo">' +
    '<span class="produto-categoria">' +
    produto.categoria +
    '</span>' +
    '<h1>' +
    produto.nome +
    '</h1>' +
    '<div class="produto-detalhe-avaliacao">⭐ ' +
    produto.avaliacao +
    ' / 5</div>' +
    '<div class="produto-detalhe-preco">' +
    formatarPreco(produto.preco) +
    '</div>' +
    '<p class="produto-detalhe-descricao">' +
    detalhada +
    '</p>' +
    blocoSpecs +
    '<div class="produto-detalhe-acoes">' +
    '<button type="button" class="btn-adicionar-carrinho-grande" onclick="adicionarProdutoAtualAoCarrinho()">Adicionar ao carrinho</button>' +
    '</div>' +
    '</div>' +
    '</div>';

  window._produtoPaginaAtual = produto;
}

function adicionarProdutoAtualAoCarrinho() {
  var p = window._produtoPaginaAtual;
  if (!p) return;
  adicionarItemAoCarrinho({ id: p.id, nome: p.nome, preco: p.preco });
  alert(p.nome + ' adicionado ao carrinho!');
}

function mostrarErro(mensagem) {
  var root = document.getElementById('produto-detalhe-root');
  var bannerTitulo = document.getElementById('produto-banner-titulo');
  if (bannerTitulo) {
    bannerTitulo.textContent = 'Produto não encontrado';
  }
  document.title = 'Produto não encontrado | MatchMyPet';
  root.innerHTML =
    '<div class="produto-detalhe-erro">' +
    '<p>' +
    mensagem +
    '</p>' +
    '<p><a href="index.html">Voltar para a loja</a></p>' +
    '</div>';
}

document.addEventListener('DOMContentLoaded', function () {
  var id = obterIdProdutoDaUrl();
  if (id === null) {
    mostrarErro('Nenhum produto foi selecionado. Use um link válido a partir da loja.');
    return;
  }

  carregarProdutoPorIdDaApi(id)
    .then(function (produto) {
      if (!produto) {
        mostrarErro('Não encontramos este produto. Ele pode ter sido removido.');
        return;
      }
      renderizarProduto(produto);
    })
    .catch(function (err) {
      console.error('Erro ao carregar produto via JSON Server:', err);
      mostrarErro(
        'Não foi possível carregar os dados do produto. Execute npm start na pasta codigo e tente novamente.'
      );
    });
});
