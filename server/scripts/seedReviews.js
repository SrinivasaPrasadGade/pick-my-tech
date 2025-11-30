const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Device = require('../models/Device');
const Review = require('../models/Review');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MOCK_USERS = [
    { name: 'Alex Chen', email: 'alex.chen@example.com' },
    { name: 'Sarah Jones', email: 'sarah.j@example.com' },
    { name: 'Mike Ross', email: 'mike.ross@example.com' },
    { name: 'Emily Blunt', email: 'emily.b@example.com' },
    { name: 'David Kim', email: 'david.kim@example.com' },
    { name: 'Jessica Lee', email: 'jessica.lee@example.com' },
    { name: 'Tom Holland', email: 'tom.h@example.com' },
    { name: 'Chris Evans', email: 'chris.e@example.com' },
    { name: 'Natalie Portman', email: 'natalie.p@example.com' },
    { name: 'Robert Downey', email: 'robert.d@example.com' },
    { name: 'Scarlett Johansson', email: 'scarlett.j@example.com' },
    { name: 'Mark Ruffalo', email: 'mark.r@example.com' },
    { name: 'Chris Hemsworth', email: 'chris.h@example.com' },
    { name: 'Jeremy Renner', email: 'jeremy.r@example.com' },
    { name: 'Elizabeth Olsen', email: 'elizabeth.o@example.com' }
];

const POSITIVE_TEMPLATES = [
    "Absolutely love this device! The performance is top-notch and the battery life is incredible.",
    "Best purchase I've made this year. The screen is beautiful and it's so fast.",
    "Exceeded my expectations. The camera quality is stunning, especially in low light.",
    "Great value for money. It handles everything I throw at it without breaking a sweat.",
    "Sleek design and powerful internals. Highly recommend to anyone looking for an upgrade.",
    "The build quality is premium and it feels great in the hand. Very satisfied.",
    "Fast, reliable, and looks amazing. What more could you ask for?",
    "I'm impressed by how smooth the interface is. A joy to use every day.",
    "Perfect for my needs. Gaming is smooth and productivity apps run like a breeze.",
    "Battery lasts all day even with heavy usage. A solid 5-star device."
];

const MIXED_TEMPLATES = [
    "It's a good device, but there are some minor annoyances with the software.",
    "Great hardware, but the battery life could be better.",
    "Decent performance for the price, but the camera is just average.",
    "I like the design, but it gets a bit warm during heavy gaming.",
    "Good overall, but I wish it had more storage options.",
    "Solid phone, but the charging speed is a bit slow compared to competitors.",
    "Nice screen, but the speakers are a bit tinny.",
    "Works well, but I've encountered a few bugs here and there.",
    "Good value, but the build materials feel a bit cheap.",
    "Okay for daily tasks, but struggles with intensive apps."
];

const NEGATIVE_TEMPLATES = [
    "Disappointed with the battery life. Barely makes it through half a day.",
    "Overpriced for what you get. There are better options out there.",
    "The camera is really poor in low light. Not what I expected.",
    "Software is buggy and crashes frequently. Needs an update ASAP.",
    "Build quality is subpar. It feels fragile and cheap.",
    "Overheats way too easily. I can't recommend this.",
    "Customer support was unhelpful when I had issues. Frustrating experience.",
    "Too much bloatware pre-installed. Slows down the system.",
    "The screen isn't as bright as advertised. Hard to see outdoors.",
    "Regret buying this. Should have gone with the other brand."
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateReviewContent = (rating) => {
    let content = '';
    let sentimentLabel = 'NEUTRAL';
    let sentimentScore = 0.5;
    let pros = [];
    let cons = [];

    if (rating >= 4) {
        content = getRandomElement(POSITIVE_TEMPLATES);
        sentimentLabel = 'POSITIVE';
        sentimentScore = 0.8 + (Math.random() * 0.19);
        pros = ['Great performance', 'Excellent battery', 'Good value'];
    } else if (rating === 3) {
        content = getRandomElement(MIXED_TEMPLATES);
        sentimentLabel = 'NEUTRAL';
        sentimentScore = 0.4 + (Math.random() * 0.2);
        pros = ['Decent price'];
        cons = ['Average battery'];
    } else {
        content = getRandomElement(NEGATIVE_TEMPLATES);
        sentimentLabel = 'NEGATIVE';
        sentimentScore = 0.1 + (Math.random() * 0.3);
        cons = ['Poor battery', 'Overheating', 'Buggy software'];
    }

    // Add some random variation to content
    if (Math.random() > 0.5) {
        content += " " + (rating >= 4 ? "Definitely worth it!" : "Hope they fix these issues.");
    }

    return { content, sentimentLabel, sentimentScore, pros, cons };
};

const seedReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Ensure Users Exist
        const users = [];
        for (const mockUser of MOCK_USERS) {
            let user = await User.findOne({ email: mockUser.email });
            if (!user) {
                user = await User.create({
                    ...mockUser,
                    password: 'password123', // Dummy password
                    provider: 'local'
                });
                console.log(`Created user: ${user.name}`);
            }
            users.push(user);
        }

        // 2. Get All Devices
        const devices = await Device.find({});
        console.log(`Found ${devices.length} devices.`);

        for (const device of devices) {
            const currentReviewCount = await Review.countDocuments({ device: device._id });
            const targetCount = 10;

            if (currentReviewCount < targetCount) {
                const reviewsNeeded = targetCount - currentReviewCount;
                console.log(`Device ${device.name} needs ${reviewsNeeded} more reviews.`);

                for (let i = 0; i < reviewsNeeded; i++) {
                    const randomUser = getRandomElement(users);

                    // Generate weighted rating (mostly positive for "good" products)
                    const rand = Math.random();
                    let rating;
                    if (rand < 0.6) rating = 5;
                    else if (rand < 0.85) rating = 4;
                    else if (rand < 0.95) rating = 3;
                    else rating = 2;

                    const { content, sentimentLabel, sentimentScore, pros, cons } = generateReviewContent(rating);

                    await Review.create({
                        user: randomUser._id,
                        device: device._id,
                        rating,
                        content,
                        sentimentLabel,
                        sentimentScore,
                        pros,
                        cons,
                        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) // Random past date
                    });
                }
            }

            // Recalculate stats
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
                await Device.findByIdAndUpdate(device._id, {
                    averageRating: stats[0].avgRating,
                    reviewCount: stats[0].count
                });
                console.log(`Updated stats for ${device.name}: ${stats[0].avgRating.toFixed(1)} stars (${stats[0].count} reviews)`);
            }
        }

        console.log('Review seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding reviews:', error);
        process.exit(1);
    }
};

seedReviews();
