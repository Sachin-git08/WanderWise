// utils/geocode.js
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function forwardGeocode(location) {
  try {
    console.log("Fetching coordinates for:", location);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const fakeResponse = {
      body: {
        features: data.map(item => ({
          type: "Feature",
          place_name: item.display_name,
          geometry: {
            type: "Point",
            coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
          }
        }))
      }
    };

    return fakeResponse;
  } catch (err) {
    console.error("Geocoding failed:", err.message);
    throw err;
  }
}

module.exports = { forwardGeocode };
