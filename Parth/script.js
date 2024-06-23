const url = "http://127.0.0.1:5000/api/v1.0/income_levels";

// Example data structure (replace with your actual data fetching logic)
//d3.json(url).then(data)
const dp2 = d3.json(url)
const filteredData = jsonData.map(item => {
    return {
        year: item["year"],
        zip: item["zip"],
        household_income_in_12_months: item["Households Household Income in the Past 12 Months"]
    };
});
// Promise Pending
//const dataPromise = d3.json(url);
//console.log("Data Promise: ", dataPromise);
const traces = {};

filteredData.forEach(row => {
    const year = row["year"];
    const income = parseFloat(row["household_income_in_12_months"]);
    const zipCode = row["zip"];

    if (!traces[zipCode]) {
        traces[zipCode] = { x: [], y: [], mode: 'lines+markers', name: zipCode };
    }

    traces[zipCode].x.push(year);
    traces[zipCode].y.push(income);
});
const traceArray = Object.values(traces);
console.log(traceArray)
const layout = {
    title: 'Household Income in the Past 12 Months by Zip Code',
    xaxis: { title: 'Year', tickmode: 'linear' },
    yaxis: { title: 'Household Income (USD)' }
};
Plotly.newPlot('myPlot', traceArray, layout);
// Fetch the JSON data and console log it
/*d3.json(url).then(function(data) {
  console.log(data);

});*/