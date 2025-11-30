const mongoose = require('mongoose');
const Device = require('../models/Device');
require('dotenv').config();

const fetchHeadphone = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const device = await Device.findOne({ category: 'headphones' });
        if (device) {
            console.log(`HEADPHONE_ID: ${device._id}`);
        } else {
            console.log('No headphones found');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fetchHeadphone();
