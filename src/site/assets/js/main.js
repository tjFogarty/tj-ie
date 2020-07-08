(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const menu = document.querySelector('.js-nav-overlay');
    const toggleMenu = document.querySelectorAll('.js-toggle-menu');
    const openClass = 'nav-open';

    function handleKeydown(e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        body.classList.remove(openClass);
      }
    }

    [...toggleMenu].forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        body.classList.toggle(openClass);

        if (body.classList.contains(openClass)) {
          menu.addEventListener('transitionend', () => {
            menu.querySelector('a').focus();
          }, { once: true });
          window.addEventListener('keydown', handleKeydown);
        } else {
          window.removeEventListener('keydown', handleKeydown);
        }
      });
    })
  });
})();
