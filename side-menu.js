function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const button = document.querySelector('.menu-toggle');
  const isOpen = sidebar.classList.toggle('open');
  button.setAttribute('aria-expanded', String(!isOpen));
}

function setActive(event) {
  event.preventDefault();
  const links = document.querySelectorAll('.menu-link');
  links.forEach(link => link.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function logout(event) {
  event.preventDefault();
  setActive(event);
  alert('You clicked Logout. This menu runs separately from the login page.');
}
