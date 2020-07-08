//* Variables
var searches = [];
var apiKey = "94b6202e8b8c7902f232bf135edcd567";

//* Functions
function onLoad() {
    getSearches();
}
// ** creates recent search buttons
function renderSearches() {

    $("#recent-searches").empty();

    for (var i = 0; i < searches.length; i++) {
        var search = $(`<button class='city btn bg-med-blue btn-lg btn-block p-2 mx-auto mt-3 text-white' data-name='${searches[i]}'>${searches[i].toUpperCase()}</button>`);

        $("#recent-searches").prepend(search)
    }
}
// ** gets info from API and displays it current weather div
function displayCurrentInfo() {

    var queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {

        var lat = response.coord.lat
        var lon = response.coord.lon
        var date = moment.unix(response.dt).format("M/D/YY");
        var iconCode = response.weather[0].icon;
        var iconImg = $("<img>");
        iconImg.attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png")

        var temp = $(`<p>Temperature: ${response.main.temp} &degF</p>`);
        var humidity = $(`<p>Humidity: ${response.main.humidity}%</p>`);
        var windSpeed = $(`<p>Wind Speed: ${response.wind.speed} MPH</p>`);

        $("#current-weather").addClass("shadow-sm p-3 bg-white rounded mb-3").append(`<h3>${city.toUpperCase()} (${date}) </h3>`).append(iconImg, temp, humidity, windSpeed, getUV(lat, lon));

    })

}
// ** gets UV info -- to be called in displayCurrentInfo
function getUV(lat, lon) {
    var uvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    $.ajax({
        url: uvUrl,
        method: "GET"
    }).then(function (response) {
        var uv = response.value
        $("#current-weather").append(`<p class ='uv font-weight-bold' value='${uv}'>UV Index: ${uv} </p>`);

        if (uv < 2) {
            $(".uv").addClass("uv-low");
        } else if ((uv > 2) && (uv <5)) {
            $(".uv").addClass("uv-md");
        } else if ((uv > 5) && (uv < 8)) {
            $(".uv").addClass("uv-high");
        } else if ((uv > 8) && (uv < 11)) {
            $(".uv").addClass("uv-v-high");
        } else {
            $(".uv").addClass("uv-ex-high");
        }

    })
}
// ** gets 5 day forecast information
function display5DayInfo() {
    var url5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`

    $.ajax({
        url: url5Day,
        method: "GET"
    }).then(function (response) {
        var results = response.list;

        $("#5day").append($("<h3 class='row'>5 Day Forecast:</h3>"))
        var wrapper = $("<div class='wrapper row'>");

        for (var i = 0; i < results.length; i++) {
            if (results[i].dt_txt.indexOf("18:00:00") !== -1) {

            var forecastDiv = $("<div class='card text-white text-center bg-med-blue-7 mr-3 mb-3 col-md-2 p-2'>");
             
            var date5 = $(`<div class='card-header' id='date5'> ${moment.unix(results[i].dt).format("M/D/YY")} </div>`);

            var icon5 = results[i].weather[0].icon
            
            var iconImage = $("<img>");
            iconImage.attr("src", "https://openweathermap.org/img/wn/" + icon5 + "@2x.png")

            var temp5 = $(`<p id='temp5' class = 'card-text'> Max Temperature: <br> ${results[i].main.temp_max}</p>`);

            var humidity5 = $(`<p id='humidity5' class = 'card-text'> Humidity: ${results[i].main.humidity}%</p>`);

            forecastDiv.append(date5, iconImage, temp5, humidity5);
            wrapper.append(forecastDiv)
            $("#5day").addClass("shadow-sm p-3 bg-white rounded").append(wrapper);
            }
        }
    })
}
// ** clears current data so new data can load
function clearData() {
    $("#current-weather").empty();
    $("#5day").empty();
}
//* local storage
function getSearches() {
    searches = JSON.parse(localStorage.getItem("city")) || [];
    renderSearches();
}
function saveSearches() {

localStorage.setItem("city", JSON.stringify(searches));

}
function clearStorage() {
    localStorage.clear();
    $("#recent-searches").empty();
    clearData();
    searches = [];
}

// * Call functions
onLoad();

// * Click Events
//search button
$("#search").on("click", function (event) {
    if (!$("#search-input").val()) {
        return false;
    }

    event.preventDefault();
    city = $("#search-input").val().trim();
    clearData();
    searches.push(city);
    renderSearches();
    $("#search-input").val("");
    display5DayInfo();
    displayCurrentInfo();
    saveSearches();
})
//recent search
$(document).on("click", ".city", function () {
    city = $(this).attr("data-name");
    clearData();
    displayCurrentInfo();
    display5DayInfo();

});
//clear button
$("#clear").on("click", clearStorage);
