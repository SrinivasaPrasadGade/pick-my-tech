const { pipeline } = require('@xenova/transformers');

class SentimentService {
    constructor() {
        this.pipeline = null;
        this.initPromise = this.init();
    }

    async init() {
        if (this.pipeline) return;
        console.log('Initializing Sentiment Analysis Pipeline...');
        try {
            // Use a smaller, faster model suitable for CPU
            this.pipeline = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
            console.log('Sentiment Analysis Pipeline Ready');
        } catch (error) {
            console.error('Failed to initialize sentiment pipeline:', error);
        }
    }

    async analyzeSentiment(text) {
        await this.initPromise;
        if (!this.pipeline) {
            throw new Error('Sentiment pipeline not initialized');
        }

        try {
            // Truncate text if too long to avoid token limit issues (simple approach)
            const truncatedText = text.slice(0, 512);
            const result = await this.pipeline(truncatedText);
            // result is like [{ label: 'POSITIVE', score: 0.99 }]
            return result[0];
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            return { label: 'NEUTRAL', score: 0.5 };
        }
    }

    async extractProsCons(text) {
        await this.initPromise;
        if (!this.pipeline) {
            return { pros: [], cons: [] };
        }

        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
        const pros = [];
        const cons = [];

        for (const sentence of sentences) {
            const trimmed = sentence.trim();
            if (trimmed.length < 5) continue;

            try {
                const result = await this.pipeline(trimmed);
                const { label, score } = result[0];

                if (score > 0.7) {
                    if (label === 'POSITIVE') {
                        pros.push(trimmed);
                    } else if (label === 'NEGATIVE') {
                        cons.push(trimmed);
                    }
                }
            } catch (err) {
                // Ignore errors for individual sentences
            }
        }

        return { pros, cons };
    }
}

module.exports = new SentimentService();
