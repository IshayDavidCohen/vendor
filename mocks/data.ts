import type {
  Supplier,
  Business,
  Category,
  Item,
  Handshake,
  Order,
  SupplierCarouselItem,
} from '@/types';

// =======================================================
// Mutable mock data store.
// Arrays are module-level let bindings so that mock
// mutations (create order, respond handshake, etc.) persist
// for the lifetime of the JS bundle / session.
// =======================================================

// ===================
// UNITS
// ==================
export const UNIT_OPTIONS = [
  { label: 'Unit', value: 'unit' },
  { label: 'Each', value: 'each' },
  { label: 'Piece', value: 'piece' },
  { label: 'Bottle', value: 'bottle' },
  { label: 'Box', value: 'box' },
  { label: 'Bundle', value: 'bundle' },
  { label: 'Case', value: 'case' },
  { label: 'Dozen', value: 'dozen' },
  { label: 'Keg', value: 'keg' },
  { label: 'Loaf', value: 'loaf' },
  { label: 'Rack', value: 'rack' },
  { label: '4-Pack', value: '4-pack' },
  { label: '6-Pack', value: '6-pack' },

  { label: 'Kilogram (kg)', value: 'kg' },
  { label: 'Gram (g)', value: 'g' },
  { label: 'Pound (lb)', value: 'lb' },

  { label: 'Litre', value: 'litre' },
  { label: 'Millilitre (ml)', value: 'ml' },
  { label: 'Gallon', value: 'gallon' },
  { label: 'Quart', value: 'quart' },
  { label: 'Pint', value: 'pint' },
];


// ===================
// CATEGORIES
// ===================
let categories: Category[] = [
  {
    oid: 'cat-alcohol',
    title: 'Alcohol & Spirits',
    icon: '🍷',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    users: { 'sup-premium-wines': 'supplier', 'sup-craft-spirits': 'supplier', 'sup-beer-masters': 'supplier' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    oid: 'cat-meat',
    title: 'Meat & Poultry',
    icon: '🥩',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800',
    users: { 'sup-prime-meats': 'supplier', 'sup-organic-farms': 'supplier' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    oid: 'cat-dairy',
    title: 'Dairy & Eggs',
    icon: '🧀',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800',
    users: { 'sup-dairy-direct': 'supplier', 'sup-artisan-cheese': 'supplier' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    oid: 'cat-seafood',
    title: 'Seafood & Fish',
    icon: '🦐',
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800',
    users: { 'sup-ocean-harvest': 'supplier', 'sup-fresh-catch': 'supplier' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    oid: 'cat-produce',
    title: 'Fresh Produce',
    icon: '🥬',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    users: { 'sup-green-valley': 'supplier', 'sup-organic-farms': 'supplier' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    oid: 'cat-bakery',
    title: 'Bakery & Bread',
    icon: '🥖',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    users: { 'sup-artisan-bakery': 'supplier' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    oid: 'cat-beverages',
    title: 'Non-Alcoholic Beverages',
    icon: '🥤',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800',
    users: { 'sup-beverage-co': 'supplier' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    oid: 'cat-frozen',
    title: 'Frozen Foods',
    icon: '🧊',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800',
    users: { 'sup-arctic-foods': 'supplier' },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// ===================
// SUPPLIERS
// ===================
let suppliers: Supplier[] = [
  {
    id: 'sup-premium-wines',
    bid: 'firebase-uid-wines',
    company_name: 'Premium Wines & Spirits Co.',
    desc: 'Leading distributor of fine wines and premium spirits from around the world. Over 25 years of experience serving restaurants, hotels, and retail establishments.',
    icon: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=200',
    banner: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200',
    email: 'orders@premiumwines.com',
    phone: '+1 (555) 123-4567',
    address: '123 Wine Boulevard, Napa Valley, CA 94558',
    shipping_address: '123 Wine Boulevard, Napa Valley, CA 94558',
    categories: ['cat-alcohol'],
    approved_businesses: ['bus-demo'],
    handshake_requests: [],
    items: ['item-wine-1', 'item-wine-2', 'item-wine-3', 'item-wine-4', 'item-wine-5'],
    active_orders: ['ord-1'],
    order_history: [],
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'sup-craft-spirits',
    bid: 'firebase-uid-spirits',
    company_name: 'Craft Spirits Distillery',
    desc: 'Artisanal spirits crafted in small batches. Specializing in whiskey, gin, vodka, and rum. Award-winning distillery with sustainable practices.',
    icon: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200',
    banner: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200',
    email: 'sales@craftspirits.com',
    phone: '+1 (555) 234-5678',
    address: '456 Distillery Lane, Louisville, KY 40202',
    shipping_address: '456 Distillery Lane, Louisville, KY 40202',
    categories: ['cat-alcohol'],
    approved_businesses: [],
    handshake_requests: ['hs-pending-1'],
    items: ['item-spirit-1', 'item-spirit-2', 'item-spirit-3'],
    active_orders: [],
    order_history: [],
    created_at: '2023-08-20T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'sup-beer-masters',
    bid: 'firebase-uid-beer',
    company_name: 'Beer Masters Brewing',
    desc: 'Craft brewery offering a wide selection of ales, lagers, IPAs, and seasonal specialties. Family-owned since 1985.',
    icon: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=200',
    banner: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=1200',
    email: 'wholesale@beermasters.com',
    phone: '+1 (555) 345-6789',
    address: '789 Brewery Ave, Portland, OR 97209',
    shipping_address: '789 Brewery Ave, Portland, OR 97209',
    categories: ['cat-alcohol'],
    approved_businesses: ['bus-demo'],
    handshake_requests: [],
    items: ['item-beer-1', 'item-beer-2', 'item-beer-3', 'item-beer-4'],
    active_orders: [],
    order_history: ['ord-hist-1'],
    created_at: '2023-05-10T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
  },
  {
    id: 'sup-prime-meats',
    bid: 'firebase-uid-meats',
    company_name: 'Prime Meats & Co.',
    desc: 'USDA Prime certified meat supplier. Dry-aged steaks, premium cuts, and specialty meats for fine dining establishments.',
    icon: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=200',
    banner: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=1200',
    email: 'orders@primemeats.com',
    phone: '+1 (555) 456-7890',
    address: '321 Butcher Street, Chicago, IL 60601',
    shipping_address: '321 Butcher Street, Chicago, IL 60601',
    categories: ['cat-meat'],
    approved_businesses: ['bus-demo'],
    handshake_requests: [],
    items: ['item-meat-1', 'item-meat-2', 'item-meat-3', 'item-meat-4', 'item-meat-5', 'item-meat-6'],
    active_orders: ['ord-2'],
    order_history: [],
    created_at: '2023-03-01T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z',
  },
  {
    id: 'sup-organic-farms',
    bid: 'firebase-uid-organic',
    company_name: 'Organic Valley Farms',
    desc: 'Certified organic produce and free-range poultry. Farm-to-table freshness with daily deliveries. Supporting local sustainable agriculture.',
    icon: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=200',
    banner: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
    email: 'supply@organicvalley.com',
    phone: '+1 (555) 567-8901',
    address: '555 Farm Road, Sacramento, CA 95814',
    shipping_address: '555 Farm Road, Sacramento, CA 95814',
    categories: ['cat-meat', 'cat-produce'],
    approved_businesses: [],
    handshake_requests: [],
    items: ['item-organic-1', 'item-organic-2', 'item-organic-3', 'item-organic-4'],
    active_orders: [],
    order_history: [],
    created_at: '2023-04-15T00:00:00Z',
    updated_at: '2024-01-08T00:00:00Z',
  },
  {
    id: 'sup-dairy-direct',
    bid: 'firebase-uid-dairy',
    company_name: 'Dairy Direct Ltd.',
    desc: 'Premium dairy products from grass-fed cows. Fresh milk, cream, butter, and yogurt delivered daily. Family dairy farm since 1952.',
    icon: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200',
    banner: 'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=1200',
    email: 'orders@dairydirect.com',
    phone: '+1 (555) 678-9012',
    address: '777 Dairy Lane, Madison, WI 53703',
    shipping_address: '777 Dairy Lane, Madison, WI 53703',
    categories: ['cat-dairy'],
    approved_businesses: ['bus-demo'],
    handshake_requests: [],
    items: ['item-dairy-1', 'item-dairy-2', 'item-dairy-3', 'item-dairy-4', 'item-dairy-5'],
    active_orders: [],
    order_history: [],
    created_at: '2023-02-20T00:00:00Z',
    updated_at: '2024-01-11T00:00:00Z',
  },
  {
    id: 'sup-artisan-cheese',
    bid: 'firebase-uid-cheese',
    company_name: 'Artisan Cheese Collective',
    desc: 'Handcrafted artisan cheeses from master cheesemakers. Imported and domestic varieties. Cheese plates and pairings consulting available.',
    icon: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=200',
    banner: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=1200',
    email: 'info@artisancheese.com',
    phone: '+1 (555) 789-0123',
    address: '888 Cheese Way, San Francisco, CA 94102',
    shipping_address: '888 Cheese Way, San Francisco, CA 94102',
    categories: ['cat-dairy'],
    approved_businesses: [],
    handshake_requests: ['hs-pending-2'],
    items: ['item-cheese-1', 'item-cheese-2', 'item-cheese-3', 'item-cheese-4'],
    active_orders: [],
    order_history: [],
    created_at: '2023-07-01T00:00:00Z',
    updated_at: '2024-01-09T00:00:00Z',
  },
  {
    id: 'sup-ocean-harvest',
    bid: 'firebase-uid-seafood',
    company_name: 'Ocean Harvest Seafood',
    desc: 'Fresh and sustainable seafood from the Pacific. Daily catches, premium shellfish, and specialty fish. Certified sustainable fishing practices.',
    icon: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200',
    banner: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=1200',
    email: 'orders@oceanharvest.com',
    phone: '+1 (555) 890-1234',
    address: '999 Harbor Drive, Seattle, WA 98101',
    shipping_address: '999 Harbor Drive, Seattle, WA 98101',
    categories: ['cat-seafood'],
    approved_businesses: ['bus-demo'],
    handshake_requests: [],
    items: ['item-seafood-1', 'item-seafood-2', 'item-seafood-3', 'item-seafood-4', 'item-seafood-5'],
    active_orders: ['ord-3'],
    order_history: [],
    created_at: '2023-01-10T00:00:00Z',
    updated_at: '2024-01-13T00:00:00Z',
  },
  {
    id: 'sup-green-valley',
    bid: 'firebase-uid-produce',
    company_name: 'Green Valley Produce',
    desc: 'Fresh fruits and vegetables from local farms. Seasonal specialties and exotic produce. Supporting 50+ local family farms.',
    icon: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200',
    banner: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=1200',
    email: 'orders@greenvalley.com',
    phone: '+1 (555) 901-2345',
    address: '111 Produce Plaza, Fresno, CA 93721',
    shipping_address: '111 Produce Plaza, Fresno, CA 93721',
    categories: ['cat-produce'],
    approved_businesses: ['bus-demo'],
    handshake_requests: [],
    items: ['item-produce-1', 'item-produce-2', 'item-produce-3', 'item-produce-4', 'item-produce-5', 'item-produce-6'],
    active_orders: [],
    order_history: ['ord-hist-2'],
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'sup-artisan-bakery',
    bid: 'firebase-uid-bakery',
    company_name: 'Artisan Bakery House',
    desc: 'European-style artisan breads and pastries. Fresh baked daily using traditional methods. Sourdough specialists.',
    icon: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=200',
    banner: 'https://images.unsplash.com/photo-1517433670267-30f8906c40eb?w=1200',
    email: 'wholesale@artisanbakery.com',
    phone: '+1 (555) 012-3456',
    address: '222 Baker Street, New York, NY 10001',
    shipping_address: '222 Baker Street, New York, NY 10001',
    categories: ['cat-bakery'],
    approved_businesses: [],
    handshake_requests: [],
    items: ['item-bakery-1', 'item-bakery-2', 'item-bakery-3', 'item-bakery-4'],
    active_orders: [],
    order_history: [],
    created_at: '2023-09-01T00:00:00Z',
    updated_at: '2024-01-07T00:00:00Z',
  },
];

// ===================
// ITEMS
// ===================
let items: Item[] = [
  // Wine items
  { id: 'item-wine-1', supplier_id: 'sup-premium-wines', name: 'Château Margaux 2018', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400', desc: 'Premier Grand Cru Classé from Bordeaux. Rich and elegant with notes of blackcurrant and cedar.', base_price: 450.00, unit: 'bottle', currency: 'USD', custom_prices: { 'bus-demo': 420.00 }, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-wine-2', supplier_id: 'sup-premium-wines', name: 'Opus One 2019', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=400', desc: 'Napa Valley red blend. Silky tannins with layers of dark fruit and spice.', base_price: 380.00, unit: 'bottle', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-wine-3', supplier_id: 'sup-premium-wines', name: 'Dom Pérignon 2012', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1594372365401-3bc16c4c7d1b?w=400', desc: 'Prestige cuvée champagne. Exceptional vintage with fine bubbles and toasty notes.', base_price: 220.00, unit: 'bottle', currency: 'USD', custom_prices: { 'bus-demo': 195.00 }, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-wine-4', supplier_id: 'sup-premium-wines', name: 'Cloudy Bay Sauvignon Blanc', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1566754436893-1c49778ab51e?w=400', desc: 'New Zealand white wine. Crisp and refreshing with citrus and tropical notes.', base_price: 28.00, unit: 'bottle', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-wine-5', supplier_id: 'sup-premium-wines', name: 'Penfolds Grange 2017', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', desc: 'Australian Shiraz. Bold and powerful with dark chocolate and plum flavors.', base_price: 850.00, unit: 'bottle', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Spirits items
  { id: 'item-spirit-1', supplier_id: 'sup-craft-spirits', name: 'Small Batch Bourbon', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400', desc: 'Hand-crafted bourbon aged 8 years. Caramel, vanilla, and oak notes.', base_price: 65.00, unit: 'bottle', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-spirit-2', supplier_id: 'sup-craft-spirits', name: 'London Dry Gin', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=400', desc: 'Botanical gin with juniper, citrus, and floral notes. Perfect for cocktails.', base_price: 45.00, unit: 'bottle', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-spirit-3', supplier_id: 'sup-craft-spirits', name: 'Premium Vodka', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1613752966027-6e30f7faa643?w=400', desc: 'Triple-distilled premium vodka. Smooth and clean finish.', base_price: 38.00, unit: 'bottle', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Beer items
  { id: 'item-beer-1', supplier_id: 'sup-beer-masters', name: 'Craft IPA 6-Pack', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400', desc: 'West Coast style IPA with citrus hops. 6.5% ABV.', base_price: 14.00, unit: '6-pack', currency: 'USD', custom_prices: { 'bus-demo': 12.50 }, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-beer-2', supplier_id: 'sup-beer-masters', name: 'Belgian Wheat Ale Case', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', desc: 'Traditional Belgian witbier with orange peel and coriander. Case of 24.', base_price: 48.00, unit: 'case', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-beer-3', supplier_id: 'sup-beer-masters', name: 'Stout 4-Pack', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1608270586620-248524dae6a55?w=400', desc: 'Rich imperial stout with coffee and chocolate notes. 8.2% ABV.', base_price: 16.00, unit: '4-pack', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-beer-4', supplier_id: 'sup-beer-masters', name: 'Pilsner Keg', category: 'cat-alcohol', image: 'https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=400', desc: 'Classic Czech-style pilsner. 5L mini keg for events.', base_price: 45.00, unit: 'keg', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Meat items
  { id: 'item-meat-1', supplier_id: 'sup-prime-meats', name: 'USDA Prime Ribeye', category: 'cat-meat', image: 'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?w=400', desc: '28-day dry-aged prime ribeye. Exceptional marbling.', base_price: 52.00, unit: 'lb', currency: 'USD', custom_prices: { 'bus-demo': 48.00 }, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-meat-2', supplier_id: 'sup-prime-meats', name: 'Wagyu Tenderloin A5', category: 'cat-meat', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400', desc: 'Japanese A5 Wagyu tenderloin. Ultimate in beef quality.', base_price: 180.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-meat-3', supplier_id: 'sup-prime-meats', name: 'Lamb Rack Frenched', category: 'cat-meat', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400', desc: 'New Zealand lamb rack, frenched and trimmed.', base_price: 38.00, unit: 'rack', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-meat-4', supplier_id: 'sup-prime-meats', name: 'Kurobuta Pork Chops', category: 'cat-meat', image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400', desc: 'Heritage Berkshire pork chops, double-cut.', base_price: 24.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-meat-5', supplier_id: 'sup-prime-meats', name: 'Veal Osso Buco', category: 'cat-meat', image: 'https://images.unsplash.com/photo-1588347818036-558601350947?w=400', desc: 'Premium veal shank cuts for osso buco.', base_price: 28.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-meat-6', supplier_id: 'sup-prime-meats', name: 'Duck Breast Magret', category: 'cat-meat', image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400', desc: 'Moulard duck breast, skin-on.', base_price: 22.00, unit: 'piece', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Organic items
  { id: 'item-organic-1', supplier_id: 'sup-organic-farms', name: 'Free-Range Chicken', category: 'cat-meat', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', desc: 'Pasture-raised whole chicken, 4-5 lbs.', base_price: 18.00, unit: 'each', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-organic-2', supplier_id: 'sup-organic-farms', name: 'Organic Eggs', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', desc: 'Farm-fresh organic eggs, dozen.', base_price: 8.00, unit: 'dozen', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-organic-3', supplier_id: 'sup-organic-farms', name: 'Heirloom Tomatoes', category: 'cat-produce', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', desc: 'Mixed heirloom tomatoes, vine-ripened.', base_price: 6.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-organic-4', supplier_id: 'sup-organic-farms', name: 'Mixed Microgreens', category: 'cat-produce', image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', desc: 'Organic microgreen mix, chef selection.', base_price: 12.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Dairy items
  { id: 'item-dairy-1', supplier_id: 'sup-dairy-direct', name: 'Whole Milk', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', desc: 'Fresh whole milk from grass-fed cows.', base_price: 5.50, unit: 'gallon', currency: 'USD', custom_prices: { 'bus-demo': 5.00 }, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-dairy-2', supplier_id: 'sup-dairy-direct', name: 'Heavy Cream', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400', desc: '40% butterfat heavy whipping cream.', base_price: 8.00, unit: 'quart', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-dairy-3', supplier_id: 'sup-dairy-direct', name: 'Cultured Butter', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', desc: 'European-style cultured butter.', base_price: 12.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-dairy-4', supplier_id: 'sup-dairy-direct', name: 'Greek Yogurt', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400', desc: 'Thick, creamy Greek-style yogurt.', base_price: 6.00, unit: 'quart', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-dairy-5', supplier_id: 'sup-dairy-direct', name: 'Crème Fraîche', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=400', desc: 'French-style cultured cream.', base_price: 9.00, unit: 'pint', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Cheese items
  { id: 'item-cheese-1', supplier_id: 'sup-artisan-cheese', name: 'Aged Gruyère', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', desc: 'Swiss Gruyère aged 18 months.', base_price: 24.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-cheese-2', supplier_id: 'sup-artisan-cheese', name: 'Parmigiano Reggiano', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400', desc: '24-month aged Italian parmesan, DOP certified.', base_price: 28.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-cheese-3', supplier_id: 'sup-artisan-cheese', name: 'Burrata', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=400', desc: 'Fresh Italian burrata, cream-filled.', base_price: 14.00, unit: 'piece', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-cheese-4', supplier_id: 'sup-artisan-cheese', name: 'Manchego Reserva', category: 'cat-dairy', image: 'https://images.unsplash.com/photo-1634487359989-3e90c9432133?w=400', desc: 'Spanish sheep milk cheese, aged 12 months.', base_price: 22.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Seafood items
  { id: 'item-seafood-1', supplier_id: 'sup-ocean-harvest', name: 'Wild Salmon Fillet', category: 'cat-seafood', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400', desc: 'Wild-caught Alaskan king salmon, skin-on fillet.', base_price: 32.00, unit: 'lb', currency: 'USD', custom_prices: { 'bus-demo': 29.00 }, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-seafood-2', supplier_id: 'sup-ocean-harvest', name: 'Jumbo Prawns', category: 'cat-seafood', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', desc: 'U10 tiger prawns, head-on.', base_price: 28.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-seafood-3', supplier_id: 'sup-ocean-harvest', name: 'Live Maine Lobster', category: 'cat-seafood', image: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400', desc: 'Live Maine lobster, 1.5-2 lbs.', base_price: 45.00, unit: 'each', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-seafood-4', supplier_id: 'sup-ocean-harvest', name: 'Sashimi-Grade Tuna', category: 'cat-seafood', image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400', desc: 'Bluefin tuna loin, sashimi quality.', base_price: 55.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-seafood-5', supplier_id: 'sup-ocean-harvest', name: 'Fresh Oysters', category: 'cat-seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', desc: 'Kumamoto oysters, live, per dozen.', base_price: 24.00, unit: 'dozen', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Produce items
  { id: 'item-produce-1', supplier_id: 'sup-green-valley', name: 'Baby Arugula', category: 'cat-produce', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', desc: 'Fresh baby arugula, pre-washed.', base_price: 4.00, unit: 'lb', currency: 'USD', custom_prices: { 'bus-demo': 3.50 }, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-produce-2', supplier_id: 'sup-green-valley', name: 'Mixed Bell Peppers', category: 'cat-produce', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', desc: 'Red, yellow, and orange bell peppers.', base_price: 5.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-produce-3', supplier_id: 'sup-green-valley', name: 'Fresh Herbs Bundle', category: 'cat-produce', image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400', desc: 'Chef selection of fresh herbs.', base_price: 8.00, unit: 'bundle', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-produce-4', supplier_id: 'sup-green-valley', name: 'Meyer Lemons', category: 'cat-produce', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400', desc: 'Sweet Meyer lemons, organic.', base_price: 4.50, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-produce-5', supplier_id: 'sup-green-valley', name: 'Baby Spinach', category: 'cat-produce', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', desc: 'Tender baby spinach leaves.', base_price: 5.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-produce-6', supplier_id: 'sup-green-valley', name: 'Wild Mushroom Mix', category: 'cat-produce', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', desc: 'Chanterelle, shiitake, and oyster mushrooms.', base_price: 18.00, unit: 'lb', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },

  // Bakery items
  { id: 'item-bakery-1', supplier_id: 'sup-artisan-bakery', name: 'Sourdough Boule', category: 'cat-bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', desc: 'Traditional sourdough with crispy crust.', base_price: 8.00, unit: 'loaf', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-bakery-2', supplier_id: 'sup-artisan-bakery', name: 'French Baguette', category: 'cat-bakery', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400', desc: 'Classic French baguette, baked fresh.', base_price: 4.00, unit: 'piece', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-bakery-3', supplier_id: 'sup-artisan-bakery', name: 'Butter Croissants', category: 'cat-bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', desc: 'Flaky, all-butter croissants, box of 12.', base_price: 36.00, unit: 'box', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'item-bakery-4', supplier_id: 'sup-artisan-bakery', name: 'Ciabatta Rolls', category: 'cat-bakery', image: 'https://images.unsplash.com/photo-1586444248879-bc604cbcc439?w=400', desc: 'Italian ciabatta rolls, dozen.', base_price: 12.00, unit: 'dozen', currency: 'USD', custom_prices: {}, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

// ===================
// HANDSHAKES
// ===================
let handshakes: Handshake[] = [
  {
    id: 'hs-pending-1',
    sender_id: 'bus-demo',
    recipient_id: 'sup-craft-spirits',
    sender_type: 'business',
    recipient_type: 'supplier',
    status: 'pending',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
  },
  {
    id: 'hs-pending-2',
    sender_id: 'bus-demo',
    recipient_id: 'sup-artisan-cheese',
    sender_type: 'business',
    recipient_type: 'supplier',
    status: 'pending',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
  {
    id: 'hs-accepted-1',
    sender_id: 'bus-demo',
    recipient_id: 'sup-premium-wines',
    sender_type: 'business',
    recipient_type: 'supplier',
    status: 'accepted',
    created_at: '2023-12-01T09:00:00Z',
    updated_at: '2023-12-02T11:00:00Z',
  },
  {
    id: 'hs-accepted-2',
    sender_id: 'sup-prime-meats',
    recipient_id: 'bus-demo',
    sender_type: 'supplier',
    recipient_type: 'business',
    status: 'accepted',
    created_at: '2023-11-15T14:00:00Z',
    updated_at: '2023-11-16T09:30:00Z',
  },
  {
    id: 'hs-incoming-1',
    sender_id: 'sup-artisan-bakery',
    recipient_id: 'bus-demo',
    sender_type: 'supplier',
    recipient_type: 'business',
    status: 'pending',
    created_at: '2024-01-14T16:00:00Z',
    updated_at: '2024-01-14T16:00:00Z',
  },
];

// ===================
// ORDERS (active)
// ===================
let activeOrders: Order[] = [
  {
    id: 'ord-1',
    supplier_id: 'sup-premium-wines',
    business_id: 'bus-demo',
    estimated_eta: '2024-01-20T14:00:00Z',
    ordered_items: [
      { item_id: 'item-wine-1', quantity: 6, base_price: 450.00, price_at_order: 420.00, total_price_for_item: 2520.00 },
      { item_id: 'item-wine-3', quantity: 12, base_price: 220.00, price_at_order: 195.00, total_price_for_item: 2340.00 },
    ],
    total_price: 4860.00,
    status: 'accepted',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T11:30:00Z',
  },
  {
    id: 'ord-2',
    supplier_id: 'sup-prime-meats',
    business_id: 'bus-demo',
    estimated_eta: '2024-01-19T08:00:00Z',
    ordered_items: [
      { item_id: 'item-meat-1', quantity: 20, base_price: 52.00, price_at_order: 48.00, total_price_for_item: 960.00 },
      { item_id: 'item-meat-2', quantity: 5, base_price: 180.00, price_at_order: 180.00, total_price_for_item: 900.00 },
      { item_id: 'item-meat-3', quantity: 10, base_price: 38.00, price_at_order: 38.00, total_price_for_item: 380.00 },
    ],
    total_price: 2240.00,
    status: 'delivering',
    created_at: '2024-01-14T15:00:00Z',
    updated_at: '2024-01-16T07:00:00Z',
  },
  {
    id: 'ord-3',
    supplier_id: 'sup-ocean-harvest',
    business_id: 'bus-demo',
    ordered_items: [
      { item_id: 'item-seafood-1', quantity: 15, base_price: 32.00, price_at_order: 29.00, total_price_for_item: 435.00 },
      { item_id: 'item-seafood-3', quantity: 8, base_price: 45.00, price_at_order: 45.00, total_price_for_item: 360.00 },
    ],
    total_price: 795.00,
    status: 'pending',
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T09:00:00Z',
  },
  {
    id: 'ord-4',
    supplier_id: 'sup-dairy-direct',
    business_id: 'bus-demo',
    ordered_items: [
      { item_id: 'item-dairy-1', quantity: 10, base_price: 5.50, price_at_order: 5.00, total_price_for_item: 50.00 },
      { item_id: 'item-dairy-2', quantity: 8, base_price: 8.00, price_at_order: 8.00, total_price_for_item: 64.00 },
      { item_id: 'item-dairy-3', quantity: 5, base_price: 12.00, price_at_order: 12.00, total_price_for_item: 60.00 },
    ],
    total_price: 174.00,
    status: 'arrived',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
  },
];

// ===================
// ORDERS (history)
// ===================
let orderHistory: Order[] = [
  {
    id: 'ord-hist-1',
    supplier_id: 'sup-beer-masters',
    business_id: 'bus-demo',
    ordered_items: [
      { item_id: 'item-beer-1', quantity: 48, base_price: 14.00, price_at_order: 12.50, total_price_for_item: 600.00 },
      { item_id: 'item-beer-4', quantity: 4, base_price: 45.00, price_at_order: 45.00, total_price_for_item: 180.00 },
    ],
    total_price: 780.00,
    status: 'arrived',
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-08T14:00:00Z',
  },
  {
    id: 'ord-hist-2',
    supplier_id: 'sup-green-valley',
    business_id: 'bus-demo',
    ordered_items: [
      { item_id: 'item-produce-1', quantity: 20, base_price: 4.00, price_at_order: 3.50, total_price_for_item: 70.00 },
      { item_id: 'item-produce-3', quantity: 10, base_price: 8.00, price_at_order: 8.00, total_price_for_item: 80.00 },
      { item_id: 'item-produce-6', quantity: 5, base_price: 18.00, price_at_order: 18.00, total_price_for_item: 90.00 },
    ],
    total_price: 240.00,
    status: 'arrived',
    created_at: '2024-01-02T07:00:00Z',
    updated_at: '2024-01-03T09:00:00Z',
  },
];

// ===================
// BUSINESSES
// ===================
let businesses: Business[] = [
  {
    id: 'bus-demo',
    bid: 'mock-firebase-uid',
    company_name: 'The Grand Restaurant',
    desc: 'Fine dining establishment in downtown. Serving contemporary American cuisine with seasonal ingredients.',
    icon: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
    banner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
    email: 'orders@grandrestaurant.com',
    phone: '+1 (555) 100-2000',
    address: '100 Main Street, New York, NY 10001',
    shipping_address: '100 Main Street, New York, NY 10001',
    categories: ['cat-alcohol', 'cat-meat', 'cat-dairy', 'cat-seafood', 'cat-produce'],
    my_suppliers: ['sup-premium-wines', 'sup-beer-masters', 'sup-prime-meats', 'sup-dairy-direct', 'sup-ocean-harvest', 'sup-green-valley'],
    handshake_requests: ['hs-pending-1', 'hs-pending-2'],
    active_orders: ['ord-1', 'ord-2', 'ord-3', 'ord-4'],
    order_history: ['ord-hist-1', 'ord-hist-2'],
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'bus-bistro',
    bid: 'firebase-uid-bistro',
    company_name: 'Le Petit Bistro',
    desc: 'Cozy French bistro specializing in classic dishes.',
    icon: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=200',
    banner: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200',
    email: 'info@lepetitbistro.com',
    phone: '+1 (555) 200-3000',
    address: '200 Oak Avenue, San Francisco, CA 94102',
    shipping_address: '200 Oak Avenue, San Francisco, CA 94102',
    categories: ['cat-alcohol', 'cat-meat', 'cat-dairy', 'cat-bakery'],
    my_suppliers: [],
    handshake_requests: [],
    active_orders: [],
    order_history: [],
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
];

// ===================================================
// Public getters (return current snapshot of mutable state)
// ===================================================
export const mockCategories = (): Category[] => [...categories];
export const mockSuppliers = (): Supplier[] => [...suppliers];
export const mockItems = (): Item[] => [...items];
export const mockHandshakes = (): Handshake[] => [...handshakes];
export const mockOrders = (): Order[] => [...activeOrders];
export const mockOrderHistory = (): Order[] => [...orderHistory];
export const mockBusinesses = (): Business[] => [...businesses];

// ===================================================
// Helper query functions
// ===================================================
export function getSupplierCarousel(categoryId: string): SupplierCarouselItem[] {
  const category = categories.find(c => c.oid === categoryId);
  if (!category) return [];

  const supplierIds = Object.keys(category.users).filter(
    id => category.users[id] === 'supplier',
  );

  return supplierIds
    .map(id => {
      const supplier = suppliers.find(s => s.id === id);
      if (!supplier) return null;
      return {
        link: `/supplier/${supplier.id}`,
        title: supplier.company_name,
        desc: supplier.desc,
        banner: supplier.banner,
        icon: supplier.icon,
      };
    })
    .filter(Boolean) as SupplierCarouselItem[];
}

export function getSupplierItems(supplierId: string): Item[] {
  return items.filter(item => item.supplier_id === supplierId);
}

export function getItemById(itemId: string): Item | undefined {
  return items.find(item => item.id === itemId);
}

export function getSupplierById(supplierId: string): Supplier | undefined {
  return suppliers.find(s => s.id === supplierId);
}

export function getBusinessById(businessId: string): Business | undefined {
  return businesses.find(b => b.id === businessId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(c => c.oid === categoryId);
}

// ===================================================
// Mutation helpers (for mock mode — persist in session)
// ===================================================

export function addOrder(order: Order): void {
  activeOrders = [...activeOrders, order];
  const biz = businesses.find(b => b.id === order.business_id);
  if (biz) biz.active_orders = [...biz.active_orders, order.id];
  const sup = suppliers.find(s => s.id === order.supplier_id);
  if (sup) sup.active_orders = [...sup.active_orders, order.id];
}

export function updateOrderStatus(orderId: string, status: Order['status']): boolean {
  const order = activeOrders.find(o => o.id === orderId);
  if (!order) return false;
  order.status = status;
  order.updated_at = new Date().toISOString();
  return true;
}

export function archiveOrder(orderId: string): boolean {
  const idx = activeOrders.findIndex(o => o.id === orderId);
  if (idx === -1) return false;
  const [order] = activeOrders.splice(idx, 1);
  orderHistory = [...orderHistory, order];

  const biz = businesses.find(b => b.id === order.business_id);
  if (biz) {
    biz.active_orders = biz.active_orders.filter(id => id !== orderId);
    biz.order_history = [...biz.order_history, orderId];
  }
  const sup = suppliers.find(s => s.id === order.supplier_id);
  if (sup) {
    sup.active_orders = sup.active_orders.filter(id => id !== orderId);
    sup.order_history = [...sup.order_history, orderId];
  }
  return true;
}

export function updateHandshakeStatus(
  handshakeId: string,
  status: Handshake['status'],
): boolean {
  const hs = handshakes.find(h => h.id === handshakeId);
  if (!hs) return false;
  hs.status = status;
  hs.updated_at = new Date().toISOString();

  if (status === 'accepted') {
    const biz = businesses.find(b =>
      (hs.sender_type === 'business' && b.id === hs.sender_id) ||
      (hs.recipient_type === 'business' && b.id === hs.recipient_id),
    );
    const sup = suppliers.find(s =>
      (hs.sender_type === 'supplier' && s.id === hs.sender_id) ||
      (hs.recipient_type === 'supplier' && s.id === hs.recipient_id),
    );
    if (biz && sup) {
      if (!biz.my_suppliers.includes(sup.id)) biz.my_suppliers.push(sup.id);
      if (!sup.approved_businesses.includes(biz.id)) sup.approved_businesses.push(biz.id);
    }
  }
  return true;
}

export function addHandshake(hs: Handshake): void {
  handshakes = [...handshakes, hs];
  const sender =
    hs.sender_type === 'business'
      ? businesses.find(b => b.id === hs.sender_id)
      : suppliers.find(s => s.id === hs.sender_id);
  const recipient =
    hs.recipient_type === 'business'
      ? businesses.find(b => b.id === hs.recipient_id)
      : suppliers.find(s => s.id === hs.recipient_id);
  if (sender) sender.handshake_requests = [...sender.handshake_requests, hs.id];
  if (recipient) recipient.handshake_requests = [...recipient.handshake_requests, hs.id];
}

export function addItem(item: Item): void {
  items = [...items, item];
  const sup = suppliers.find(s => s.id === item.supplier_id);
  if (sup) sup.items = [...sup.items, item.id];
}

export function updateItem(itemId: string, data: Partial<Item>): boolean {
  const item = items.find(i => i.id === itemId);
  if (!item) return false;
  Object.assign(item, data, { updated_at: new Date().toISOString() });
  return true;
}

export function deleteItem(itemId: string): boolean {
  const idx = items.findIndex(i => i.id === itemId);
  if (idx === -1) return false;
  const item = items[idx];
  items.splice(idx, 1);
  const sup = suppliers.find(s => s.id === item.supplier_id);
  if (sup) sup.items = sup.items.filter(id => id !== itemId);
  return true;
}

export function updateBusiness(businessId: string, data: Partial<Business>): boolean {
  const biz = businesses.find(b => b.id === businessId);
  if (!biz) return false;
  Object.assign(biz, data, { updated_at: new Date().toISOString() });
  return true;
}

export function updateSupplier(supplierId: string, data: Partial<Supplier>): boolean {
  const sup = suppliers.find(s => s.id === supplierId);
  if (!sup) return false;
  Object.assign(sup, data, { updated_at: new Date().toISOString() });
  return true;
}

export function setCustomPrice(itemId: string, businessId: string, price: number): boolean {
  const item = items.find(i => i.id === itemId);
  if (!item) return false;
  item.custom_prices = { ...item.custom_prices, [businessId]: price };
  item.updated_at = new Date().toISOString();
  return true;
}

export function deleteCustomPrice(itemId: string, businessId: string): boolean {
  const item = items.find(i => i.id === itemId);
  if (!item) return false;
  const { [businessId]: _, ...rest } = item.custom_prices;
  item.custom_prices = rest;
  item.updated_at = new Date().toISOString();
  return true;
}
