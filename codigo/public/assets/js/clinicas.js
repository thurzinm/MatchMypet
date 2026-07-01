function apiUrl(path) {
  if (window.SITE_CONFIG && typeof SITE_CONFIG.api === 'function') {
    return SITE_CONFIG.api(path);
  }
  return '/' + String(path || '').replace(/^\/+/, '');
}

const API_CLINICAS = apiUrl('clinicas');

let todasClinicas = [];

document.addEventListener('DOMContentLoaded', function () {
  carregarClinicas();

  var filtro = document.getElementById('filtro-especialidade');
  if (filtro) {
    filtro.addEventListener('change', function () {
      filtrarClinicas(this.value);
    });
  }
});

function carregarClinicas() {
  fetch(API_CLINICAS)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Falha ao carregar clínicas: ' + response.status);
      }
      return response.json();
    })
    .then(function (clinicas) {
      todasClinicas = clinicas;
      exibirClinicas(clinicas);
    })
    .catch(function (erro) {
      console.error(erro);
      var grade = document.getElementById('grade-clinicas');
      if (grade) {
        grade.innerHTML =
          '<p class="mensagem-erro">Erro ao carregar clínicas. Execute <code>npm start</code> na pasta codigo.</p>';
      }
    });
}

function exibirClinicas(clinicas) {
  var grade = document.getElementById('grade-clinicas');
  var contador = document.getElementById('contador-clinicas');

  if (!grade) return;

  if (contador) {
    contador.textContent = clinicas.length + ' clínica' + (clinicas.length !== 1 ? 's' : '') + ' parceira' + (clinicas.length !== 1 ? 's' : '');
  }

  if (clinicas.length === 0) {
    grade.innerHTML = '<p class="mensagem-vazia">Nenhuma clínica encontrada para este filtro.</p>';
    return;
  }

  var html = '';
  for (var i = 0; i < clinicas.length; i++) {
    html += criarCardClinica(clinicas[i]);
  }
  grade.innerHTML = html;
}

function criarCardClinica(clinica) {
  var especialidadesHtml = '';
  for (var j = 0; j < clinica.especialidades.length; j++) {
    especialidadesHtml += '<span class="tag-especialidade">' + clinica.especialidades[j] + '</span>';
  }

  var badgeParceiro = clinica.parceiroOficial
    ? '<span class="badge-parceiro">Parceiro Oficial</span>'
    : '';

  var badgeDesconto = clinica.descontoAdotados
    ? '<span class="badge-desconto">-' + clinica.descontoAdotados + '% adotados</span>'
    : '';

  var telefoneLimpo = clinica.telefone.replace(/\D/g, '');

  return (
    '<article class="cartao-clinica">' +
      '<div class="clinica-imagem">' +
        '<img src="' + clinica.imagem + '" alt="' + clinica.nome + '" loading="lazy" />' +
        badgeParceiro +
        badgeDesconto +
      '</div>' +
      '<div class="clinica-corpo">' +
        '<div class="clinica-cabecalho">' +
          '<h3>' + clinica.nome + '</h3>' +
          '<span class="clinica-avaliacao">★ ' + clinica.avaliacao.toFixed(1) + '</span>' +
        '</div>' +
        '<div class="clinica-info"><span>📍</span><span>' + clinica.endereco + '</span></div>' +
        '<div class="clinica-info"><span>📞</span><span>' + clinica.telefone + '</span></div>' +
        '<div class="clinica-info"><span>🕐</span><span>' + clinica.horario + '</span></div>' +
        '<div class="clinica-especialidades">' + especialidadesHtml + '</div>' +
        '<div class="clinica-acoes">' +
          '<a href="tel:' + telefoneLimpo + '" class="btn-ligar">Ligar</a>' +
          '<a href="https://maps.google.com/?q=' + encodeURIComponent(clinica.endereco) + '" target="_blank" rel="noopener" class="btn-maps">Ver no mapa</a>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

function filtrarClinicas(especialidade) {
  if (especialidade === 'todas') {
    exibirClinicas(todasClinicas);
    return;
  }

  var filtradas = [];
  for (var i = 0; i < todasClinicas.length; i++) {
    if (todasClinicas[i].especialidades.indexOf(especialidade) !== -1) {
      filtradas.push(todasClinicas[i]);
    }
  }
  exibirClinicas(filtradas);
}
