const API_PATH = '';

function alternarMenu() {
  document.getElementById('menuMobile').classList.toggle('aberto');
}

document.addEventListener('DOMContentLoaded', async () => {
  await carregarResgatadores();
  await carregarHistorias();
});

async function carregarResgatadores() {
  const lista = document.querySelector('.lista-resgatadores');

  try {
    const resposta = await fetch(`${API_PATH}/resgatadores?_sort=resgates&_order=desc`);
    if (!resposta.ok) throw new Error('Erro ao buscar resgatadores');
    const resgatadores = await resposta.json();

    lista.innerHTML = resgatadores.map((r, index) => {
      const posicao = index + 1;
      const classePosicao = posicao === 1 ? 'ouro' : posicao === 2 ? 'prata' : posicao === 3 ? 'bronze' : 'outros';
      const circunferencia = 2 * Math.PI * 40;
      const offset = circunferencia * (1 - r.taxaSucesso / 100);

      return `
        <div class="cartao-resgatador">
          <div class="posicao ${classePosicao}">${posicao}</div>
          <div class="foto-resgatador">
            <img src="${r.imagem}" alt="${r.nome}" />
          </div>
          <div class="info-resgatador">
            <h3>${r.nome}</h3>
            <p class="cidade-resgatador">${r.cidade}</p>
            <div class="stats-resgatador">
              <span class="stat-resgates">${r.resgates} resgates</span>
              <span class="stat-matches">${r.matches} matches</span>
            </div>
          </div>
          <div class="taxa-sucesso">
            <svg class="circulo-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" class="circulo-fundo" />
              <circle cx="50" cy="50" r="40" class="circulo-progresso"
                style="stroke-dasharray: ${circunferencia.toFixed(1)}; stroke-dashoffset: ${offset.toFixed(1)};" />
            </svg>
            <div class="taxa-texto">
              <strong>${r.taxaSucesso}%</strong>
              <span>sucesso</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (erro) {
    lista.innerHTML = '<p style="color:red; padding:1rem;">Erro ao carregar resgatadores.</p>';
    console.error(erro.message);
  }
}

async function carregarHistorias() {
  const grade = document.querySelector('.grade-historias');

  try {
    const resposta = await fetch(`${API_PATH}/historias?_sort=pontuacaoMatch&_order=desc`);
    if (!resposta.ok) throw new Error('Erro ao buscar histórias');
    const historias = await resposta.json();

    grade.innerHTML = historias.map(h => `
      <div class="cartao-historia">
        <div class="historia-foto">
          <img src="${h.imagemPet}" alt="${h.nomePet}" />
          <span class="badge-match">★ ${h.pontuacaoMatch}% match</span>
        </div>
        <div class="historia-conteudo">
          <div class="historia-cabecalho">
            <h3>${h.nomePet}</h3>
            <span class="historia-data">${h.data}</span>
          </div>
          <div class="historia-pessoas">
            <div class="pessoa">
              <img src="${h.imagemAdotante}" alt="${h.nomeAdotante}" />
              <div>
                <p class="pessoa-label">Adotado por</p>
                <p class="pessoa-nome">${h.nomeAdotante}</p>
              </div>
            </div>
            <div class="divisor"></div>
            <div>
              <p class="pessoa-label">Resgatado por</p>
              <p class="pessoa-nome">${h.nomeResgatador}</p>
            </div>
          </div>
          <p class="historia-texto">${h.historia}</p>
          <div class="historia-rodape">♥ Match Perfeito!</div>
        </div>
      </div>
    `).join('');

  } catch (erro) {
    grade.innerHTML = '<p style="color:red; padding:1rem;">Erro ao carregar histórias.</p>';
    console.error(erro.message);
  }
}
