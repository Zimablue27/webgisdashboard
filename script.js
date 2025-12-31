// Initialize map
var map = L.map('map').setView([26.2, 92.9], 9);

// Base map
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// LULC raster bounds (UPDATE WITH YOUR VALUES)
var lulcBounds = [
  [25.027693, 92.802886], // SW corner
  [26.119415, 89.821198]  // NE corner
];

// LULC raster overlay
var lulc = L.imageOverlay(
  'data/lulc.png',
  lulcBounds,
  { opacity: 0.7 }
).addTo(map);

// Boundary
fetch("Boundary.geojson")
.then(res => res.json())
.then(data => {
  var boundary = L.geoJSON(data, {
    style: {
      color: "red",
      weight: 2,
      fillOpacity: 0
    }
  }).addTo(map);

  map.fitBounds(boundary.getBounds());

  // Roads
  fetch("roads.geojson")
  .then(res => res.json())
  .then(roadData => {

    var roads = L.geoJSON(roadData, {
      style: { color: "black", weight: 1 }
    }).addTo(map);

    // Layer control
    L.control.layers(
      { "OpenStreetMap": osm },
      {
        "Boundary": boundary,
        "LULC": lulc,
        "Roads": roads
      }
    ).addTo(map);
  });
});
