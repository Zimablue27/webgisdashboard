/*******************************
 * 1. Initialize the map
 *******************************/
var map = L.map('map').setView([25.6, 91.3], 7);

/*******************************
 * 2. Base map (OSM)
 *******************************/
var osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '© OpenStreetMap'
  }
).addTo(map);

/*******************************
 * 3. Create custom pane for LULC
 *    (forces raster ABOVE basemap)
 *******************************/
map.createPane('lulcPane');
map.getPane('lulcPane').style.zIndex = 650;

/*******************************
 * 4. LULC Raster Overlay
 *    (EXACT bounds from QGIS)
 *******************************/
var lulcBounds = [
  [25.027693, 89.821198],   // South-West (lat, lon)
  [26.119415, 92.802886]    // North-East (lat, lon)
];

var lulc = L.imageOverlay(
  'lulc.png',
  lulcBounds,
  {
    pane: 'lulcPane',
    opacity: 10.0   // FULL visibility (reduce later if needed)
  }
);

/*******************************
 * 5. Load Boundary
 *******************************/
fetch('Boundary.geojson')
  .then(response => response.json())
  .then(boundaryData => {

    var boundary = L.geoJSON(boundaryData, {
      style: {
        color: 'red',
        weight: 2,
        fillOpacity: 0
      }
    }).addTo(map);

    // Zoom map to boundary
    map.fitBounds(boundary.getBounds());

    /*******************************
     * 6. Load Roads
     *******************************/
    fetch('megresidentials.geojson')
      .then(response => response.json())
      .then(roadData => {

        var roads = L.geoJSON(roadData, {
          style: {
            color: '#ff6600',   // high contrast
            weight: 1
          }
        }).addTo(map);

        /*******************************
         * 7. Add LULC LAST (on top)
         *******************************/
        lulc.addTo(map);

        /*******************************
         * 8. Layer Control
         *******************************/
        L.control.layers(
          {
            "OpenStreetMap": osm
          },
          {
            "Boundary": boundary,
            "Roads": roads,
            "LULC": lulc
          }
        ).addTo(map);

        /*******************************
         * 9. Scale Bar
         *******************************/
        L.control.scale().addTo(map);

      })
      .catch(err => console.error("Roads loading error:", err));

  })
  .catch(err => console.error("Boundary loading error:", err));

