
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function forwardGeocode(location) {
  console.log("📍 Searching coordinates for:", location);

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "WanderWise-App (Node.js Server)" }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  if (data.length === 0) {
    throw new Error("Location not found");
  }

  return {
    type: "Point",
    coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
  };
}

module.exports = forwardGeocode;
