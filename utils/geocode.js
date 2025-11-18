const fetch = require("node-fetch");

async function forwardGeocode(location) {
  console.log("Searching coordinates for:", location);

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "WanderWise-App" }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  if (data.length === 0) {
    throw new Error("Location not found");
  }

  const place = data[0];

  return {
    type: "Point",
    coordinates: [parseFloat(place.lon), parseFloat(place.lat)]
  };
}

module.exports = forwardGeocode;
