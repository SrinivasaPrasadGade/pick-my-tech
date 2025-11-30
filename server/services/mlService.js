const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

let model = null;

// Load the model
const loadModel = async () => {
    if (model) return model;
    console.log('Loading TensorFlow model...');
    try {
        model = await use.load();
        console.log('TensorFlow model loaded successfully');
        return model;
    } catch (error) {
        console.error('Error loading TensorFlow model:', error);
        throw error;
    }
};

// Generate embeddings for an array of strings
const getEmbeddings = async (texts) => {
    const m = await loadModel();
    const embeddings = await m.embed(texts);
    return embeddings;
};

// Calculate cosine similarity between two vectors
const calculateSimilarity = (a, b) => {
    const dotProduct = tf.tidy(() => {
        const aTensor = tf.tensor1d(a);
        const bTensor = tf.tensor1d(b);
        return aTensor.dot(bTensor).dataSync()[0];
    });

    // Assuming normalized vectors from USE, dot product is cosine similarity
    return dotProduct;
};

// Calculate similarity between a query embedding and multiple item embeddings
const findTopMatches = async (queryText, items, itemTextCallback) => {
    const m = await loadModel();

    // Get embedding for query
    const queryEmbeddingTensor = await m.embed([queryText]);
    const queryEmbedding = queryEmbeddingTensor.arraySync()[0];
    queryEmbeddingTensor.dispose();

    // Prepare item texts
    const itemTexts = items.map(itemTextCallback);

    // Get embeddings for items (batch process)
    // For large datasets, we might need to batch this, but for <1000 items it's fine
    const itemEmbeddingsTensor = await m.embed(itemTexts);
    const itemEmbeddings = itemEmbeddingsTensor.arraySync();
    itemEmbeddingsTensor.dispose();

    // Calculate scores
    const scoredItems = items.map((item, index) => {
        // Manual dot product for performance (vectors are already normalized by USE)
        let dot = 0;
        for (let i = 0; i < queryEmbedding.length; i++) {
            dot += queryEmbedding[i] * itemEmbeddings[index][i];
        }
        return { item, score: dot };
    });

    // Sort by score desc
    return scoredItems.sort((a, b) => b.score - a.score);
};

module.exports = {
    loadModel,
    getEmbeddings,
    calculateSimilarity,
    findTopMatches
};
