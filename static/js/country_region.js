document.addEventListener("DOMContentLoaded", function () {
    const byCountry = document.getElementById("byCountry")
    const byRegion = document.getElementById("byRegion")
    const countryOptions = document.getElementById("countryOptions")
    const regionOptions = document.getElementById("regionOptions")
    const generateChartBtn = document.getElementById("generateChart")

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