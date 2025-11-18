const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function forwardGeocode(location) {
  console.log("📍 Searching coordinates for:", location);

  const accessKey = process.env.POSITIONSTACK_API_KEY;

  const url = `http://api.positionstack.com/v1/forward?access_key=${accessKey}&query=${encodeURIComponent(location)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`PositionStack error! Status: ${response.status}`);
  }

  const data = await response.json();

  if (!data || !data.data || data.data.length === 0) {
    throw new Error("Location not found");
  }

  const place = data.data[0];

  return {
    type: "Point",
    coordinates: [place.longitude, place.latitude]
  };
}

module.exports = forwardGeocode;
