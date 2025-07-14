function recommendationScore(post, categoriesHelped, distance){
    let score = 0
    const urgencyW = {
        high: 3, 
        medium: 2, 
        low: 1
    }
    score += (urgencyW[post.urgency?.toLowerCase()] || 0) * 10
    if(categoriesHelped.has(post.category)){ 
        score += 20
    }
    if (distance < 1) score += 40
    else if (distance < 3) score += 30
    else if (distance < 10) score += 20
    else if (distance < 50) score += 10

    return score
}

module.exports = recommendationScore