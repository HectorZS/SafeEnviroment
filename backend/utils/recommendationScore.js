const { getSemanticSimilarity } = require("./semanticModel");
const { PrismaClient } = require('../generated/prisma/index.js');
const prisma = new PrismaClient();

async function calculateBaseScore(post, categoriesHelped, distance, times) {
  if (post === null || post === undefined) return 0;
  
  let score = 0;
  const URGENCY_WEIGHTS = { high: 3, medium: 2, low: 1 };
  const urgencyWeight = post.urgency ? URGENCY_WEIGHTS[post.urgency.toLowerCase()] || 0 : 0;
  
  score += urgencyWeight * 10;
  
  if (categoriesHelped && typeof categoriesHelped.has === 'function' && 
      categoriesHelped.has(post.category)) {
    score += (10 * (times.get(post.category) || 0));
  }

  const DISTANCE_THRESHOLDS = [
    { max: 1, bonus: 40 },
    { max: 3, bonus: 30 },
    { max: 10, bonus: 20 },
    { max: 50, bonus: 10 },
    { max: 500, bonus: 9 },
    { max: 1000, bonus: 7 },
    { max: 5000, bonus: 5 },
    { max: 10000, bonus: 1 },
  ];

  if (typeof distance === 'number') {
    for (const {max, bonus} of DISTANCE_THRESHOLDS) {
      if (distance < max) {
        score += bonus * urgencyWeight;
        break;
      }
    }
  }

  return score;
}

async function recommendationScore(post, categoriesHelped, distance, times, helpedPosts, string = "notHere") {
  try {
    if (post === null || post === undefined) return 0;
    
    const baseScore = await calculateBaseScore(post, categoriesHelped, distance, times);
    if (!Array.isArray(helpedPosts) || !helpedPosts.length || 
        !post.title || !post.description) {
      return baseScore;
    }

    let maxSimilarity = 0;
    const currentText = `${post.title} ${post.description}`;
    
    for (const helpedPost of helpedPosts) {
      if (helpedPost === null || helpedPost === undefined) continue;
      
      const similarity = await getSemanticSimilarity(
        currentText,
        `${helpedPost.title} ${helpedPost.description}`
      );
      maxSimilarity = Math.max(maxSimilarity, similarity || 0);
    }
    console.log(`---------- Max similarity for ${post.title}: ${maxSimilarity} ------------`)
    return baseScore + (maxSimilarity * 50);
  } catch (err) {
    console.error('Recommendation score error:', err.message);
    return 0;
  }
}

module.exports = recommendationScore;


