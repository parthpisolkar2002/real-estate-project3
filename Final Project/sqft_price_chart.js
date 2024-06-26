// Fetch data from API
const url = 'http://127.0.0.1:5000/api/v1.0/price_per_sqft'

fetch(url)
    .then(response => response.json())
    .then(data => {
        // Extract data for plotting
        const city = data.map(item => item.city);
        const price_per_sqft = data.map(item => item.price_per_sqft);

        // Define trace for the bar chart
        const trace = {
            x: city,
            y: price_per_sqft,
            type: 'bar'
        };

        // Define layout for the chart
        const layout = {
            title: 'Price per Sqft in Different Cities',
            xaxis: { title: 'City' },
            yaxis: { title: 'Price per Sqft (USD)' }
        };

        // Plot the chart
        Plotly.newPlot('myPlot', [trace], layout);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });