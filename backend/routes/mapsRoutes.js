import axios from 'axios';


function getComponentNames(addressComponents, type) {
  const component = addressComponents.find(c => c.types.includes(type));
  if (component) {
    return {
      long_name: component.long_name,
      short_name: component.short_name,
    };
  }
  return null;
}

async function getCoordsForAdress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GEOCODE_API_KEY}`
  );
  const data = response.data;
  console.log("GAPI: ", data.results[0].address_components)
  const addressComponents = data.results[0].address_components

  const streetNumber = getComponentNames(addressComponents, "street_number");
  const route = getComponentNames(addressComponents, "route");
  const locality = getComponentNames(addressComponents, "locality");
  const administrativeAreaLevel1 = getComponentNames(addressComponents, "administrative_area_level_1");

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new Error('Could not find location');
  }

  const coordinates = data.results[0].geometry.location;
  return [coordinates, streetNumber, route, locality, administrativeAreaLevel1];
}

export default getCoordsForAdress;