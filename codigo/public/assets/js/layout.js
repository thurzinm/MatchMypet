function alternarMenu() {
  var menu = document.getElementById('menuMobile');
  if (menu) menu.classList.toggle('aberto');
}

function alternarMenuRonan() {
  var menu = document.getElementById('menuMobileRonan');
  if (menu) menu.classList.toggle('aberto');
}

document.addEventListener('click', function (e) {
  var menuRonan = document.getElementById('menuMobileRonan');
  var btnRonan = document.querySelector('.botao-menu-ronan');
  if (menuRonan && menuRonan.classList.contains('aberto') && btnRonan &&
      !menuRonan.contains(e.target) && !btnRonan.contains(e.target)) {
    menuRonan.classList.remove('aberto');
  }

  var menu = document.getElementById('menuMobile');
  var btn = document.querySelector('.botao-menu');
  if (menu && menu.classList.contains('aberto') && btn &&
      !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('aberto');
  }
});
