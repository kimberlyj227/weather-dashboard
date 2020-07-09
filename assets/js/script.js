//* Variables
var searches = [];
var apiKey = "94b6202e8b8c7902f232bf135edcd567";

//* Functions
function onLoad() {
    getSearches();
    $("#clear").hide();
    clearData();
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

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var weather = response.weather[0].main;

        var date = moment.unix(response.dt).format("M/D/YY");
        var iconCode = response.weather[0].icon;
        var iconImg = $("<img>");
        iconImg.attr("src", "https://openweathermap.org/img/wn/" + iconCode + "@2x.png")

        var temp = $(`<p>Temperature: ${response.main.temp} &degF</p>`);
        var humidity = $(`<p>Humidity: ${response.main.humidity}%</p>`);
        var windSpeed = $(`<p>Wind Speed: ${response.wind.speed} MPH</p>`);

        $("#current-weather").append(`<h3>${city.toUpperCase()} (${date}) </h3>`).append(iconImg, temp, humidity, windSpeed, getUV(lat, lon));
        backgroundPhoto(weather);

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
// ** populates background image
function backgroundPhoto(weather) {
    var background = $("#current-weather").css("background-image", "url('assets/images/default-md.jpg')");

    if(weather === "Clear") {
        background.css("background-image", "url('assets/images/clear-md.jpg')") 
    } else if (weather === "Rain" || weather === "Drizzle") {
        background.css("background-image", "url('assets/images/rain-md.jpg')")
     } else if (weather === "Thunderstorm") {
        background.css("background-image", "url('assets/images/storm.-mdjpg')")
     } else if (weather === "Snow") {
        background.css("background-image", "url('assets/images/snow-md.jpg')")
     } else {
        background.css("background-image", "url('assets/images/clouds-md.jpg')")
     }


}
// ** gets 5 day forecast information
function display5DayInfo() {
    var url5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`

    $.ajax({
        url: url5Day,
        method: "GET"
    }).then(function (response) {
        var results = response.list;

        $("#5day").append($("<h3 class='row p-2'>5 Day Forecast:</h3>"))
        var wrapper = $("<div class='wrapper row mx-auto'>");

        for (var i = 0; i < results.length; i+=8) {
            if (results[i].dt_txt.indexOf("18:00:00")) {

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
    $("#current-weather").empty().hide();
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
    $("#clear").hide();
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
    $("#clear").show();
    $("#current-weather").show();
    ("#5day").show();
})
//recent search
$(document).on("click", ".city", function () {
    city = $(this).attr("data-name");
    clearData();
    displayCurrentInfo();
    display5DayInfo();
    $("#current-weather").show();

});
//clear button
$("#clear").on("click", clearStorage);
