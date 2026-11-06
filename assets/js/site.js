// Keep the small navigation usable on narrow screens.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Update the copyright year without editing every page each year.
document.querySelectorAll('[data-year]').forEach((item) => {
  item.textContent = new Date().getFullYear();
});
