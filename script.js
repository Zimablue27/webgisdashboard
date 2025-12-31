// 1. Initialize map
var map = L.map('map').setView([25.6, 91.3], 7);

// 2. Base map
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// 3. LULC raster overlay (EXACT BOUNDS)
var lulcBounds = [
  [25.027693, 89.821198],
  [26.119415, 92.802886]
];

var lulc = L.imageOverlay('lulc.png', lulcBounds, {
  opacity: 0.0
});

// 4. Boundary
fetch('Boundary.geojson')
  .then(r => r.json())
  .then(boundaryData => {

    var boundary = L.geoJSON(boundaryData, {
      style: {
        color: 'red',
        weight: 2,
        fillOpacity: 0
      }
    }).addTo(map);

    map.fitBounds(boundary.getBounds());

    // 5. Roads
    fetch('megresidentials.geojson')
      .then(r => r.json())
      .then(roadData => {

        var roads = L.geoJSON(roadData, {
          style: {
            color: 'black',
            weight: 5
          }
        }).addTo(map);

        // 6. Add raster last
        lulc.addTo(map);

        // 7. Layer control
        L.control.layers(
          { "OpenStreetMap": osm },
          {
            "Boundary": boundary,
            "Roads": roads,
            "LULC": lulc
          }
        ).addTo(map);

      });

  });


