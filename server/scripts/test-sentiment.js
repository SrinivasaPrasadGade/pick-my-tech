const sentimentService = require('../services/SentimentService');

async function testSentiment() {
    console.log('Testing Sentiment Service...');

    const testCases = [
        "I absolutely love this phone! The camera is amazing.",
        "The battery life is terrible and the screen is dim.",
        "It's okay, not the best but good for the price.",
        "Great display but the charging is slow."
    ];

    for (const text of testCases) {
        console.log(`\nAnalyzing: "${text}"`);
        const sentiment = await sentimentService.analyzeSentiment(text);
        console.log('Sentiment:', sentiment);

        const prosCons = await sentimentService.extractProsCons(text);
        console.log('Pros/Cons:', prosCons);
    }
}

testSentiment();
