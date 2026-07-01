const LOGIN_URL = (window.SITE_CONFIG && SITE_CONFIG.loginUrl) || '/modulos/login/login.html';

function apiUrl(path) {
  if (window.SITE_CONFIG && typeof SITE_CONFIG.api === 'function') {
    return SITE_CONFIG.api(path);
  }
  return '/' + String(path || '').replace(/^\/+/, '');
}

const MATCH_STORAGE_API = apiUrl('matchContatos');
const FEED_PROGRESS_API = apiUrl('matchFeedProgress');
const LOCAL_KEY_PREFIX = 'matchmypet:contatos:';
const FEED_LOCAL_KEY_PREFIX = 'matchmypet:feed:';

function idNumerico(id) {
  return typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id));
}

function chaveFeedLocal(usuarioId) {
  return FEED_LOCAL_KEY_PREFIX + Number(usuarioId);
}

function lerFeedLocal(usuarioId) {
  try {
    var dados = localStorage.getItem(chaveFeedLocal(usuarioId));
    if (dados) return JSON.parse(dados);
  } catch (e) {
    /* ignora */
  }
  return { petsVistos: [], filtroAtivo: 'todos' };
}

function gravarFeedLocal(usuarioId, progresso) {
  localStorage.setItem(chaveFeedLocal(usuarioId), JSON.stringify(progresso));
}

function mesclarPetsVistos(a, b) {
  var set = new Set();
  (a || []).forEach(function (id) { set.add(Number(id)); });
  (b || []).forEach(function (id) { set.add(Number(id)); });
  return Array.from(set);
}

async function carregarProgressoFeedApi(usuarioId) {
  var resposta = await fetch(FEED_PROGRESS_API + '?usuarioId=' + Number(usuarioId));
  if (!resposta.ok) return null;
  var lista = await resposta.json();
  return lista.length ? lista[0] : null;
}

async function salvarProgressoFeedApi(usuarioId, progresso) {
  var payload = {
    usuarioId: Number(usuarioId),
    petsVistos: progresso.petsVistos || [],
    filtroAtivo: progresso.filtroAtivo || 'todos'
  };

  if (idNumerico(progresso.id)) {
    var patch = await fetch(FEED_PROGRESS_API + '/' + progresso.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (patch.ok) return patch.json();
  }

  var existente = await carregarProgressoFeedApi(usuarioId);
  if (existente && existente.id) {
    var patchExistente = await fetch(FEED_PROGRESS_API + '/' + existente.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (patchExistente.ok) return patchExistente.json();
  }

  var criar = await fetch(FEED_PROGRESS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!criar.ok) {
    throw new Error('Erro ao salvar progresso do feed: ' + criar.status);
  }
  return criar.json();
}

async function carregarProgressoFeed(usuarioId) {
  usuarioId = Number(usuarioId);
  var local = lerFeedLocal(usuarioId);
  var api = null;

  try {
    api = await carregarProgressoFeedApi(usuarioId);
  } catch (e) {
    console.warn('Progresso do feed indisponível na API.', e);
  }

  if (api) {
    var mesclado = {
      id: api.id,
      usuarioId: usuarioId,
      petsVistos: mesclarPetsVistos(local.petsVistos, api.petsVistos),
      filtroAtivo: api.filtroAtivo || local.filtroAtivo || 'todos'
    };
    gravarFeedLocal(usuarioId, mesclado);
    return mesclado;
  }

  return local;
}

async function registrarPetVisto(usuarioId, petId) {
  usuarioId = Number(usuarioId);
  petId = Number(petId);
  var progresso = await carregarProgressoFeed(usuarioId);

  if (!progresso.petsVistos) progresso.petsVistos = [];
  if (progresso.petsVistos.indexOf(petId) === -1) {
    progresso.petsVistos.push(petId);
  }

  gravarFeedLocal(usuarioId, progresso);

  try {
    var salvo = await salvarProgressoFeedApi(usuarioId, progresso);
    progresso.id = salvo.id;
    progresso.petsVistos = salvo.petsVistos || progresso.petsVistos;
    gravarFeedLocal(usuarioId, progresso);
  } catch (e) {
    console.warn('API do progresso do feed falhou, mantido no cache local.', e);
  }

  return progresso;
}

function chaveLocal(usuarioId) {
  return LOCAL_KEY_PREFIX + Number(usuarioId);
}

function getUsuarioId() {
  try {
    var usuario = JSON.parse(sessionStorage.getItem('usuarioCorrente') || 'null');
    return usuario && usuario.id != null ? Number(usuario.id) : null;
  } catch (e) {
    return null;
  }
}

function exigirLoginMatch() {
  if (getUsuarioId()) return true;
  sessionStorage.setItem('returnURL', window.location.pathname);
  window.location.href = LOGIN_URL;
  return false;
}

function lerLocal(usuarioId) {
  try {
    var dados = localStorage.getItem(chaveLocal(usuarioId));
    return dados ? JSON.parse(dados) : [];
  } catch (e) {
    return [];
  }
}

function gravarLocal(usuarioId, contatos) {
  localStorage.setItem(chaveLocal(usuarioId), JSON.stringify(contatos));
}

function montarContato(usuarioId, pet, mensagens, id) {
  return {
    id: id || null,
    usuarioId: Number(usuarioId),
    petId: Number(pet.id),
    responsavel: pet.responsavel,
    petNome: pet.nome,
    tipo: pet.tipo,
    avatar: pet.foto,
    mensagens: mensagens || [],
    criadoEm: new Date().toISOString()
  };
}

function buscarNoLocal(usuarioId, petId) {
  return lerLocal(usuarioId).find(function (c) {
    return Number(c.petId) === Number(petId);
  }) || null;
}

async function buscarContatoPorPetApi(usuarioId, petId) {
  var resposta = await fetch(
    MATCH_STORAGE_API + '?usuarioId=' + Number(usuarioId) + '&petId=' + Number(petId)
  );
  if (!resposta.ok) return null;
  var lista = await resposta.json();
  return lista.length ? lista[0] : null;
}

async function carregarContatosApi(usuarioId) {
  var resposta = await fetch(MATCH_STORAGE_API + '?usuarioId=' + Number(usuarioId));
  if (!resposta.ok) return null;
  return resposta.json();
}

function mesclarContatos(api, local) {
  var map = {};
  local.forEach(function (c) {
    map[Number(c.petId)] = c;
  });
  api.forEach(function (c) {
    map[Number(c.petId)] = c;
  });
  return Object.keys(map).map(function (key) {
    return map[Number(key)];
  });
}

async function carregarContatos(usuarioId) {
  usuarioId = Number(usuarioId);
  var local = lerLocal(usuarioId);
  var api = null;

  try {
    api = await carregarContatosApi(usuarioId);
  } catch (e) {
    console.warn('API de contatos indisponível, usando cache local.', e);
  }

  if (api !== null) {
    var mesclados = mesclarContatos(api, local);
    gravarLocal(usuarioId, mesclados);
    return mesclados;
  }

  return local;
}

async function criarContatoApi(usuarioId, pet, mensagens) {
  var resposta = await fetch(MATCH_STORAGE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(montarContato(usuarioId, pet, mensagens))
  });

  if (!resposta.ok) {
    throw new Error('Erro ao criar contato: ' + resposta.status);
  }

  return resposta.json();
}

async function criarContato(usuarioId, pet, mensagens) {
  usuarioId = Number(usuarioId);

  var local = lerLocal(usuarioId);
  var existenteLocal = buscarNoLocal(usuarioId, pet.id);
  if (existenteLocal) return existenteLocal;

  try {
    var existenteApi = await buscarContatoPorPetApi(usuarioId, pet.id);
    if (existenteApi) {
      if (!existenteLocal) {
        local.push(existenteApi);
        gravarLocal(usuarioId, local);
      }
      return existenteApi;
    }
  } catch (e) {
    console.warn('Busca na API falhou, salvando localmente.', e);
  }

  var novo = montarContato(usuarioId, pet, mensagens, 'local-' + Date.now());

  try {
    var criado = await criarContatoApi(usuarioId, pet, mensagens);
    novo = criado;
  } catch (e) {
    console.warn('POST na API falhou, contato salvo no navegador.', e);
  }

  local.push(novo);
  gravarLocal(usuarioId, local);
  return novo;
}

async function atualizarMensagensApi(contatoId, mensagens) {
  var resposta = await fetch(MATCH_STORAGE_API + '/' + contatoId, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensagens: mensagens })
  });

  if (!resposta.ok) {
    throw new Error('Erro ao atualizar mensagens: ' + resposta.status);
  }

  return resposta.json();
}

async function atualizarMensagens(usuarioId, contatoId, mensagens) {
  usuarioId = Number(usuarioId);
  var local = lerLocal(usuarioId);
  var indice = local.findIndex(function (c) {
    return String(c.id) === String(contatoId);
  });

  if (indice === -1) {
    indice = local.findIndex(function (c) {
      return String(c.id) === String(contatoId).replace('local-', 'local-');
    });
  }

  if (indice >= 0) {
    local[indice].mensagens = mensagens;
    gravarLocal(usuarioId, local);
  }

  if (!idNumerico(contatoId)) {
    var contato = indice >= 0 ? local[indice] : null;
    if (contato) {
      try {
        var pet = {
          id: contato.petId,
          responsavel: contato.responsavel,
          nome: contato.petNome,
          tipo: contato.tipo,
          foto: contato.avatar
        };
        var sincronizado = await criarContatoApi(usuarioId, pet, mensagens);
        if (indice >= 0) {
          local[indice] = sincronizado;
          gravarLocal(usuarioId, local);
        }
        return sincronizado;
      } catch (e) {
        console.warn('Sincronização com API falhou, mensagens ficaram no cache local.', e);
        return contato;
      }
    }
    return null;
  }

  try {
    var atualizado = await atualizarMensagensApi(contatoId, mensagens);
    if (indice >= 0) {
      local[indice] = atualizado;
      gravarLocal(usuarioId, local);
    }
    return atualizado;
  } catch (e) {
    console.warn('PATCH na API falhou, mensagens salvas no cache local.', e);
    return indice >= 0 ? local[indice] : null;
  }
}

async function sincronizarPendentes(usuarioId) {
  usuarioId = Number(usuarioId);
  var local = lerLocal(usuarioId);
  var alterou = false;

  for (var i = 0; i < local.length; i++) {
    if (idNumerico(local[i].id)) continue;

    try {
      var pet = {
        id: local[i].petId,
        responsavel: local[i].responsavel,
        nome: local[i].petNome,
        tipo: local[i].tipo,
        foto: local[i].avatar
      };
      var criado = await criarContatoApi(usuarioId, pet, local[i].mensagens);
      local[i] = criado;
      alterou = true;
    } catch (e) {
      console.warn('Contato pendente não sincronizado:', local[i].petNome, e);
    }
  }

  if (alterou) gravarLocal(usuarioId, local);
  return local;
}

window.MatchStorage = {
  getUsuarioId: getUsuarioId,
  exigirLoginMatch: exigirLoginMatch,
  carregarContatos: carregarContatos,
  criarContato: criarContato,
  atualizarMensagens: atualizarMensagens,
  sincronizarPendentes: sincronizarPendentes,
  carregarProgressoFeed: carregarProgressoFeed,
  registrarPetVisto: registrarPetVisto
};
