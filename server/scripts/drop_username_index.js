const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dropIndex = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const collection = mongoose.connection.collection('users');

        console.log('Listing indexes...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        const usernameIndex = indexes.find(idx => idx.name === 'username_1');

        if (usernameIndex) {
            console.log('Found username_1 index. Dropping it...');
            await collection.dropIndex('username_1');
            console.log('✅ Successfully dropped username_1 index.');
        } else {
            console.log('username_1 index not found. It might have been already removed.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit();
    }
};

dropIndex();
