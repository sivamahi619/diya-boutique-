/**
 * Diya Boutique — Initial Dataset
 * Categories, Collections, Products, Coupons, and Sample Data
 */

const INITIAL_CATEGORIES = [
  { id: 'sarees', name: 'Sarees', count: 18, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', description: 'Handcrafted Kanjivaram, Banarasi & Pure Silk' },
  { id: 'lehengas', name: 'Bridal Lehengas', count: 12, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80', description: 'Regal Zardozi & Embroidered Bridal Ensembles' },
  { id: 'kurtis', name: 'Kurtis & Suits', count: 24, image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=80', description: 'Designer Anarkalis, Shararas & Everyday Chic' },
  { id: 'western', name: 'Western & Gowns', count: 15, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80', description: 'Evening Gowns, Co-ord Sets & Party Wear' },
  { id: 'accessories', name: 'Jewellery & Clutches', count: 20, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', description: 'Kundan Sets, Potlis & Designer Belts' }
];

const INITIAL_COLLECTIONS = [
  { id: 'bridal-2026', name: 'Royal Heritage Bridal 2026', tag: 'Luxury', discount: 'Exclusive' },
  { id: 'festive-vibes', name: 'Festive Radiance', tag: 'Festive', discount: 'Up to 25% Off' },
  { id: 'summer-pastel', name: 'Summer Sorbet Pastels', tag: 'Trending', discount: 'New Launch' },
  { id: 'handloom-classics', name: 'Handloom & Artisan Craft', tag: 'Handcrafted', discount: 'Limited Edition' }
];

const INITIAL_PRODUCTS = [
  {
    id: 'db-001',
    sku: 'DB-SR-001',
    name: 'Kanjivaram Pure Crimson Silk Saree with Gold Zari',
    category: 'sarees',
    subcategory: 'Silk Sarees',
    collection: 'bridal-2026',
    price: 24999,
    originalPrice: 32999,
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    fabric: 'Pure Kanjivaram Silk',
    pattern: 'Temple Border Zari Weave',
    occasion: 'Bridal & Festive',
    color: 'Crimson Red & Gold',
    colorsAvailable: ['#9b111e', '#e5c158', '#4b0082'],
    sizesAvailable: ['Free Size (Includes 0.8m Blouse Piece)'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A masterpiece woven by master artisans in Kanchipuram. Adorned with 24k gold electroplated silver zari motifs representing traditional peacock and temple borders. Comes with an unstitched premium matching silk blouse piece.',
    careInstructions: 'Strictly Dry Clean Only. Store wrapped in pure cotton or muslin fabric.',
    deliveryDays: '3-5 Business Days'
  },
  {
    id: 'db-002',
    sku: 'DB-LH-002',
    name: 'Noor-E-Chashm Embroidered Raw Silk Bridal Lehenga',
    category: 'lehengas',
    subcategory: 'Bridal Lehenga',
    collection: 'bridal-2026',
    price: 48500,
    originalPrice: 62000,
    rating: 5.0,
    reviewsCount: 24,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    fabric: 'Raw Silk & Fine Net',
    pattern: 'Handcrafted Zardozi, Cutdana & Sequin Work',
    occasion: 'Wedding / Reception',
    color: 'Dusty Rose & Champagne Gold',
    colorsAvailable: ['#dcae96', '#800020', '#104e3b'],
    sizesAvailable: ['S', 'M', 'L', 'XL', 'Custom Fit'],
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elevate your wedding day with our signature Noor-E-Chashm ensemble. Intricately embellished with over 180 hours of hand zardozi and pearl embroidery with double dupatta styling.',
    careInstructions: 'Dry clean only. Avoid spraying perfumes directly onto the metallic embroidery.',
    deliveryDays: '5-7 Business Days (Express available)'
  },
  {
    id: 'db-003',
    sku: 'DB-KT-003',
    name: 'Gulmohar Handblock Georgette Anarkali Set',
    category: 'kurtis',
    subcategory: 'Anarkali Suits',
    collection: 'festive-vibes',
    price: 6499,
    originalPrice: 8999,
    rating: 4.8,
    reviewsCount: 52,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    fabric: 'Pure Georgette with Cotton Lining',
    pattern: 'Floral Handblock Print with Gota Patti',
    occasion: 'Festive & Sangeet',
    color: 'Emerald Olive & Mustard',
    colorsAvailable: ['#2e5339', '#e3a857', '#800020'],
    sizesAvailable: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Chic, breathable, and effortlessly regal. 32-kali flared Anarkali paired with matching handcrafted organza dupatta detailed with delicate gota lace trims and comfortable cotton pants.',
    careInstructions: 'Dry clean recommended or gentle hand wash in cold water.',
    deliveryDays: '2-4 Business Days'
  },
  {
    id: 'db-004',
    sku: 'DB-WT-004',
    name: 'Velvet Midnight Blue Tiered Corset Evening Gown',
    category: 'western',
    subcategory: 'Evening Gowns',
    collection: 'festive-vibes',
    price: 14200,
    originalPrice: 18500,
    rating: 4.9,
    reviewsCount: 19,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    fabric: 'Micro Velvet & French Tulle',
    pattern: 'Corset Bodice with Hand-Beaded Crystals',
    occasion: 'Cocktail / Reception / Red Carpet',
    color: 'Midnight Royal Blue',
    colorsAvailable: ['#191970', '#800020', '#1c1c1c'],
    sizesAvailable: ['XS', 'S', 'M', 'L'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Designed for unforgettable grand entrances. Sculpted boned corset bodice accentuates your silhouette while flowing into a majestic layered velvet skirt.',
    careInstructions: 'Dry clean only. Steam iron inside-out.',
    deliveryDays: '3-5 Business Days'
  },
  {
    id: 'db-005',
    sku: 'DB-SR-005',
    name: 'Varanasi Organza Tissue Saree with Floral Resham',
    category: 'sarees',
    subcategory: 'Tissue Organza',
    collection: 'summer-pastel',
    price: 11800,
    originalPrice: 15500,
    rating: 4.7,
    reviewsCount: 29,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    fabric: 'Pure Silk Organza Tissue',
    pattern: 'Hand-painted Floral Resham & Scalloped Zari Edge',
    occasion: 'Day Wedding / High Tea / Engagements',
    color: 'Pastel Peach & Pearl Silver',
    colorsAvailable: ['#ffdab9', '#e0b0ff', '#b0e0e6'],
    sizesAvailable: ['Free Size (Includes 0.8m Blouse Piece)'],
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Airy, ethereal, and radiant under the sun. Metallic sheen organza draped effortlessly with scalloped floral borders.',
    careInstructions: 'Dry clean only. Avoid harsh creasing.',
    deliveryDays: '2-4 Business Days'
  },
  {
    id: 'db-006',
    sku: 'DB-AC-006',
    name: 'Rajwada 22K Gold Plated Kundan Choker Set with Meenakari',
    category: 'accessories',
    subcategory: 'Jewellery',
    collection: 'bridal-2026',
    price: 8900,
    originalPrice: 12500,
    rating: 5.0,
    reviewsCount: 41,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    fabric: 'Brass Alloy with 22K Micron Gold Plating',
    pattern: 'Hand-set Glass Kundan, Freshwater Pearls & Meenakari',
    occasion: 'Bridal & Traditional Festivities',
    color: 'Gold & Emerald Green Drops',
    colorsAvailable: ['#2e5339', '#800020', '#ffffff'],
    sizesAvailable: ['Adjustable Dori'],
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heritage statement necklace set complete with matching jhumkas and maang tikka. Beautiful hand-enamelled back meenakari detailing.',
    careInstructions: 'Wipe with soft lint-free cloth. Store in airtight zip pouch away from water and perfume.',
    deliveryDays: '2-3 Business Days'
  },
  {
    id: 'db-007',
    sku: 'DB-KT-007',
    name: 'Chanderi Silk Peplum Kurti with Sharara & Dupatta',
    category: 'kurtis',
    subcategory: 'Sharara Sets',
    collection: 'summer-pastel',
    price: 7800,
    originalPrice: 9900,
    rating: 4.8,
    reviewsCount: 16,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    fabric: 'Pure Chanderi Silk with Cotton Shantoon',
    pattern: 'Mirror Work & Thread Embroidery',
    occasion: 'Haldi / Mehendi / Festive Parties',
    color: 'Sunshine Mustard Yellow',
    colorsAvailable: ['#ffdb58', '#ffb6c1', '#98ff98'],
    sizesAvailable: ['S', 'M', 'L', 'XL'],
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Modern silhouette with royal ethnic roots. Peplum short kurti paired with voluminous flared sharara pants and featherlight dupatta.',
    careInstructions: 'Dry clean only.',
    deliveryDays: '3-4 Business Days'
  },
  {
    id: 'db-008',
    sku: 'DB-LH-008',
    name: 'Kashmiri Tilla Embroidered Velvet Lehenga Ensemble',
    category: 'lehengas',
    subcategory: 'Occasion Lehenga',
    collection: 'handloom-classics',
    price: 36000,
    originalPrice: 45000,
    rating: 4.9,
    reviewsCount: 22,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    fabric: 'Plush Silk Velvet & Organza',
    pattern: 'Traditional Kashmiri Silver Tilla Needlecraft',
    occasion: 'Winter Weddings & Sangeet',
    color: 'Deep Plum Wine',
    colorsAvailable: ['#4b0082', '#004225', '#800020'],
    sizesAvailable: ['XS', 'S', 'M', 'L', 'Custom Fit'],
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted luxury in warm silk velvet adorned with authentic metallic silver Tilla embroidery inspired by Mughal Chinar leaves.',
    careInstructions: 'Dry clean only.',
    deliveryDays: '5-7 Business Days'
  }
];

const INITIAL_COUPONS = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minPurchase: 2000, maxDiscount: 1500, desc: '10% Off on your first order' },
  { code: 'BRIDAL20', type: 'percentage', value: 20, minPurchase: 25000, maxDiscount: 8000, desc: '20% Off on Bridal & Luxury Collection' },
  { code: 'DIYA500', type: 'flat', value: 500, minPurchase: 4000, maxDiscount: 500, desc: 'Flat ₹500 instant off on orders over ₹4,000' }
];

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    productId: 'db-001',
    author: 'Ananya Sharma',
    rating: 5,
    date: '2026-08-15',
    verified: true,
    comment: 'The crimson silk saree was the crown jewel of my reception! The zari weight and drape are ultra-luxurious.',
    city: 'Bangalore'
  },
  {
    id: 'rev-2',
    productId: 'db-002',
    author: 'Pooja Iyer',
    rating: 5,
    date: '2026-08-10',
    verified: true,
    comment: 'I ordered the custom bridal fitting. The team coordinated every measurement perfectly over WhatsApp and the trial was spot on.',
    city: 'Mumbai'
  },
  {
    id: 'rev-3',
    productId: 'db-003',
    author: 'Dr. Radhika Sen',
    rating: 5,
    date: '2026-08-02',
    verified: true,
    comment: 'Gorgeous flair and very comfortable cotton lining. Wore it to a family sangeet and received non-stop compliments!',
    city: 'Delhi'
  }
];

const INITIAL_MEASUREMENT_PROFILES = [
  {
    id: 'meas-1',
    title: 'Bridal Lehenga & Blouse Fit',
    date: '2026-07-20',
    bust: 36,
    waist: 30,
    hip: 39,
    shoulder: 14.5,
    sleeveLength: 11,
    armhole: 16,
    dressLength: 42,
    neckFront: 7.5,
    neckBack: 10
  },
  {
    id: 'meas-2',
    title: 'Everyday Anarkali / Kurti Fit',
    date: '2026-08-05',
    bust: 35,
    waist: 29,
    hip: 38,
    shoulder: 14,
    sleeveLength: 18,
    armhole: 15.5,
    dressLength: 48,
    neckFront: 6.5,
    neckBack: 6.5
  }
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-101',
    service: 'Bridal Trousseau Consultation',
    date: '2026-09-02',
    time: '03:00 PM',
    customerName: 'Kavya Subramanian',
    phone: '+91 98450 12345',
    notes: 'Looking for December destination wedding outfits (Lehenga + Saree)',
    status: 'Confirmed'
  },
  {
    id: 'apt-102',
    service: 'Custom Dress Trial & Fitting',
    date: '2026-09-04',
    time: '11:30 AM',
    customerName: 'Meera Deshmukh',
    phone: '+91 97230 67890',
    notes: 'First fitting for cocktail velvet gown',
    status: 'Pending'
  }
];

const INITIAL_CUSTOM_ORDERS = [
  {
    id: 'cust-901',
    customerName: 'Rhea Patel',
    phone: '+91 98860 45678',
    email: 'rhea.patel@example.com',
    dressType: 'Designer Reception Gown',
    fabric: 'Italian Silk Velvet with Net Cape',
    color: 'Deep Emerald Green',
    targetDate: '2026-09-25',
    notes: 'Attached inspiration sketch from Pinterest with crystal shoulder embellishments.',
    status: 'In Production',
    quoteAmount: 28500,
    advancePaid: 15000,
    measurementProfile: 'Bridal Lehenga & Blouse Fit',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-18'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-8821',
    date: '2026-08-20',
    customer: {
      name: 'Ananya Sharma',
      email: 'ananya.s@example.com',
      phone: '+91 98451 99882',
      address: 'Villa 14, Prestige Palms, Whitefield, Bangalore, KA - 560066'
    },
    items: [
      {
        id: 'db-001',
        name: 'Kanjivaram Pure Crimson Silk Saree with Gold Zari',
        price: 24999,
        quantity: 1,
        size: 'Free Size (Includes 0.8m Blouse Piece)',
        color: 'Crimson Red & Gold',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'
      }
    ],
    deliveryMethod: 'Express Delivery (1-2 Days)',
    paymentMethod: 'UPI (Google Pay / PhonePe)',
    couponApplied: 'WELCOME10',
    discountAmount: 1500,
    subtotal: 24999,
    tax: 1175,
    shippingFee: 200,
    total: 24874,
    status: 'Shipped',
    trackingNumber: 'BLR-EXP-99281',
    timeline: [
      { step: 'Order Placed', time: '2026-08-20 10:30 AM', done: true },
      { step: 'Payment Confirmed', time: '2026-08-20 10:31 AM', done: true },
      { step: 'Quality Checked & Packed', time: '2026-08-21 02:15 PM', done: true },
      { step: 'Shipped via Express Courier', time: '2026-08-22 09:00 AM', done: true },
      { step: 'Out for Delivery', time: 'Expected 2026-08-26', done: false },
      { step: 'Delivered', time: 'Pending', done: false }
    ]
  }
];
