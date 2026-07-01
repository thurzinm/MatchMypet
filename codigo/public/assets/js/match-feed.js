function urlFotoFallback(pet, largura, altura) {
  if (pet.foto) return pet.foto;
  largura = largura || 900;
  altura = altura || 675;
  if (pet.tipo === 'Gato') {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/960px-Cat_November_2010-1a.jpg';
  }
  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/960px-YellowLabradorLooking_new.jpg';
}

function urlFotoAnimal(pet, largura, altura) {
  return pet.foto || urlFotoFallback(pet, largura, altura);
}

function aplicarFotoPet(img, pet, largura, altura) {
  if (!img || !pet) return;
  largura = largura || 900;
  altura = altura || 675;
  img.referrerPolicy = 'no-referrer';
  img.src = pet.foto;
  img.onerror = function () {
    img.onerror = null;
    img.src = urlFotoFallback(pet, largura, altura);
  };
}

window.aplicarFotoAvatar = function (img, pet) {
  aplicarFotoPet(img, pet, 52, 52);
};

window.urlFotoFallback = urlFotoFallback;

const PETS_FEED = [
  {
    id: 1,
    nome: 'Max',
    tipo: 'Cachorro',
    raca: 'SRD',
    idade: '2 anos',
    porte: 'Médio',
    localizacao: 'Belo Horizonte, MG',
    status: 'Disponível para adoção',
    responsavel: 'ONG Patinhas do Bem',
    contato: '(31) 99999-9999',
    matchScore: 94,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/960px-YellowLabradorLooking_new.jpg',
    tags: ['Dócil', 'Brincalhão', 'Sociável'],
    detalhes: ['Vacinado', 'Vermifugado', 'Bom com crianças'],
    descricao: 'Max é um cachorro carinhoso, alegre e sociável. Foi resgatado recentemente e está procurando uma família responsável para receber muito amor e cuidado.',
    mensagemInicial: 'Oi! A equipe da Patinhas do Bem adorou seu interesse no Max. Posso te explicar o processo de adoção e marcar uma visita?'
  },
  {
    id: 2,
    nome: 'Luna',
    tipo: 'Gato',
    raca: 'SRD',
    idade: '1 ano',
    porte: 'Pequeno',
    localizacao: 'Contagem, MG',
    status: 'Disponível para adoção',
    responsavel: 'Protetora Ana Paula',
    contato: '(31) 98888-8888',
    matchScore: 91,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/960px-Cat_November_2010-1a.jpg',
    tags: ['Calma', 'Carinhosa', 'Castrada'],
    detalhes: ['Vacinada', 'Castrada', 'Boa para apartamento'],
    descricao: 'Luna é uma gatinha tranquila e muito carinhosa. Gosta de ambientes calmos e está pronta para encontrar um lar definitivo.',
    mensagemInicial: 'Bom dia! Aqui é a Ana Paula. A Luna é bem calminha e adora colo — quer que eu te envie o histórico veterinário dela?'
  },
  {
    id: 3,
    nome: 'Thor',
    tipo: 'Cachorro',
    raca: 'Vira-lata',
    idade: '8 meses',
    porte: 'Pequeno',
    localizacao: 'Nova Lima, MG',
    status: 'Disponível para adoção',
    responsavel: 'Lar Temporário Cãopanheiro',
    contato: '(31) 97777-7777',
    matchScore: 88,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Golde33443.jpg/960px-Golde33443.jpg',
    tags: ['Filhote', 'Ativo', 'Amigável'],
    detalhes: ['Primeira vacina', 'Vermifugado', 'Adora brincar'],
    descricao: 'Thor é um filhote cheio de energia, ideal para famílias que querem um companheiro divertido e amoroso.',
    mensagemInicial: 'Opa! Thor está pulando de alegria por aqui. Quer vir conhecer esse filhote cheio de energia pessoalmente?'
  },
  {
    id: 4,
    nome: 'Mel',
    tipo: 'Cachorro',
    raca: 'Golden Retriever',
    idade: '3 anos',
    porte: 'Grande',
    localizacao: 'Betim, MG',
    status: 'Disponível para adoção',
    responsavel: 'Abrigo Esperança Animal',
    contato: '(31) 96666-6666',
    matchScore: 96,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Golden_Retriever_Dukedomain_Buster_Stanley_5481657527.jpg/960px-Golden_Retriever_Dukedomain_Buster_Stanley_5481657527.jpg',
    tags: ['Leal', 'Protetor', 'Inteligente'],
    detalhes: ['Castrado', 'Vacinado', 'Treinado básico'],
    descricao: 'Mel é uma cadela dócil e muito inteligente. Adora caminhadas e se dá bem com outros animais. Busca um lar com espaço e carinho.',
    mensagemInicial: 'Olá! Somos do Abrigo Esperança Animal. A Mel já tem treinamento básico e se dá super bem com outros pets. Tem interesse em agendar um encontro?'
  },
  {
    id: 5,
    nome: 'Bob',
    tipo: 'Gato',
    raca: 'Persa',
    idade: '5 anos',
    porte: 'Médio',
    localizacao: 'Belo Horizonte, MG',
    status: 'Disponível para adoção',
    responsavel: 'Clínica Vet Amigo Fiel',
    contato: '(31) 95555-5555',
    matchScore: 85,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Persian_6d.jpg/960px-Persian_6d.jpg',
    tags: ['Tranquilo', 'Independente', 'Pelagem longa'],
    detalhes: ['Castrado', 'Vacinado', 'Indoor'],
    descricao: 'Bob é um gato sereno que prefere ambientes calmos. Perfeito para quem busca um companheiro relaxado e carinhoso nos momentos certos.',
    mensagemInicial: 'Boa tarde! Aqui é a equipe da Clínica Amigo Fiel. O Bob é tranquilo e ideal para apartamento. Posso tirar suas dúvidas sobre os cuidados com a pelagem dele?'
  },
  {
    id: 6,
    nome: 'Nina',
    tipo: 'Cachorro',
    raca: 'SRD',
    idade: '4 anos',
    porte: 'Grande',
    localizacao: 'Santa Luzia, MG',
    status: 'Disponível para adoção',
    responsavel: 'Protetor Carlos Mendes',
    contato: '(31) 94444-4444',
    matchScore: 90,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cute_dog.jpg/960px-Cute_dog.jpg',
    tags: ['Guardiã', 'Dócil', 'Castrada'],
    detalhes: ['Vacinada', 'Castrada', 'Boa com idosos'],
    descricao: 'Nina foi resgatada das ruas e hoje é uma cachorra equilibrada e protetora. Ideal para casas com quintal e famílias que buscam segurança e afeto.',
    mensagemInicial: 'E aí! Sou o Carlos, protetor da Nina. Ela veio das ruas e hoje é uma cachorra equilibrada e muito leal. Quer saber como está a rotina dela?'
  },
  {
    id: 7,
    nome: 'Pipoca',
    tipo: 'Gato',
    raca: 'SRD',
    idade: '4 meses',
    porte: 'Pequeno',
    localizacao: 'Ibirité, MG',
    status: 'Disponível para adoção',
    responsavel: 'Lar Temporário Gatos & Cia',
    contato: '(31) 93333-3333',
    matchScore: 93,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Kitten_%281%29.jpg/960px-Kitten_%281%29.jpg',
    tags: ['Filhote', 'Curioso', 'Brincalhão'],
    detalhes: ['Primeira vacina', 'Vermifugado', 'Usa caixinha'],
    descricao: 'Pipoca é um filhote cheio de curiosidade. Adora explorar e brincar com bolinhas. Procura um lar paciente para crescer com muito carinho.',
    mensagemInicial: 'Oi! O Pipoca acabou de derrubar um pote de ração aqui — filhote curioso demais. Posso te contar sobre a rotina e os cuidados com gatos pequenos?'
  },
  {
    id: 8,
    nome: 'Zeus',
    tipo: 'Cachorro',
    raca: 'Pastor Alemão',
    idade: '6 anos',
    porte: 'Grande',
    localizacao: 'Ribeirão das Neves, MG',
    status: 'Disponível para adoção',
    responsavel: 'ONG Cães de BH',
    contato: '(31) 92222-2222',
    matchScore: 87,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/German_Shepherd_-_DSC_0346_%2810096362833%29.jpg/960px-German_Shepherd_-_DSC_0346_%2810096362833%29.jpg',
    tags: ['Obediente', 'Ativo', 'Leal'],
    detalhes: ['Vacinado', 'Castrado', 'Sociável com adultos'],
    descricao: 'Zeus é um cão experiente e muito leal. Gosta de atividades físicas e se adapta bem a rotinas estruturadas. Busca tutor com experiência.',
    mensagemInicial: 'Olá! A ONG Cães de BH aqui. O Zeus é obediente e adora caminhadas longas. Você já teve experiência com cães de porte grande?'
  },
  {
    id: 9,
    nome: 'Mimi',
    tipo: 'Gato',
    raca: 'Siamês',
    idade: '2 anos',
    porte: 'Pequeno',
    localizacao: 'Contagem, MG',
    status: 'Disponível para adoção',
    responsavel: 'Protetora Mariana Costa',
    contato: '(31) 91111-1111',
    matchScore: 92,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Siam_lilacpoint.jpg/960px-Siam_lilacpoint.jpg',
    tags: ['Vocal', 'Afetuosa', 'Elegante'],
    detalhes: ['Castrada', 'Vacinada', 'Indoor/outdoor'],
    descricao: 'Mimi é uma gata comunicativa e muito grudada no tutor. Adora colo e conversar. Perfeita para quem quer uma companheira presente no dia a dia.',
    mensagemInicial: 'Oi! Mariana falando. A Mimi é bem comunicativa e adora ficar colada no tutor. Quer ver um vídeo dela brincando?'
  },
  {
    id: 10,
    nome: 'Rex',
    tipo: 'Cachorro',
    raca: 'Bulldog Francês',
    idade: '1 ano',
    porte: 'Pequeno',
    localizacao: 'Belo Horizonte, MG',
    status: 'Disponível para adoção',
    responsavel: 'Abrigo Patinhas Urbanas',
    contato: '(31) 90000-0000',
    matchScore: 89,
    foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Male_fawn_French_Bulldog_self_portrait.jpg/960px-Male_fawn_French_Bulldog_self_portrait.jpg',
    tags: ['Engraçado', 'Companheiro', 'Adaptável'],
    detalhes: ['Vacinado', 'Vermifugado', 'Bom para apartamento'],
    descricao: 'Rex tem uma personalidade única e adora estar perto das pessoas. Se adapta bem a apartamentos e adora sonecas no sofá com a família.',
    mensagemInicial: 'Hey! Aqui é o pessoal do Abrigo Patinhas Urbanas. O Rex é perfeito para apartamento e adora soneca no sofá. Topa conversar sobre a rotina dele?'
  }
];

window.PETS_FEED = PETS_FEED;

function initMatchFeed() {
  const feedView = document.getElementById('feedView');
  if (!feedView) return;

  let indiceAtual = 0;
  let filtroAtivo = 'todos';
  let petsFiltrados = [];
  const matches = [];
  const salvos = [];
  const petsVistos = new Set();

  function initProgressoFeed() {
    var prog = window.__feedProgress || { petsVistos: [] };
    (prog.petsVistos || []).forEach(function (id) {
      petsVistos.add(Number(id));
    });
    if (prog.filtroAtivo) {
      filtroAtivo = prog.filtroAtivo;
    }
  }

  function filtrarNaoVistos(lista) {
    return lista.filter(function (p) {
      return !petsVistos.has(Number(p.id));
    });
  }

  function listaBasePorFiltro(filtro) {
    if (filtro === 'todos') {
      return PETS_FEED.slice();
    }
    if (filtro === 'Pequeno') {
      return PETS_FEED.filter(function (p) { return p.porte === 'Pequeno'; });
    }
    return PETS_FEED.filter(function (p) { return p.tipo === filtro; });
  }

  async function marcarPetVisto(petId) {
    petId = Number(petId);
    if (petsVistos.has(petId)) return;
    petsVistos.add(petId);
    if (window.MatchStorage && window.__usuarioIdFeed) {
      try {
        window.__feedProgress = await MatchStorage.registrarPetVisto(window.__usuarioIdFeed, petId);
      } catch (e) {
        console.warn('Erro ao salvar progresso do feed:', e);
      }
    }
  }

  function obterFotoExibida(pet) {
    var img = document.getElementById('petFoto');
    if (img && img.src && img.src.indexOf('http') === 0 && img.naturalWidth > 0) {
      return img.src;
    }
    return pet.foto;
  }

  function clonarPetComFotoExibida(pet) {
    return Object.assign({}, pet, { foto: obterFotoExibida(pet) });
  }

  const petCard = document.getElementById('petCard');
  const petCardNext = document.getElementById('petCardNext');
  const contadorPets = document.getElementById('contadorPets');
  const modalPerfil = document.getElementById('modalPerfil');
  const toast = document.getElementById('feedToast');
  const feedEmpty = document.getElementById('feedEmpty');
  const feedProgressBar = document.getElementById('feedProgressBar');
  const statMatches = document.getElementById('statMatches');
  const statSalvos = document.getElementById('statSalvos');
  const statRestantes = document.getElementById('statRestantes');
  const feedEmptyResumo = document.getElementById('feedEmptyResumo');
  const matchContent = document.querySelector('#feedView .match-content');
  const bottomActions = document.querySelector('#feedView .bottom-actions');
  const feedStatus = document.querySelector('#feedView .feed-status');
  const feedFilters = document.querySelectorAll('.feed-filter');

  function aplicarFiltro(filtro) {
    filtroAtivo = filtro;
    petsFiltrados = filtrarNaoVistos(listaBasePorFiltro(filtro));
    indiceAtual = 0;
    feedFilters.forEach(function (btn) {
      btn.classList.toggle('ativo', btn.getAttribute('data-filtro') === filtro);
    });
    renderizarPet();
  }

  function getPetAtual() {
    return petsFiltrados[indiceAtual];
  }

  function getProximoPet() {
    return petsFiltrados[indiceAtual + 1];
  }

  function feedVisivel() {
    return feedView && !feedView.hidden;
  }

  function montarTags(container, lista) {
    container.innerHTML = '';
    lista.forEach(function (tag) {
      const span = document.createElement('span');
      span.textContent = tag;
      container.appendChild(span);
    });
  }

  function mostrarToast(mensagem) {
    toast.textContent = mensagem;
    toast.classList.remove('hidden');
    setTimeout(function () {
      toast.classList.add('hidden');
    }, 2200);
  }

  function atualizarStats() {
    const restantes = Math.max(petsFiltrados.length - indiceAtual, 0);
    statMatches.textContent = matches.length;
    statSalvos.textContent = salvos.length;
    statRestantes.textContent = restantes;

    const progresso = petsFiltrados.length
      ? Math.round((indiceAtual / petsFiltrados.length) * 100)
      : 100;
    feedProgressBar.style.width = progresso + '%';
  }

  function preencherCardPreview(card, pet) {
    if (!pet) {
      card.innerHTML = '';
      card.classList.add('hidden');
      return;
    }
    card.classList.remove('hidden');
    card.innerHTML =
      '<div class="photo-area">' +
      '<img src="' + pet.foto + '" alt="' + pet.nome + '" referrerpolicy="no-referrer" />' +
      '</div>' +
      '<div class="card-body preview-body">' +
      '<h1>' + pet.nome + '</h1>' +
      '</div>';
    var previewImg = card.querySelector('img');
    aplicarFotoPet(previewImg, pet);
  }

  function toggleFeedAtivo(ativo) {
    const ocultar = !ativo;
    if (matchContent) matchContent.classList.toggle('hidden', ocultar);
    if (bottomActions) bottomActions.classList.toggle('hidden', ocultar);
    if (feedStatus) feedStatus.classList.toggle('hidden', ocultar);
    if (feedEmpty) feedEmpty.classList.toggle('hidden', ativo);
  }

  function renderizarPet() {
    const pet = getPetAtual();
    const proximo = getProximoPet();
    atualizarStats();

    if (!pet) {
      toggleFeedAtivo(false);
      feedEmptyResumo.textContent =
        matches.length + ' match(es) · ' + salvos.length + ' salvo(s).';
      contadorPets.textContent = petsFiltrados.length + ' de ' + petsFiltrados.length;
      preencherCardPreview(petCardNext, null);
      return;
    }

    toggleFeedAtivo(true);
    preencherCardPreview(petCardNext, proximo);

    aplicarFotoPet(document.getElementById('petFoto'), pet);
    document.getElementById('petFoto').alt = 'Foto do pet ' + pet.nome;
    document.getElementById('petTipo').textContent = pet.tipo;
    document.getElementById('petStatus').textContent = pet.status;
    document.getElementById('petMatchScore').textContent = pet.matchScore + '% match';
    document.getElementById('petNome').textContent = pet.nome;
    document.getElementById('petLocalizacao').textContent = '⌖ ' + pet.localizacao;
    document.getElementById('petIdade').textContent = pet.idade;
    document.getElementById('petPorte').textContent = pet.porte;
    document.getElementById('petRaca').textContent = pet.raca;
    contadorPets.textContent = (indiceAtual + 1) + ' de ' + petsFiltrados.length;
    montarTags(document.getElementById('petTags'), pet.tags);
  }

  function notificarMatch(pet) {
    var petMatch = clonarPetComFotoExibida(pet);
    const jaMatch = matches.some(function (item) { return item.id === pet.id; });
    if (!jaMatch) {
      matches.push(petMatch);
      atualizarStats();
      window.dispatchEvent(new CustomEvent('pet:match', { detail: petMatch }));
    }
  }

  function proximoPet(direcao) {
    const pet = getPetAtual();
    if (!pet) {
      mostrarToast('O feed já terminou.');
      return;
    }

    if (direcao === 'right') {
      notificarMatch(pet);
      mostrarToast('Match com ' + pet.nome + '! ♥');
      petCard.classList.add('swipe-right');
    } else {
      mostrarToast(pet.nome + ' foi passado.');
      petCard.classList.add('swipe-left');
    }

    marcarPetVisto(pet.id);

    setTimeout(function () {
      indiceAtual++;
      petCard.classList.remove('swipe-left', 'swipe-right', 'swipe-drag');
      petCard.style.transform = '';
      renderizarPet();
    }, 260);
  }

  function abrirPerfil() {
    const pet = getPetAtual();
    if (!pet) return;

    aplicarFotoPet(document.getElementById('perfilFoto'), pet);
    document.getElementById('perfilFoto').alt = 'Foto de perfil do pet ' + pet.nome;
    document.getElementById('perfilNome').textContent = pet.nome;
    document.getElementById('perfilResumo').textContent =
      pet.tipo + ' • ' + pet.raca + ' • ' + pet.porte + ' porte • ' + pet.idade;
    document.getElementById('perfilDescricao').textContent = pet.descricao;
    document.getElementById('perfilLocalizacao').textContent = pet.localizacao;
    document.getElementById('perfilResponsavel').textContent = pet.responsavel;
    document.getElementById('perfilStatus').textContent = pet.status;
    document.getElementById('perfilContato').textContent = pet.contato;
    montarTags(document.getElementById('perfilTags'), pet.detalhes);

    modalPerfil.classList.remove('hidden');
    modalPerfil.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function fecharPerfil() {
    modalPerfil.classList.add('hidden');
    modalPerfil.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function salvarPerfil() {
    const pet = getPetAtual();
    if (!pet) return;

    const jaSalvo = salvos.some(function (item) { return item.id === pet.id; });
    if (!jaSalvo) {
      salvos.push(pet);
      mostrarToast(pet.nome + ' salvo para ver depois.');
      atualizarStats();
    } else {
      mostrarToast(pet.nome + ' já está salvo.');
    }
  }

  function demonstrarInteresse() {
    const pet = getPetAtual();
    if (!pet) return;

    notificarMatch(pet);
    marcarPetVisto(pet.id);
    mostrarToast('Interesse registrado em ' + pet.nome + '!');
    fecharPerfil();
  }

  function restaurarMatches(petIds) {
    if (!petIds || !petIds.length) return;
    petIds.forEach(function (petId) {
      var pet = PETS_FEED.find(function (p) { return p.id === petId; });
      if (pet && !matches.some(function (item) { return item.id === petId; })) {
        matches.push(pet);
      }
    });
    atualizarStats();
  }

  window.addEventListener('match:restored', function (event) {
    if (event.detail && event.detail.petIds) {
      event.detail.petIds.forEach(function (petId) {
        petsVistos.add(Number(petId));
      });
      restaurarMatches(event.detail.petIds);
      aplicarFiltro(filtroAtivo);
    }
  });

  function reiniciarFeed() {
    if (petsFiltrados.length === 0) {
      mostrarToast('Você já viu todos os pets deste filtro.');
      return;
    }
    indiceAtual = 0;
    renderizarPet();
    mostrarToast('Feed reiniciado.');
  }

  function reiniciarCompleto() {
    aplicarFiltro('todos');
    if (petsFiltrados.length === 0) {
      mostrarToast('Não há mais pets novos para explorar.');
    } else {
      mostrarToast('Continuando de onde parou.');
    }
  }

  feedFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      aplicarFiltro(btn.getAttribute('data-filtro'));
    });
  });

  document.getElementById('btnPassar').addEventListener('click', function () { proximoPet('left'); });
  document.getElementById('btnGostei').addEventListener('click', function () { proximoPet('right'); });
  document.getElementById('btnPassarMobile').addEventListener('click', function () { proximoPet('left'); });
  document.getElementById('btnGosteiMobile').addEventListener('click', function () { proximoPet('right'); });
  document.getElementById('btnReiniciar').addEventListener('click', reiniciarFeed);
  document.getElementById('btnReiniciarEmpty').addEventListener('click', reiniciarCompleto);

  petCard.addEventListener('click', function (e) {
    if (e.target.closest('#btnInfo')) return;
    abrirPerfil();
  });
  petCard.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') abrirPerfil();
  });

  document.getElementById('btnInfo').addEventListener('click', function (event) {
    event.stopPropagation();
    abrirPerfil();
  });

  document.getElementById('btnFecharModal').addEventListener('click', fecharPerfil);
  modalPerfil.addEventListener('click', function (event) {
    if (event.target.hasAttribute('data-close-modal')) fecharPerfil();
  });

  document.getElementById('btnSalvarPerfil').addEventListener('click', salvarPerfil);
  document.getElementById('btnTenhoInteresse').addEventListener('click', demonstrarInteresse);

  document.addEventListener('keydown', function (event) {
    if (!feedVisivel()) return;
    if (event.key === 'Escape') fecharPerfil();
    if (!modalPerfil.classList.contains('hidden')) return;
    if (event.key === 'ArrowLeft') proximoPet('left');
    if (event.key === 'ArrowRight') proximoPet('right');
  });

  var touchStartX = 0;
  var touchDeltaX = 0;

  petCard.addEventListener('touchstart', function (e) {
    if (!getPetAtual()) return;
    touchStartX = e.changedTouches[0].clientX;
    touchDeltaX = 0;
    petCard.classList.add('swipe-drag');
  }, { passive: true });

  petCard.addEventListener('touchmove', function (e) {
    if (!getPetAtual()) return;
    touchDeltaX = e.changedTouches[0].clientX - touchStartX;
    var rotate = touchDeltaX * 0.04;
    petCard.style.transform = 'translateX(' + touchDeltaX + 'px) rotate(' + rotate + 'deg)';
  }, { passive: true });

  petCard.addEventListener('touchend', function () {
    if (!getPetAtual()) return;
    petCard.classList.remove('swipe-drag');
    if (touchDeltaX > 80) {
      proximoPet('right');
    } else if (touchDeltaX < -80) {
      proximoPet('left');
    } else {
      petCard.style.transform = '';
    }
    touchDeltaX = 0;
  });

  initProgressoFeed();
  aplicarFiltro(filtroAtivo);
}
