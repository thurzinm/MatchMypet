const API_PATH = '';

function alternarMenu() {
  const menu = document.getElementById('menuMobile');
  if (menu) menu.classList.toggle('aberto');
}

const uploadFotos = document.getElementById('uploadFotos');
if (uploadFotos) {
  uploadFotos.addEventListener('change', function () {
    const grade = document.getElementById('gradePreviews');
    if (!grade) return;
    Array.from(this.files).forEach((arquivo, indice) => {
      const url = URL.createObjectURL(arquivo);
      const item = document.createElement('div');
      item.className = 'item-preview';
      item.innerHTML = `
      <img src="${url}" alt="Preview ${indice + 1}" />
      <button type="button" class="botao-remover" onclick="this.parentElement.remove()">✕</button>
    `;
      grade.appendChild(item);
    });
  });
}

const formulario = document.getElementById('formularioCadastro');
if (formulario) {
  formulario.addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente') || 'null');

    if (!usuarioCorrente) {
      alert('Você precisa estar logado para cadastrar um animal.');
      window.location.href = '../login/login.html';
      return;
    }

    const botao = document.querySelector('.botao-cadastrar');
    if (botao) {
      botao.textContent = 'Cadastrando...';
      botao.disabled = true;
    }

    const animal = {
      tipo:         document.getElementById('tipoAnimal') ? document.getElementById('tipoAnimal').value : '',
      nome:         document.getElementById('nomeAnimal') ? document.getElementById('nomeAnimal').value : '',
      idade:        document.getElementById('idadeAnimal') ? document.getElementById('idadeAnimal').value : '',
      porte:        document.getElementById('porteAnimal') ? document.getElementById('porteAnimal').value : '',
      genero:       document.getElementById('generoAnimal') ? document.getElementById('generoAnimal').value : '',
      peso:         document.getElementById('pesoAnimal') ? document.getElementById('pesoAnimal').value : '',
      localizacao:  document.getElementById('localizacao') ? document.getElementById('localizacao').value : '',
      saude:        document.getElementById('saude') ? document.getElementById('saude').value : '',
      temperamento: document.getElementById('temperamento') ? document.getElementById('temperamento').value : '',
      descricao:    document.getElementById('descricao') ? document.getElementById('descricao').value : '',
      status:       'Disponível',
      usuarioId:    usuarioCorrente.id,
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    try {
      const resposta = await fetch(`${API_PATH}/animais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal)
      });

      if (!resposta.ok) throw new Error('Erro ao cadastrar animal');

      window.location.href = 'userPerfil.html';

    } catch (erro) {
      alert('Erro ao cadastrar: ' + erro.message);
      if (botao) {
        botao.textContent = 'Cadastrar Animal';
        botao.disabled = false;
      }
    }
  });
}
