const url = "http://127.0.0.1:5000/api/v1.0/income_levels";

d3.json(url).then(data => {
    const filteredData = data.map(item => ({
        year: item.year,
        zip: item.zip,
        household_income_in_12_months: item["Households Household Income in the Past 12 Months"]
    }));

    const traces = {};

    filteredData.forEach(row => {
        const year = row.year;
        const income = parseFloat(row.household_income_in_12_months);
        const zipCode = row.zip;

        if (!traces[zipCode]) {
            traces[zipCode] = { x: [], y: [], mode: 'lines+markers', name: zipCode };
        }

        traces[zipCode].x.push(year);
        traces[zipCode].y.push(income);
    });

    const traceArray = Object.values(traces);

    const layout = {
        title: 'Household Income in the Past 12 Months by Zip Code',
        xaxis: { title: 'Year', tickmode: 'linear' },
        yaxis: { title: 'Household Income (USD)' }
    };

    Plotly.newPlot('myPlot', traceArray, layout);
}).catch(error => {
    console.error('Error fetching or processing data:', error);
});