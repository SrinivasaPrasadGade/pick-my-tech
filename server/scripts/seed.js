const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Device = require('../models/Device');
const News = require('../models/News');
const Community = require('../models/Community');
const User = require('../models/User');
const { generateAllDevices } = require('./deviceGenerator');
const { generateCommunityPosts } = require('./generateCommunity');

dotenv.config();

// Generate all 200 devices
const devices = generateAllDevices();

// Keep original seed devices for reference (optional - you can remove this if you want)
const originalDevices = [
  {
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'mobile',
    model: 'A3101',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
    ],
    description: 'The most advanced iPhone ever with A17 Pro chip and titanium design.',
    specifications: {
      display: {
        size: '6.1 inch',
        resolution: '2556 x 1179',
        type: 'Super Retina XDR OLED',
        refreshRate: '120Hz ProMotion',
        features: ['Always-On Display', 'HDR', 'True Tone']
      },
      processor: {
        name: 'A17 Pro',
        cores: 6,
        speed: '3.78 GHz',
        architecture: '3nm'
      },
      memory: {
        ram: '8GB',
        storage: '128GB',
        expandable: false
      },
      camera: {
        rear: '48MP + 12MP + 12MP',
        front: '12MP',
        video: '4K 60fps',
        features: ['Night Mode', 'Portrait Mode', 'ProRAW']
      },
      battery: {
        capacity: '3274 mAh',
        fastCharge: true,
        wirelessCharge: true
      },
      connectivity: {
        wifi: 'Wi-Fi 6E',
        bluetooth: '5.3',
        ports: ['USB-C'],
        cellular: ['5G', '4G LTE']
      },
      operatingSystem: 'iOS 17',
      dimensions: {
        length: '159.9 mm',
        width: '76.7 mm',
        height: '8.25 mm',
        weight: '187 g'
      },
      additionalFeatures: ['Face ID', 'MagSafe', 'Water Resistant IP68']
    },
    prices: [
      {
        source: 'Apple Store',
        url: 'https://apple.com',
        price: 999,
        currency: 'USD',
        lastUpdated: new Date()
      },
      {
        source: 'Amazon',
        url: 'https://amazon.com',
        price: 949,
        currency: 'USD',
        lastUpdated: new Date()
      }
    ],
    tags: ['premium', 'gaming', 'photography', 'productivity'],
    releaseDate: new Date('2023-09-22')
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'mobile',
    model: 'SM-S928B',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
    description: 'Ultimate Android flagship with S Pen and 200MP camera.',
    specifications: {
      display: {
        size: '6.8 inch',
        resolution: '3120 x 1440',
        type: 'Dynamic AMOLED 2X',
        refreshRate: '120Hz',
        features: ['Always-On Display', 'HDR10+']
      },
      processor: {
        name: 'Snapdragon 8 Gen 3',
        cores: 8,
        speed: '3.39 GHz',
        architecture: '4nm'
      },
      memory: {
        ram: '12GB',
        storage: '256GB',
        expandable: true
      },
      camera: {
        rear: '200MP + 50MP + 12MP + 10MP',
        front: '12MP',
        video: '8K 30fps',
        features: ['100x Space Zoom', 'Night Mode', 'Pro Mode']
      },
      battery: {
        capacity: '5000 mAh',
        fastCharge: true,
        wirelessCharge: true
      },
      connectivity: {
        wifi: 'Wi-Fi 7',
        bluetooth: '5.3',
        ports: ['USB-C'],
        cellular: ['5G', '4G LTE']
      },
      operatingSystem: 'Android 14',
      dimensions: {
        length: '162.3 mm',
        width: '79.0 mm',
        height: '8.6 mm',
        weight: '233 g'
      },
      additionalFeatures: ['S Pen', 'Under-Display Fingerprint', 'Water Resistant IP68']
    },
    prices: [
      {
        source: 'Samsung Store',
        url: 'https://samsung.com',
        price: 1199,
        currency: 'USD',
        lastUpdated: new Date()
      }
    ],
    tags: ['premium', 'gaming', 'photography', 'productivity', 'stylus'],
    releaseDate: new Date('2024-01-24')
  },
  {
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    category: 'laptop',
    model: 'M3 Pro',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
    description: 'Powerful laptop for professionals with M3 Pro chip.',
    specifications: {
      display: {
        size: '16.2 inch',
        resolution: '3456 x 2234',
        type: 'Liquid Retina XDR',
        refreshRate: '120Hz ProMotion',
        features: ['P3 Wide Color', 'True Tone', 'XDR']
      },
      processor: {
        name: 'M3 Pro',
        cores: 12,
        speed: 'Up to 4.05 GHz',
        architecture: '3nm'
      },
      memory: {
        ram: '18GB',
        storage: '512GB SSD',
        expandable: false
      },
      camera: {
        rear: 'N/A',
        front: '1080p FaceTime HD',
        video: '1080p',
        features: ['Studio Quality Mic Array']
      },
      battery: {
        capacity: '100 Wh',
        fastCharge: true,
        wirelessCharge: false
      },
      connectivity: {
        wifi: 'Wi-Fi 6E',
        bluetooth: '5.3',
        ports: ['MagSafe 3', 'HDMI', 'SDXC', '3x USB-C/Thunderbolt 4', '3.5mm Headphone'],
        cellular: []
      },
      operatingSystem: 'macOS Sonoma',
      dimensions: {
        length: '355.7 mm',
        width: '248.1 mm',
        height: '16.8 mm',
        weight: '2.15 kg'
      },
      additionalFeatures: ['Touch ID', 'Force Touch Trackpad', 'Six-speaker Sound System']
    },
    prices: [
      {
        source: 'Apple Store',
        url: 'https://apple.com',
        price: 2499,
        currency: 'USD',
        lastUpdated: new Date()
      }
    ],
    tags: ['premium', 'productivity', 'creative', 'gaming'],
    releaseDate: new Date('2023-11-07')
  },
  {
    name: 'Dell XPS 15',
    brand: 'Dell',
    category: 'laptop',
    model: '9530',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    description: 'Premium Windows laptop for creators and professionals.',
    specifications: {
      display: {
        size: '15.6 inch',
        resolution: '3840 x 2400',
        type: 'OLED Touch',
        refreshRate: '60Hz',
        features: ['100% DCI-P3', 'HDR', 'Touch']
      },
      processor: {
        name: 'Intel Core i7-13700H',
        cores: 14,
        speed: 'Up to 5.0 GHz',
        architecture: 'Intel 7'
      },
      memory: {
        ram: '16GB',
        storage: '512GB SSD',
        expandable: true
      },
      camera: {
        rear: 'N/A',
        front: '720p HD',
        video: '720p',
        features: ['Temporal Noise Reduction']
      },
      battery: {
        capacity: '86 Wh',
        fastCharge: true,
        wirelessCharge: false
      },
      connectivity: {
        wifi: 'Wi-Fi 6E',
        bluetooth: '5.2',
        ports: ['2x Thunderbolt 4', '1x USB-C', 'SD Card Reader', '3.5mm Headphone'],
        cellular: []
      },
      operatingSystem: 'Windows 11',
      dimensions: {
        length: '344.4 mm',
        width: '230.1 mm',
        height: '18.0 mm',
        weight: '1.92 kg'
      },
      additionalFeatures: ['Fingerprint Reader', 'Backlit Keyboard']
    },
    prices: [
      {
        source: 'Dell Store',
        url: 'https://dell.com',
        price: 1899,
        currency: 'USD',
        lastUpdated: new Date()
      }
    ],
    tags: ['premium', 'productivity', 'creative'],
    releaseDate: new Date('2023-04-01')
  },
  {
    name: 'iPad Pro 12.9"',
    brand: 'Apple',
    category: 'tablet',
    model: 'M2',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
    description: 'Most powerful iPad ever with M2 chip.',
    specifications: {
      display: {
        size: '12.9 inch',
        resolution: '2732 x 2048',
        type: 'Liquid Retina XDR',
        refreshRate: '120Hz ProMotion',
        features: ['P3 Wide Color', 'True Tone']
      },
      processor: {
        name: 'M2',
        cores: 8,
        speed: 'Up to 3.49 GHz',
        architecture: '5nm'
      },
      memory: {
        ram: '8GB',
        storage: '128GB',
        expandable: false
      },
      camera: {
        rear: '12MP + 10MP',
        front: '12MP Ultra Wide',
        video: '4K 60fps',
        features: ['LiDAR Scanner', 'ProRAW']
      },
      battery: {
        capacity: '40.88 Wh',
        fastCharge: true,
        wirelessCharge: false
      },
      connectivity: {
        wifi: 'Wi-Fi 6E',
        bluetooth: '5.3',
        ports: ['USB-C/Thunderbolt'],
        cellular: ['5G (optional)']
      },
      operatingSystem: 'iPadOS 17',
      dimensions: {
        length: '280.6 mm',
        width: '214.9 mm',
        height: '6.4 mm',
        weight: '682 g'
      },
      additionalFeatures: ['Face ID', 'Apple Pencil Support', 'Magic Keyboard Support']
    },
    prices: [
      {
        source: 'Apple Store',
        url: 'https://apple.com',
        price: 1099,
        currency: 'USD',
        lastUpdated: new Date()
      }
    ],
    tags: ['premium', 'productivity', 'creative'],
    releaseDate: new Date('2022-10-26')
  }
]; // End of original devices array - now using generated devices from deviceGenerator.js

// Helper to generate news items
const generateNewsItems = () => {
  const categories = ['mobile', 'laptop', 'tablet', 'smartwatch', 'general', 'reviews', 'rumors'];
  const news = [];

  const templates = {
    mobile: [
      { t: 'iPhone 16 Pro Leaks: Bigger Battery', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800' },
      { t: 'Samsung Galaxy S25 Ultra Concepts', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800' },
      { t: 'Pixel 9 Pro Camera Samples', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff70?w=800' },
      { t: 'OnePlus 13 Fast Charging', img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800' },
      { t: 'Xiaomi 15 Ultra Global Launch', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800' },
      { t: 'Nothing Phone (3) Design Reveal', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800' }
    ],
    laptop: [
      { t: 'MacBook Pro M4 Performance', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800' },
      { t: 'Dell XPS 15 2025 Refresh', img: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800' },
      { t: 'Lenovo ThinkPad X1 Carbon Gen 13', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800' },
      { t: 'Asus ROG Zephyrus G14 Review', img: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800' },
      { t: 'HP Spectre x360 14 OLED', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800' },
      { t: 'Framework Laptop 16 Updates', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800' }
    ],
    tablet: [
      { t: 'iPad Pro OLED Long Term Review', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' },
      { t: 'Samsung Galaxy Tab S10 Ultra Leaks', img: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800' },
      { t: 'Pixel Tablet 2 with Keyboard', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' },
      { t: 'iPad Mini 7 Release Date', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' },
      { t: 'OnePlus Pad 2 Specs', img: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800' },
      { t: 'Amazon Fire Max 11 Review', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' }
    ],
    smartwatch: [
      { t: 'Apple Watch Series 10 Redesign', img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800' },
      { t: 'Samsung Galaxy Watch 7 Pro Battery', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800' },
      { t: 'Garmin Fenix 8 Solar Features', img: 'https://images.unsplash.com/photo-1551817958-c1b0c0f36961?w=800' },
      { t: 'Pixel Watch 3 Sizes', img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800' },
      { t: 'Fitbit Charge 7 Rumors', img: 'https://images.unsplash.com/photo-1551817958-c1b0c0f36961?w=800' },
      { t: 'Whoop 5.0 Expectations', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800' }
    ],
    general: [
      { t: 'OpenAI GPT-5 Release Timeline', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800' },
      { t: 'NVIDIA RTX 5090 Specs Leaked', img: 'https://images.unsplash.com/photo-1558002038-1091a1661116?w=800' },
      { t: 'Windows 12 AI Features', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800' },
      { t: 'Tesla Robotaxi Event Recap', img: 'https://images.unsplash.com/photo-1558002038-1091a1661116?w=800' },
      { t: 'SpaceX Starship Launch Success', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800' },
      { t: 'Matter Smart Home Update', img: 'https://images.unsplash.com/photo-1558002038-1091a1661116?w=800' }
    ],
    reviews: [
      { t: 'Sony WH-1000XM6 Review', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800' },
      { t: 'Bose QuietComfort Ultra Review', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800' },
      { t: 'Sonos Ace Headphones Review', img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800' },
      { t: 'Kindle Paperwhite 2024 Review', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' },
      { t: 'Logitech MX Master 3S Review', img: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=800' },
      { t: 'Steam Deck OLED Review', img: 'https://images.unsplash.com/photo-1612287230217-969b698cb8d1?w=800' }
    ],
    rumors: [
      { t: 'Nintendo Switch 2 Specs Leak', img: 'https://images.unsplash.com/photo-1612287230217-969b698cb8d1?w=800' },
      { t: 'PS5 Pro Release Date', img: 'https://images.unsplash.com/photo-1612287230217-969b698cb8d1?w=800' },
      { t: 'Xbox Handheld Console Rumors', img: 'https://images.unsplash.com/photo-1612287230217-969b698cb8d1?w=800' },
      { t: 'Apple Foldable iPhone Plans', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800' },
      { t: 'Samsung Rollable Phone Demo', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800' },
      { t: 'Apple Smart Ring Patents', img: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800' }
    ]
  };

  categories.forEach(category => {
    // Ensure at least 12 items per category
    for (let i = 0; i < 12; i++) {
      const template = templates[category][i % templates[category].length];
      const dateOffset = Math.floor(Math.random() * 30); // Random date within last 30 days

      news.push({
        title: i < 6 ? template.t : `${template.t} - Update ${i - 5}`,
        description: `Latest updates and news regarding ${template.t}. This article covers everything you need to know about the recent developments, specs, and release information.`,
        content: `Full detailed coverage of ${template.t}. We dive deep into the specifications, features, and what this means for the industry.`,
        url: 'https://techcrunch.com',
        imageUrl: template.img,
        source: ['The Verge', 'TechCrunch', 'Engadget', 'MacRumors', '9to5Google'][Math.floor(Math.random() * 5)],
        author: 'Tech Reporter',
        publishedAt: new Date(Date.now() - dateOffset * 86400000),
        category: category,
        tags: [category, 'Tech', 'News'],
        featured: i === 0 // First item of each category is featured
      });
    }
  });

  return news;
};

const newsItems = generateNewsItems();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pickmytech');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Device.deleteMany({});
    await News.deleteMany({});
    await Community.deleteMany({});

    // Create or get a test user for community posts
    let testUser = await User.findOne({ email: 'community@test.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Community User',
        email: 'community@test.com',
        password: 'testpassword123',
        provider: 'local'
      });
      console.log('Created test user for community posts');
    }

    // Shuffle devices to ensure a mix of categories in the default view
    const shuffledDevices = [...devices].sort(() => Math.random() - 0.5);

    // Seed devices
    const insertedDevices = await Device.insertMany(shuffledDevices);
    console.log(`✓ Seeded ${shuffledDevices.length} devices`);

    // Seed news
    await News.insertMany(newsItems);
    console.log(`✓ Seeded ${newsItems.length} news items`);

    // Seed community posts (100+)
    const deviceIds = insertedDevices.map(d => d._id);
    const communityPosts = generateCommunityPosts(testUser._id, deviceIds);
    await Community.insertMany(communityPosts);
    console.log(`✓ Seeded ${communityPosts.length} community discussion posts`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`   - ${devices.length} devices across ${[...new Set(devices.map(d => d.category))].length} categories`);
    console.log(`   - ${newsItems.length} news items`);
    console.log(`   - ${communityPosts.length} community posts`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

