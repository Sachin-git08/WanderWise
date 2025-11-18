// public/js/map.js

console.log("Leaflet map script loaded!");

// Ensure listingData exists
if (typeof listingData !== "undefined" && listingData.coordinates) {

    let [lng, lat] = listingData.coordinates; // GeoJSON = [lng, lat]

    console.log(`Showing map for ${listingData.title}: LAT=${lat}, LNG=${lng}`);

    // Initialize Leaflet map
    const map = L.map("map").setView([lat, lng], 13);

    // FAST, STABLE TILE SERVER
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Red marker icon
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

    // Popup
    const popupHTML = `
      <div style="text-align:center;font-family:'Plus Jakarta Sans';">
        <h5 style="margin:0;font-weight:700;">${listingData.title}</h5>
        <p style="margin:4px 0 0;font-size:13px;color:#555;">
          Exact location provided after booking
        </p>
      </div>
    `;

    L.marker([lat, lng], { icon: redIcon })
        .addTo(map)
        .bindPopup(popupHTML)
        .openPopup();

} else {
    console.warn("⚠️ No coordinates — loading default map");

    const map = L.map("map").setView([12.9716, 77.5946], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    const defaultIcon = new L.Icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    L.marker([12.9716, 77.5946], { icon: defaultIcon })
        .addTo(map)
        .bindPopup("Default Bangalore Location")
        .openPopup();
}
