function recommendationScore(post, categoriesHelped, distance) {
    let score = 0

    const URGENCY_WEIGHTS = { high: 3, medium: 2, low: 1 }
    const urgencyWeight = URGENCY_WEIGHTS[post.urgency?.toLowerCase()] || 0

    score += urgencyWeight * 10

    if (categoriesHelped.has(post.category)) {
        score += 20
    }

    const DISTANCE_THRESHOLDS = [
        { max: 1, bonus: 40 },
        { max: 3, bonus: 30 },
        { max: 10, bonus: 20 },
        { max: 50, bonus: 10 }
    ];

    for (const pairDist of DISTANCE_THRESHOLDS) { // bonus by distance multiplied by urgency weight
        if (distance < pairDist.max) {
            score += pairDist.bonus * urgencyWeight
            break
        }
    }

    return score
}

module.exports = recommendationScore


