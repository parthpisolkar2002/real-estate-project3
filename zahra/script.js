// URL to fetch JSON data
const dataUrl = 'http://127.0.0.1:5000/api/v1.0/data'; // Replace with your actual data URL

// Initialize the map
var map = L.map('map').setView([40.73, -74.0059], 8); // Centered on NY

var heatMap = L.map('heatMap').setView([40.73, -74.0059], 8); // Centered on NY

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(heatMap);

let allData = [];

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

 // Function to populate state selector
 function populateStateSelector(data) {
    let states = new Set();
    data.forEach(item => {
        states.add(item.state);
    });
    states = Array.from(states).sort();

    let stateSelector = document.getElementById('stateSelector');
    states.forEach(state => {
        let option = document.createElement('option');
        option.value = state;
        option.text = state;
        stateSelector.appendChild(option);
    });
}
// Function to filter data and update the marker map
function filterData() {
    let state = document.getElementById('stateSelector').value;
    let filteredData = allData.filter(item => state === '' || item.state === state);
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    plotMarkers(filteredData);
}


// Function to plot markers on the map. Customize it for your needs.

function plotMarkers(jsonData) {
    jsonData.forEach(data => {
        if (data.lat && data.lon) {
            L.marker([data.lat, data.lon]).addTo(map)
                .bindPopup(`<b>Zip Code: ${data.zip}</b><br>State: ${data.state}<br>City: ${data.city}<br>Listings: ${data.households}<br>Avg Price: $${data.price.toLocaleString()}`);
        }
    });
}



// Function to plot heat map
function plotHeatMap(jsonData) {
    var heatData = jsonData.map(data => [data.lat, data.lon, data.price]);
    console.log(heatData);
    L.heatLayer(heatData, {
        radius: 20,
        blur: 35,
        maxZoom: 10,
        gradient: {
            0.2: 'blue',
            0.4: 'lime',
            0.6: 'yellow',
            0.8: 'orange',
            1.0: 'red'
        }
    }).addTo(heatMap);
}

// Fetch JSON data using D3
d3.json(dataUrl).then(jsonData => {
    // Extract zip codes and fetch coordinates for each
    var promises = jsonData.map(item => 
        fetchCoordinates(item.zip).then(coords => {
            item.lat = coords.lat;
            item.lon = coords.lon;
            return item;
        }).catch(error => {
            console.error('Error fetching coordinates for zip:', item.zip, error);
            return null;
        })
    );

    // Wait for all coordinates to be fetched and then plot markers and heat map
    Promise.all(promises)
    .then(updatedData => {
        allData = updatedData.filter(item => item !== null);
        plotMarkers(allData);
        plotHeatMap(allData);
        populateStateSelector(allData);
    })
    .catch(error => console.error('Error processing data:', error));
}).catch(error => console.error('Error fetching JSON data:', error));

// Event listener for state selector
document.getElementById('stateSelector').addEventListener('change', filterData);