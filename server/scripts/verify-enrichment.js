const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Device = require('../models/Device');
const Review = require('../models/Review');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function verifyData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pickmytech');

        const deviceCount = await Device.countDocuments();
        console.log(`Total Devices: ${deviceCount}`);

        // Check a random device
        const randomDevice = await Device.findOne().skip(Math.floor(Math.random() * deviceCount));
        console.log(`\nChecking Device: ${randomDevice.name}`);
        console.log(`Description Length: ${randomDevice.description.split(/\s+/).length} words`);
        console.log(`Description: ${randomDevice.description.substring(0, 100)}...`);

        const reviewCount = await Review.countDocuments({ device: randomDevice._id });
        console.log(`Review Count: ${reviewCount}`);

        if (reviewCount > 0) {
            const review = await Review.findOne({ device: randomDevice._id });
            console.log(`Sample Review Sentiment: ${review.sentimentLabel} (${review.sentimentScore})`);
            console.log(`Pros: ${review.pros.join(', ')}`);
            console.log(`Cons: ${review.cons.join(', ')}`);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

verifyData();
