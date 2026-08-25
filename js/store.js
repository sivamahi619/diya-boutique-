/**
 * Diya Boutique — Central State Management Engine
 * Handles LocalStorage persistence, reactive subscribers, cart, wishlist, orders, appointments & admin operations.
 */

class BoutiqueStore {
  constructor() {
    this.STORAGE_KEYS = {
      PRODUCTS: 'diya_boutique_products',
      CART: 'diya_boutique_cart',
      WISHLIST: 'diya_boutique_wishlist',
      ORDERS: 'diya_boutique_orders',
      CUSTOM_ORDERS: 'diya_boutique_custom_orders',
      MEASUREMENTS: 'diya_boutique_measurements',
      APPOINTMENTS: 'diya_boutique_appointments',
      COUPONS: 'diya_boutique_coupons',
      REVIEWS: 'diya_boutique_reviews',
      USER: 'diya_boutique_current_user'
    };

    this.subscribers = [];
    this.init();
  }

  init() {
    // Populate defaults if not present
    if (!localStorage.getItem(this.STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.CART)) {
      localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(['db-001', 'db-002']));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.CUSTOM_ORDERS)) {
      localStorage.setItem(this.STORAGE_KEYS.CUSTOM_ORDERS, JSON.stringify(INITIAL_CUSTOM_ORDERS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.MEASUREMENTS)) {
      localStorage.setItem(this.STORAGE_KEYS.MEASUREMENTS, JSON.stringify(INITIAL_MEASUREMENT_PROFILES));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(this.STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.COUPONS)) {
      localStorage.setItem(this.STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(this.STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.USER)) {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify({
        name: 'Ananya Sharma',
        email: 'ananya.s@example.com',
        phone: '+91 98451 99882',
        role: 'customer' // 'customer' or 'admin'
      }));
    }
  }

  // Subscribe to changes
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify(event, data) {
    this.subscribers.forEach(cb => cb(event, data));
  }

  // Generic getter / setter
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading localStorage key:', key, e);
      return null;
    }
  }

  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
    this.notify(key, val);
  }

  // Products
  getProducts() {
    return this.get(this.STORAGE_KEYS.PRODUCTS) || [];
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  saveProduct(productData) {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === productData.id);
    if (existingIndex > -1) {
      products[existingIndex] = { ...products[existingIndex], ...productData };
    } else {
      const newProduct = {
        id: 'db-' + Date.now().toString().slice(-4),
        sku: 'DB-GEN-' + Math.floor(100 + Math.random() * 900),
        rating: 5.0,
        reviewsCount: 0,
        ...productData
      };
      products.unshift(newProduct);
    }
    this.set(this.STORAGE_KEYS.PRODUCTS, products);
    return true;
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.set(this.STORAGE_KEYS.PRODUCTS, products);
  }

  // Cart
  getCart() {
    return this.get(this.STORAGE_KEYS.CART) || [];
  }

  addToCart(product, size, color, quantity = 1) {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(
      item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (itemIndex > -1) {
      cart[itemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images && product.images[0] ? product.images[0] : '',
        category: product.category,
        selectedSize: size || (product.sizesAvailable && product.sizesAvailable[0]) || 'Standard',
        selectedColor: color || product.color || 'Standard',
        quantity: quantity
      });
    }

    this.set(this.STORAGE_KEYS.CART, cart);
    return cart;
  }

  updateCartQuantity(index, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    this.set(this.STORAGE_KEYS.CART, cart);
  }

  removeFromCart(index) {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.set(this.STORAGE_KEYS.CART, cart);
  }

  clearCart() {
    this.set(this.STORAGE_KEYS.CART, []);
  }

  getCartTotal(couponCode = null) {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST on luxury textiles
    let shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupons = this.get(this.STORAGE_KEYS.COUPONS) || [];
      const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
      if (found && subtotal >= found.minPurchase) {
        appliedCoupon = found;
        if (found.type === 'percentage') {
          discount = Math.min(Math.round((subtotal * found.value) / 100), found.maxDiscount);
        } else {
          discount = found.value;
        }
      }
    }

    const total = Math.max(0, subtotal + tax + shipping - discount);

    return {
      subtotal,
      tax,
      shipping,
      discount,
      appliedCoupon,
      total,
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
    };
  }

  // Wishlist
  getWishlist() {
    return this.get(this.STORAGE_KEYS.WISHLIST) || [];
  }

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    this.set(this.STORAGE_KEYS.WISHLIST, wishlist);
    return wishlist.includes(productId);
  }

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  }

  // Orders & Checkout
  getOrders() {
    return this.get(this.STORAGE_KEYS.ORDERS) || [];
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString().split('T')[0],
      ...orderData,
      status: 'Order Placed',
      trackingNumber: 'DB-' + Math.floor(100000 + Math.random() * 900000),
      timeline: [
        { step: 'Order Placed', time: new Date().toLocaleString(), done: true },
        { step: 'Payment Confirmed', time: new Date().toLocaleString(), done: true },
        { step: 'Quality Checked & Packed', time: 'In progress', done: false },
        { step: 'Shipped via Express Courier', time: 'Pending', done: false },
        { step: 'Out for Delivery', time: 'Pending', done: false },
        { step: 'Delivered', time: 'Pending', done: false }
      ]
    };

    orders.unshift(newOrder);
    this.set(this.STORAGE_KEYS.ORDERS, orders);

    // Deduct inventory for purchased items
    const products = this.getProducts();
    orderData.items.forEach(item => {
      const p = products.find(prod => prod.id === item.id);
      if (p && p.stock > 0) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });
    this.set(this.STORAGE_KEYS.PRODUCTS, products);

    // Clear user cart
    this.clearCart();

    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      // update timeline flags
      const statuses = ['Order Placed', 'Payment Confirmed', 'Processing', 'Quality Checked & Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
      const curIndex = statuses.indexOf(newStatus);
      if (order.timeline) {
        order.timeline.forEach((t, idx) => {
          if (idx <= curIndex) {
            t.done = true;
            if (t.time === 'Pending' || t.time === 'In progress') {
              t.time = new Date().toLocaleString();
            }
          }
        });
      }
      this.set(this.STORAGE_KEYS.ORDERS, orders);
    }
  }

  // Custom Dress Orders
  getCustomOrders() {
    return this.get(this.STORAGE_KEYS.CUSTOM_ORDERS) || [];
  }

  createCustomOrder(customData) {
    const customOrders = this.getCustomOrders();
    const newOrder = {
      id: 'cust-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Request Received',
      quoteAmount: null,
      advancePaid: 0,
      ...customData
    };
    customOrders.unshift(newOrder);
    this.set(this.STORAGE_KEYS.CUSTOM_ORDERS, customOrders);
    return newOrder;
  }

  updateCustomOrderStatus(id, status, quoteAmount = null, advancePaid = null) {
    const list = this.getCustomOrders();
    const item = list.find(o => o.id === id);
    if (item) {
      item.status = status;
      if (quoteAmount !== null) item.quoteAmount = quoteAmount;
      if (advancePaid !== null) item.advancePaid = advancePaid;
      this.set(this.STORAGE_KEYS.CUSTOM_ORDERS, list);
    }
  }

  // Measurements
  getMeasurements() {
    return this.get(this.STORAGE_KEYS.MEASUREMENTS) || [];
  }

  saveMeasurement(profile) {
    const list = this.getMeasurements();
    if (profile.id) {
      const idx = list.findIndex(m => m.id === profile.id);
      if (idx > -1) list[idx] = { ...list[idx], ...profile };
    } else {
      list.push({
        id: 'meas-' + Date.now().toString().slice(-4),
        date: new Date().toISOString().split('T')[0],
        ...profile
      });
    }
    this.set(this.STORAGE_KEYS.MEASUREMENTS, list);
  }

  deleteMeasurement(id) {
    const list = this.getMeasurements().filter(m => m.id !== id);
    this.set(this.STORAGE_KEYS.MEASUREMENTS, list);
  }

  // Appointments
  getAppointments() {
    return this.get(this.STORAGE_KEYS.APPOINTMENTS) || [];
  }

  createAppointment(appointmentData) {
    const list = this.getAppointments();
    const newApt = {
      id: 'apt-' + Math.floor(100 + Math.random() * 900),
      status: 'Confirmed',
      ...appointmentData
    };
    list.unshift(newApt);
    this.set(this.STORAGE_KEYS.APPOINTMENTS, list);
    return newApt;
  }

  updateAppointmentStatus(id, status) {
    const list = this.getAppointments();
    const item = list.find(a => a.id === id);
    if (item) {
      item.status = status;
      this.set(this.STORAGE_KEYS.APPOINTMENTS, list);
    }
  }

  // Reviews
  getReviews(productId = null) {
    const reviews = this.get(this.STORAGE_KEYS.REVIEWS) || [];
    if (productId) {
      return reviews.filter(r => r.productId === productId);
    }
    return reviews;
  }

  addReview(reviewData) {
    const reviews = this.getReviews();
    const newRev = {
      id: 'rev-' + Date.now().toString().slice(-4),
      date: new Date().toISOString().split('T')[0],
      verified: true,
      ...reviewData
    };
    reviews.unshift(newRev);
    this.set(this.STORAGE_KEYS.REVIEWS, reviews);
    return newRev;
  }

  // Dashboard Analytics Helper
  getAnalytics() {
    const orders = this.getOrders();
    const products = this.getProducts();
    const appointments = this.getAppointments();
    const customOrders = this.getCustomOrders();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Order Placed' || o.status === 'Processing').length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts: products.length,
      lowStockCount,
      outOfStockCount,
      appointmentCount: appointments.length,
      customOrderCount: customOrders.length
    };
  }
}

// Global singleton instance
window.boutiqueStore = new BoutiqueStore();
