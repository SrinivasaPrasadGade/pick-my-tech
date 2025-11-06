// Device generation helper - generates realistic device data
const generateDevice = (name, brand, category, specs, prices, tags, releaseDate, imageUrl) => {
  return {
    name,
    brand,
    category,
    model: `${brand.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 10000)}`,
    image: imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 900000) + 100000}?w=800`,
    images: [
      imageUrl || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 900000) + 100000}?w=800`,
      `https://images.unsplash.com/photo-${Math.floor(Math.random() * 900000) + 100000}?w=800`
    ],
    description: `${name} - ${specs.description}`,
    specifications: specs,
    prices: prices.map(p => ({
      ...p,
      lastUpdated: new Date()
    })),
    tags,
    releaseDate: new Date(releaseDate),
    averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
    reviewCount: Math.floor(Math.random() * 500) + 50
  };
};

// Mobile phones
const mobileDevices = [
  // Apple
  generateDevice('iPhone 15 Pro Max', 'Apple', 'mobile', {
    display: { size: '6.7 inch', resolution: '2796 x 1290', type: 'Super Retina XDR OLED', refreshRate: '120Hz ProMotion' },
    processor: { name: 'A17 Pro', cores: 6, speed: '3.78 GHz', architecture: '3nm' },
    memory: { ram: '8GB', storage: '256GB', expandable: false },
    camera: { rear: '48MP + 12MP + 12MP', front: '12MP', video: '4K 60fps' },
    battery: { capacity: '4441 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'iOS 17',
    dimensions: { length: '159.9 mm', width: '76.7 mm', height: '8.25 mm', weight: '221 g' }
  }, [{ source: 'Apple Store', url: 'https://apple.com', price: 1199, currency: 'USD' }], ['premium', 'photography'], '2023-09-22'),
  
  generateDevice('iPhone 15', 'Apple', 'mobile', {
    display: { size: '6.1 inch', resolution: '2556 x 1179', type: 'Super Retina XDR OLED', refreshRate: '60Hz' },
    processor: { name: 'A16 Bionic', cores: 6, speed: '3.46 GHz', architecture: '4nm' },
    memory: { ram: '6GB', storage: '128GB', expandable: false },
    camera: { rear: '48MP + 12MP', front: '12MP', video: '4K 60fps' },
    battery: { capacity: '3349 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'iOS 17',
    dimensions: { length: '147.6 mm', width: '71.6 mm', height: '7.80 mm', weight: '171 g' }
  }, [{ source: 'Apple Store', url: 'https://apple.com', price: 799, currency: 'USD' }], ['premium'], '2023-09-22'),

  generateDevice('iPhone 14 Pro', 'Apple', 'mobile', {
    display: { size: '6.1 inch', resolution: '2556 x 1179', type: 'Super Retina XDR OLED', refreshRate: '120Hz ProMotion' },
    processor: { name: 'A16 Bionic', cores: 6, speed: '3.46 GHz', architecture: '4nm' },
    memory: { ram: '6GB', storage: '128GB', expandable: false },
    camera: { rear: '48MP + 12MP + 12MP', front: '12MP', video: '4K 60fps' },
    battery: { capacity: '3200 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['Lightning'], cellular: ['5G'] },
    operatingSystem: 'iOS 16',
    dimensions: { length: '147.5 mm', width: '71.5 mm', height: '7.85 mm', weight: '206 g' }
  }, [{ source: 'Apple Store', url: 'https://apple.com', price: 899, currency: 'USD' }], ['premium'], '2022-09-16'),

  // Samsung
  generateDevice('Samsung Galaxy S24', 'Samsung', 'mobile', {
    display: { size: '6.2 inch', resolution: '2340 x 1080', type: 'Dynamic AMOLED 2X', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 8 Gen 3', cores: 8, speed: '3.39 GHz', architecture: '4nm' },
    memory: { ram: '8GB', storage: '128GB', expandable: true },
    camera: { rear: '50MP + 12MP + 10MP', front: '12MP', video: '8K 30fps' },
    battery: { capacity: '4000 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 14',
    dimensions: { length: '147.0 mm', width: '70.6 mm', height: '7.6 mm', weight: '167 g' }
  }, [{ source: 'Samsung Store', url: 'https://samsung.com', price: 799, currency: 'USD' }], ['premium'], '2024-01-24'),

  generateDevice('Samsung Galaxy S24+', 'Samsung', 'mobile', {
    display: { size: '6.7 inch', resolution: '3120 x 1440', type: 'Dynamic AMOLED 2X', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 8 Gen 3', cores: 8, speed: '3.39 GHz', architecture: '4nm' },
    memory: { ram: '12GB', storage: '256GB', expandable: true },
    camera: { rear: '50MP + 12MP + 10MP', front: '12MP', video: '8K 30fps' },
    battery: { capacity: '4900 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 14',
    dimensions: { length: '158.5 mm', width: '75.9 mm', height: '7.7 mm', weight: '196 g' }
  }, [{ source: 'Samsung Store', url: 'https://samsung.com', price: 999, currency: 'USD' }], ['premium'], '2024-01-24'),

  generateDevice('Samsung Galaxy S23', 'Samsung', 'mobile', {
    display: { size: '6.1 inch', resolution: '2340 x 1080', type: 'Dynamic AMOLED 2X', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 8 Gen 2', cores: 8, speed: '3.36 GHz', architecture: '4nm' },
    memory: { ram: '8GB', storage: '128GB', expandable: true },
    camera: { rear: '50MP + 12MP + 10MP', front: '12MP', video: '8K 30fps' },
    battery: { capacity: '3900 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 13',
    dimensions: { length: '146.3 mm', width: '70.9 mm', height: '7.6 mm', weight: '168 g' }
  }, [{ source: 'Samsung Store', url: 'https://samsung.com', price: 699, currency: 'USD' }], ['premium'], '2023-02-17'),

  generateDevice('Samsung Galaxy A54', 'Samsung', 'mobile', {
    display: { size: '6.4 inch', resolution: '2340 x 1080', type: 'Super AMOLED', refreshRate: '120Hz' },
    processor: { name: 'Exynos 1380', cores: 8, speed: '2.4 GHz', architecture: '5nm' },
    memory: { ram: '6GB', storage: '128GB', expandable: true },
    camera: { rear: '50MP + 12MP + 5MP', front: '32MP', video: '4K 30fps' },
    battery: { capacity: '5000 mAh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 13',
    dimensions: { length: '158.2 mm', width: '76.7 mm', height: '8.2 mm', weight: '202 g' }
  }, [{ source: 'Samsung Store', url: 'https://samsung.com', price: 449, currency: 'USD' }], ['mid-range'], '2023-03-24'),

  // Google
  generateDevice('Google Pixel 8 Pro', 'Google', 'mobile', {
    display: { size: '6.7 inch', resolution: '2992 x 1344', type: 'LTPO OLED', refreshRate: '120Hz' },
    processor: { name: 'Google Tensor G3', cores: 9, speed: '2.91 GHz', architecture: '4nm' },
    memory: { ram: '12GB', storage: '128GB', expandable: false },
    camera: { rear: '50MP + 48MP + 48MP', front: '10.5MP', video: '4K 60fps' },
    battery: { capacity: '5050 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 14',
    dimensions: { length: '162.6 mm', width: '76.5 mm', height: '8.8 mm', weight: '213 g' }
  }, [{ source: 'Google Store', url: 'https://store.google.com', price: 999, currency: 'USD' }], ['premium', 'photography'], '2023-10-12'),

  generateDevice('Google Pixel 8', 'Google', 'mobile', {
    display: { size: '6.2 inch', resolution: '2400 x 1080', type: 'OLED', refreshRate: '120Hz' },
    processor: { name: 'Google Tensor G3', cores: 9, speed: '2.91 GHz', architecture: '4nm' },
    memory: { ram: '8GB', storage: '128GB', expandable: false },
    camera: { rear: '50MP + 12MP', front: '10.5MP', video: '4K 60fps' },
    battery: { capacity: '4575 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 14',
    dimensions: { length: '150.5 mm', width: '70.8 mm', height: '8.9 mm', weight: '187 g' }
  }, [{ source: 'Google Store', url: 'https://store.google.com', price: 699, currency: 'USD' }], ['premium'], '2023-10-12'),

  generateDevice('Google Pixel 7a', 'Google', 'mobile', {
    display: { size: '6.1 inch', resolution: '2400 x 1080', type: 'OLED', refreshRate: '90Hz' },
    processor: { name: 'Google Tensor G2', cores: 8, speed: '2.85 GHz', architecture: '5nm' },
    memory: { ram: '8GB', storage: '128GB', expandable: false },
    camera: { rear: '64MP + 13MP', front: '13MP', video: '4K 60fps' },
    battery: { capacity: '4385 mAh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 6E', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 13',
    dimensions: { length: '152.4 mm', width: '72.9 mm', height: '9.0 mm', weight: '193.5 g' }
  }, [{ source: 'Google Store', url: 'https://store.google.com', price: 499, currency: 'USD' }], ['mid-range'], '2023-05-11'),

  // Xiaomi/Redmi/Poco
  generateDevice('Xiaomi 14 Pro', 'Xiaomi', 'mobile', {
    display: { size: '6.73 inch', resolution: '3200 x 1440', type: 'AMOLED', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 8 Gen 3', cores: 8, speed: '3.39 GHz', architecture: '4nm' },
    memory: { ram: '12GB', storage: '512GB', expandable: false },
    camera: { rear: '50MP + 50MP + 50MP', front: '32MP', video: '8K 24fps' },
    battery: { capacity: '4880 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.4', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'MIUI 15',
    dimensions: { length: '161.4 mm', width: '75.3 mm', height: '8.5 mm', weight: '223 g' }
  }, [{ source: 'Xiaomi Store', url: 'https://mi.com', price: 899, currency: 'USD' }], ['premium', 'gaming'], '2024-01-01'),

  generateDevice('Redmi Note 13 Pro', 'Redmi', 'mobile', {
    display: { size: '6.67 inch', resolution: '2400 x 1080', type: 'AMOLED', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 7s Gen 2', cores: 8, speed: '2.4 GHz', architecture: '4nm' },
    memory: { ram: '8GB', storage: '256GB', expandable: true },
    camera: { rear: '200MP + 8MP + 2MP', front: '16MP', video: '4K 30fps' },
    battery: { capacity: '5100 mAh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.2', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'MIUI 14',
    dimensions: { length: '161.1 mm', width: '75.0 mm', height: '8.0 mm', weight: '187 g' }
  }, [{ source: 'Xiaomi Store', url: 'https://mi.com', price: 349, currency: 'USD' }], ['budget', 'photography'], '2024-01-15'),

  generateDevice('POCO X6 Pro', 'Poco', 'mobile', {
    display: { size: '6.67 inch', resolution: '2712 x 1220', type: 'AMOLED', refreshRate: '120Hz' },
    processor: { name: 'MediaTek Dimensity 8300 Ultra', cores: 8, speed: '3.35 GHz', architecture: '4nm' },
    memory: { ram: '12GB', storage: '512GB', expandable: false },
    camera: { rear: '64MP + 8MP + 2MP', front: '16MP', video: '4K 30fps' },
    battery: { capacity: '5000 mAh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.4', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'MIUI 14',
    dimensions: { length: '160.5 mm', width: '74.3 mm', height: '8.3 mm', weight: '199 g' }
  }, [{ source: 'Poco Store', url: 'https://pocophone.net', price: 299, currency: 'USD' }], ['budget', 'gaming'], '2024-01-11'),

  // Realme
  generateDevice('Realme GT 5 Pro', 'Realme', 'mobile', {
    display: { size: '6.78 inch', resolution: '2780 x 1264', type: 'AMOLED', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 8 Gen 3', cores: 8, speed: '3.39 GHz', architecture: '4nm' },
    memory: { ram: '16GB', storage: '1TB', expandable: false },
    camera: { rear: '50MP + 8MP + 2MP', front: '32MP', video: '4K 60fps' },
    battery: { capacity: '5400 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.4', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Realme UI 5.0',
    dimensions: { length: '161.7 mm', width: '75.1 mm', height: '9.2 mm', weight: '218 g' }
  }, [{ source: 'Realme Store', url: 'https://realme.com', price: 599, currency: 'USD' }], ['premium', 'gaming'], '2023-12-07'),

  generateDevice('Realme 12 Pro+', 'Realme', 'mobile', {
    display: { size: '6.7 inch', resolution: '2412 x 1080', type: 'AMOLED', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 7s Gen 2', cores: 8, speed: '2.4 GHz', architecture: '4nm' },
    memory: { ram: '12GB', storage: '512GB', expandable: true },
    camera: { rear: '50MP + 64MP + 8MP', front: '32MP', video: '4K 30fps' },
    battery: { capacity: '5000 mAh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.2', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Realme UI 5.0',
    dimensions: { length: '161.5 mm', width: '74.0 mm', height: '8.7 mm', weight: '196 g' }
  }, [{ source: 'Realme Store', url: 'https://realme.com', price: 399, currency: 'USD' }], ['mid-range'], '2024-01-29'),

  // OnePlus
  generateDevice('OnePlus 12', 'OnePlus', 'mobile', {
    display: { size: '6.82 inch', resolution: '3168 x 1440', type: 'LTPO AMOLED', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 8 Gen 3', cores: 8, speed: '3.39 GHz', architecture: '4nm' },
    memory: { ram: '16GB', storage: '512GB', expandable: false },
    camera: { rear: '50MP + 64MP + 48MP', front: '32MP', video: '8K 24fps' },
    battery: { capacity: '5400 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.4', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'OxygenOS 14',
    dimensions: { length: '164.3 mm', width: '75.8 mm', height: '9.2 mm', weight: '220 g' }
  }, [{ source: 'OnePlus Store', url: 'https://oneplus.com', price: 799, currency: 'USD' }], ['premium'], '2024-01-23'),

  generateDevice('OnePlus Nord 3', 'OnePlus', 'mobile', {
    display: { size: '6.74 inch', resolution: '2772 x 1240', type: 'AMOLED', refreshRate: '120Hz' },
    processor: { name: 'MediaTek Dimensity 9000', cores: 8, speed: '3.05 GHz', architecture: '4nm' },
    memory: { ram: '16GB', storage: '256GB', expandable: false },
    camera: { rear: '50MP + 8MP + 2MP', front: '16MP', video: '4K 30fps' },
    battery: { capacity: '5000 mAh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 6', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'OxygenOS 13',
    dimensions: { length: '162.9 mm', width: '75.1 mm', height: '8.2 mm', weight: '193.5 g' }
  }, [{ source: 'OnePlus Store', url: 'https://oneplus.com', price: 449, currency: 'USD' }], ['mid-range'], '2023-07-05'),

  // Oppo
  generateDevice('OPPO Find X7 Ultra', 'Oppo', 'mobile', {
    display: { size: '6.82 inch', resolution: '3168 x 1440', type: 'LTPO AMOLED', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 8 Gen 3', cores: 8, speed: '3.39 GHz', architecture: '4nm' },
    memory: { ram: '16GB', storage: '512GB', expandable: false },
    camera: { rear: '50MP + 50MP + 50MP + 50MP', front: '32MP', video: '4K 60fps' },
    battery: { capacity: '5000 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.4', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'ColorOS 14',
    dimensions: { length: '164.3 mm', width: '76.2 mm', height: '9.5 mm', weight: '221 g' }
  }, [{ source: 'OPPO Store', url: 'https://oppo.com', price: 1199, currency: 'USD' }], ['premium', 'photography'], '2024-01-08'),

  // Motorola
  generateDevice('Motorola Edge 40 Pro', 'Motorola', 'mobile', {
    display: { size: '6.67 inch', resolution: '2400 x 1080', type: 'pOLED', refreshRate: '165Hz' },
    processor: { name: 'Snapdragon 8 Gen 2', cores: 8, speed: '3.36 GHz', architecture: '4nm' },
    memory: { ram: '12GB', storage: '512GB', expandable: false },
    camera: { rear: '50MP + 50MP + 12MP', front: '60MP', video: '8K 30fps' },
    battery: { capacity: '4600 mAh', fastCharge: true, wirelessCharge: true },
    connectivity: { wifi: 'Wi-Fi 7', bluetooth: '5.3', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 13',
    dimensions: { length: '161.2 mm', width: '74.0 mm', height: '8.6 mm', weight: '199 g' }
  }, [{ source: 'Motorola Store', url: 'https://motorola.com', price: 699, currency: 'USD' }], ['premium'], '2023-04-04'),

  generateDevice('Motorola Moto G84', 'Motorola', 'mobile', {
    display: { size: '6.5 inch', resolution: '2400 x 1080', type: 'pOLED', refreshRate: '120Hz' },
    processor: { name: 'Snapdragon 695', cores: 8, speed: '2.2 GHz', architecture: '6nm' },
    memory: { ram: '12GB', storage: '256GB', expandable: true },
    camera: { rear: '50MP + 8MP', front: '16MP', video: '1080p 60fps' },
    battery: { capacity: '5000 mAh', fastCharge: true, wirelessCharge: false },
    connectivity: { wifi: 'Wi-Fi 5', bluetooth: '5.1', ports: ['USB-C'], cellular: ['5G'] },
    operatingSystem: 'Android 13',
    dimensions: { length: '160.0 mm', width: '74.4 mm', height: '7.6 mm', weight: '168.8 g' }
  }, [{ source: 'Motorola Store', url: 'https://motorola.com', price: 249, currency: 'USD' }], ['budget'], '2023-09-01'),
];

module.exports = { generateDevice, mobileDevices };
