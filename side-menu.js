const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.content-section');
const cartCount = document.getElementById('cartCount');
const logoutButton = document.getElementById('logoutBtn');

let itemCount = 0;

function setActiveMenu(targetId) {
  menuItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.target === targetId);
  });

  sections.forEach((section) => {
    const isVisible = section.id === targetId;
    section.classList.toggle('active', isVisible);
  });
}

function toggleSidebar() {
  sidebar.classList.toggle('collapsed');
}

menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    setActiveMenu(item.dataset.target);
  });
});

menuToggle.addEventListener('click', toggleSidebar);

const addButtons = document.querySelectorAll('.add-cart, .move-cart');
addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    itemCount += 1;
    cartCount.textContent = itemCount;
    button.textContent = 'Added';
    button.disabled = true;
    button.style.opacity = '0.7';
  });
});

logoutButton.addEventListener('click', () => {
  alert('Logout successful. This section represents the logout page.');
  setActiveMenu('logout');
});
