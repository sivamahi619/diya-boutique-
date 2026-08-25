/**
 * Diya Boutique — Main Application Controller & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Application
  initApp();
});

function initApp() {
  bindNavigation();
  bindCartEvents();
  bindWishlistEvents();
  bindSearchEvents();
  bindProductDetailsModal();
  bindCustomDressStudio();
  bindAppointmentsScheduler();
  bindMeasurementVault();
  bindAdminDashboard();
  bindCheckoutFlow();

  // Initial Views
  renderHeroAndFeatured();
  renderCategoriesGrid();
  renderCatalog();
  updateCartBadge();
  updateWishlistBadge();

  // Subscribe to store updates
  window.boutiqueStore.subscribe((event, data) => {
    updateCartBadge();
    updateWishlistBadge();
    if (document.getElementById('admin-section') && document.getElementById('admin-section').style.display !== 'none') {
      renderAdminDashboard();
    }
  });
}

// ----------------------------------------------------
// Toast Notification
// ----------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ----------------------------------------------------
// Navigation & Section Router
// ----------------------------------------------------
function bindNavigation() {
  const navLinks = document.querySelectorAll('[data-nav-target]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-nav-target');
      navigateToSection(targetId);
    });
  });

  const adminToggle = document.getElementById('btn-toggle-admin');
  if (adminToggle) {
    adminToggle.addEventListener('click', () => {
      const adminSec = document.getElementById('admin-section');
      const isVisible = adminSec.style.display !== 'none';
      if (isVisible) {
        navigateToSection('home-section');
        adminToggle.innerHTML = `<span>⚙️</span> Staff Admin Portal`;
      } else {
        navigateToSection('admin-section');
        renderAdminDashboard();
        adminToggle.innerHTML = `<span>🛍️</span> Switch to Storefront`;
      }
    });
  }
}

function navigateToSection(sectionId) {
  const sections = ['home-section', 'shop-section', 'custom-studio-section', 'appointments-section', 'tracking-section', 'admin-section'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === sectionId) ? 'block' : 'none';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-nav-target') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (sectionId === 'shop-section') {
    renderCatalog();
  } else if (sectionId === 'appointments-section') {
    renderAppointmentsServices();
  } else if (sectionId === 'custom-studio-section') {
    populateMeasurementDropdown();
  } else if (sectionId === 'admin-section') {
    renderAdminDashboard();
  }
}

// ----------------------------------------------------
// Homepage Curations
// ----------------------------------------------------
function renderHeroAndFeatured() {
  const trendingContainer = document.getElementById('trending-products-grid');
  if (!trendingContainer) return;

  const products = window.boutiqueStore.getProducts().slice(0, 4);
  trendingContainer.innerHTML = products.map(p => renderProductCardHTML(p)).join('');
}

function renderCategoriesGrid() {
  const catGrid = document.getElementById('categories-grid');
  if (!catGrid) return;

  catGrid.innerHTML = INITIAL_CATEGORIES.map(cat => `
    <div class="category-card" onclick="filterByCategoryAndNavigate('${cat.id}')">
      <img src="${cat.image}" alt="${cat.name}" loading="lazy" />
      <div class="category-card-overlay">
        <h4 class="category-card-title">${cat.name}</h4>
        <p class="category-card-count">${cat.count}+ Styles Available</p>
      </div>
    </div>
  `).join('');
}

window.filterByCategoryAndNavigate = function(catId) {
  navigateToSection('shop-section');
  const catRadio = document.querySelector(`input[name="filter-cat"][value="${catId}"]`);
  if (catRadio) {
    catRadio.checked = true;
    renderCatalog();
  }
};

// ----------------------------------------------------
// Product Card HTML Generator
// ----------------------------------------------------
function renderProductCardHTML(p) {
  const isWish = window.boutiqueStore.isInWishlist(p.id);
  const discountPercent = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  return `
    <div class="product-card" data-product-id="${p.id}">
      <div class="product-img-wrapper">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
        <div class="product-badge-group">
          ${p.isNewArrival ? '<span class="badge badge-gold">New</span>' : ''}
          ${discountPercent > 0 ? `<span class="badge badge-burgundy">${discountPercent}% OFF</span>` : ''}
          ${p.stock <= 5 && p.stock > 0 ? '<span class="badge badge-warning">Only ' + p.stock + ' Left</span>' : ''}
        </div>
        <button class="product-wishlist-btn ${isWish ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${p.id}')" title="Save to Wishlist">
          ♥
        </button>
        <div class="product-quick-actions">
          <button class="btn btn-gold btn-sm" onclick="event.stopPropagation(); openProductModal('${p.id}')">Quick View & Fit</button>
        </div>
      </div>
      <div class="product-info" onclick="openProductModal('${p.id}')">
        <span class="product-cat-tag">${p.subcategory || p.category}</span>
        <h4 class="product-title">${p.name}</h4>
        <div class="product-rating">
          ★ ${p.rating.toFixed(1)} <span>(${p.reviewsCount} reviews)</span>
        </div>
        <div class="product-price-row">
          <span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>
          ${p.originalPrice ? `<span class="price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
          ${discountPercent > 0 ? `<span class="price-discount">${discountPercent}% off</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// Shop Catalog & Filtering Engine
// ----------------------------------------------------
function renderCatalog() {
  const grid = document.getElementById('catalog-products-grid');
  if (!grid) return;

  const products = window.boutiqueStore.getProducts();
  const searchVal = (document.getElementById('catalog-search-input')?.value || '').toLowerCase().trim();
  const selectedCat = document.querySelector('input[name="filter-cat"]:checked')?.value || 'all';
  const selectedOccasion = document.querySelector('input[name="filter-occasion"]:checked')?.value || 'all';
  const maxPrice = parseInt(document.getElementById('filter-price-range')?.value || '60000', 10);
  const sortBy = document.getElementById('catalog-sort-select')?.value || 'featured';

  let filtered = products.filter(p => {
    // Search query
    if (searchVal && !p.name.toLowerCase().includes(searchVal) && !p.fabric.toLowerCase().includes(searchVal) && !p.category.toLowerCase().includes(searchVal)) {
      return false;
    }
    // Category
    if (selectedCat !== 'all' && p.category !== selectedCat) {
      return false;
    }
    // Occasion
    if (selectedOccasion !== 'all' && (!p.occasion || !p.occasion.toLowerCase().includes(selectedOccasion.toLowerCase()))) {
      return false;
    }
    // Price
    if (p.price > maxPrice) {
      return false;
    }
    return true;
  });

  // Sort
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  const countEl = document.getElementById('catalog-results-count');
  if (countEl) countEl.innerText = `Showing ${filtered.length} curated design${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <h3 class="font-serif" style="color: var(--burgundy); margin-bottom: 10px;">No Designs Match Your Selected Filters</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Try adjusting your price range or clearing occasion filters.</p>
        <button class="btn btn-outline btn-sm" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => renderProductCardHTML(p)).join('');
}

window.resetFilters = function() {
  const catAll = document.querySelector('input[name="filter-cat"][value="all"]');
  if (catAll) catAll.checked = true;
  const occAll = document.querySelector('input[name="filter-occasion"][value="all"]');
  if (occAll) occAll.checked = true;
  const priceSlider = document.getElementById('filter-price-range');
  if (priceSlider) {
    priceSlider.value = '60000';
    document.getElementById('price-range-val').innerText = '₹60,000';
  }
  const searchInp = document.getElementById('catalog-search-input');
  if (searchInp) searchInp.value = '';
  renderCatalog();
};

function bindSearchEvents() {
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', renderCatalog);
  }
  const priceSlider = document.getElementById('filter-price-range');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      document.getElementById('price-range-val').innerText = '₹' + parseInt(e.target.value).toLocaleString('en-IN');
      renderCatalog();
    });
  }
  const filterInputs = document.querySelectorAll('.filters-sidebar input[type="radio"], #catalog-sort-select');
  filterInputs.forEach(inp => inp.addEventListener('change', renderCatalog));
}

// ----------------------------------------------------
// Product Quick View & Details Modal
// ----------------------------------------------------
let activeModalProduct = null;
let selectedModalSize = null;
let selectedModalColor = null;

function bindProductDetailsModal() {
  const modalBackdrop = document.getElementById('product-detail-modal');
  const closeBtn = document.getElementById('btn-close-detail-modal');
  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
    });
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
    });
  }

  // Size Guide Modal
  const sizeGuideModal = document.getElementById('size-guide-modal');
  const closeSizeGuide = document.getElementById('btn-close-size-guide');
  if (closeSizeGuide && sizeGuideModal) {
    closeSizeGuide.addEventListener('click', () => sizeGuideModal.classList.remove('active'));
  }
}

window.openSizeGuideModal = function() {
  const modal = document.getElementById('size-guide-modal');
  if (modal) modal.classList.add('active');
};

window.openProductModal = function(productId) {
  const product = window.boutiqueStore.getProductById(productId);
  if (!product) return;

  activeModalProduct = product;
  selectedModalSize = product.sizesAvailable ? product.sizesAvailable[0] : 'Standard';
  selectedModalColor = product.color;

  const modal = document.getElementById('product-detail-modal');
  const mainImg = document.getElementById('modal-main-img');
  const thumbStrip = document.getElementById('modal-thumb-strip');
  const title = document.getElementById('modal-product-title');
  const category = document.getElementById('modal-product-category');
  const price = document.getElementById('modal-product-price');
  const origPrice = document.getElementById('modal-product-orig-price');
  const desc = document.getElementById('modal-product-desc');
  const fabric = document.getElementById('modal-product-fabric');
  const care = document.getElementById('modal-product-care');
  const sizesContainer = document.getElementById('modal-size-pills');
  const reviewsContainer = document.getElementById('modal-reviews-list');

  if (mainImg) mainImg.src = product.images[0];
  if (title) title.innerText = product.name;
  if (category) category.innerText = `${product.category.toUpperCase()} • ${product.subcategory || ''}`;
  if (price) price.innerText = `₹${product.price.toLocaleString('en-IN')}`;
  if (origPrice) {
    origPrice.innerText = product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : '';
  }
  if (desc) desc.innerText = product.description;
  if (fabric) fabric.innerText = product.fabric;
  if (care) care.innerText = product.careInstructions;

  // Thumbnails
  if (thumbStrip) {
    thumbStrip.innerHTML = product.images.map((img, idx) => `
      <img src="${img}" class="${idx === 0 ? 'active' : ''}" onclick="changeModalMainImage('${img}', this)" alt="thumb" />
    `).join('');
  }

  // Size pills
  if (sizesContainer) {
    sizesContainer.innerHTML = (product.sizesAvailable || ['Standard']).map((sz, idx) => `
      <div class="size-pill ${idx === 0 ? 'active' : ''}" onclick="selectModalSize('${sz}', this)">${sz}</div>
    `).join('');
  }

  // Reviews
  const reviews = window.boutiqueStore.getReviews(product.id);
  if (reviewsContainer) {
    if (reviews.length === 0) {
      reviewsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No reviews yet. Be the first to review this boutique piece!</p>`;
    } else {
      reviewsContainer.innerHTML = reviews.map(r => `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--bg-subtle);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <strong style="color: var(--burgundy);">${r.author} <span style="font-size: 0.75rem; color: #2e7d32;">(Verified Purchase)</span></strong>
            <span style="color: #f59e0b;">${'★'.repeat(r.rating)}</span>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-muted);">${r.comment}</p>
        </div>
      `).join('');
    }
  }

  modal.classList.add('active');
};

window.changeModalMainImage = function(src, el) {
  document.getElementById('modal-main-img').src = src;
  document.querySelectorAll('#modal-thumb-strip img').forEach(img => img.classList.remove('active'));
  el.classList.add('active');
};

window.selectModalSize = function(size, el) {
  selectedModalSize = size;
  document.querySelectorAll('#modal-size-pills .size-pill').forEach(pill => pill.classList.remove('active'));
  el.classList.add('active');
};

window.addActiveModalToCart = function() {
  if (!activeModalProduct) return;
  const qty = parseInt(document.getElementById('modal-product-qty')?.value || '1', 10);
  window.boutiqueStore.addToCart(activeModalProduct, selectedModalSize, selectedModalColor, qty);
  showToast(`Added "${activeModalProduct.name.slice(0, 24)}..." to your Shopping Bag!`, 'success');
  document.getElementById('product-detail-modal')?.classList.remove('active');
  openCartDrawer();
};

// ----------------------------------------------------
// Wishlist
// ----------------------------------------------------
function bindWishlistEvents() {
  const btnWishlist = document.getElementById('btn-nav-wishlist');
  if (btnWishlist) {
    btnWishlist.addEventListener('click', () => {
      const wishlistIds = window.boutiqueStore.getWishlist();
      if (wishlistIds.length === 0) {
        showToast('Your Wishlist is currently empty. Tap the heart icon on any outfit to save it!', 'info');
        return;
      }
      navigateToSection('shop-section');
      const grid = document.getElementById('catalog-products-grid');
      const products = window.boutiqueStore.getProducts().filter(p => wishlistIds.includes(p.id));
      grid.innerHTML = products.map(p => renderProductCardHTML(p)).join('');
      document.getElementById('catalog-results-count').innerText = `Saved Wishlist Items (${products.length})`;
      showToast(`Showing ${products.length} saved wishlist favorites`, 'info');
    });
  }
}

window.toggleWishlist = function(productId) {
  const isNowIn = window.boutiqueStore.toggleWishlist(productId);
  showToast(isNowIn ? 'Saved item to your Wishlist!' : 'Removed from Wishlist', 'info');
  updateWishlistBadge();
  document.querySelectorAll(`.product-card[data-product-id="${productId}"] .product-wishlist-btn`).forEach(btn => {
    btn.classList.toggle('active', isNowIn);
  });
};

function updateWishlistBadge() {
  const count = window.boutiqueStore.getWishlist().length;
  const badge = document.getElementById('nav-wishlist-count');
  if (badge) badge.innerText = count;
}

// ----------------------------------------------------
// Sliding Cart Drawer
// ----------------------------------------------------
let currentCouponApplied = null;

function bindCartEvents() {
  const btnOpen = document.getElementById('btn-nav-cart');
  const btnClose = document.getElementById('btn-close-cart');
  const backdrop = document.getElementById('cart-drawer-backdrop');

  if (btnOpen) btnOpen.addEventListener('click', openCartDrawer);
  if (btnClose) btnClose.addEventListener('click', closeCartDrawer);
  if (backdrop) backdrop.addEventListener('click', closeCartDrawer);

  const btnApplyCoupon = document.getElementById('btn-apply-coupon');
  if (btnApplyCoupon) {
    btnApplyCoupon.addEventListener('click', () => {
      const input = document.getElementById('cart-coupon-input');
      const code = input?.value.trim().toUpperCase();
      if (!code) return;

      const calc = window.boutiqueStore.getCartTotal(code);
      if (calc.appliedCoupon) {
        currentCouponApplied = code;
        showToast(`Promo Code "${code}" applied successfully! You saved ₹${calc.discount.toLocaleString('en-IN')}`, 'success');
      } else {
        showToast(`Invalid coupon code or minimum purchase amount not met. Try 'WELCOME10' or 'DIYA500'`, 'warning');
      }
      renderCartDrawerItems();
    });
  }
}

function openCartDrawer() {
  renderCartDrawerItems();
  document.getElementById('cart-drawer')?.classList.add('active');
  document.getElementById('cart-drawer-backdrop')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('active');
  document.getElementById('cart-drawer-backdrop')?.classList.remove('active');
}

function updateCartBadge() {
  const total = window.boutiqueStore.getCartTotal();
  const badge = document.getElementById('nav-cart-count');
  if (badge) badge.innerText = total.itemCount;
}

function renderCartDrawerItems() {
  const list = document.getElementById('cart-items-list');
  const cart = window.boutiqueStore.getCart();
  const totals = window.boutiqueStore.getCartTotal(currentCouponApplied);

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 60px 0;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🛍️</div>
        <h4 class="font-serif" style="color: var(--burgundy);">Your Shopping Bag is Empty</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Discover our royal bridal and festive collections.</p>
        <button class="btn btn-gold btn-sm" onclick="closeCartDrawer(); navigateToSection('shop-section');">Explore Catalog</button>
      </div>
    `;
    document.getElementById('cart-subtotal-val').innerText = '₹0';
    document.getElementById('cart-tax-val').innerText = '₹0';
    document.getElementById('cart-shipping-val').innerText = '₹0';
    document.getElementById('cart-discount-val').innerText = '-₹0';
    document.getElementById('cart-total-val').innerText = '₹0';
    return;
  }

  list.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item-details">
        <h5 class="cart-item-title">${item.name}</h5>
        <div class="cart-item-meta">Size: <strong>${item.selectedSize}</strong> | ₹${item.price.toLocaleString('en-IN')}</div>
        <div class="cart-qty-control">
          <button class="qty-btn" onclick="updateCartQty(${idx}, ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty(${idx}, ${item.quantity + 1})">+</button>
          <button style="margin-left: auto; color: #b71c1c; font-size: 0.82rem;" onclick="removeCartItem(${idx})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('cart-subtotal-val').innerText = `₹${totals.subtotal.toLocaleString('en-IN')}`;
  document.getElementById('cart-tax-val').innerText = `₹${totals.tax.toLocaleString('en-IN')}`;
  document.getElementById('cart-shipping-val').innerText = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`;
  document.getElementById('cart-discount-val').innerText = `-₹${totals.discount.toLocaleString('en-IN')}`;
  document.getElementById('cart-total-val').innerText = `₹${totals.total.toLocaleString('en-IN')}`;
}

window.updateCartQty = function(idx, qty) {
  window.boutiqueStore.updateCartQuantity(idx, qty);
  renderCartDrawerItems();
};

window.removeCartItem = function(idx) {
  window.boutiqueStore.removeFromCart(idx);
  renderCartDrawerItems();
  showToast('Item removed from shopping bag', 'info');
};

// ----------------------------------------------------
// 4-Step Checkout Flow
// ----------------------------------------------------
function bindCheckoutFlow() {
  const btnCheckout = document.getElementById('btn-proceed-checkout');
  const modal = document.getElementById('checkout-modal');
  const btnClose = document.getElementById('btn-close-checkout');

  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (window.boutiqueStore.getCart().length === 0) {
        showToast('Your bag is empty! Add dresses before checking out.', 'warning');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => modal.classList.remove('active'));
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      processOrderSubmission();
    });
  }
}

function openCheckoutModal() {
  const totals = window.boutiqueStore.getCartTotal(currentCouponApplied);
  document.getElementById('checkout-summary-total').innerText = `₹${totals.total.toLocaleString('en-IN')}`;
  document.getElementById('checkout-modal')?.classList.add('active');
}

function processOrderSubmission() {
  const name = document.getElementById('co-name')?.value;
  const email = document.getElementById('co-email')?.value;
  const phone = document.getElementById('co-phone')?.value;
  const address = document.getElementById('co-address')?.value;
  const city = document.getElementById('co-city')?.value;
  const pincode = document.getElementById('co-pincode')?.value;
  const delivery = document.querySelector('input[name="co-delivery"]:checked')?.value || 'Standard Delivery';
  const payment = document.querySelector('input[name="co-payment"]:checked')?.value || 'UPI (Instant)';

  const totals = window.boutiqueStore.getCartTotal(currentCouponApplied);
  const cartItems = [...window.boutiqueStore.getCart()];

  const orderData = {
    customer: {
      name,
      email,
      phone,
      address: `${address}, ${city} - ${pincode}`
    },
    items: cartItems,
    deliveryMethod: delivery,
    paymentMethod: payment,
    couponApplied: currentCouponApplied,
    discountAmount: totals.discount,
    subtotal: totals.subtotal,
    tax: totals.tax,
    shippingFee: totals.shipping,
    total: totals.total
  };

  const newOrder = window.boutiqueStore.createOrder(orderData);
  document.getElementById('checkout-modal')?.classList.remove('active');

  // Show confirmation modal
  renderOrderConfirmation(newOrder);
}

function renderOrderConfirmation(order) {
  const modal = document.getElementById('order-confirmed-modal');
  if (!modal) return;

  document.getElementById('conf-order-id').innerText = order.id;
  document.getElementById('conf-tracking-id').innerText = order.trackingNumber;
  document.getElementById('conf-order-total').innerText = `₹${order.total.toLocaleString('en-IN')}`;
  document.getElementById('conf-customer-info').innerText = `${order.customer.name} (${order.customer.phone})`;
  document.getElementById('conf-customer-address').innerText = order.customer.address;

  modal.classList.add('active');
}

window.closeConfirmationAndTrack = function(orderId) {
  document.getElementById('order-confirmed-modal')?.classList.remove('active');
  navigateToSection('tracking-section');
  loadOrderTracking(orderId);
};

// ----------------------------------------------------
// Order Live Tracking Portal
// ----------------------------------------------------
window.trackOrderByInput = function() {
  const input = document.getElementById('order-track-input')?.value.trim().toUpperCase();
  if (!input) return;
  loadOrderTracking(input);
};

function loadOrderTracking(queryId) {
  const orders = window.boutiqueStore.getOrders();
  const order = orders.find(o => o.id.toUpperCase() === queryId || (o.trackingNumber && o.trackingNumber.toUpperCase() === queryId));

  const resultContainer = document.getElementById('tracking-result-box');
  if (!resultContainer) return;

  if (!order) {
    resultContainer.innerHTML = `
      <div style="background: #fff; padding: 30px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
        <h4 style="color: var(--burgundy);">No Order Found for "${queryId}"</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Please verify your Order ID (e.g. ORD-8821) or Courier Tracking ID.</p>
      </div>
    `;
    return;
  }

  const statuses = ['Order Placed', 'Payment Confirmed', 'Processing', 'Quality Checked & Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const curIdx = statuses.indexOf(order.status) !== -1 ? statuses.indexOf(order.status) : 1;

  resultContainer.innerHTML = `
    <div style="background: var(--bg-card); padding: 36px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 1px solid var(--bg-subtle); padding-bottom: 16px;">
        <div>
          <span class="badge badge-gold">Order Tracking</span>
          <h3 class="font-serif" style="color: var(--burgundy); font-size: 1.5rem; margin-top: 6px;">Order #${order.id}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Placed on ${order.date} | Waybill: <strong>${order.trackingNumber}</strong></p>
        </div>
        <span class="badge badge-success" style="font-size: 0.85rem; padding: 6px 14px;">Status: ${order.status}</span>
      </div>

      <div class="tracking-timeline">
        ${statuses.slice(0, 5).map((st, idx) => `
          <div class="timeline-step ${idx <= curIdx ? 'completed' : ''} ${idx === curIdx ? 'active' : ''}">
            <div class="timeline-dot">${idx <= curIdx ? '✓' : idx + 1}</div>
            <div style="font-size: 0.8rem; font-weight: 600; color: ${idx <= curIdx ? 'var(--burgundy)' : 'var(--text-muted)'};">${st}</div>
          </div>
        `).join('')}
      </div>

      <div style="background: var(--bg-subtle); padding: 20px; border-radius: var(--radius-sm); margin-top: 30px;">
        <h5 style="color: var(--burgundy); margin-bottom: 10px;">Enclosed Boutique Items:</h5>
        ${order.items.map(it => `
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
            <span>${it.quantity}x ${it.name} (${it.selectedSize || 'Custom'})</span>
            <strong>₹${(it.price * it.quantity).toLocaleString('en-IN')}</strong>
          </div>
        `).join('')}
        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border-subtle); color: var(--burgundy);">
          <span>Total Paid</span>
          <span>₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// Custom Dress Studio & Measurements Vault
// ----------------------------------------------------
function bindCustomDressStudio() {
  const form = document.getElementById('custom-dress-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const customerName = document.getElementById('cd-name')?.value;
    const phone = document.getElementById('cd-phone')?.value;
    const email = document.getElementById('cd-email')?.value;
    const dressType = document.getElementById('cd-type')?.value;
    const fabric = document.getElementById('cd-fabric')?.value;
    const color = document.getElementById('cd-color')?.value;
    const targetDate = document.getElementById('cd-date')?.value;
    const measurementProfile = document.getElementById('cd-meas-profile')?.value;
    const notes = document.getElementById('cd-notes')?.value;

    const customReq = {
      customerName,
      phone,
      email,
      dressType,
      fabric,
      color,
      targetDate,
      measurementProfile,
      notes,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
    };

    const created = window.boutiqueStore.createCustomOrder(customReq);
    showToast(`Bespoke Request #${created.id} submitted! Our Master Stylist will review and send a quotation within 24 hours.`, 'success');
    form.reset();
  });
}

function populateMeasurementDropdown() {
  const select = document.getElementById('cd-meas-profile');
  if (!select) return;
  const profiles = window.boutiqueStore.getMeasurements();
  select.innerHTML = `
    <option value="">-- Choose Saved Measurement Profile (Optional) --</option>
    ${profiles.map(p => `<option value="${p.title}">${p.title} (Bust: ${p.bust}", Waist: ${p.waist}")</option>`).join('')}
    <option value="New / In-Store Measurement">Measure In-Store During Fitting</option>
  `;
}

function bindMeasurementVault() {
  renderMeasurementCards();
  const form = document.getElementById('new-measurement-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const profile = {
        title: document.getElementById('meas-title').value,
        bust: parseFloat(document.getElementById('meas-bust').value) || 36,
        waist: parseFloat(document.getElementById('meas-waist').value) || 28,
        hip: parseFloat(document.getElementById('meas-hip').value) || 38,
        shoulder: parseFloat(document.getElementById('meas-shoulder').value) || 14.5,
        sleeveLength: parseFloat(document.getElementById('meas-sleeve').value) || 15,
        armhole: parseFloat(document.getElementById('meas-armhole').value) || 16,
        dressLength: parseFloat(document.getElementById('meas-length').value) || 45
      };
      window.boutiqueStore.saveMeasurement(profile);
      showToast(`Measurement card "${profile.title}" saved successfully!`, 'success');
      form.reset();
      renderMeasurementCards();
      populateMeasurementDropdown();
    });
  }
}

function renderMeasurementCards() {
  const container = document.getElementById('saved-measurements-list');
  if (!container) return;
  const list = window.boutiqueStore.getMeasurements();
  container.innerHTML = list.map(m => `
    <div style="background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm); position: relative;">
      <button style="position: absolute; top: 14px; right: 14px; color: #b71c1c;" onclick="deleteMeasurementProfile('${m.id}')" title="Delete Profile">✕</button>
      <h4 class="font-serif" style="color: var(--burgundy); margin-bottom: 4px;">${m.title}</h4>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 14px;">Updated: ${m.date || 'Recent'}</p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.85rem;">
        <div>Bust: <strong>${m.bust}"</strong></div>
        <div>Waist: <strong>${m.waist}"</strong></div>
        <div>Hip: <strong>${m.hip}"</strong></div>
        <div>Shoulder: <strong>${m.shoulder}"</strong></div>
        <div>Sleeve: <strong>${m.sleeveLength}"</strong></div>
        <div>Length: <strong>${m.dressLength}"</strong></div>
      </div>
    </div>
  `).join('');
}

window.deleteMeasurementProfile = function(id) {
  window.boutiqueStore.deleteMeasurement(id);
  renderMeasurementCards();
  populateMeasurementDropdown();
  showToast('Measurement profile removed', 'info');
};

// ----------------------------------------------------
// In-Store Appointments Scheduler
// ----------------------------------------------------
let selectedAptService = 'Bridal Trousseau Consultation';
let selectedAptTime = '03:00 PM';

function renderAppointmentsServices() {
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedAptService = card.getAttribute('data-service');
    });
  });

  const slots = document.querySelectorAll('.time-slot');
  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedAptTime = slot.getAttribute('data-time');
    });
  });
}

function bindAppointmentsScheduler() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const customerName = document.getElementById('apt-name')?.value;
    const phone = document.getElementById('apt-phone')?.value;
    const date = document.getElementById('apt-date')?.value;
    const notes = document.getElementById('apt-notes')?.value;

    const aptData = {
      service: selectedAptService,
      date,
      time: selectedAptTime,
      customerName,
      phone,
      notes
    };

    const booked = window.boutiqueStore.createAppointment(aptData);
    showToast(`Appointment Confirmed for ${date} at ${selectedAptTime}! A confirmation SMS has been dispatched.`, 'success');
    form.reset();
  });
}

// ----------------------------------------------------
// Admin Operations & Management Panel
// ----------------------------------------------------
function bindAdminDashboard() {
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabTarget = btn.getAttribute('data-admin-tab');
      ['admin-orders-tab', 'admin-products-tab', 'admin-custom-tab', 'admin-appointments-tab'].forEach(tabId => {
        const el = document.getElementById(tabId);
        if (el) el.style.display = (tabId === tabTarget) ? 'block' : 'none';
      });
    });
  });

  // New Product Modal Form
  const newProdForm = document.getElementById('admin-new-product-form');
  if (newProdForm) {
    newProdForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('np-name').value;
      const category = document.getElementById('np-category').value;
      const price = parseFloat(document.getElementById('np-price').value);
      const originalPrice = parseFloat(document.getElementById('np-orig-price').value) || (price * 1.25);
      const stock = parseInt(document.getElementById('np-stock').value, 10);
      const fabric = document.getElementById('np-fabric').value;
      const imageUrl = document.getElementById('np-image').value || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';

      const prodData = {
        name,
        category,
        price,
        originalPrice,
        stock,
        fabric,
        isNewArrival: true,
        images: [imageUrl],
        description: 'Exclusive handcrafted boutique design with royal accents.',
        careInstructions: 'Dry clean recommended.'
      };

      window.boutiqueStore.saveProduct(prodData);
      showToast(`Product "${name.slice(0, 20)}..." created in inventory!`, 'success');
      newProdForm.reset();
      renderAdminProducts();
      renderAdminKPIs();
      renderCatalog();
    });
  }
}

function renderAdminDashboard() {
  renderAdminKPIs();
  renderAdminOrders();
  renderAdminProducts();
  renderAdminCustomOrders();
  renderAdminAppointments();
}

function renderAdminKPIs() {
  const a = window.boutiqueStore.getAnalytics();
  document.getElementById('kpi-revenue').innerText = `₹${a.totalRevenue.toLocaleString('en-IN')}`;
  document.getElementById('kpi-orders').innerText = a.totalOrders;
  document.getElementById('kpi-products').innerText = a.totalProducts;
  document.getElementById('kpi-stock-alert').innerText = `${a.lowStockCount} Low Stock`;
}

function renderAdminOrders() {
  const container = document.getElementById('admin-orders-table-body');
  if (!container) return;
  const orders = window.boutiqueStore.getOrders();

  container.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.id}</strong><br><span style="font-size: 0.78rem; color: var(--text-muted);">${o.date}</span></td>
      <td>
        <strong>${o.customer.name}</strong><br>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${o.customer.phone}</span>
      </td>
      <td>
        ${o.items.map(it => `<div style="font-size: 0.85rem;">• ${it.name.slice(0, 24)}... (x${it.quantity})</div>`).join('')}
      </td>
      <td><strong>₹${o.total.toLocaleString('en-IN')}</strong></td>
      <td>
        <select class="form-control" style="padding: 4px 8px; font-size: 0.85rem;" onchange="updateAdminOrderStatus('${o.id}', this.value)">
          ${['Order Placed', 'Payment Confirmed', 'Processing', 'Quality Checked & Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => `
            <option value="${st}" ${o.status === st ? 'selected' : ''}>${st}</option>
          `).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

window.updateAdminOrderStatus = function(orderId, status) {
  window.boutiqueStore.updateOrderStatus(orderId, status);
  showToast(`Order #${orderId} status changed to "${status}"`, 'info');
  renderAdminOrders();
  renderAdminKPIs();
};

function renderAdminProducts() {
  const container = document.getElementById('admin-products-table-body');
  if (!container) return;
  const products = window.boutiqueStore.getProducts();

  container.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${p.images[0]}" style="width: 44px; height: 50px; object-fit: cover; border-radius: 4px;" alt="prod" />
          <div>
            <strong>${p.name.slice(0, 32)}...</strong><br>
            <span style="font-size: 0.78rem; color: var(--primary-gold);">${p.sku}</span>
          </div>
        </div>
      </td>
      <td>${p.category.toUpperCase()}</td>
      <td><strong>₹${p.price.toLocaleString('en-IN')}</strong></td>
      <td>
        <span class="badge ${p.stock <= 5 ? (p.stock === 0 ? 'badge-burgundy' : 'badge-warning') : 'badge-success'}">
          ${p.stock === 0 ? 'Out of Stock' : p.stock + ' Units'}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" style="padding: 4px 10px; color: #b71c1c; border-color: #b71c1c;" onclick="deleteAdminProduct('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteAdminProduct = function(id) {
  if (confirm('Are you sure you wish to remove this product from inventory?')) {
    window.boutiqueStore.deleteProduct(id);
    renderAdminProducts();
    renderAdminKPIs();
    renderCatalog();
    showToast('Product removed from catalog', 'info');
  }
};

function renderAdminCustomOrders() {
  const container = document.getElementById('admin-custom-table-body');
  if (!container) return;
  const list = window.boutiqueStore.getCustomOrders();

  container.innerHTML = list.map(c => `
    <tr>
      <td><strong>#${c.id}</strong><br><span style="font-size: 0.78rem; color: var(--text-muted);">${c.createdAt}</span></td>
      <td><strong>${c.customerName}</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">${c.phone}</span></td>
      <td>
        <strong>${c.dressType}</strong><br>
        <span style="font-size: 0.8rem; color: var(--text-muted);">Fabric: ${c.fabric} | Target: ${c.targetDate}</span>
      </td>
      <td>
        ${c.quoteAmount ? `<strong>₹${c.quoteAmount.toLocaleString('en-IN')}</strong>` : '<span style="color: #f57f17;">Pending Quote</span>'}
      </td>
      <td>
        <select class="form-control" style="padding: 4px 8px; font-size: 0.85rem;" onchange="updateAdminCustomStatus('${c.id}', this.value)">
          ${['Request Received', 'Quotation Sent', 'Advance Paid', 'In Production', 'Quality Check', 'Ready for Dispatch', 'Delivered'].map(st => `
            <option value="${st}" ${c.status === st ? 'selected' : ''}>${st}</option>
          `).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

window.updateAdminCustomStatus = function(id, status) {
  window.boutiqueStore.updateCustomOrderStatus(id, status);
  showToast(`Custom Order #${id} updated to "${status}"`, 'info');
  renderAdminCustomOrders();
};

function renderAdminAppointments() {
  const container = document.getElementById('admin-appointments-table-body');
  if (!container) return;
  const list = window.boutiqueStore.getAppointments();

  container.innerHTML = list.map(a => `
    <tr>
      <td><strong>${a.date}</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">${a.time}</span></td>
      <td><strong>${a.customerName}</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">${a.phone}</span></td>
      <td><span class="badge badge-gold">${a.service}</span></td>
      <td><span style="font-size: 0.82rem; color: var(--text-muted);">${a.notes || 'None'}</span></td>
      <td>
        <select class="form-control" style="padding: 4px 8px; font-size: 0.85rem;" onchange="updateAdminAptStatus('${a.id}', this.value)">
          ${['Confirmed', 'Completed', 'Rescheduled', 'Cancelled'].map(st => `
            <option value="${st}" ${a.status === st ? 'selected' : ''}>${st}</option>
          `).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

window.updateAdminAptStatus = function(id, status) {
  window.boutiqueStore.updateAppointmentStatus(id, status);
  showToast(`Appointment status updated`, 'info');
  renderAdminAppointments();
};
