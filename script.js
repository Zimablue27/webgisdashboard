var map = L.map('map').setView([26.2, 92.9], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Load boundary ONLY
fetch('data/Boundary.geojson')
  .then(response => {
    if (!response.ok) throw new Error('Boundary load failed');
    return response.json();
  })
  .then(data => {
    var boundary = L.geoJSON(data, {
      style: {
        color: 'red',
        weight: 2,
        fillOpacity: 0
      }
    }).addTo(map);

    map.fitBounds(boundary.getBounds());
  })
  .catch(error => {
    console.error(error);
    alert("Boundary not loading – check file name or CRS");
  });
