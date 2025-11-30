const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Device = require('../models/Device');
const Review = require('../models/Review');
const User = require('../models/User');
const sentimentService = require('../services/SentimentService');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DESCRIPTION_TEMPLATES = {
    mobile: (name, brand) => `The ${name} by ${brand} is a flagship smartphone that redefines the mobile experience. With its stunning display and powerful processor, it handles multitasking and gaming with ease. The camera system captures breathtaking photos and videos in any lighting condition. Designed with premium materials, it feels as good as it looks. Battery life is exceptional, lasting all day on a single charge. Whether you're a professional or a casual user, this device offers the perfect blend of performance and style. Experience the future of mobile technology with the ${name}.`,
    laptop: (name, brand) => `Unleash your productivity with the ${name} from ${brand}. This laptop is engineered for performance, featuring a high-speed processor and ample RAM to handle demanding applications. The display offers vibrant colors and sharp details, making it perfect for creative work and entertainment. Its sleek and lightweight design ensures portability without compromising on power. With a long-lasting battery and a comfortable keyboard, you can work efficiently from anywhere. The ${name} is the ultimate tool for professionals and students alike.`,
    tablet: (name, brand) => `The ${name} by ${brand} is a versatile tablet that adapts to your lifestyle. Its immersive display is perfect for streaming movies, reading books, and browsing the web. Powered by a fast processor, it delivers smooth performance for apps and games. The lightweight design makes it easy to carry, while the long battery life keeps you connected all day. With support for a stylus and keyboard, it transforms into a creative canvas or a productivity station. Discover new possibilities with the ${name}.`,
    default: (name, brand) => `Discover the ${name} by ${brand}, a device designed to elevate your tech experience. It combines cutting-edge technology with a sleek design, offering superior performance and reliability. Whether you're using it for work or play, it delivers exceptional results. The intuitive interface and robust features make it a joy to use. Built to last, the ${name} is a testament to ${brand}'s commitment to quality and innovation. Upgrade your daily routine with this outstanding device.`
};

const REVIEW_TEMPLATES = [
    { text: "I've been using this for a week and I'm blown away by the performance. It's incredibly fast and handles everything I throw at it. The build quality is top-notch.", rating: 5 },
    { text: "Great device overall. The screen is beautiful and the battery lasts a long time. My only complaint is that it gets a bit warm during heavy use.", rating: 4 },
    { text: "It's a decent product for the price. Does what it says, but don't expect flagship performance. Good for basic tasks.", rating: 3 },
    { text: "I'm really impressed with the camera quality. The photos are sharp and vibrant. Highly recommend it for photography enthusiasts!", rating: 5 },
    { text: "The design is sleek and modern. It fits perfectly in my hand. However, the software could use some polish.", rating: 4 },
    { text: "Battery life is amazing! I can go two days without charging. Performance is smooth and I haven't experienced any lag.", rating: 5 },
    { text: "Not bad, but there are better options in this price range. The display is a bit dim outdoors.", rating: 3 },
    { text: "Absolutely love it! The features are exactly what I needed. It has improved my workflow significantly.", rating: 5 },
    { text: "Solid build and good performance. A bit heavy, but that makes it feel durable. Worth the money.", rating: 4 },
    { text: "The user interface is very intuitive. Setup was a breeze. I'm very happy with this purchase.", rating: 5 }
];

async function enrichData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pickmytech');
        console.log('Connected!');

        // Get a user to attribute reviews to (or create one)
        let user = await User.findOne();
        if (!user) {
            console.log('No users found. Creating a dummy user...');
            user = await User.create({
                name: 'Tech Enthusiast',
                email: 'reviewer@example.com',
                password: 'password123',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reviewer'
            });
        }

        const devices = await Device.find({});
        console.log(`Found ${devices.length} devices to process.`);

        for (const device of devices) {
            console.log(`Processing ${device.name}...`);

            // 1. Enrich Description
            const wordCount = (device.description || '').split(/\s+/).length;
            if (wordCount < 50) {
                console.log(`  - Updating description (current: ${wordCount} words)`);
                const template = DESCRIPTION_TEMPLATES[device.category?.toLowerCase()] || DESCRIPTION_TEMPLATES.default;
                const newDesc = template(device.name, device.brand);
                device.description = newDesc;
                await device.save();
            }

            // 2. Generate Reviews
            const currentReviewCount = await Review.countDocuments({ device: device._id });
            if (currentReviewCount < 10) {
                const needed = 10 - currentReviewCount;
                console.log(`  - Generating ${needed} reviews...`);

                for (let i = 0; i < needed; i++) {
                    const template = REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)];

                    // Analyze sentiment
                    const sentiment = await sentimentService.analyzeSentiment(template.text);
                    const { pros, cons } = await sentimentService.extractProsCons(template.text);

                    await Review.create({
                        user: user._id,
                        device: device._id,
                        rating: template.rating,
                        content: template.text,
                        sentimentScore: sentiment.score,
                        sentimentLabel: sentiment.label,
                        pros,
                        cons,
                        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random date in past
                    });
                }

                // Update Device stats
                const stats = await Review.aggregate([
                    { $match: { device: device._id } },
                    {
                        $group: {
                            _id: '$device',
                            avgRating: { $avg: '$rating' },
                            count: { $sum: 1 }
                        }
                    }
                ]);

                if (stats.length > 0) {
                    device.averageRating = stats[0].avgRating;
                    device.reviewCount = stats[0].count;
                    await device.save();
                }
            }
        }

        console.log('Data enrichment complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error enriching data:', error);
        process.exit(1);
    }
}

enrichData();
