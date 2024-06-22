// URL to fetch JSON data
const dataUrl = 'http://127.0.0.1:5000/api/v1.0/data'; // Replace with your actual data URL

// Initialize the map
var map = L.map('map').setView([40.73, -74.0059], 8); // Centered on USA

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Function to fetch coordinates for a zip code
function fetchCoordinates(zipCode) {
    return fetch(`https://api.zippopotam.us/us/${zipCode}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.places && data.places.length > 0) {
                var place = data.places[0];
                return {
                    zipCode: zipCode,
                    lat: parseFloat(place.latitude),
                    lon: parseFloat(place.longitude)
                };
            } else {
                throw new Error(`No data found for zip code: ${zipCode}`);
            }
        });
}

d3.json(dataUrl).then(function(response) {

    console.log(response[0]);
    //features = response.features;
    
  
    let heatArray = [];
  
    for (let i = 0; i < features.length; i++) {
      let location = features[i].geometry;
      if (location) {
        //console.log(location);
        heatArray.push([location.coordinates[1], location.coordinates[0]]);
      }
  
    }
  
    let heat = L.heatLayer(heatArray, {
      radius: 20,
      blur: 35
    }).addTo(map);
  
  });
  
