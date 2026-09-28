const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

nav.addEventListener('click', (event) => {
  if (!event.target.matches('a')) return;
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
});

document.querySelector('#year').textContent = new Date().getFullYear();
