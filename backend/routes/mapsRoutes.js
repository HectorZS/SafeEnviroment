import axios from 'axios';

async function getCoordsForAdress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GEOCODE_API_KEY}`
  );
  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new Error('Could not find location');
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

export default getCoordsForAdress;