const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

let model;
let modelLoadPromise = null;

const loadModel = async () => {
  if (model) return model;
  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = (async () => {
    try {
      model = await use.load();
      return model;
    } catch (err) {
      modelLoadPromise = null;
      throw err;
    }
  })();

  return modelLoadPromise;
};

const getSemanticSimilarity = async (text1, text2) => {
  if (!text1 || !text2) return 0;
  console.log(`Text 1: ${text1} | Text 2: ${text2}`)
  try {
    await loadModel();
    
    const cleanText1 = String(text1).trim().toLowerCase();
    const cleanText2 = String(text2).trim().toLowerCase();
    if (!cleanText1 || !cleanText2) return 0;

    // Generate embeddings
    const embeddings = await model.embed([cleanText1, cleanText2]);
    
    // Validate embeddings
    if (!embeddings || embeddings.shape.length !== 2 || embeddings.shape[0] !== 2) {
      throw new Error('Invalid embeddings shape');
    }

    // Normalize embeddings
    const normalize = (tensor) => {
      const norm = tf.norm(tensor);
      const safeNorm = tf.maximum(norm, 1e-6); // Prevent division by zero
      return tf.div(tensor, safeNorm);
    };

    const emb1 = normalize(tf.slice(embeddings, [0, 0], [1, -1]));
    const emb2 = normalize(tf.slice(embeddings, [1, 0], [1, -1]));
    
    // Calculate similarity
    const similarity = tf.matMul(emb1, emb2, false, true).dataSync()[0];
    
    // Clean up tensors
    tf.dispose([embeddings, emb1, emb2]);
    
    return Math.max(-1, Math.min(1, similarity)); // Clamp between -1 and 1
  } catch (err) {
    console.error('Similarity calculation error:', err.message);
    return 0; 
  }
};

module.exports = {
  loadModel,
  getSemanticSimilarity
};
