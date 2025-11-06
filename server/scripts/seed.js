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

const newsItems = [
  {
    title: 'Apple Announces New AI Features in iOS 18',
    description: 'Apple introduces groundbreaking AI capabilities that will revolutionize iPhone usage.',
    content: 'Apple has announced revolutionary AI features coming to iOS 18...',
    url: 'https://example.com/news/apple-ai',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    source: 'Tech News',
    author: 'Tech Reporter',
    publishedAt: new Date(),
    category: 'mobile',
    tags: ['Apple', 'iOS', 'AI'],
    featured: true
  },
  {
    title: 'New Gaming Laptops Dominate CES 2024',
    description: 'Latest gaming laptops with RTX 4090 and advanced cooling systems unveiled.',
    content: 'CES 2024 showcased the most powerful gaming laptops ever created...',
    url: 'https://example.com/news/gaming-laptops',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
    source: 'Gaming Tech',
    author: 'Gaming Editor',
    publishedAt: new Date(),
    category: 'laptop',
    tags: ['Gaming', 'Laptops', 'CES'],
    featured: true
  },
  {
    title: 'Samsung Galaxy S24 Ultra Camera Review',
    description: 'In-depth review of the 200MP camera system in Samsung\'s latest flagship.',
    content: 'The Samsung Galaxy S24 Ultra features an impressive 200MP camera...',
    url: 'https://example.com/news/samsung-camera',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
    source: 'Camera Reviews',
    author: 'Photo Expert',
    publishedAt: new Date(),
    category: 'mobile',
    tags: ['Samsung', 'Camera', 'Review'],
    featured: false
  }
];

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

    // Seed devices
    const insertedDevices = await Device.insertMany(devices);
    console.log(`✓ Seeded ${devices.length} devices`);

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

