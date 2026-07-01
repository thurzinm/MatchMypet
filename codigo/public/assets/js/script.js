document.addEventListener('DOMContentLoaded', function () {
    const conversas = {};
    let conversaAtivaId = null;
    let termoBusca = '';
    let usuarioId = null;

    const feedView = document.getElementById('feedView');
    const chatView = document.getElementById('chatView');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const btnVoltarFeed = document.getElementById('btnVoltarFeed');
    const btnVerConversas = document.getElementById('btnVerConversas');
    const talkScreen = document.querySelector('.talk-screen');
    const sidebar = document.getElementById('talkSidebar');
    const chatList = document.getElementById('chatList');
    const buscaMatch = document.getElementById('buscaMatch');
    const sidebarEmpty = document.getElementById('sidebarEmpty');
    const sidebarMatchCount = document.getElementById('sidebarMatchCount');

    function isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    function totalMatches() {
        return Object.keys(conversas).length;
    }

    function mostrarSidebar() {
        if (!sidebar) return;
        sidebar.hidden = false;
        sidebar.classList.add('visivel');
        if (talkScreen) talkScreen.classList.remove('sem-sidebar');
        if (btnVerConversas) {
            btnVerConversas.hidden = false;
            btnVerConversas.classList.add('visivel');
        }
        if (sidebarMatchCount) sidebarMatchCount.textContent = totalMatches();
        if (sidebarEmpty) sidebarEmpty.classList.add('hidden');
    }

    function contatoParaConversa(contato) {
        return {
            contatoId: contato.id,
            nome: contato.responsavel,
            pet: contato.petNome,
            petId: contato.petId,
            tipo: contato.tipo,
            avatar: contato.avatar,
            mensagens: contato.mensagens || []
        };
    }

    function fotoAtualDoPet(dados) {
        if (dados.avatar) return dados.avatar;
        if (window.PETS_FEED && dados.petId) {
            var petAtual = window.PETS_FEED.find(function (p) { return p.id === dados.petId; });
            if (petAtual) return petAtual.foto;
        }
        return dados.avatar;
    }

    function aplicarAvatar(img, dados) {
        if (!img || !dados) return;
        var petInfo = {
            id: dados.petId,
            tipo: dados.tipo,
            foto: fotoAtualDoPet(dados),
            nome: dados.pet
        };
        if (typeof window.aplicarFotoAvatar === 'function') {
            window.aplicarFotoAvatar(img, petInfo);
            return;
        }
        img.referrerPolicy = 'no-referrer';
        img.src = dados.avatar;
        img.onerror = function () {
            img.onerror = null;
            if (typeof window.urlFotoFallback === 'function') {
                img.src = window.urlFotoFallback(petInfo, 52, 52);
                return;
            }
            img.src = dados.tipo === 'Gato'
                ? 'https://cataas.com/cat?width=52&height=52'
                : 'https://placedog.net/52/52?id=' + dados.petId;
        };
    }

    function criarConversa(pet) {
        const id = 'pet-' + pet.id;
        if (conversas[id]) return id;

        conversas[id] = {
            nome: pet.responsavel,
            pet: pet.nome,
            petId: pet.id,
            tipo: pet.tipo,
            avatar: pet.foto,
            mensagens: [{
                tipo: 'incoming',
                texto: pet.mensagemInicial || ('Olá! Vi que você se interessou pelo ' + pet.nome + '. Posso te contar mais?'),
                hora: formatarHora(new Date())
            }]
        };

        return id;
    }

    function formatarHora(data) {
        return data.getHours() + ':' + data.getMinutes().toString().padStart(2, '0');
    }

    function mostrarToastRestauracao(total) {
        var toast = document.getElementById('feedToast');
        if (!toast || total <= 0) return;
        toast.textContent = total + ' conversa(s) restaurada(s).';
        toast.classList.remove('hidden');
        setTimeout(function () {
            toast.classList.add('hidden');
        }, 2600);
    }

    async function persistirContato(pet, conversaId) {
        if (!window.MatchStorage || !usuarioId) return;

        try {
            var contato = await MatchStorage.criarContato(
                usuarioId,
                pet,
                conversas[conversaId].mensagens
            );
            conversas[conversaId].contatoId = contato.id;
        } catch (e) {
            console.error('Erro ao salvar match:', e);
        }
    }

    async function persistirMensagens(conversaId) {
        var dados = conversas[conversaId];
        if (!dados || !window.MatchStorage || !usuarioId) return;

        try {
            var atualizado = await MatchStorage.atualizarMensagens(
                usuarioId,
                dados.contatoId,
                dados.mensagens
            );
            if (atualizado && atualizado.id) {
                dados.contatoId = atualizado.id;
            }
        } catch (e) {
            console.error('Erro ao salvar mensagens:', e);
        }
    }

    function renderizarListaMatches() {
        if (!chatList) return;

        chatList.innerHTML = '';
        const ids = Object.keys(conversas);

        ids.forEach(function (id) {
            const dados = conversas[id];
            const termo = termoBusca.trim().toLowerCase();
            const petNome = dados.pet.toLowerCase();
            const responsavel = dados.nome.toLowerCase();

            if (termo && !petNome.includes(termo) && !responsavel.includes(termo)) {
                return;
            }

            const ultimaMsg = dados.mensagens[dados.mensagens.length - 1];
            const item = document.createElement('div');
            item.className = 'chat-item';
            if (id === conversaAtivaId) item.classList.add('active');
            item.setAttribute('data-id', id);
            item.setAttribute('data-pet-nome', dados.pet.toLowerCase());
            item.innerHTML =
                '<img src="" alt="' + dados.pet + '" referrerpolicy="no-referrer">' +
                '<div class="chat-info">' +
                '<div class="chat-name">' + dados.nome + ' (' + dados.pet + ')</div>' +
                '<div class="chat-last-msg">' + ultimaMsg.texto + '</div>' +
                '</div>';

            aplicarAvatar(item.querySelector('img'), dados);

            item.addEventListener('click', function () {
                mostrarChat(id);
            });

            chatList.appendChild(item);
        });

        if (sidebarMatchCount) sidebarMatchCount.textContent = totalMatches();

        const visiveis = chatList.querySelectorAll('.chat-item').length;
        if (sidebarEmpty && totalMatches() > 0) {
            sidebarEmpty.classList.toggle('hidden', visiveis > 0 || !termoBusca);
            if (termoBusca && visiveis === 0) {
                sidebarEmpty.textContent = 'Nenhum pet encontrado com esse nome.';
                sidebarEmpty.classList.remove('hidden');
            } else if (!termoBusca) {
                sidebarEmpty.textContent = 'Dê match em um pet para iniciar uma conversa.';
            }
        }
    }

    function mostrarFeed() {
        if (feedView) feedView.hidden = false;
        if (chatView) chatView.hidden = true;
        if (sidebar) {
            sidebar.classList.remove('visivel-mobile', 'oculta-mobile');
        }
        if (talkScreen) {
            talkScreen.classList.add('modo-feed');
            talkScreen.classList.remove('modo-chat');
        }
        document.querySelectorAll('.chat-item').forEach(function (item) {
            item.classList.remove('active');
        });
        conversaAtivaId = null;
    }

    function carregarConversa(id) {
        const dados = conversas[id];
        if (!dados) return;

        conversaAtivaId = id;

        document.querySelector('.talk-header h3').textContent = dados.nome + ' (' + dados.pet + ')';
        var headerAvatar = document.querySelector('.talk-header img');
        headerAvatar.alt = dados.pet;
        aplicarAvatar(headerAvatar, dados);

        chatMessages.innerHTML = '';
        dados.mensagens.forEach(function (msg) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('msg', msg.tipo);
            msgDiv.innerHTML = '<p>' + msg.texto + '</p><span class="meta">' + msg.hora + '</span>';
            chatMessages.appendChild(msgDiv);
        });

        document.querySelectorAll('.chat-item').forEach(function (item) {
            item.classList.toggle('active', item.getAttribute('data-id') === id);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function mostrarChat(id) {
        if (feedView) feedView.hidden = true;
        if (chatView) chatView.hidden = false;
        if (sidebar) {
            sidebar.classList.remove('visivel-mobile');
            if (isMobile()) sidebar.classList.add('oculta-mobile');
        }
        if (talkScreen) {
            talkScreen.classList.remove('modo-feed');
            talkScreen.classList.add('modo-chat');
        }
        carregarConversa(id);
    }

    window.addEventListener('pet:match', function (event) {
        const pet = event.detail;
        if (!pet) return;

        var conversaId = criarConversa(pet);
        mostrarSidebar();
        renderizarListaMatches();
        persistirContato(pet, conversaId);
    });

    if (buscaMatch) {
        buscaMatch.addEventListener('input', function () {
            termoBusca = buscaMatch.value;
            renderizarListaMatches();
        });
    }

    if (btnVoltarFeed) {
        btnVoltarFeed.addEventListener('click', mostrarFeed);
    }

    if (btnVerConversas) {
        btnVerConversas.addEventListener('click', function () {
            if (sidebar) sidebar.classList.toggle('visivel-mobile');
        });
    }

    document.addEventListener('click', function (e) {
        if (!isMobile() || !sidebar || !sidebar.classList.contains('visivel-mobile')) return;
        if (sidebar.contains(e.target) || (btnVerConversas && btnVerConversas.contains(e.target))) return;
        sidebar.classList.remove('visivel-mobile');
    });

    function enviarMensagem() {
        if (!conversaAtivaId) return;

        const texto = userInput.value.trim();
        if (!texto) return;

        const hora = formatarHora(new Date());
        conversas[conversaAtivaId].mensagens.push({ tipo: 'outgoing', texto: texto, hora: hora });

        const msgDiv = document.createElement('div');
        msgDiv.classList.add('msg', 'outgoing');
        msgDiv.innerHTML = '<p>' + texto + '</p><span class="meta">' + hora + '</span>';
        chatMessages.appendChild(msgDiv);

        userInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        renderizarListaMatches();
        persistirMensagens(conversaAtivaId);
    }

    sendBtn.addEventListener('click', enviarMensagem);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') enviarMensagem();
    });

    async function inicializar() {
        if (window.MatchStorage && !MatchStorage.exigirLoginMatch()) return;

        usuarioId = window.MatchStorage ? MatchStorage.getUsuarioId() : null;
        window.__usuarioIdFeed = usuarioId;

        if (window.MatchStorage && usuarioId) {
            try {
                await MatchStorage.sincronizarPendentes(usuarioId);
                var contatos = await MatchStorage.carregarContatos(usuarioId);
                var petIds = [];

                contatos.forEach(function (contato) {
                    conversas['pet-' + contato.petId] = contatoParaConversa(contato);
                    petIds.push(contato.petId);
                });

                for (var i = 0; i < petIds.length; i++) {
                    await MatchStorage.registrarPetVisto(usuarioId, petIds[i]);
                }

                window.__feedProgress = await MatchStorage.carregarProgressoFeed(usuarioId);

                if (petIds.length > 0) {
                    mostrarSidebar();
                    renderizarListaMatches();
                    mostrarToastRestauracao(petIds.length);
                }
            } catch (e) {
                console.error('Erro ao restaurar contatos:', e);
                window.__feedProgress = { petsVistos: [], filtroAtivo: 'todos' };
            }
        } else {
            window.__feedProgress = { petsVistos: [], filtroAtivo: 'todos' };
        }

        if (typeof initMatchFeed === 'function') {
            initMatchFeed();
        }

        if (window.MatchStorage && usuarioId && Object.keys(conversas).length > 0) {
            var idsRestaurados = Object.keys(conversas).map(function (key) {
                return conversas[key].petId;
            });
            window.dispatchEvent(new CustomEvent('match:restored', {
                detail: { petIds: idsRestaurados }
            }));
        }

        mostrarFeed();
    }

    inicializar();
});
