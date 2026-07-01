function formatarTelefone(valor) {
  const numeros = valor.replace(/\D/g, '').substring(0, 11);

  if (numeros.length > 6) {
    return numeros.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
  }
  if (numeros.length > 2) {
    return numeros.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  }
  if (numeros.length > 0) {
    return numeros.replace(/^(\d{0,2})/, '($1');
  }
  return '';
}

function formatarEmail(valor) {
  return valor
    .replace(/\s/g, '')
    .replace(/[^a-zA-Z0-9@._+-]/g, '');
}

function bloquearLetrasTelefone(evento) {
  if (evento.key.length === 1 && /[a-zA-Z]/.test(evento.key)) {
    evento.preventDefault();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const campoEmail = document.getElementById('campo-email');
  const campoTelefone = document.getElementById('campo-telefone');

  if (campoEmail) {
    campoEmail.addEventListener('input', (e) => {
      e.target.value = formatarEmail(e.target.value);
    });
  }

  if (campoTelefone) {
    campoTelefone.addEventListener('keydown', bloquearLetrasTelefone);
    campoTelefone.addEventListener('input', (e) => {
      e.target.value = formatarTelefone(e.target.value);
    });
    campoTelefone.addEventListener('paste', (e) => {
      e.preventDefault();
      const texto = (e.clipboardData || window.clipboardData).getData('text');
      e.target.value = formatarTelefone(texto);
    });
  }
});
