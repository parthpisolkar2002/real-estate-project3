// Initialize the map
var map = L.map('map').setView([37.0902, -95.7129], 4); // Centered on USA

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// List of zip codes
var zipCodes = ['10001', '90210', '30301'];

// Function to fetch coordinates for a zip code
function fetchCoordinates(zipCode) {
    return fetch(`http://api.zippopotam.us/us/${zipCode}`)
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

// Function to plot markers on the map
function plotMarkers(zipCodeData) {
    zipCodeData.forEach(data => {
        if (data) {
            L.marker([data.lat, data.lon]).addTo(map)
                .bindPopup(`<b>Zip Code: ${data.zipCode}</b>`);
        }
    });
}

// Fetch and plot data for all zip codes
Promise.all(zipCodes.map(fetchCoordinates))
    .then(plotMarkers)
    .catch(error => console.error('Error fetching zip code data:', error));