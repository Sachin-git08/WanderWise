// public/js/map.js

console.log("Leaflet map script loaded!");

// Ensure listingData exists (injected by show.ejs)
if (typeof listingData !== "undefined" && listingData.coordinates) {
  const [lng, lat] = listingData.coordinates; // GeoJSON = [lng, lat]

  console.log(`Showing location for ${listingData.title}:`, lat, lng);

  // Initialize Leaflet map
  const map = L.map("map").setView([lat, lng], 10);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Create a custom red marker icon
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Add marker with styled popup like "Jaipur, Rajasthan"
  const popupHTML = `
    <div style="
      text-align:center;
      line-height:1.4;
      font-family: 'Plus Jakarta Sans', sans-serif;
    ">
      <h5 style="margin:0; font-weight:700; color:#000;">
        ${listingData.title}
      </h5>
      <p style="margin:4px 0 0; font-size:13px; color:#555;">
        Exact location provided after booking
      </p>
    </div>
  `;

  L.marker([lat, lng], { icon: redIcon })
    .addTo(map)
    .bindPopup(popupHTML)
    .openPopup();

} else {
  console.warn("No coordinates found for this listing. Showing default Bengaluru.");

  const map = L.map("map").setView([12.9716, 77.5946], 10);

 L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.fr/">OSM France</a>'
}).addTo(map);

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const popupHTML = `
    <div style="text-align:center; line-height:1.4;">
      <h5 style="margin:0; font-weight:700;">Default Location</h5>
      <p style="margin:4px 0 0; font-size:13px; color:#555;">
        Bengaluru, India
      </p>
    </div>
  `;

  L.marker([12.9716, 77.5946], { icon: redIcon })
    .addTo(map)
    .bindPopup(popupHTML)
    .openPopup();
}
