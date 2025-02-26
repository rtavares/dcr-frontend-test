let countriesData = []; // Stores the JSON data

// Load JSON file
fetch("data/countries.json")
    .then(response => response.json())
    .then(data => {
        countriesData = data;
    })
    .catch(error => console.error("Error loading JSON:", error));

document.addEventListener("DOMContentLoaded", function () {
    const byCountry = document.getElementById("byCountry")
    const byRegion = document.getElementById("byRegion")
    const countryOptions = document.getElementById("countryOptions")
    const regionOptions = document.getElementById("regionOptions")

    function toggleOptions() {
        if (byCountry.checked) {
            countryOptions.classList.remove("d-none")
            regionOptions.classList.add("d-none")
        } else {
            countryOptions.classList.add("d-none")
            regionOptions.classList.remove("d-none")
        }
    }

    byCountry.addEventListener("change", toggleOptions)
    byRegion.addEventListener("change", toggleOptions)

})
// ---------------------------------------------------------------------------------------------------------------------

function updateChart(dataType) {
    let selectedMetric = ""

    if (dataType === 'country') {
        selectedMetric = document.getElementById("countryDataSelection").value;
    } else if (dataType === 'region') {
        selectedMetric = document.getElementById("regionDataSelection").value;
    }

    if (selectedMetric === "") {
        // Null option selected. Reset chart.
        let svg = d3.select("#bubbleChart")
        svg.selectAll("*").remove()

        return
    }

    let processedData = dataType === "country" ? processCountryData(selectedMetric) : processRegionData(selectedMetric)
    let bubbleColor = document.getElementById("bubbleColor").value;
    drawBubbleChart(processedData, bubbleColor);
    drawTable(dataType, selectedMetric, processedData);
        }
// ---------------------------------------------------------------------------------------------------------------------

function processCountryData(metric) {
    return countriesData.map(country => {
        let value = metric === "population" ? country.population
            : metric === "borders" ? (country.borders ? country.borders.length : 0)
            : metric === "timezones" ? country.timezones.length
            : country.languages.length;

        return { name: country.name, value };
    }).filter(d => d.value > 0);
}

function processRegionData(metric) {
    let regionMap = {};

    countriesData.forEach(country => {
        let region = country.region;
        if (!regionMap[region]) {
            regionMap[region] = { count: 0, timezones: new Set() };
        }
        regionMap[region].count += 1;
        country.timezones.forEach(tz => regionMap[region].timezones.add(tz));
    });

    return Object.entries(regionMap).map(([name, data]) => ({
        name,
        value: metric === "countriesInRegion" ? data.count : data.timezones.size
    }));
}
// ---------------------------------------------------------------------------------------------------------------------

function drawBubbleChart(data, color) {
    let svg = d3.select("#bubbleChart");
    svg.selectAll("*").remove();

    let width = svg.attr("width");
    let height = svg.attr("height");

    let bubbleScale = d3.scaleSqrt()
        .domain([1, d3.max(data, d => d.value)])
        .range([10, 80]);

    let simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .force("collide", d3.forceCollide(d => bubbleScale(d.value) + 2))
        .force("charge", d3.forceManyBody().strength(-15))
        .on("tick", ticked);

    let nodes = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", d => bubbleScale(d.value))
        .attr("fill", color)
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

    let labels = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("text-anchor", "middle");

    labels.append("text")
        .attr("dy", "-0.4em")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .text(d => d.name.length > 10 ? d.name.slice(0, 8) + "…" : d.name);

    labels.append("text")
        .attr("dy", "1.2em")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .text(d => formatNumber(d.value));

    function ticked() {
        nodes.attr("cx", d => d.x)
             .attr("cy", d => d.y);

        labels.attr("transform", d => `translate(${d.x},${d.y})`);
    }
}
// ---------------------------------------------------------------------------------------------------------------------

function formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num;
}
// ---------------------------------------------------------------------------------------------------------------------

function drawTable(dataType, selectedMetric, data) {
    // TO-DO: validate the arguments and handle invalid data properly

    let selectedElement = ""

    if (dataType === 'country') {
        selectedElement = document.getElementById("countryDataSelection")
    } else if (dataType === 'region') {
        selectedElement = document.getElementById("regionDataSelection")
    }

    const selectedOption = selectedElement.options[selectedElement.selectedIndex]
    const selectedElementLabel = selectedOption.text

    document.getElementById('dataScope').textContent = capitalizeWord(dataType)
    document.getElementById('dataMetric').textContent = selectedElementLabel

    // Clean up the table
     const tableBody = document.getElementById('tdataBody')
     tableBody.innerHTML = ''

    // Add the new rows
    data.forEach(item =>{
         const row = document.createElement('tr')

        // Add data to the row
        const dataScope = document.createElement('td')
        dataScope.textContent = item.name
        row.appendChild(dataScope)

        const dataValue = document.createElement('td')
        dataValue.textContent = Number(item.value).toLocaleString()
        dataValue.classList.add('right-align')
        row.appendChild(dataValue);

        tableBody.appendChild(row);
    })

}
// ---------------------------------------------------------------------------------------------------------------------

function capitalizeWord(word) {
    if (!word) return word; // Null value, nothing to do
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}