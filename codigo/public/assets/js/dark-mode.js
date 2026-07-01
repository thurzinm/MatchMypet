(function () {
  const STORAGE_KEY = 'dark-mode';

  function isDarkModeEnabled() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  function setDarkMode(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
    if (document.body) {
      document.body.classList.toggle('dark-mode', isDark);
    }
    localStorage.setItem(STORAGE_KEY, isDark ? 'true' : 'false');

    const toggle = document.getElementById('darkModeToggle');
    if (toggle) toggle.checked = isDark;
  }

  if (isDarkModeEnabled()) {
    document.documentElement.classList.add('dark-mode');
  }

  window.setDarkMode = setDarkMode;
  window.isDarkModeEnabled = isDarkModeEnabled;

  document.addEventListener('DOMContentLoaded', () => {
    if (isDarkModeEnabled()) {
      document.body.classList.add('dark-mode');
      const toggle = document.getElementById('darkModeToggle');
      if (toggle) toggle.checked = true;
    }
  });
})();
