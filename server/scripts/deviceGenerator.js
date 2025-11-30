// Device generator for creating 200 devices programmatically
// This generates realistic device data based on templates

// Helper to generate image URLs based on device type
const getImageUrl = (brand, category, name) => {
  // Image collections by category
  const imageCollections = {
    'mobile': [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', // iPhone
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', // Samsung
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', // Pixel
      'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=800&q=80', // Generic
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80', // Phone
      'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=800&q=80', // Phone
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80', // Phone
      'https://images.unsplash.com/photo-1580910051074-3eb6948d3ea0?w=800&q=80', // Phone
      'https://images.unsplash.com/photo-1573148195900-7845dcb9b858?w=800&q=80', // Phone
      'https://images.unsplash.com/photo-1512054502232-10a0a0e79743?w=800&q=80'  // Phone
    ],
    'laptop': [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', // MacBook
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', // Laptop
      'https://images.unsplash.com/photo-1531297461136-82lw9b21085ab?w=800&q=80', // Laptop
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', // MacBook
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', // Laptop
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', // Laptop
      'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800&q=80', // Dell
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80', // Laptop
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', // Laptop
      'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&q=80'  // Laptop
    ],
    'tablet': [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', // iPad
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&q=80', // Tablet
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80', // Tablet
      'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&q=80', // Tablet
      'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800&q=80', // Tablet
      'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800&q=80', // Tablet
      'https://images.unsplash.com/photo-1527698266440-12104e498b36?w=800&q=80'  // Tablet
    ],
    'smartwatch': [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', // Watch
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', // Watch
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80', // Watch
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&q=80', // Watch
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80', // Watch
      'https://images.unsplash.com/photo-1517502474097-f9b30659dadb?w=800&q=80'  // Watch
    ],
    'headphones': [
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80', // Headphones
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', // Headphones
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', // Headphones
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80', // Headphones
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', // Earbuds
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', // Headphones
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'  // Headphones
    ]
  };

  // Simple hash function to get a consistent index from the name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const images = imageCollections[category] || imageCollections['mobile'];
  const index = hash % images.length;

  return images[index];
};

const generateDevice = (template, variations = {}) => {
  const device = {
    name: variations.name || template.name,
    brand: variations.brand || template.brand,
    category: variations.category || template.category,
    model: variations.model || `${template.brand.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
    image: variations.image || getImageUrl(variations.brand || template.brand, variations.category || template.category, variations.name || template.name),
    images: variations.images || [
      getImageUrl(variations.brand || template.brand, variations.category || template.category, variations.name || template.name),
      getImageUrl(variations.brand || template.brand, variations.category || template.category, variations.name || template.name)
    ],
    description: variations.description || template.description,
    specifications: variations.specifications || template.specifications,
    prices: (variations.prices || template.prices).map(p => ({
      ...p,
      lastUpdated: new Date()
    })),
    tags: variations.tags || template.tags,
    releaseDate: new Date(variations.releaseDate || template.releaseDate),
    averageRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 500) + 50
  };
  return device;
};

// Device templates by category
const mobileTemplates = {
  apple: {
    name: 'iPhone',
    brand: 'Apple',
    category: 'mobile',
    description: 'Premium iPhone with advanced features.',
    specifications: {
      display: { size: '6.1 inch', resolution: '2532 x 1170', type: 'Super Retina XDR OLED', refreshRate: '60Hz', features: ['HDR', 'True Tone'] },
      processor: { name: 'A16 Bionic', cores: 6, speed: '3.46 GHz', architecture: '4nm' },
      memory: { ram: '6GB', storage: '128GB', expandable: false },
      camera: { rear: '12MP + 12MP', front: '12MP', video: '4K 60fps', features: ['Night Mode'] },
      battery: { capacity: '3200 mAh', fastCharge: true, wirelessCharge: true },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['Lightning'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'iOS 17',
      dimensions: { length: '147.5 mm', width: '71.5 mm', height: '7.85 mm', weight: '206 g' }
    },
    prices: [{ source: 'Apple Store', url: 'https://apple.com', price: 799, currency: 'USD' }],
    tags: ['premium'],
    releaseDate: '2023-09-22'
  },
  samsung: {
    name: 'Galaxy S',
    brand: 'Samsung',
    category: 'mobile',
    description: 'Samsung Galaxy flagship smartphone.',
    specifications: {
      display: { size: '6.1 inch', resolution: '2340 x 1080', type: 'Dynamic AMOLED 2X', refreshRate: '120Hz', features: ['Always-On Display'] },
      processor: { name: 'Snapdragon 8 Gen 3', cores: 8, speed: '3.39 GHz', architecture: '4nm' },
      memory: { ram: '8GB', storage: '128GB', expandable: true },
      camera: { rear: '50MP + 12MP + 10MP', front: '12MP', video: '8K 30fps', features: ['Night Mode'] },
      battery: { capacity: '4000 mAh', fastCharge: true, wirelessCharge: true },
      connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'Android 14',
      dimensions: { length: '147.0 mm', width: '70.6 mm', height: '7.6 mm', weight: '167 g' }
    },
    prices: [{ source: 'Samsung Store', url: 'https://samsung.com', price: 799, currency: 'USD' }],
    tags: ['premium'],
    releaseDate: '2024-01-24'
  }
};

// Generate all 200 devices
const generateAllDevices = () => {
  const devices = [];

  // Helper function to add device with specific specs
  const addDevice = (name, brand, category, specs, prices, tags, releaseDate, description) => {
    devices.push(generateDevice({
      name,
      brand,
      category,
      description,
      specifications: specs,
      prices,
      tags,
      releaseDate
    }));
  };

  // MOBILES - 80 devices
  // Apple (10)
  const appleMobiles = [
    { name: 'iPhone 15 Pro Max', price: 1199, ram: '8GB', storage: '256GB', processor: 'A17 Pro', display: '6.7 inch', battery: '4441 mAh', date: '2023-09-22' },
    { name: 'iPhone 15 Pro', price: 999, ram: '8GB', storage: '128GB', processor: 'A17 Pro', display: '6.1 inch', battery: '3274 mAh', date: '2023-09-22' },
    { name: 'iPhone 15 Plus', price: 899, ram: '6GB', storage: '128GB', processor: 'A16 Bionic', display: '6.7 inch', battery: '4383 mAh', date: '2023-09-22' },
    { name: 'iPhone 15', price: 799, ram: '6GB', storage: '128GB', processor: 'A16 Bionic', display: '6.1 inch', battery: '3349 mAh', date: '2023-09-22' },
    { name: 'iPhone 14 Pro Max', price: 999, ram: '6GB', storage: '128GB', processor: 'A16 Bionic', display: '6.7 inch', battery: '4323 mAh', date: '2022-09-16' },
    { name: 'iPhone 14 Pro', price: 899, ram: '6GB', storage: '128GB', processor: 'A16 Bionic', display: '6.1 inch', battery: '3200 mAh', date: '2022-09-16' },
    { name: 'iPhone 14 Plus', price: 899, ram: '6GB', storage: '128GB', processor: 'A15 Bionic', display: '6.7 inch', battery: '4325 mAh', date: '2022-09-16' },
    { name: 'iPhone 14', price: 699, ram: '6GB', storage: '128GB', processor: 'A15 Bionic', display: '6.1 inch', battery: '3279 mAh', date: '2022-09-16' },
    { name: 'iPhone 13 Pro Max', price: 899, ram: '6GB', storage: '128GB', processor: 'A15 Bionic', display: '6.7 inch', battery: '4352 mAh', date: '2021-09-24' },
    { name: 'iPhone 13', price: 599, ram: '4GB', storage: '128GB', processor: 'A15 Bionic', display: '6.1 inch', battery: '3240 mAh', date: '2021-09-24' }
  ];

  appleMobiles.forEach(m => {
    addDevice(m.name, 'Apple', 'mobile', {
      display: { size: m.display, resolution: m.display.includes('6.7') ? '2796 x 1290' : '2556 x 1179', type: 'Super Retina XDR OLED', refreshRate: m.name.includes('Pro') ? '120Hz ProMotion' : '60Hz', features: ['HDR', 'True Tone'] },
      processor: { name: m.processor, cores: 6, speed: m.processor.includes('A17') ? '3.78 GHz' : '3.46 GHz', architecture: m.processor.includes('A17') ? '3nm' : '4nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: false },
      camera: { rear: m.name.includes('Pro') ? '48MP + 12MP + 12MP' : '12MP + 12MP', front: '12MP', video: '4K 60fps', features: ['Night Mode', 'Portrait Mode'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: true },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: m.name.includes('15') ? ['USB-C'] : ['Lightning'], cellular: ['5G', '4G LTE'] },
      operatingSystem: m.name.includes('15') ? 'iOS 17' : m.name.includes('14') ? 'iOS 16' : 'iOS 15',
      dimensions: { length: m.display.includes('6.7') ? '160.9 mm' : '147.6 mm', width: m.display.includes('6.7') ? '77.8 mm' : '71.6 mm', height: '7.80 mm', weight: m.display.includes('6.7') ? '221 g' : '187 g' }
    }, [{ source: 'Apple Store', url: 'https://apple.com', price: m.price, currency: 'USD' }],
      m.name.includes('Pro') ? ['premium', 'photography', 'gaming'] : ['premium'],
      m.date, `${m.name} - ${m.name.includes('Pro') ? 'Premium' : 'Flagship'} iPhone with ${m.processor}`);
  });

  // Samsung (15)
  const samsungMobiles = [
    { name: 'Galaxy S24 Ultra', price: 1199, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 3', display: '6.8 inch', battery: '5000 mAh', date: '2024-01-24', camera: '200MP + 50MP + 12MP + 10MP' },
    { name: 'Galaxy S24+', price: 999, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 3', display: '6.7 inch', battery: '4900 mAh', date: '2024-01-24', camera: '50MP + 12MP + 10MP' },
    { name: 'Galaxy S24', price: 799, ram: '8GB', storage: '128GB', processor: 'Snapdragon 8 Gen 3', display: '6.2 inch', battery: '4000 mAh', date: '2024-01-24', camera: '50MP + 12MP + 10MP' },
    { name: 'Galaxy S23 Ultra', price: 1099, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 2', display: '6.8 inch', battery: '5000 mAh', date: '2023-02-17', camera: '200MP + 10MP + 10MP + 12MP' },
    { name: 'Galaxy S23+', price: 899, ram: '8GB', storage: '256GB', processor: 'Snapdragon 8 Gen 2', display: '6.6 inch', battery: '4700 mAh', date: '2023-02-17', camera: '50MP + 12MP + 10MP' },
    { name: 'Galaxy S23', price: 699, ram: '8GB', storage: '128GB', processor: 'Snapdragon 8 Gen 2', display: '6.1 inch', battery: '3900 mAh', date: '2023-02-17', camera: '50MP + 12MP + 10MP' },
    { name: 'Galaxy A54 5G', price: 449, ram: '6GB', storage: '128GB', processor: 'Exynos 1380', display: '6.4 inch', battery: '5000 mAh', date: '2023-03-24', camera: '50MP + 12MP + 5MP' },
    { name: 'Galaxy A34 5G', price: 349, ram: '6GB', storage: '128GB', processor: 'MediaTek Dimensity 1080', display: '6.6 inch', battery: '5000 mAh', date: '2023-03-24', camera: '48MP + 8MP + 5MP' },
    { name: 'Galaxy A14 5G', price: 199, ram: '4GB', storage: '64GB', processor: 'MediaTek Dimensity 700', display: '6.6 inch', battery: '5000 mAh', date: '2023-01-12', camera: '50MP + 2MP + 2MP' },
    { name: 'Galaxy Z Fold 5', price: 1799, ram: '12GB', storage: '512GB', processor: 'Snapdragon 8 Gen 2', display: '7.6 inch', battery: '4400 mAh', date: '2023-08-11', camera: '50MP + 10MP + 12MP' },
    { name: 'Galaxy Z Flip 5', price: 999, ram: '8GB', storage: '256GB', processor: 'Snapdragon 8 Gen 2', display: '6.7 inch', battery: '3700 mAh', date: '2023-08-11', camera: '12MP + 12MP' },
    { name: 'Galaxy Note 20 Ultra', price: 1199, ram: '12GB', storage: '256GB', processor: 'Snapdragon 865+', display: '6.9 inch', battery: '4500 mAh', date: '2020-08-21', camera: '108MP + 12MP + 12MP' },
    { name: 'Galaxy A53 5G', price: 399, ram: '6GB', storage: '128GB', processor: 'Exynos 1280', display: '6.5 inch', battery: '5000 mAh', date: '2022-03-24', camera: '64MP + 12MP + 5MP + 5MP' },
    { name: 'Galaxy S22 Ultra', price: 999, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 1', display: '6.8 inch', battery: '5000 mAh', date: '2022-02-25', camera: '108MP + 10MP + 10MP + 12MP' },
    { name: 'Galaxy S21 FE', price: 549, ram: '6GB', storage: '128GB', processor: 'Snapdragon 888', display: '6.4 inch', battery: '4500 mAh', date: '2022-01-04', camera: '12MP + 8MP + 12MP' }
  ];

  samsungMobiles.forEach(m => {
    addDevice(m.name, 'Samsung', 'mobile', {
      display: { size: m.display, resolution: m.display.includes('6.8') || m.display.includes('6.9') ? '3088 x 1440' : m.display.includes('6.7') ? '2640 x 1080' : '2340 x 1080', type: 'Dynamic AMOLED 2X', refreshRate: '120Hz', features: ['Always-On Display'] },
      processor: { name: m.processor, cores: 8, speed: '3.39 GHz', architecture: '4nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: true },
      camera: { rear: m.camera, front: '12MP', video: '8K 30fps', features: ['Night Mode', 'Pro Mode'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: m.price > 500 },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'Android 14',
      dimensions: { length: '162.3 mm', width: '79.0 mm', height: '8.6 mm', weight: '233 g' }
    }, [{ source: 'Samsung Store', url: 'https://samsung.com', price: m.price, currency: 'USD' }],
      m.price > 800 ? ['premium', 'photography'] : m.price > 400 ? ['mid-range'] : ['budget'],
      m.date, `${m.name} - ${m.price > 800 ? 'Premium' : 'Flagship'} Samsung smartphone`);
  });

  // Google (8)
  const googleMobiles = [
    { name: 'Pixel 8 Pro', price: 999, ram: '12GB', storage: '128GB', processor: 'Google Tensor G3', display: '6.7 inch', battery: '5050 mAh', date: '2023-10-12', camera: '50MP + 48MP + 48MP' },
    { name: 'Pixel 8', price: 699, ram: '8GB', storage: '128GB', processor: 'Google Tensor G3', display: '6.2 inch', battery: '4575 mAh', date: '2023-10-12', camera: '50MP + 12MP' },
    { name: 'Pixel 7a', price: 499, ram: '8GB', storage: '128GB', processor: 'Google Tensor G2', display: '6.1 inch', battery: '4385 mAh', date: '2023-05-11', camera: '64MP + 13MP' },
    { name: 'Pixel 7 Pro', price: 899, ram: '12GB', storage: '128GB', processor: 'Google Tensor G2', display: '6.7 inch', battery: '5000 mAh', date: '2022-10-13', camera: '50MP + 48MP + 12MP' },
    { name: 'Pixel 7', price: 599, ram: '8GB', storage: '128GB', processor: 'Google Tensor G2', display: '6.3 inch', battery: '4355 mAh', date: '2022-10-13', camera: '50MP + 12MP' },
    { name: 'Pixel 6a', price: 449, ram: '6GB', storage: '128GB', processor: 'Google Tensor', display: '6.1 inch', battery: '4410 mAh', date: '2022-07-28', camera: '12.2MP + 12MP' },
    { name: 'Pixel 6 Pro', price: 899, ram: '12GB', storage: '128GB', processor: 'Google Tensor', display: '6.7 inch', battery: '5003 mAh', date: '2021-10-28', camera: '50MP + 48MP + 12MP' },
    { name: 'Pixel 6', price: 599, ram: '8GB', storage: '128GB', processor: 'Google Tensor', display: '6.4 inch', battery: '4614 mAh', date: '2021-10-28', camera: '50MP + 12MP' }
  ];

  googleMobiles.forEach(m => {
    addDevice(m.name, 'Google', 'mobile', {
      display: { size: m.display, resolution: m.display.includes('6.7') ? '3120 x 1440' : '2400 x 1080', type: 'OLED', refreshRate: '120Hz', features: ['HDR'] },
      processor: { name: m.processor, cores: 8, speed: '2.85 GHz', architecture: '5nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: false },
      camera: { rear: m.camera, front: '10.5MP', video: '4K 60fps', features: ['Night Sight'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: m.price > 600 },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.2', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'Android 14',
      dimensions: { length: '162.6 mm', width: '76.5 mm', height: '8.8 mm', weight: '213 g' }
    }, [{ source: 'Google Store', url: 'https://store.google.com', price: m.price, currency: 'USD' }],
      m.price > 700 ? ['premium', 'photography'] : ['mid-range'],
      m.date, `${m.name} - ${m.price > 700 ? 'Premium' : 'Flagship'} Google Pixel smartphone`);
  });

  // Xiaomi/Redmi/Poco (20)
  const xiaomiMobiles = [
    { name: 'Xiaomi 14 Pro', brand: 'Xiaomi', price: 899, ram: '12GB', storage: '512GB', processor: 'Snapdragon 8 Gen 3', display: '6.73 inch', battery: '4880 mAh', date: '2024-01-01', camera: '50MP + 50MP + 50MP' },
    { name: 'Xiaomi 14', brand: 'Xiaomi', price: 699, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 3', display: '6.36 inch', battery: '4610 mAh', date: '2024-01-01', camera: '50MP + 50MP + 50MP' },
    { name: 'Xiaomi 13 Pro', brand: 'Xiaomi', price: 899, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 2', display: '6.73 inch', battery: '4820 mAh', date: '2023-02-26', camera: '50MP + 50MP + 50MP' },
    { name: 'Xiaomi 13', brand: 'Xiaomi', price: 599, ram: '8GB', storage: '128GB', processor: 'Snapdragon 8 Gen 2', display: '6.36 inch', battery: '4500 mAh', date: '2023-02-26', camera: '50MP + 10MP + 12MP' },
    { name: 'Redmi Note 13 Pro', brand: 'Redmi', price: 349, ram: '8GB', storage: '256GB', processor: 'Snapdragon 7s Gen 2', display: '6.67 inch', battery: '5100 mAh', date: '2024-01-15', camera: '200MP + 8MP + 2MP' },
    { name: 'Redmi Note 13', brand: 'Redmi', price: 249, ram: '6GB', storage: '128GB', processor: 'MediaTek Dimensity 6080', display: '6.67 inch', battery: '5000 mAh', date: '2024-01-15', camera: '108MP + 8MP + 2MP' },
    { name: 'Redmi Note 12 Pro', brand: 'Redmi', price: 299, ram: '6GB', storage: '128GB', processor: 'MediaTek Dimensity 1080', display: '6.67 inch', battery: '5000 mAh', date: '2023-01-05', camera: '50MP + 8MP + 2MP' },
    { name: 'Redmi Note 11', brand: 'Redmi', price: 179, ram: '4GB', storage: '64GB', processor: 'Snapdragon 680', display: '6.43 inch', battery: '5000 mAh', date: '2022-01-26', camera: '50MP + 8MP + 2MP + 2MP' },
    { name: 'POCO X6 Pro', brand: 'Poco', price: 299, ram: '12GB', storage: '512GB', processor: 'MediaTek Dimensity 8300 Ultra', display: '6.67 inch', battery: '5000 mAh', date: '2024-01-11', camera: '64MP + 8MP + 2MP' },
    { name: 'POCO X6', brand: 'Poco', price: 249, ram: '8GB', storage: '256GB', processor: 'Snapdragon 7s Gen 2', display: '6.67 inch', battery: '5100 mAh', date: '2024-01-11', camera: '64MP + 8MP + 2MP' },
    { name: 'POCO F5 Pro', brand: 'Poco', price: 399, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8+ Gen 1', display: '6.67 inch', battery: '5160 mAh', date: '2023-05-09', camera: '64MP + 8MP + 2MP' },
    { name: 'POCO M5', brand: 'Poco', price: 149, ram: '4GB', storage: '64GB', processor: 'MediaTek Helio G99', display: '6.58 inch', battery: '5000 mAh', date: '2022-09-05', camera: '50MP + 2MP + 2MP' },
    { name: 'Redmi 13C', brand: 'Redmi', price: 129, ram: '4GB', storage: '64GB', processor: 'MediaTek Helio G85', display: '6.74 inch', battery: '5000 mAh', date: '2023-11-10', camera: '50MP + 2MP' },
    { name: 'Xiaomi 12T Pro', brand: 'Xiaomi', price: 649, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8+ Gen 1', display: '6.67 inch', battery: '5000 mAh', date: '2022-10-04', camera: '200MP + 8MP + 2MP' },
    { name: 'Xiaomi 11T', brand: 'Xiaomi', price: 499, ram: '8GB', storage: '128GB', processor: 'MediaTek Dimensity 1200', display: '6.67 inch', battery: '5000 mAh', date: '2021-09-15', camera: '108MP + 8MP + 5MP' },
    { name: 'Redmi K70', brand: 'Redmi', price: 399, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 2', display: '6.67 inch', battery: '5000 mAh', date: '2023-11-29', camera: '50MP + 8MP + 2MP' },
    { name: 'POCO C65', brand: 'Poco', price: 119, ram: '4GB', storage: '64GB', processor: 'MediaTek Helio G85', display: '6.74 inch', battery: '5000 mAh', date: '2023-12-06', camera: '50MP + 2MP' },
    { name: 'Redmi Note 13 Pro+', brand: 'Redmi', price: 399, ram: '12GB', storage: '512GB', processor: 'MediaTek Dimensity 7200 Ultra', display: '6.67 inch', battery: '5000 mAh', date: '2024-01-15', camera: '200MP + 8MP + 2MP' },
    { name: 'Xiaomi Mi 11', brand: 'Xiaomi', price: 699, ram: '8GB', storage: '128GB', processor: 'Snapdragon 888', display: '6.81 inch', battery: '4600 mAh', date: '2021-02-08', camera: '108MP + 13MP + 5MP' },
    { name: 'POCO X5 Pro', brand: 'Poco', price: 279, ram: '6GB', storage: '128GB', processor: 'Snapdragon 778G', display: '6.67 inch', battery: '5000 mAh', date: '2023-02-06', camera: '108MP + 8MP + 2MP' }
  ];

  xiaomiMobiles.forEach(m => {
    addDevice(m.name, m.brand, 'mobile', {
      display: { size: m.display, resolution: '2400 x 1080', type: 'AMOLED', refreshRate: '120Hz', features: ['HDR'] },
      processor: { name: m.processor, cores: 8, speed: '3.0 GHz', architecture: '4nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: m.brand !== 'Xiaomi' },
      camera: { rear: m.camera, front: '16MP', video: '4K 30fps', features: ['Night Mode'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: m.price > 500 },
      connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.2', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'MIUI 14',
      dimensions: { length: '161.1 mm', width: '75.0 mm', height: '8.0 mm', weight: '187 g' }
    }, [{ source: `${m.brand} Store`, url: `https://${m.brand.toLowerCase()}.com`, price: m.price, currency: 'USD' }],
      m.price > 600 ? ['premium', 'gaming'] : m.price > 300 ? ['mid-range'] : ['budget'],
      m.date, `${m.name} - ${m.brand} smartphone`);
  });

  // Realme (8)
  const realmeMobiles = [
    { name: 'Realme GT 5 Pro', price: 599, ram: '16GB', storage: '1TB', processor: 'Snapdragon 8 Gen 3', display: '6.78 inch', battery: '5400 mAh', date: '2023-12-07', camera: '50MP + 8MP + 2MP' },
    { name: 'Realme 12 Pro+', price: 399, ram: '12GB', storage: '512GB', processor: 'Snapdragon 7s Gen 2', display: '6.7 inch', battery: '5000 mAh', date: '2024-01-29', camera: '50MP + 64MP + 8MP' },
    { name: 'Realme GT 3', price: 449, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8+ Gen 1', display: '6.74 inch', battery: '4600 mAh', date: '2023-02-28', camera: '50MP + 8MP + 2MP' },
    { name: 'Realme 11 Pro+', price: 349, ram: '12GB', storage: '512GB', processor: 'MediaTek Dimensity 7050', display: '6.7 inch', battery: '5000 mAh', date: '2023-05-10', camera: '200MP + 8MP + 2MP' },
    { name: 'Realme 10 Pro+', price: 299, ram: '8GB', storage: '256GB', processor: 'MediaTek Dimensity 1080', display: '6.7 inch', battery: '5000 mAh', date: '2022-11-17', camera: '108MP + 8MP + 2MP' },
    { name: 'Realme C55', price: 149, ram: '6GB', storage: '128GB', processor: 'MediaTek Helio G88', display: '6.72 inch', battery: '5000 mAh', date: '2023-03-21', camera: '64MP + 2MP' },
    { name: 'Realme Narzo 60 Pro', price: 229, ram: '8GB', storage: '256GB', processor: 'MediaTek Dimensity 7050', display: '6.43 inch', battery: '5000 mAh', date: '2023-07-06', camera: '100MP + 2MP' },
    { name: 'Realme GT Neo 5', price: 379, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8+ Gen 1', display: '6.74 inch', battery: '5000 mAh', date: '2023-02-09', camera: '50MP + 8MP + 2MP' }
  ];

  realmeMobiles.forEach(m => {
    addDevice(m.name, 'Realme', 'mobile', {
      display: { size: m.display, resolution: '2412 x 1080', type: 'AMOLED', refreshRate: '120Hz', features: ['HDR'] },
      processor: { name: m.processor, cores: 8, speed: '3.0 GHz', architecture: '4nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: true },
      camera: { rear: m.camera, front: '32MP', video: '4K 30fps', features: ['Night Mode'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: m.price > 400 },
      connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.2', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'Realme UI 5.0',
      dimensions: { length: '161.5 mm', width: '74.0 mm', height: '8.7 mm', weight: '196 g' }
    }, [{ source: 'Realme Store', url: 'https://realme.com', price: m.price, currency: 'USD' }],
      m.price > 500 ? ['premium', 'gaming'] : ['mid-range'],
      m.date, `${m.name} - Realme smartphone`);
  });

  // OnePlus (8)
  const oneplusMobiles = [
    { name: 'OnePlus 12', price: 799, ram: '16GB', storage: '512GB', processor: 'Snapdragon 8 Gen 3', display: '6.82 inch', battery: '5400 mAh', date: '2024-01-23', camera: '50MP + 64MP + 48MP' },
    { name: 'OnePlus 11', price: 699, ram: '16GB', storage: '256GB', processor: 'Snapdragon 8 Gen 2', display: '6.7 inch', battery: '5000 mAh', date: '2023-02-07', camera: '50MP + 32MP + 48MP' },
    { name: 'OnePlus Nord 3', price: 449, ram: '16GB', storage: '256GB', processor: 'MediaTek Dimensity 9000', display: '6.74 inch', battery: '5000 mAh', date: '2023-07-05', camera: '50MP + 8MP + 2MP' },
    { name: 'OnePlus 10 Pro', price: 899, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 1', display: '6.7 inch', battery: '5000 mAh', date: '2022-03-31', camera: '48MP + 8MP + 50MP' },
    { name: 'OnePlus 9 Pro', price: 969, ram: '12GB', storage: '256GB', processor: 'Snapdragon 888', display: '6.7 inch', battery: '4500 mAh', date: '2021-03-23', camera: '48MP + 8MP + 50MP + 2MP' },
    { name: 'OnePlus Nord CE 3', price: 299, ram: '8GB', storage: '128GB', processor: 'Snapdragon 782G', display: '6.7 inch', battery: '5000 mAh', date: '2023-06-01', camera: '50MP + 8MP + 2MP' },
    { name: 'OnePlus 8T', price: 749, ram: '12GB', storage: '256GB', processor: 'Snapdragon 865', display: '6.55 inch', battery: '4500 mAh', date: '2020-10-14', camera: '48MP + 16MP + 5MP + 2MP' },
    { name: 'OnePlus Nord 2T', price: 399, ram: '8GB', storage: '128GB', processor: 'MediaTek Dimensity 1300', display: '6.43 inch', battery: '4500 mAh', date: '2022-05-19', camera: '50MP + 8MP + 2MP' }
  ];

  oneplusMobiles.forEach(m => {
    addDevice(m.name, 'OnePlus', 'mobile', {
      display: { size: m.display, resolution: '3168 x 1440', type: 'LTPO AMOLED', refreshRate: '120Hz', features: ['HDR'] },
      processor: { name: m.processor, cores: 8, speed: '3.39 GHz', architecture: '4nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: false },
      camera: { rear: m.camera, front: '16MP', video: '8K 24fps', features: ['Night Mode'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: m.price > 600 },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'OxygenOS 14',
      dimensions: { length: '164.3 mm', width: '75.8 mm', height: '9.2 mm', weight: '220 g' }
    }, [{ source: 'OnePlus Store', url: 'https://oneplus.com', price: m.price, currency: 'USD' }],
      m.price > 600 ? ['premium'] : ['mid-range'],
      m.date, `${m.name} - OnePlus flagship`);
  });

  // Oppo (6)
  const oppoMobiles = [
    { name: 'OPPO Find X7 Ultra', price: 1199, ram: '16GB', storage: '512GB', processor: 'Snapdragon 8 Gen 3', display: '6.82 inch', battery: '5000 mAh', date: '2024-01-08', camera: '50MP + 50MP + 50MP + 50MP' },
    { name: 'OPPO Find X6 Pro', price: 999, ram: '16GB', storage: '512GB', processor: 'Snapdragon 8 Gen 2', display: '6.82 inch', battery: '5000 mAh', date: '2023-03-21', camera: '50MP + 50MP + 50MP' },
    { name: 'OPPO Find N3', price: 1499, ram: '16GB', storage: '1TB', processor: 'Snapdragon 8 Gen 2', display: '7.82 inch', battery: '4805 mAh', date: '2023-10-19', camera: '48MP + 48MP + 64MP' },
    { name: 'OPPO Reno 11 Pro', price: 499, ram: '12GB', storage: '256GB', processor: 'MediaTek Dimensity 8200', display: '6.7 inch', battery: '4700 mAh', date: '2023-11-23', camera: '50MP + 32MP + 8MP' },
    { name: 'OPPO A98', price: 299, ram: '8GB', storage: '256GB', processor: 'Snapdragon 695', display: '6.72 inch', battery: '5000 mAh', date: '2023-05-09', camera: '64MP + 2MP + 2MP' },
    { name: 'OPPO Find X5 Pro', price: 1149, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 1', display: '6.7 inch', battery: '5000 mAh', date: '2022-03-14', camera: '50MP + 50MP + 13MP' }
  ];

  oppoMobiles.forEach(m => {
    addDevice(m.name, 'Oppo', 'mobile', {
      display: { size: m.display, resolution: '3168 x 1440', type: 'LTPO AMOLED', refreshRate: '120Hz', features: ['HDR'] },
      processor: { name: m.processor, cores: 8, speed: '3.39 GHz', architecture: '4nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: false },
      camera: { rear: m.camera, front: '32MP', video: '4K 60fps', features: ['Night Mode'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: true },
      connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.4', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'ColorOS 14',
      dimensions: { length: '164.3 mm', width: '76.2 mm', height: '9.5 mm', weight: '221 g' }
    }, [{ source: 'OPPO Store', url: 'https://oppo.com', price: m.price, currency: 'USD' }],
      m.price > 800 ? ['premium', 'photography'] : ['mid-range'],
      m.date, `${m.name} - OPPO flagship`);
  });

  // Motorola (8)
  const motorolaMobiles = [
    { name: 'Motorola Edge 40 Pro', price: 699, ram: '12GB', storage: '512GB', processor: 'Snapdragon 8 Gen 2', display: '6.67 inch', battery: '4600 mAh', date: '2023-04-04', camera: '50MP + 50MP + 12MP' },
    { name: 'Motorola Edge 40', price: 499, ram: '8GB', storage: '256GB', processor: 'MediaTek Dimensity 8020', display: '6.55 inch', battery: '4400 mAh', date: '2023-05-04', camera: '50MP + 13MP' },
    { name: 'Motorola Moto G84', price: 249, ram: '12GB', storage: '256GB', processor: 'Snapdragon 695', display: '6.5 inch', battery: '5000 mAh', date: '2023-09-01', camera: '50MP + 8MP' },
    { name: 'Motorola Edge 30 Pro', price: 749, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 1', display: '6.7 inch', battery: '4800 mAh', date: '2022-03-03', camera: '50MP + 50MP + 2MP' },
    { name: 'Motorola Moto G73', price: 229, ram: '8GB', storage: '128GB', processor: 'MediaTek Dimensity 930', display: '6.5 inch', battery: '5000 mAh', date: '2023-01-24', camera: '50MP + 8MP' },
    { name: 'Motorola Razr 40 Ultra', price: 999, ram: '12GB', storage: '512GB', processor: 'Snapdragon 8+ Gen 1', display: '6.9 inch', battery: '3800 mAh', date: '2023-06-01', camera: '12MP + 13MP' },
    { name: 'Motorola Moto G54', price: 199, ram: '8GB', storage: '128GB', processor: 'MediaTek Dimensity 7020', display: '6.5 inch', battery: '5000 mAh', date: '2023-09-05', camera: '50MP + 8MP' },
    { name: 'Motorola Edge 20 Pro', price: 649, ram: '12GB', storage: '256GB', processor: 'Snapdragon 870', display: '6.7 inch', battery: '4500 mAh', date: '2021-08-19', camera: '108MP + 16MP + 8MP' }
  ];

  motorolaMobiles.forEach(m => {
    addDevice(m.name, 'Motorola', 'mobile', {
      display: { size: m.display, resolution: '2400 x 1080', type: 'pOLED', refreshRate: '165Hz', features: ['HDR'] },
      processor: { name: m.processor, cores: 8, speed: '3.36 GHz', architecture: '4nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: m.price < 400 },
      camera: { rear: m.camera, front: '60MP', video: '8K 30fps', features: ['Night Mode'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: m.price > 600 },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'Android 13',
      dimensions: { length: '161.2 mm', width: '74.0 mm', height: '8.6 mm', weight: '199 g' }
    }, [{ source: 'Motorola Store', url: 'https://motorola.com', price: m.price, currency: 'USD' }],
      m.price > 600 ? ['premium'] : ['mid-range'],
      m.date, `${m.name} - Motorola smartphone`);
  });

  // Sony (3)
  const sonyMobiles = [
    { name: 'Sony Xperia 1 V', price: 1199, ram: '12GB', storage: '256GB', processor: 'Snapdragon 8 Gen 2', display: '6.5 inch', battery: '5000 mAh', date: '2023-05-11', camera: '48MP + 12MP + 12MP' },
    { name: 'Sony Xperia 5 V', price: 999, ram: '8GB', storage: '128GB', processor: 'Snapdragon 8 Gen 2', display: '6.1 inch', battery: '5000 mAh', date: '2023-09-01', camera: '48MP + 12MP' },
    { name: 'Sony Xperia 10 V', price: 399, ram: '6GB', storage: '128GB', processor: 'Snapdragon 695', display: '6.1 inch', battery: '5000 mAh', date: '2023-05-11', camera: '48MP + 8MP + 8MP' }
  ];

  sonyMobiles.forEach(m => {
    addDevice(m.name, 'Sony', 'mobile', {
      display: { size: m.display, resolution: '2520 x 1080', type: 'OLED', refreshRate: '120Hz', features: ['HDR'] },
      processor: { name: m.processor, cores: 8, speed: '3.36 GHz', architecture: '4nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: true },
      camera: { rear: m.camera, front: '12MP', video: '4K 120fps', features: ['Cinema Pro'] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: true },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G', '4G LTE'] },
      operatingSystem: 'Android 13',
      dimensions: { length: '165 mm', width: '71 mm', height: '8.3 mm', weight: '187 g' }
    }, [{ source: 'Sony Store', url: 'https://sony.com', price: m.price, currency: 'USD' }],
      ['premium', 'photography'],
      m.date, `${m.name} - Sony Xperia`);
  });

  // Continue with laptops, tablets, watches, headphones...
  // For brevity, I'll add key devices from each category to reach 200 total

  console.log(`Generated ${devices.length} mobile devices so far. Continuing with other categories...`);

  // LAPTOPS - 50 devices
  // Apple MacBooks (8)
  const appleLaptops = [
    { name: 'MacBook Pro 16" M3 Max', price: 3999, ram: '36GB', storage: '1TB', processor: 'M3 Max', display: '16.2 inch', date: '2023-11-07', battery: '22 hours' },
    { name: 'MacBook Pro 16" M3 Pro', price: 2499, ram: '18GB', storage: '512GB', processor: 'M3 Pro', display: '16.2 inch', date: '2023-11-07', battery: '22 hours' },
    { name: 'MacBook Pro 14" M3 Max', price: 3999, ram: '36GB', storage: '1TB', processor: 'M3 Max', display: '14.2 inch', date: '2023-11-07', battery: '18 hours' },
    { name: 'MacBook Pro 14" M3 Pro', price: 1999, ram: '18GB', storage: '512GB', processor: 'M3 Pro', display: '14.2 inch', date: '2023-11-07', battery: '18 hours' },
    { name: 'MacBook Air 15" M2', price: 1299, ram: '16GB', storage: '512GB', processor: 'M2', display: '15.3 inch', date: '2023-06-13', battery: '18 hours' },
    { name: 'MacBook Air 13" M2', price: 999, ram: '8GB', storage: '256GB', processor: 'M2', display: '13.6 inch', date: '2022-07-15', battery: '18 hours' },
    { name: 'MacBook Pro 13" M2', price: 1299, ram: '8GB', storage: '256GB', processor: 'M2', display: '13.3 inch', date: '2022-06-24', battery: '20 hours' },
    { name: 'MacBook Air M1', price: 899, ram: '8GB', storage: '256GB', processor: 'M1', display: '13.3 inch', date: '2020-11-17', battery: '18 hours' }
  ];

  appleLaptops.forEach(m => {
    addDevice(m.name, 'Apple', 'laptop', {
      display: { size: m.display, resolution: m.display.includes('16') ? '3456 x 2234' : m.display.includes('15') ? '2880 x 1864' : '2560 x 1664', type: 'Liquid Retina XDR', refreshRate: '120Hz ProMotion', features: ['P3 Wide Color', 'True Tone', 'XDR'] },
      processor: { name: m.processor, cores: m.processor.includes('Max') ? 16 : m.processor.includes('Pro') ? 12 : 8, speed: 'Up to 4.05 GHz', architecture: '3nm' },
      memory: { ram: m.ram, storage: m.storage, expandable: false },
      camera: { rear: 'N/A', front: '1080p FaceTime HD', video: '1080p', features: ['Studio Quality Mic Array'] },
      battery: { capacity: '100 Wh', fastCharge: true, wirelessCharge: false },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['MagSafe 3', 'HDMI', 'SDXC', '3x USB-C/Thunderbolt 4'], cellular: [] },
      operatingSystem: 'macOS Sonoma',
      dimensions: { length: '355.7 mm', width: '248.1 mm', height: '16.8 mm', weight: '2.15 kg' }
    }, [{ source: 'Apple Store', url: 'https://apple.com', price: m.price, currency: 'USD' }],
      ['premium', 'productivity', 'creative'],
      m.date, `${m.name} - ${m.processor} chip`);
  });

  // Continue generating more laptops, tablets, watches, and headphones to reach 200...
  // Due to response length limits, I'll create a more compact version

  // Dell Laptops (10)
  const dellLaptops = [
    { name: 'Dell XPS 15', price: 1899, ram: '16GB', storage: '512GB', processor: 'Intel Core i7-13700H', display: '15.6 inch', date: '2023-04-01' },
    { name: 'Dell XPS 13', price: 1299, ram: '16GB', storage: '512GB', processor: 'Intel Core i7-1355U', display: '13.4 inch', date: '2023-04-01' },
    { name: 'Dell XPS 17', price: 2499, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13900H', display: '17 inch', date: '2023-04-01' },
    { name: 'Dell Inspiron 15', price: 649, ram: '8GB', storage: '256GB', processor: 'Intel Core i5-1335U', display: '15.6 inch', date: '2023-05-15' },
    { name: 'Dell Inspiron 14', price: 599, ram: '8GB', storage: '256GB', processor: 'Intel Core i5-1335U', display: '14 inch', date: '2023-05-15' },
    { name: 'Dell Latitude 5520', price: 1099, ram: '16GB', storage: '512GB', processor: 'Intel Core i7-1185G7', display: '15.6 inch', date: '2022-03-01' },
    { name: 'Dell Alienware m18', price: 2999, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13900HX', display: '18 inch', date: '2023-06-01' },
    { name: 'Dell Alienware m16', price: 2499, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13900HX', display: '16 inch', date: '2023-06-01' },
    { name: 'Dell G15', price: 999, ram: '16GB', storage: '512GB', processor: 'Intel Core i7-12700H', display: '15.6 inch', date: '2023-03-01' },
    { name: 'Dell Precision 5680', price: 3499, ram: '64GB', storage: '2TB', processor: 'Intel Core i9-13950HX', display: '16 inch', date: '2023-07-01' }
  ];

  dellLaptops.forEach(m => {
    addDevice(m.name, 'Dell', 'laptop', {
      display: { size: m.display, resolution: m.display.includes('17') || m.display.includes('18') ? '3840 x 2400' : '1920 x 1080', type: 'IPS', refreshRate: '60Hz', features: [] },
      processor: { name: m.processor, cores: 14, speed: 'Up to 5.0 GHz', architecture: 'Intel 7' },
      memory: { ram: m.ram, storage: m.storage, expandable: true },
      camera: { rear: 'N/A', front: '720p HD', video: '720p', features: [] },
      battery: { capacity: '86 Wh', fastCharge: true, wirelessCharge: false },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.2', ports: ['USB-C', 'USB-A', 'HDMI', 'SD Card'], cellular: [] },
      operatingSystem: 'Windows 11',
      dimensions: { length: '344.4 mm', width: '230.1 mm', height: '18.0 mm', weight: '1.92 kg' }
    }, [{ source: 'Dell Store', url: 'https://dell.com', price: m.price, currency: 'USD' }],
      m.price > 2000 ? ['premium', 'gaming', 'creative'] : m.price > 1000 ? ['premium', 'productivity'] : ['mid-range'],
      m.date, `${m.name} - Dell laptop`);
  });

  // HP Laptops (8)
  const hpLaptops = [
    { name: 'HP Spectre x360 16', price: 1699, ram: '16GB', storage: '1TB', processor: 'Intel Core i7-13700H', display: '16 inch', date: '2023-05-01' },
    { name: 'HP Envy 17', price: 1499, ram: '16GB', storage: '512GB', processor: 'Intel Core i7-1360P', display: '17.3 inch', date: '2023-04-01' },
    { name: 'HP Pavilion Plus 14', price: 799, ram: '16GB', storage: '512GB', processor: 'Intel Core i5-1340P', display: '14 inch', date: '2023-06-01' },
    { name: 'HP Omen 17', price: 1899, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13900HX', display: '17.3 inch', date: '2023-07-01' },
    { name: 'HP ZBook Studio', price: 2499, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13950HX', display: '16 inch', date: '2023-08-01' },
    { name: 'HP EliteBook 850', price: 1399, ram: '16GB', storage: '512GB', processor: 'Intel Core i7-1365U', display: '15.6 inch', date: '2023-05-01' },
    { name: 'HP Victus 16', price: 999, ram: '16GB', storage: '512GB', processor: 'AMD Ryzen 7 7840HS', display: '16.1 inch', date: '2023-06-01' },
    { name: 'HP Stream 14', price: 299, ram: '4GB', storage: '64GB', processor: 'Intel Celeron N4020', display: '14 inch', date: '2023-03-01' }
  ];

  hpLaptops.forEach(m => {
    addDevice(m.name, 'HP', 'laptop', {
      display: { size: m.display, resolution: '1920 x 1080', type: 'IPS', refreshRate: '60Hz', features: [] },
      processor: { name: m.processor, cores: 14, speed: 'Up to 5.0 GHz', architecture: 'Intel 7' },
      memory: { ram: m.ram, storage: m.storage, expandable: true },
      camera: { rear: 'N/A', front: '720p HD', video: '720p', features: [] },
      battery: { capacity: '83 Wh', fastCharge: true, wirelessCharge: false },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C', 'USB-A', 'HDMI'], cellular: [] },
      operatingSystem: 'Windows 11',
      dimensions: { length: '360 mm', width: '250 mm', height: '20 mm', weight: '2.0 kg' }
    }, [{ source: 'HP Store', url: 'https://hp.com', price: m.price, currency: 'USD' }],
      m.price > 1500 ? ['premium', 'gaming'] : m.price > 800 ? ['mid-range'] : ['budget'],
      m.date, `${m.name} - HP laptop`);
  });

  // Lenovo Laptops (8)
  const lenovoLaptops = [
    { name: 'Lenovo ThinkPad X1 Carbon', price: 1799, ram: '16GB', storage: '512GB', processor: 'Intel Core i7-1365U', display: '14 inch', date: '2023-05-01' },
    { name: 'Lenovo ThinkPad P16', price: 2499, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13950HX', display: '16 inch', date: '2023-06-01' },
    { name: 'Lenovo Yoga 9i', price: 1599, ram: '16GB', storage: '1TB', processor: 'Intel Core i7-1360P', display: '14 inch', date: '2023-04-01' },
    { name: 'Lenovo Legion Pro 7i', price: 2299, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13900HX', display: '16 inch', date: '2023-07-01' },
    { name: 'Lenovo IdeaPad Pro 5', price: 899, ram: '16GB', storage: '512GB', processor: 'AMD Ryzen 7 7735HS', display: '16 inch', date: '2023-06-01' },
    { name: 'Lenovo ThinkBook 16p', price: 1299, ram: '16GB', storage: '512GB', processor: 'AMD Ryzen 7 6800H', display: '16 inch', date: '2023-05-01' },
    { name: 'Lenovo Legion Slim 5', price: 1099, ram: '16GB', storage: '512GB', processor: 'AMD Ryzen 7 7735HS', display: '16 inch', date: '2023-07-01' },
    { name: 'Lenovo IdeaPad 3', price: 499, ram: '8GB', storage: '256GB', processor: 'AMD Ryzen 5 5500U', display: '15.6 inch', date: '2023-04-01' }
  ];

  lenovoLaptops.forEach(m => {
    addDevice(m.name, 'Lenovo', 'laptop', {
      display: { size: m.display, resolution: '2560 x 1600', type: 'IPS', refreshRate: '60Hz', features: [] },
      processor: { name: m.processor, cores: 14, speed: 'Up to 5.0 GHz', architecture: 'Intel 7' },
      memory: { ram: m.ram, storage: m.storage, expandable: true },
      camera: { rear: 'N/A', front: '1080p', video: '1080p', features: [] },
      battery: { capacity: '80 Wh', fastCharge: true, wirelessCharge: false },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.2', ports: ['USB-C', 'USB-A', 'HDMI'], cellular: [] },
      operatingSystem: 'Windows 11',
      dimensions: { length: '356 mm', width: '250 mm', height: '18 mm', weight: '1.9 kg' }
    }, [{ source: 'Lenovo Store', url: 'https://lenovo.com', price: m.price, currency: 'USD' }],
      m.price > 1500 ? ['premium', 'productivity'] : ['mid-range'],
      m.date, `${m.name} - Lenovo laptop`);
  });

  // Asus Laptops (8)
  const asusLaptops = [
    { name: 'Asus ROG Zephyrus G16', price: 1999, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13900H', display: '16 inch', date: '2023-06-01' },
    { name: 'Asus ZenBook Pro 16X', price: 2499, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13905H', display: '16 inch', date: '2023-05-01' },
    { name: 'Asus ROG Strix G18', price: 2299, ram: '32GB', storage: '2TB', processor: 'Intel Core i9-13980HX', display: '18 inch', date: '2023-07-01' },
    { name: 'Asus VivoBook Pro 16', price: 999, ram: '16GB', storage: '512GB', processor: 'AMD Ryzen 7 7735HS', display: '16 inch', date: '2023-05-01' },
    { name: 'Asus TUF Gaming A15', price: 1199, ram: '16GB', storage: '512GB', processor: 'AMD Ryzen 7 7735HS', display: '15.6 inch', date: '2023-06-01' },
    { name: 'Asus ZenBook 14', price: 899, ram: '16GB', storage: '512GB', processor: 'AMD Ryzen 7 7735U', display: '14 inch', date: '2023-04-01' },
    { name: 'Asus ExpertBook B9', price: 1699, ram: '32GB', storage: '1TB', processor: 'Intel Core i7-1365U', display: '14 inch', date: '2023-05-01' },
    { name: 'Asus Chromebook Flip', price: 399, ram: '8GB', storage: '128GB', processor: 'MediaTek Kompanio 520', display: '14 inch', date: '2023-03-01' }
  ];

  asusLaptops.forEach(m => {
    addDevice(m.name, 'Asus', 'laptop', {
      display: { size: m.display, resolution: '2560 x 1600', type: 'IPS', refreshRate: m.name.includes('ROG') ? '240Hz' : '60Hz', features: [] },
      processor: { name: m.processor, cores: 14, speed: 'Up to 5.4 GHz', architecture: 'Intel 7' },
      memory: { ram: m.ram, storage: m.storage, expandable: true },
      camera: { rear: 'N/A', front: '720p', video: '720p', features: [] },
      battery: { capacity: '90 Wh', fastCharge: true, wirelessCharge: false },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.2', ports: ['USB-C', 'USB-A', 'HDMI'], cellular: [] },
      operatingSystem: m.name.includes('Chromebook') ? 'Chrome OS' : 'Windows 11',
      dimensions: { length: '355 mm', width: '243 mm', height: '20 mm', weight: '2.0 kg' }
    }, [{ source: 'Asus Store', url: 'https://asus.com', price: m.price, currency: 'USD' }],
      m.price > 1500 ? ['premium', 'gaming'] : ['mid-range'],
      m.date, `${m.name} - Asus laptop`);
  });

  // MSI Laptops (8)
  const msiLaptops = [
    { name: 'MSI Titan GT77 HX', price: 4999, ram: '64GB', storage: '2TB', processor: 'Intel Core i9-13980HX', display: '17.3 inch', date: '2023-06-01' },
    { name: 'MSI Raider GE78 HX', price: 3499, ram: '32GB', storage: '2TB', processor: 'Intel Core i9-13980HX', display: '17 inch', date: '2023-07-01' },
    { name: 'MSI Stealth 16 Studio', price: 2299, ram: '32GB', storage: '1TB', processor: 'Intel Core i9-13900H', display: '16 inch', date: '2023-06-01' },
    { name: 'MSI Katana 15', price: 1299, ram: '16GB', storage: '512GB', processor: 'Intel Core i7-13620H', display: '15.6 inch', date: '2023-05-01' },
    { name: 'MSI Creator Z17', price: 2999, ram: '32GB', storage: '2TB', processor: 'Intel Core i9-12900H', display: '17 inch', date: '2023-04-01' },
    { name: 'MSI Prestige 16', price: 1599, ram: '32GB', storage: '1TB', processor: 'Intel Core i7-13700H', display: '16 inch', date: '2023-05-01' },
    { name: 'MSI Cyborg 15', price: 999, ram: '16GB', storage: '512GB', processor: 'Intel Core i5-12450H', display: '15.6 inch', date: '2023-04-01' },
    { name: 'MSI Modern 15', price: 699, ram: '8GB', storage: '256GB', processor: 'Intel Core i5-1235U', display: '15.6 inch', date: '2023-03-01' }
  ];

  msiLaptops.forEach(m => {
    addDevice(m.name, 'MSI', 'laptop', {
      display: { size: m.display, resolution: '2560 x 1440', type: 'IPS', refreshRate: '240Hz', features: [] },
      processor: { name: m.processor, cores: 24, speed: 'Up to 5.6 GHz', architecture: 'Intel 7' },
      memory: { ram: m.ram, storage: m.storage, expandable: true },
      camera: { rear: 'N/A', front: '1080p', video: '1080p', features: [] },
      battery: { capacity: '99.9 Wh', fastCharge: true, wirelessCharge: false },
      connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C', 'USB-A', 'HDMI', 'Mini DisplayPort'], cellular: [] },
      operatingSystem: 'Windows 11',
      dimensions: { length: '397 mm', width: '284 mm', height: '23 mm', weight: '2.9 kg' }
    }, [{ source: 'MSI Store', url: 'https://msi.com', price: m.price, currency: 'USD' }],
      m.price > 2000 ? ['premium', 'gaming', 'creative'] : ['mid-range', 'gaming'],
      m.date, `${m.name} - MSI laptop`);
  });

  // TABLETS - 20 devices
  const tablets = [
    { name: 'iPad Pro 12.9" M2', brand: 'Apple', price: 1099, storage: '128GB', display: '12.9 inch', date: '2022-10-26' },
    { name: 'iPad Pro 11" M2', brand: 'Apple', price: 799, storage: '128GB', display: '11 inch', date: '2022-10-26' },
    { name: 'iPad Air M2', brand: 'Apple', price: 599, storage: '64GB', display: '10.9 inch', date: '2023-03-08' },
    { name: 'iPad 10th Gen', brand: 'Apple', price: 449, storage: '64GB', display: '10.9 inch', date: '2022-10-26' },
    { name: 'iPad Mini', brand: 'Apple', price: 499, storage: '64GB', display: '8.3 inch', date: '2021-09-24' },
    { name: 'Samsung Galaxy Tab S9 Ultra', brand: 'Samsung', price: 1199, storage: '256GB', display: '14.6 inch', date: '2023-08-03' },
    { name: 'Samsung Galaxy Tab S9+', brand: 'Samsung', price: 899, storage: '256GB', display: '12.4 inch', date: '2023-08-03' },
    { name: 'Samsung Galaxy Tab S9', brand: 'Samsung', price: 799, storage: '128GB', display: '11 inch', date: '2023-08-03' },
    { name: 'Samsung Galaxy Tab S8', brand: 'Samsung', price: 699, storage: '128GB', display: '11 inch', date: '2022-02-25' },
    { name: 'Samsung Galaxy Tab A9+', brand: 'Samsung', price: 249, storage: '64GB', display: '11 inch', date: '2023-10-05' },
    { name: 'Google Pixel Tablet', brand: 'Google', price: 499, storage: '128GB', display: '10.95 inch', date: '2023-06-20' },
    { name: 'Xiaomi Pad 6 Pro', brand: 'Xiaomi', price: 499, storage: '128GB', display: '11 inch', date: '2023-04-18' },
    { name: 'Xiaomi Pad 6', brand: 'Xiaomi', price: 349, storage: '128GB', display: '11 inch', date: '2023-04-18' },
    { name: 'Lenovo Tab P12 Pro', brand: 'Lenovo', price: 599, storage: '256GB', display: '12.6 inch', date: '2023-05-01' },
    { name: 'Lenovo Tab M10 Plus', brand: 'Lenovo', price: 199, storage: '64GB', display: '10.3 inch', date: '2023-03-01' },
    { name: 'OnePlus Pad', brand: 'OnePlus', price: 479, storage: '128GB', display: '11.61 inch', date: '2023-04-28' },
    { name: 'Realme Pad 2', brand: 'Realme', price: 299, storage: '128GB', display: '11.5 inch', date: '2023-07-06' },
    { name: 'Oppo Pad Air', brand: 'Oppo', price: 249, storage: '64GB', display: '10.36 inch', date: '2023-05-23' },
    { name: 'Motorola Tab G70', brand: 'Motorola', price: 199, storage: '64GB', display: '10.4 inch', date: '2023-02-01' },
    { name: 'Amazon Fire Max 11', brand: 'Amazon', price: 229, storage: '64GB', display: '11 inch', date: '2023-05-24' }
  ];

  tablets.forEach(m => {
    addDevice(m.name, m.brand, 'tablet', {
      display: { size: m.display, resolution: '2732 x 2048', type: 'IPS LCD', refreshRate: '120Hz', features: [] },
      processor: { name: 'Various', cores: 8, speed: '2.4 GHz', architecture: 'Various' },
      memory: { ram: '8GB', storage: m.storage, expandable: m.brand !== 'Apple' },
      camera: { rear: '12MP', front: '12MP', video: '4K', features: [] },
      battery: { capacity: '40 Wh', fastCharge: true, wirelessCharge: false },
      connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.2', ports: ['USB-C'], cellular: ['5G (optional)'] },
      operatingSystem: m.brand === 'Apple' ? 'iPadOS 17' : 'Android 13',
      dimensions: { length: '280.6 mm', width: '214.9 mm', height: '6.4 mm', weight: '682 g' }
    }, [{ source: `${m.brand} Store`, url: `https://${m.brand.toLowerCase()}.com`, price: m.price, currency: 'USD' }],
      m.price > 700 ? ['premium'] : ['mid-range'],
      m.date, `${m.name} - ${m.brand} tablet`);
  });

  // SMARTWATCHES - 20 devices
  const watches = [
    { name: 'Apple Watch Series 9', brand: 'Apple', price: 399, size: '45mm', date: '2023-09-22' },
    { name: 'Apple Watch Ultra 2', brand: 'Apple', price: 799, size: '49mm', date: '2023-09-22' },
    { name: 'Apple Watch SE', brand: 'Apple', price: 249, size: '44mm', date: '2023-09-22' },
    { name: 'Samsung Galaxy Watch 6 Classic', brand: 'Samsung', price: 369, size: '47mm', date: '2023-08-11' },
    { name: 'Samsung Galaxy Watch 6', brand: 'Samsung', price: 299, size: '44mm', date: '2023-08-11' },
    { name: 'Google Pixel Watch 2', brand: 'Google', price: 349, size: '41mm', date: '2023-10-12' },
    { name: 'OnePlus Watch 2', brand: 'OnePlus', price: 299, size: '46mm', date: '2024-02-26' },
    { name: 'Xiaomi Watch S3', brand: 'Xiaomi', price: 199, size: '47mm', date: '2024-02-25' },
    { name: 'Garmin Fenix 7', brand: 'Garmin', price: 699, size: '47mm', date: '2022-01-18' },
    { name: 'Garmin Forerunner 965', brand: 'Garmin', price: 599, size: '47mm', date: '2023-03-01' },
    { name: 'Fitbit Versa 4', brand: 'Fitbit', price: 199, size: '40mm', date: '2022-09-21' },
    { name: 'Fitbit Charge 6', brand: 'Fitbit', price: 159, size: 'N/A', date: '2023-09-28' },
    { name: 'Amazfit GTR 4', brand: 'Amazfit', price: 199, size: '46mm', date: '2022-09-05' },
    { name: 'Amazfit Bip 5', brand: 'Amazfit', price: 79, size: '45mm', date: '2023-05-15' },
    { name: 'Fossil Gen 6', brand: 'Fossil', price: 249, size: '44mm', date: '2021-09-27' },
    { name: 'TicWatch Pro 5', brand: 'Mobvoi', price: 349, size: '48mm', date: '2023-05-24' },
    { name: 'Huawei Watch GT 4', brand: 'Huawei', price: 249, size: '46mm', date: '2023-09-25' },
    { name: 'Xiaomi Watch 2 Pro', brand: 'Xiaomi', price: 179, size: '47mm', date: '2023-10-31' },
    { name: 'Realme Watch 3 Pro', brand: 'Realme', price: 99, size: '42mm', date: '2023-07-06' },
    { name: 'OPPO Watch 3', brand: 'Oppo', price: 229, size: '43mm', date: '2023-08-10' }
  ];

  watches.forEach(m => {
    addDevice(m.name, m.brand, 'smartwatch', {
      display: { size: m.size, resolution: '450 x 450', type: 'AMOLED', refreshRate: '60Hz', features: ['Always-On Display'] },
      processor: { name: 'Various', cores: 2, speed: '1.4 GHz', architecture: 'Various' },
      memory: { ram: '2GB', storage: '32GB', expandable: false },
      camera: { rear: 'N/A', front: 'N/A', video: 'N/A', features: [] },
      battery: { capacity: '500 mAh', fastCharge: true, wirelessCharge: true },
      connectivity: { wifi: 'Wi-Fi', bluetooth: '5.3', ports: ['Wireless Charging'], cellular: ['LTE (optional)'] },
      operatingSystem: m.brand === 'Apple' ? 'watchOS 10' : 'Wear OS',
      dimensions: { length: m.size, width: m.size, height: '12 mm', weight: '45 g' }
    }, [{ source: `${m.brand} Store`, url: `https://${m.brand.toLowerCase()}.com`, price: m.price, currency: 'USD' }],
      m.price > 400 ? ['premium'] : ['mid-range'],
      m.date, `${m.name} - ${m.brand} smartwatch`);
  });

  // HEADPHONES/EARBUDS - 20 devices
  const headphones = [
    { name: 'AirPods Pro 2', brand: 'Apple', price: 249, type: 'TWS', date: '2022-09-23', battery: '6 hours' },
    { name: 'AirPods 3', brand: 'Apple', price: 179, type: 'TWS', date: '2021-10-26', battery: '6 hours' },
    { name: 'AirPods Max', brand: 'Apple', price: 549, type: 'Over-ear', date: '2020-12-15', battery: '20 hours' },
    { name: 'Samsung Galaxy Buds2 Pro', brand: 'Samsung', price: 229, type: 'TWS', date: '2022-08-26', battery: '8 hours' },
    { name: 'Samsung Galaxy Buds FE', brand: 'Samsung', price: 99, type: 'TWS', date: '2023-10-05', battery: '6 hours' },
    { name: 'Google Pixel Buds Pro', brand: 'Google', price: 199, type: 'TWS', date: '2022-07-28', battery: '11 hours' },
    { name: 'Sony WH-1000XM5', brand: 'Sony', price: 399, type: 'Over-ear', date: '2022-05-19', battery: '30 hours' },
    { name: 'Sony WF-1000XM5', brand: 'Sony', price: 299, type: 'TWS', date: '2023-07-24', battery: '8 hours' },
    { name: 'Bose QuietComfort Earbuds II', brand: 'Bose', price: 279, type: 'TWS', date: '2022-09-15', battery: '6 hours' },
    { name: 'Bose QuietComfort 45', brand: 'Bose', price: 329, type: 'Over-ear', date: '2021-09-23', battery: '24 hours' },
    { name: 'OnePlus Buds Pro 2', brand: 'OnePlus', price: 179, type: 'TWS', date: '2023-02-07', battery: '9 hours' },
    { name: 'Xiaomi Buds 4 Pro', brand: 'Xiaomi', price: 129, type: 'TWS', date: '2023-10-31', battery: '9 hours' },
    { name: 'Realme Buds Air 5 Pro', brand: 'Realme', price: 69, type: 'TWS', date: '2023-07-06', battery: '10 hours' },
    { name: 'OPPO Enco X2', brand: 'Oppo', price: 149, type: 'TWS', date: '2022-03-24', battery: '9.5 hours' },
    { name: 'Jabra Elite 10', brand: 'Jabra', price: 249, type: 'TWS', date: '2023-09-01', battery: '6 hours' },
    { name: 'Sennheiser Momentum 4', brand: 'Sennheiser', price: 349, type: 'Over-ear', date: '2022-08-15', battery: '60 hours' },
    { name: 'Anker Soundcore Liberty 4', brand: 'Anker', price: 99, type: 'TWS', date: '2022-10-17', battery: '9 hours' },
    { name: 'Beats Fit Pro', brand: 'Beats', price: 199, type: 'TWS', date: '2021-11-01', battery: '6 hours' },
    { name: 'Nothing Ear 2', brand: 'Nothing', price: 149, type: 'TWS', date: '2023-03-22', battery: '6 hours' },
    { name: 'Motorola VerveBuds 125', brand: 'Motorola', price: 49, type: 'TWS', date: '2023-05-01', battery: '6 hours' }
  ];

  headphones.forEach(m => {
    addDevice(m.name, m.brand, 'headphones', {
      display: { size: 'N/A', resolution: 'N/A', type: 'N/A', refreshRate: 'N/A', features: [] },
      processor: { name: 'Audio Chip', cores: 1, speed: 'N/A', architecture: 'N/A' },
      memory: { ram: 'N/A', storage: 'N/A', expandable: false },
      camera: { rear: 'N/A', front: 'N/A', video: 'N/A', features: [] },
      battery: { capacity: m.battery, fastCharge: true, wirelessCharge: true },
      connectivity: { wifi: 'N/A', bluetooth: '5.3', ports: ['USB-C'], cellular: [] },
      operatingSystem: 'N/A',
      dimensions: { length: 'N/A', width: 'N/A', height: 'N/A', weight: '5 g' }
    }, [{ source: `${m.brand} Store`, url: `https://${m.brand.toLowerCase()}.com`, price: m.price, currency: 'USD' }],
      m.price > 250 ? ['premium', 'audio'] : ['mid-range'],
      m.date, `${m.name} - ${m.brand} ${m.type} headphones`);
  });

  // Add 4 more devices to reach exactly 200
  addDevice('iPhone 13 Pro', 'Apple', 'mobile', {
    display: { size: '6.1 inch', resolution: '2532 x 1170', type: 'Super Retina XDR OLED', refreshRate: '120Hz ProMotion', features: ['HDR', 'True Tone'] },
    processor: { name: 'A15 Bionic', cores: 6, speed: '3.23 GHz', architecture: '5nm' },
    memory: { ram: '6GB', storage: '128GB', expandable: false },
    camera: { rear: '12MP + 12MP + 12MP', front: '12MP', video: '4K 60fps', features: ['Night Mode', 'Portrait Mode'] },
    battery: { capacity: '3095 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.0', ports: ['Lightning'], cellular: ['5G', '4G LTE'] },
    operatingSystem: 'iOS 15',
    dimensions: { length: '146.7 mm', width: '71.5 mm', height: '7.65 mm', weight: '203 g' }
  }, [{ source: 'Apple Store', url: 'https://apple.com', price: 799, currency: 'USD' }],
    ['premium'], '2021-09-24', 'iPhone 13 Pro with A15 Bionic chip');

  addDevice('Samsung Galaxy A14', 'Samsung', 'mobile', {
    display: { size: '6.6 inch', resolution: '2408 x 1080', type: 'PLS LCD', refreshRate: '90Hz', features: [] },
    processor: { name: 'MediaTek Helio G80', cores: 8, speed: '2.0 GHz', architecture: '12nm' },
    memory: { ram: '4GB', storage: '64GB', expandable: true },
    camera: { rear: '50MP + 2MP + 2MP', front: '13MP', video: '1080p 30fps', features: [] },
    battery: { capacity: '5000 mAh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 5', bluetooth: '5.2', ports: ['USB-C'], cellular: ['4G LTE'] },
    operatingSystem: 'Android 13',
    dimensions: { length: '167.7 mm', width: '78.0 mm', height: '9.1 mm', weight: '201 g' }
  }, [{ source: 'Samsung Store', url: 'https://samsung.com', price: 149, currency: 'USD' }],
    ['budget'], '2023-03-28', 'Samsung Galaxy A14 budget smartphone');

  addDevice('Dell Inspiron 16', 'Dell', 'laptop', {
    display: { size: '16 inch', resolution: '1920 x 1200', type: 'IPS', refreshRate: '60Hz', features: [] },
    processor: { name: 'Intel Core i5-1335U', cores: 10, speed: 'Up to 4.6 GHz', architecture: 'Intel 7' },
    memory: { ram: '8GB', storage: '512GB', expandable: true },
    camera: { rear: 'N/A', front: '720p HD', video: '720p', features: [] },
    battery: { capacity: '54 Wh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.1', ports: ['USB-C', 'USB-A', 'HDMI', '3.5mm'], cellular: [] },
    operatingSystem: 'Windows 11',
    dimensions: { length: '356.78 mm', width: '251.9 mm', height: '18.99 mm', weight: '1.87 kg' }
  }, [{ source: 'Dell Store', url: 'https://dell.com', price: 699, currency: 'USD' }],
    ['mid-range', 'productivity'], '2023-06-15', 'Dell Inspiron 16 laptop');

  addDevice('HP Pavilion 15', 'HP', 'laptop', {
    display: { size: '15.6 inch', resolution: '1920 x 1080', type: 'IPS', refreshRate: '60Hz', features: [] },
    processor: { name: 'AMD Ryzen 5 5625U', cores: 6, speed: 'Up to 4.3 GHz', architecture: '7nm' },
    memory: { ram: '8GB', storage: '256GB', expandable: true },
    camera: { rear: 'N/A', front: '720p HD', video: '720p', features: [] },
    battery: { capacity: '41 Wh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.2', ports: ['USB-C', 'USB-A', 'HDMI'], cellular: [] },
    operatingSystem: 'Windows 11',
    dimensions: { length: '360.2 mm', width: '234.0 mm', height: '19.9 mm', weight: '1.75 kg' }
  }, [{ source: 'HP Store', url: 'https://hp.com', price: 549, currency: 'USD' }],
    ['budget', 'productivity'], '2023-04-20', 'HP Pavilion 15 laptop');

  return devices.slice(0, 200); // Ensure exactly 200 devices
};

module.exports = { generateDevice, generateAllDevices, mobileTemplates };
