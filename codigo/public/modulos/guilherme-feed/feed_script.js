const pets=[{id:1,nome:"Max",tipo:"Cachorro",raca:"SRD",idade:"2 anos",porte:"Médio",localizacao:"Belo Horizonte, MG",status:"Disponível para adoção",responsavel:"ONG Patinhas do Bem",contato:"(31) 99999-9999",foto:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",tags:["Dócil","Brincalhão","Sociável"],detalhes:["Vacinado","Vermifugado","Bom com crianças"],descricao:"Max é um cachorro carinhoso, alegre e sociável. Foi resgatado recentemente e está procurando uma família responsável para receber muito amor e cuidado."},{id:2,nome:"Luna",tipo:"Gato",raca:"SRD",idade:"1 ano",porte:"Pequeno",localizacao:"Contagem, MG",status:"Disponível para adoção",responsavel:"Protetora Ana Paula",contato:"(31) 98888-8888",foto:"https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",tags:["Calma","Carinhosa","Castrada"],detalhes:["Vacinada","Castrada","Boa para apartamento"],descricao:"Luna é uma gatinha tranquila e muito carinhosa. Gosta de ambientes calmos e está pronta para encontrar um lar definitivo."},{id:3,nome:"Thor",tipo:"Cachorro",raca:"Vira-lata",idade:"8 meses",porte:"Pequeno",localizacao:"Nova Lima, MG",status:"Disponível para adoção",responsavel:"Lar Temporário Cãopanheiro",contato:"(31) 97777-7777",foto:"https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",tags:["Filhote","Ativo","Amigável"],detalhes:["Primeira vacina","Vermifugado","Adora brincar"],descricao:"Thor é um filhote cheio de energia, ideal para famílias que querem um companheiro divertido e amoroso."}];

let indiceAtual=0;
let matches=[];
let salvos=[];

const petCard=document.getElementById("petCard");
const petFoto=document.getElementById("petFoto");
const petStatus=document.getElementById("petStatus");
const petNome=document.getElementById("petNome");
const petLocalizacao=document.getElementById("petLocalizacao");
const petTags=document.getElementById("petTags");
const petIdade=document.getElementById("petIdade");
const petPorte=document.getElementById("petPorte");
const petRaca=document.getElementById("petRaca");
const contadorPets=document.getElementById("contadorPets");
const modalPerfil=document.getElementById("modalPerfil");
const toast=document.getElementById("toast");

function getPetAtual(){return pets[indiceAtual];}

function montarTags(container,lista){
  container.innerHTML="";
  lista.forEach(tag=>{
    const span=document.createElement("span");
    span.textContent=tag;
    container.appendChild(span);
  });
}

function renderizarPet(){
  const pet=getPetAtual();

  if(!pet){
    petCard.innerHTML=`<div class="card-body"><h1>Fim do feed</h1><p class="location">Você já visualizou todos os pets disponíveis.</p><div class="tags"><span>${matches.length} match(es)</span></div></div>`;
    contadorPets.textContent=`${pets.length} de ${pets.length}`;
    return;
  }

  petFoto.src=pet.foto;
  petFoto.alt=`Foto do pet ${pet.nome}`;
  petStatus.textContent=pet.status;
  petNome.textContent=pet.nome;
  petLocalizacao.textContent=`⌖ ${pet.localizacao}`;
  petIdade.textContent=pet.idade;
  petPorte.textContent=pet.porte;
  petRaca.textContent=pet.raca;
  contadorPets.textContent=`${indiceAtual+1} de ${pets.length}`;
  montarTags(petTags,pet.tags);
}

function proximoPet(direcao){
  const pet=getPetAtual();
  if(!pet){mostrarToast("O feed já terminou. Reinicie para ver novamente.");return;}

  if(direcao==="right"){
    matches.push(pet);
    mostrarToast(`Você deu match com ${pet.nome}!`);
    petCard.classList.add("swipe-right");
  }else{
    mostrarToast(`${pet.nome} foi passado.`);
    petCard.classList.add("swipe-left");
  }

  setTimeout(()=>{
    indiceAtual++;
    petCard.classList.remove("swipe-left","swipe-right");
    renderizarPet();
  },260);
}

function abrirPerfil(){
  const pet=getPetAtual();
  if(!pet)return;

  document.getElementById("perfilFoto").src=pet.foto;
  document.getElementById("perfilFoto").alt=`Foto de perfil do pet ${pet.nome}`;
  document.getElementById("perfilNome").textContent=pet.nome;
  document.getElementById("perfilResumo").textContent=`${pet.tipo} • ${pet.raca} • ${pet.porte} porte • ${pet.idade}`;
  document.getElementById("perfilDescricao").textContent=pet.descricao;
  document.getElementById("perfilLocalizacao").textContent=pet.localizacao;
  document.getElementById("perfilResponsavel").textContent=pet.responsavel;
  document.getElementById("perfilStatus").textContent=pet.status;
  document.getElementById("perfilContato").textContent=pet.contato;
  montarTags(document.getElementById("perfilTags"),pet.detalhes);

  modalPerfil.classList.remove("hidden");
  modalPerfil.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}

function fecharPerfil(){
  modalPerfil.classList.add("hidden");
  modalPerfil.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

function salvarPerfil(){
  const pet=getPetAtual();
  if(!pet)return;

  const jaSalvo=salvos.some(item=>item.id===pet.id);
  if(!jaSalvo){
    salvos.push(pet);
    mostrarToast(`${pet.nome} foi salvo para ver depois.`);
  }else{
    mostrarToast(`${pet.nome} já está salvo.`);
  }
}

function demonstrarInteresse(){
  const pet=getPetAtual();
  if(!pet)return;

  if(!matches.some(item=>item.id===pet.id))matches.push(pet);
  mostrarToast(`Interesse registrado em ${pet.nome}.`);
}

function reiniciarFeed(){
  indiceAtual=0;
  matches=[];
  renderizarPet();
  mostrarToast("Feed reiniciado.");
}

function mostrarToast(mensagem){
  toast.textContent=mensagem;
  toast.classList.remove("hidden");
  setTimeout(()=>toast.classList.add("hidden"),2200);
}

document.getElementById("btnPassar").addEventListener("click",()=>proximoPet("left"));
document.getElementById("btnGostei").addEventListener("click",()=>proximoPet("right"));
document.getElementById("btnPassarMobile").addEventListener("click",()=>proximoPet("left"));
document.getElementById("btnGosteiMobile").addEventListener("click",()=>proximoPet("right"));
document.getElementById("btnReiniciar").addEventListener("click",reiniciarFeed);

petCard.addEventListener("click",abrirPerfil);
petCard.addEventListener("keydown",event=>{if(event.key==="Enter")abrirPerfil();});

document.getElementById("btnInfo").addEventListener("click",event=>{
  event.stopPropagation();
  abrirPerfil();
});

document.getElementById("btnFecharModal").addEventListener("click",fecharPerfil);
modalPerfil.addEventListener("click",event=>{
  if(event.target.hasAttribute("data-close-modal"))fecharPerfil();
});

document.getElementById("btnSalvarPerfil").addEventListener("click",salvarPerfil);
document.getElementById("btnTenhoInteresse").addEventListener("click",demonstrarInteresse);

document.addEventListener("keydown",event=>{
  if(event.key==="Escape")fecharPerfil();
  if(!modalPerfil.classList.contains("hidden"))return;
  if(event.key==="ArrowLeft")proximoPet("left");
  if(event.key==="ArrowRight")proximoPet("right");
});

renderizarPet();