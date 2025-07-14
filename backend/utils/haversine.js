function haversine(lat1, lon1, lat2, lon2) {
    const rad = (value) => (value * Math.PI) / 180
    const R = 6371 // earth radius in kilometers 3958.8
    const dLat = rad(lat2 - lat1)
    const dLong = rad(lon2 - lon1)
    const a = 
        Math.sin(dLat / 2) ** 2 + 
        Math.cos(rad(lat1)) * 
        Math.cos(rad(lat2)) * 
        Math.sin(dLong / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

module.exports = haversine