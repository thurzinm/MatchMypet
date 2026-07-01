const API_PARCEIROS = '/parceiros';

let todosParceiros = [];

document.addEventListener('DOMContentLoaded', function () {
  carregarParceiros();

  var filtro = document.getElementById('filtro-tipo');
  if (filtro) {
    filtro.addEventListener('change', function () {
      filtrarParceiros(this.value);
    });
  }
});

function carregarParceiros() {
  fetch(API_PARCEIROS)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Falha ao carregar parceiros: ' + response.status);
      }
      return response.json();
    })
    .then(function (parceiros) {
      todosParceiros = parceiros;
      exibirParceiros(parceiros);
    })
    .catch(function (erro) {
      console.error(erro);
      var grade = document.getElementById('grade-parceiros');
      if (grade) {
        grade.innerHTML =
          '<p class="mensagem-erro">Erro ao carregar parceiros. Execute <code>npm start</code> na pasta codigo.</p>';
      }
    });
}

function exibirParceiros(parceiros) {
  var grade = document.getElementById('grade-parceiros');
  var contador = document.getElementById('contador-parceiros');

  if (!grade) return;

  if (contador) {
    contador.textContent = parceiros.length + ' parceiro' + (parceiros.length !== 1 ? 's' : '') + ' ativo' + (parceiros.length !== 1 ? 's' : '');
  }

  if (parceiros.length === 0) {
    grade.innerHTML = '<p class="mensagem-vazia">Nenhum parceiro encontrado para este filtro.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < parceiros.length; i++) {
    html += criarCardParceiro(parceiros[i]);
  }
  grade.innerHTML = html;
}

function criarCardParceiro(parceiro) {
  var linkSite = parceiro.site
    ? '<a href="' + parceiro.site + '" target="_blank" rel="noopener" class="btn-visitar">Visitar site</a>'
    : '';

  return (
    '<article class="cartao-parceiro">' +
      '<div class="parceiro-imagem">' +
        '<img src="' + parceiro.imagem + '" alt="' + parceiro.nome + '" loading="lazy" />' +
        '<span class="badge-tipo">' + parceiro.tipo + '</span>' +
      '</div>' +
      '<div class="parceiro-corpo">' +
        '<h3>' + parceiro.nome + '</h3>' +
        '<p>' + parceiro.descricao + '</p>' +
        '<span class="parceiro-desde">Parceiro desde ' + parceiro.parceiroDesde + '</span>' +
        linkSite +
      '</div>' +
    '</article>'
  );
}

function filtrarParceiros(tipo) {
  if (tipo === 'todos') {
    exibirParceiros(todosParceiros);
    return;
  }

  var filtrados = [];
  for (var i = 0; i < todosParceiros.length; i++) {
    if (todosParceiros[i].tipo === tipo) {
      filtrados.push(todosParceiros[i]);
    }
  }
  exibirParceiros(filtrados);
}
