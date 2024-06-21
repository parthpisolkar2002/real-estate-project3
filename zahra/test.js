// Store our API endpoint as queryUrl.


fetch('http://127.0.0.1:5000/api/v1.0/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched data:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });