const defaultProducts = [
  { id: 1, name: 'Legendary Nokia', category: 'Electronics', price: 14999, stock: 20, image: '../legendary-nokia.png', featured: true },
  { id: 2, name: 'Missing Backpack', category: 'School Supplies', price: 1299, stock: 32, image: '../missing-backpack.png', featured: true },
  { id: 3, name: 'Hoodie ng Pogi', category: 'Clothing', price: 899, stock: 18, image: '../hoodie-ng-pogi.jpg', featured: true },
  { id: 4, name: 'Earbuds', category: 'Accessories', price: 2499, stock: 15, image: '../earbuds.png', featured: false },
  { id: 5, name: 'Pixar lamp', category: 'Home', price: 799, stock: 25, image: '../pixar-lamp.png', featured: false },
  { id: 6, name: 'Notebook set ng bigo sa lovelife', category: 'School Supplies', price: 420, stock: 42, image: '../notebook-lovelife.png', featured: false },
  { id: 7, name: 'Wallet na mahirap magkalaman', category: 'Accessories', price: 1199, stock: 22, image: '../wallet-mahirap-magkalaman.png', featured: false },
  { id: 8, name: 'Desk Table', category: 'Home', price: 680, stock: 17, image: '../desk-table.png', featured: false }
];

const demoAccounts = [
  { email: 'user@example.com', password: 'user123', role: 'customer', name: 'Maria Santos', phone: '+63 912 456 7890', address: 'Camiling, Tarlac' },
  { email: 'seller@example.com', password: 'seller123', role: 'seller', name: 'Nina Reyes', store: 'TAU Market Store', phone: '+63 912 345 6789', address: 'Camiling, Tarlac' }
];

const customerOrders = [
  { orderNo: 'TAU-1024', product: 'Legendary Nokia', status: 'Delivered', total: 14999 },
  { orderNo: 'TAU-1030', product: 'Missing Backpack', status: 'Shipped', total: 1299 },
  { orderNo: 'TAU-1046', product: 'Earbuds', status: 'Pending', total: 2499 }
];

const sellerOrders = [
  { orderNo: 'TAU-2201', customer: 'Maria Santos', product: 'Legendary Nokia', status: 'Pending', total: 14999 },
  { orderNo: 'TAU-2202', customer: 'Jolene Cruz', product: 'Notebook set ng bigo sa lovelife', status: 'Shipped', total: 420 },
  { orderNo: 'TAU-2203', customer: 'Loren Tabu', product: 'Hoodie ng Pogi', status: 'Delivered', total: 899 }
];

const appState = {
  currentUser: null,
  currentPage: 'home',
  cart: [],
  wishlist: [],
  products: []
};

const storageKeys = {
  products: 'tau-market-products',
  cart: 'tau-market-cart',
  wishlist: 'tau-market-wishlist',
  session: 'tau-market-session'
};

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
}

function seedProducts() {
  const savedProducts = readStorage(storageKeys.products, null);
  if (!savedProducts || !savedProducts.length) {
    writeStorage(storageKeys.products, defaultProducts);
  }

  appState.products = readStorage(storageKeys.products, defaultProducts);
  appState.cart = readStorage(storageKeys.cart, []);
  appState.wishlist = readStorage(storageKeys.wishlist, []);
  localStorage.removeItem(storageKeys.session);
}

function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const errorNode = document.getElementById('loginError');

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  const matched = demoAccounts.find((account) => {
    const accountEmail = (account.email || '').toLowerCase();
    const accountUsername = (account.username || '').toLowerCase();
    const accountName = (account.name || '').toLowerCase();
    return (accountEmail === email || accountUsername === email || accountName === email) && account.password === password;
  });

  if (!matched) {
    errorNode.textContent = 'Invalid email/username or password. Please try again.';
    return;
  }

  appState.currentUser = { ...matched };
  errorNode.textContent = '';
  showApp();
}

function handleLogout() {
  appState.currentUser = null;
  localStorage.removeItem(storageKeys.session);
  document.getElementById('loginForm').reset();
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('appShell').classList.add('hidden');
}

function showApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');
  renderSidebar();
  renderTopBar();
  renderCustomerHome();
  renderProducts();
  renderCategories();
  renderCart();
  renderWishlist();
  renderOrders();
  renderProfile();
  renderSellerDashboard();
  renderSellerProducts();
  renderSellerOrders();
  renderSellerProfile();
  showPage('home');
}

function renderTopBar() {
  const headerUserName = document.getElementById('headerUserName');
  const headerAvatar = document.getElementById('headerAvatar');
  const user = appState.currentUser;
  if (!user) return;

  headerUserName.textContent = user.name;
  headerAvatar.textContent = user.name.charAt(0).toUpperCase();
}

function renderSidebar() {
  const nav = document.getElementById('sideNav');
  const role = appState.currentUser ? appState.currentUser.role : 'customer';

  const items = role === 'customer'
    ? [
        { key: 'home', label: 'Home' },
        { key: 'products', label: 'Products' },
        { key: 'categories', label: 'Categories' },
        { key: 'cart', label: 'Cart' },
        { key: 'wishlist', label: 'Wishlist' },
        { key: 'orders', label: 'My Orders' },
        { key: 'profile', label: 'Profile' },
        { key: 'logout', label: 'Logout' }
      ]
    : [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'products', label: 'Manage Products' },
        { key: 'orders', label: 'Orders' },
        { key: 'profile', label: 'Seller Profile' },
        { key: 'logout', label: 'Logout' }
      ];

  nav.innerHTML = items.map((item) => `
    <button class="nav-item ${appState.currentPage === item.key ? 'active' : ''}" data-page="${item.key}">
      ${item.label}
    </button>
  `).join('');

  nav.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      if (page === 'logout') {
        handleLogout();
        return;
      }
      showPage(page);
    });
  });
}

function showPage(page) {
  const role = appState.currentUser ? appState.currentUser.role : 'customer';

  appState.currentPage = page;
  document.querySelectorAll('.page-section').forEach((section) => section.classList.remove('active'));

  if (role === 'customer') {
    const mappings = {
      home: 'customer-home-page',
      products: 'customer-products-page',
      categories: 'customer-categories-page',
      cart: 'customer-cart-page',
      wishlist: 'customer-wishlist-page',
      orders: 'customer-orders-page',
      profile: 'customer-profile-page'
    };

    const target = document.getElementById(mappings[page] || 'customer-home-page');
    if (target) target.classList.add('active');
  } else {
    const target = document.getElementById(
      page === 'dashboard'
        ? 'seller-dashboard-page'
        : page === 'products'
          ? 'seller-products-page'
          : page === 'orders'
            ? 'seller-orders-page'
            : page === 'profile'
              ? 'seller-profile-page'
              : 'seller-dashboard-page'
    );

    if (target) target.classList.add('active');
  }

  renderSidebar();
  document.querySelectorAll('[data-page]').forEach((button) => {
    const isActive = button.dataset.page === page;
    button.classList.toggle('active', isActive);
  });
}

function getFeaturedProducts() {
  return appState.products.filter((product) => product.featured).slice(0, 3);
}

function renderCustomerHome() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (appState.currentUser && appState.currentUser.role === 'customer') {
    welcomeMessage.textContent = `Welcome, ${appState.currentUser.name.split(' ')[0]}!`;
  }

  const featured = getFeaturedProducts();
  const featuredProducts = document.getElementById('featuredProducts');
  featuredProducts.innerHTML = featured.map((product) => `
    <article class="product-card">
      <div class="img" style="background-image: url('${product.image || 'https://via.placeholder.com/600x420?text=Product'}');"></div>
      <div class="content-box">
        <h3>${product.name}</h3>
        <div class="meta-row">
          <span>${product.category}</span>
          <span>${product.stock} left</span>
        </div>
        <div class="price">${formatPrice(product.price)}</div>
        <div class="action-row">
          <button class="secondary-btn" data-add-cart="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');

  featuredProducts.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.addCart)));
  });
}

function renderProducts() {
  const countLabel = document.getElementById('productCountLabel');
  if (countLabel) countLabel.textContent = `${appState.products.length} items`;

  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = appState.products.map((product) => `
    <article class="product-card">
      <div class="img" style="background-image: url('${product.image || 'https://via.placeholder.com/600x420?text=Product'}');"></div>
      <div class="content-box">
        <h3>${product.name}</h3>
        <div class="meta-row">
          <span>${product.category}</span>
          <span>${product.stock} in stock</span>
        </div>
        <div class="price">${formatPrice(product.price)}</div>
        <div class="action-row">
          <button class="secondary-btn" data-add-cart="${product.id}">Add to Cart</button>
          <button class="ghost-btn" data-toggle-wishlist="${product.id}">
            ${isWishlisted(product.id) ? 'Saved' : 'Wishlist'}
          </button>
        </div>
      </div>
    </article>
  `).join('');

  productsGrid.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.addCart)));
  });

  productsGrid.querySelectorAll('[data-toggle-wishlist]').forEach((button) => {
    button.addEventListener('click', () => toggleWishlist(Number(button.dataset.toggleWishlist)));
  });
}

function renderCategories() {
  const categories = ['Electronics', 'Clothing', 'School Supplies', 'Accessories', 'Home'];
  const emojiMap = { Electronics: '📱', Clothing: '👕', 'School Supplies': '📚', Accessories: '⌚', Home: '🏠' };

  document.getElementById('categoriesGrid').innerHTML = categories.map((category) => `
    <div class="category-card">
      <div class="emoji">${emojiMap[category]}</div>
      <h3>${category}</h3>
      <p>${appState.products.filter((product) => product.category === category).length} products available</p>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = appState.products.find((item) => item.id === productId);
  if (!product) return;

  const existing = appState.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    appState.cart.push({ id: product.id, name: product.name, category: product.category, price: product.price, image: product.image, quantity: 1 });
  }

  writeStorage(storageKeys.cart, appState.cart);
  renderCart();
  renderProfile();
}

function updateCartQuantity(productId, delta) {
  const item = appState.cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    appState.cart = appState.cart.filter((entry) => entry.id !== productId);
  }

  writeStorage(storageKeys.cart, appState.cart);
  renderCart();
  renderProfile();
}

function removeFromCart(productId) {
  appState.cart = appState.cart.filter((item) => item.id !== productId);
  writeStorage(storageKeys.cart, appState.cart);
  renderCart();
  renderProfile();
}

function renderCart() {
  const countNode = document.getElementById('cartItemCount');
  const itemsNode = document.getElementById('cartItems');
  const subtotalValue = document.getElementById('subtotalValue');
  const shippingValue = document.getElementById('shippingValue');
  const discountValue = document.getElementById('discountValue');
  const totalValue = document.getElementById('totalValue');
  const checkoutButton = document.getElementById('checkoutButton');

  if (!appState.cart.length) {
    itemsNode.innerHTML = '<div class="empty-state">Your cart is empty. Add a few items to continue shopping.</div>';
    countNode.textContent = '0 items';
    subtotalValue.textContent = formatPrice(0);
    shippingValue.textContent = formatPrice(0);
    discountValue.textContent = '-' + formatPrice(0);
    totalValue.textContent = formatPrice(0);
    return;
  }

  const subtotal = appState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1500 ? 0 : 150;
  const discount = subtotal > 2500 ? 250 : 0;
  const total = subtotal + shipping - discount;

  countNode.textContent = `${appState.cart.reduce((sum, item) => sum + item.quantity, 0)} items`;
  itemsNode.innerHTML = appState.cart.map((item) => `
    <div class="cart-item">
      <div class="thumb" style="background-image: url('${item.image || 'https://via.placeholder.com/240x200?text=Item'}');"></div>
      <div>
        <h4>${item.name}</h4>
        <p>${item.category}</p>
      </div>
      <div class="qty-control">
        <button data-decrease="${item.id}" aria-label="Decrease quantity">−</button>
        <strong>${item.quantity}</strong>
        <button data-increase="${item.id}" aria-label="Increase quantity">+</button>
      </div>
      <div style="text-align:right;">
        <div class="price-tag">${formatPrice(item.price * item.quantity)}</div>
        <button class="danger-btn" data-remove-cart="${item.id}" style="margin-top:8px; padding:7px 10px;">Remove</button>
      </div>
    </div>
  `).join('');

  subtotalValue.textContent = formatPrice(subtotal);
  shippingValue.textContent = formatPrice(shipping);
  discountValue.textContent = '-' + formatPrice(discount);
  totalValue.textContent = formatPrice(total);

  itemsNode.querySelectorAll('[data-increase]').forEach((button) => {
    button.addEventListener('click', () => updateCartQuantity(Number(button.dataset.increase), 1));
  });

  itemsNode.querySelectorAll('[data-decrease]').forEach((button) => {
    button.addEventListener('click', () => updateCartQuantity(Number(button.dataset.decrease), -1));
  });

  itemsNode.querySelectorAll('[data-remove-cart]').forEach((button) => {
    button.addEventListener('click', () => removeFromCart(Number(button.dataset.removeCart)));
  });

  checkoutButton.disabled = !appState.cart.length;
  checkoutButton.style.opacity = appState.cart.length ? '1' : '0.5';
  checkoutButton.onclick = () => {
    if (!appState.cart.length) return;
    const total = appState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = `TAU-${Math.floor(Math.random() * 9000 + 1000)}`;
    customerOrders.unshift({
      orderNo: orderId,
      product: appState.cart.map((item) => item.name).join(', '),
      status: 'Pending',
      total
    });
    appState.cart = [];
    writeStorage(storageKeys.cart, appState.cart);
    renderCart();
    renderOrders();
    showPage('orders');
  };
}

function isWishlisted(productId) {
  return appState.wishlist.includes(productId);
}

function toggleWishlist(productId) {
  if (isWishlisted(productId)) {
    appState.wishlist = appState.wishlist.filter((id) => id !== productId);
  } else {
    appState.wishlist.push(productId);
  }

  writeStorage(storageKeys.wishlist, appState.wishlist);
  renderProducts();
  renderWishlist();
  renderProfile();
}

function renderWishlist() {
  const wishlistCount = document.getElementById('wishlistCount');
  const wishlistItems = document.getElementById('wishlistItems');
  const items = appState.products.filter((product) => isWishlisted(product.id));

  wishlistCount.textContent = `${items.length} saved`;

  if (!items.length) {
    wishlistItems.innerHTML = '<div class="empty-state" style="grid-column:1 / -1;">No saved products yet. Save items you love from the product list.</div>';
    return;
  }

  wishlistItems.innerHTML = items.map((product) => `
    <article class="product-card">
      <div class="img" style="background-image: url('${product.image || 'https://via.placeholder.com/600x420?text=Product'}');"></div>
      <div class="content-box">
        <h3>${product.name}</h3>
        <div class="meta-row">
          <span>${product.category}</span>
          <span>${product.stock} left</span>
        </div>
        <div class="price">${formatPrice(product.price)}</div>
        <div class="action-row">
          <button class="secondary-btn" data-add-cart="${product.id}">Move to Cart</button>
          <button class="danger-btn" data-remove-wishlist="${product.id}">Remove</button>
        </div>
      </div>
    </article>
  `).join('');

  wishlistItems.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.addCart)));
  });

  wishlistItems.querySelectorAll('[data-remove-wishlist]').forEach((button) => {
    button.addEventListener('click', () => toggleWishlist(Number(button.dataset.removeWishlist)));
  });
}

function renderOrders() {
  const ordersList = document.getElementById('ordersList');
  if (!customerOrders.length) {
    ordersList.innerHTML = '<div class="empty-state" style="grid-column:1 / -1;">No orders yet. Your order history will appear here.</div>';
    return;
  }

  ordersList.innerHTML = customerOrders.map((order) => `
    <div class="order-box summary-box" style="padding:20px;">
      <div class="meta-row">
        <strong>#${order.orderNo}</strong>
        <span class="status-pill ${order.status.toLowerCase()}">${order.status}</span>
      </div>
      <h3>${order.product}</h3>
      <p style="color:var(--muted); margin:0;">Total amount: ${formatPrice(order.total)}</p>
    </div>
  `).join('');
}

function renderProfile() {
  const user = appState.currentUser;
  if (!user || user.role !== 'customer') return;

  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profilePhone = document.getElementById('profilePhone');
  const profileAddress = document.getElementById('profileAddress');
  const profileAvatar = document.getElementById('profileAvatar');
  const profileWishlistTotal = document.getElementById('profileWishlistTotal');
  const profileCartTotal = document.getElementById('profileCartTotal');

  profileName.textContent = user.name;
  profileEmail.textContent = user.email;
  profilePhone.textContent = user.phone;
  profileAddress.textContent = user.address;
  profileAvatar.textContent = user.name.charAt(0).toUpperCase();
  profileWishlistTotal.textContent = appState.wishlist.length;
  profileCartTotal.textContent = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function renderSellerDashboard() {
  const stats = [
    { label: 'Total products', value: appState.products.length },
    { label: 'Total orders', value: sellerOrders.length },
    { label: 'Monthly sales', value: formatPrice(45500) },
    { label: 'Visitors', value: '8.4K' }
  ];

  document.getElementById('sellerStats').innerHTML = stats.map((stat) => `
    <div class="stat-card">
      <div class="label">${stat.label}</div>
      <div class="num">${stat.value}</div>
    </div>
  `).join('');
}

function renderSellerProducts() {
  const body = document.getElementById('sellerProductTableBody');
  body.innerHTML = appState.products.map((product) => `
    <tr>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${formatPrice(product.price)}</td>
      <td>${product.stock}</td>
      <td>
        <div class="action-row" style="margin-top:0;">
          <button class="ghost-btn" data-edit-product="${product.id}">Edit</button>
          <button class="danger-btn" data-delete-product="${product.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  body.querySelectorAll('[data-edit-product]').forEach((button) => {
    button.addEventListener('click', () => editProduct(Number(button.dataset.editProduct)));
  });

  body.querySelectorAll('[data-delete-product]').forEach((button) => {
    button.addEventListener('click', () => deleteProduct(Number(button.dataset.deleteProduct)));
  });

  document.getElementById('sellerProductCount').textContent = appState.products.length;
}

function editProduct(productId) {
  const product = appState.products.find((item) => item.id === productId);
  if (!product) return;

  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('productImage').value = product.image || '';
}

function deleteProduct(productId) {
  appState.products = appState.products.filter((product) => product.id !== productId);
  writeStorage(storageKeys.products, appState.products);
  renderSellerDashboard();
  renderSellerProducts();
  renderProducts();
  renderCustomerHome();
  renderCategories();
}

function handleProductSubmit(event) {
  event.preventDefault();

  const productId = document.getElementById('productId').value;
  const productName = document.getElementById('productName').value.trim();
  const productPrice = Number(document.getElementById('productPrice').value);
  const productCategory = document.getElementById('productCategory').value;
  const productStock = Number(document.getElementById('productStock').value);
  const productImage = document.getElementById('productImage').value.trim();

  if (!productName || !productPrice || !productCategory || !productStock) {
    return;
  }

  if (productId) {
    const product = appState.products.find((item) => item.id === Number(productId));
    if (product) {
      product.name = productName;
      product.price = productPrice;
      product.category = productCategory;
      product.stock = productStock;
      product.image = productImage || product.image;
    }
  } else {
    const nextId = appState.products.length ? Math.max(...appState.products.map((item) => item.id)) + 1 : 1;
    appState.products.push({
      id: nextId,
      name: productName,
      price: productPrice,
      category: productCategory,
      stock: productStock,
      image: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      featured: false
    });
  }

  writeStorage(storageKeys.products, appState.products);
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
  renderSellerDashboard();
  renderSellerProducts();
  renderProducts();
  renderCustomerHome();
  renderCategories();
}

function renderSellerOrders() {
  const body = document.getElementById('sellerOrderTableBody');
  body.innerHTML = sellerOrders.map((order) => `
    <tr>
      <td>${order.orderNo}</td>
      <td>${order.customer}</td>
      <td>${order.product}</td>
      <td><span class="status-pill ${order.status.toLowerCase()}">${order.status}</span></td>
      <td>${formatPrice(order.total)}</td>
    </tr>
  `).join('');
}

function renderSellerProfile() {
  const sellerName = document.getElementById('sellerName');
  const user = appState.currentUser;
  if (user && user.role === 'seller') {
    sellerName.textContent = user.name;
  }
  document.getElementById('sellerProductCount').textContent = appState.products.length;
}

document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('menuToggle').addEventListener('click', function () {
  const layout = document.querySelector('.layout');
  const isCollapsed = layout.classList.toggle('sidebar-collapsed');
  this.setAttribute('aria-expanded', String(!isCollapsed));
  this.setAttribute('aria-label', isCollapsed ? 'Open side menu' : 'Close side menu');
});
document.getElementById('showPasswordToggle').addEventListener('click', function () {
  const passwordInput = document.getElementById('loginPassword');
  const isVisible = passwordInput.type === 'password';
  passwordInput.type = isVisible ? 'text' : 'password';
  this.textContent = isVisible ? 'Hide' : 'Show';
  this.setAttribute('aria-pressed', String(isVisible));
});
document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
document.getElementById('cancelProductEdit').addEventListener('click', () => {
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
});
document.querySelectorAll('[data-page]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.page;
    if (target === 'logout') return;
    showPage(target);
  });
});

seedProducts();
