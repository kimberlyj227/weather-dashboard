//create html info for sidebar 
// search field #search-input
// blocks for recently searched items (local storage) div = #recent-searches
// dynamically create html for information section


// main chunk- #display-information
//#current-weather
// url : https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
// My api key: 94b6202e8b8c7902f232bf135edcd567
//city/date response.name // response.dt (need moment())
//temperature response.main.temp
//humidity response.main.humidity
//wind speed response.wind.speed

// * need these to input to uv index
// lat response.coord.lat
// lon response.coord.lon
// uv index (bkgrnd changes based on index range?)
//url : https:// http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}

//5 day forecast #5day
//cards for each day in 5 day forecast:
//date response.list.dt (need moment())
//icon for weather conditions (sun, clouds, rain, etc) response.weather[i].icon
//temp response.list[i].main.temp
//humidity response.list[i].main.humidity



//* Variables
// initial array of recent searches
var searches = [];
var apiKey = "94b6202e8b8c7902f232bf135edcd567";



//* Functions
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


    //ajax call
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {

        var lat = response.coord.lat
        var lon = response.coord.lon
        var date = moment.unix(response.dt).format("M/D/YY");
        var iconCode = response.weather[0].icon;
        var iconImg = $("<img>");
        iconImg.attr("src", "http://openweathermap.org/img/wn/" + iconCode + "@2x.png")

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
        $("#current-weather").append(`<p class ='uv' value='${uv}'>UV Index: ${uv} </p>`);

        if (uv < 2) {
            $(".uv").addClass("uv-low");
        } else if ((uv > 2) && (uv <5)) {
            $(".uv").addClass("uv-md");
        } else if ((uv > 5) && (uv < 7)) {
            $(".uv").addClass("uv-high");
        } else if ((uv > 7) && (uv < 11)) {
            $(".uv").addClass("uv-v-high");
        } else {
            $(".uv").addClass("uv-ex-high text-white");
        }

    })
}

function display5DayInfo() {
    var url5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`

    $.ajax({
        url: url5Day,
        method: "GET"
    }).then(function (response) {
        var results = response.list;
        console.log(response)

        $("#5day").append($("<h3 class='row'>5 Day Forecast:</h3>"))
        var wrapper = $("<div class='wrapper row'>");

        for (var i = 0; i < results.length; i++) {
            if (results[i].dt_txt.indexOf("15:00:00") !== -1) {
            var forecastDiv = $("<div class='card text-white text-center bg-med-blue-7 mr-1 col-md-2 p-2'>");
             
            var date5 = $(`<div class='card-header' id='date5'> ${moment.unix(results[i].dt).format("M/D/YY")} </div>`);

            var icon5 = results[i].weather[0].icon
            
            var iconImage = $("<img>");
            iconImage.attr("src", "https://openweathermap.org/img/wn/" + icon5 + "@2x.png")

            var temp5 = $(`<p id='temp5' class = 'card-text'> Temperature: <br> ${results[i].main.temp_max}</p>`);

            var humidity5 = $(`<p id='humidity5' class = 'card-text'> Humidity: ${results[i].main.humidity}%</p>`);

            forecastDiv.append(date5, iconImage, temp5, humidity5);
            wrapper.append(forecastDiv)
            $("#5day").addClass("shadow-sm p-3 bg-white rounded").append(wrapper);
            }
        }
    })
}

//
// function get5Day(response) {
//     var results = response.list;
//     console.log(response)

//     $("#5day").append($("<h3 class='row'>5 Day Forecast:</h3>"))
//     var wrapper = $("<div class='wrapper row'>");
//     for (var i = 0; i < results.length; i++) {
//         var forecastDiv = $("<div class='card text-white bg-med-blue-7 mr-1 col-md-2 p-2'>")
//         var date5 = $(`<div class='card-header' id='date5'> ${moment.utc(results[i].dt[i]).format("M/D/YY")} </div>`);
//         var icon5 = $(`<p id='date5'> ${results[i].weather.icon} </p>`)
//         var temp5 = $(`<p id='temp5' class = 'card-text'> Temperature: ${results[i].main.temp}</p>`);
//         var humidity5 = $(`<p id='humidity5' class = 'card-text'> Humidity: ${results[i].main.humidity}%</p>`);
//         // console.log(temp5)

//         // var cardInfo = $(`
//         //                 
//         //                 <p id='icon5'class='card-text'>${icon5}</p>`);

//         forecastDiv.append(date5, icon5, temp5, humidity5);
//         wrapper.append(forecastDiv)
//         $("#5day").append(wrapper);

//     }

// }

// ** clears current data so new data can load
function clearData() {
    $("#current-weather").empty();
    $("#5day").empty();
}

//* Call Functions

// * Click Events
//search button
$("#search-button").on("click", function (event) {
    event.preventDefault();
    city = $("#search-input").val().trim();
    clearData();
    searches.push(city);
    renderSearches();
    $("#search-input").val("");
    display5DayInfo();
    displayCurrentInfo();

})
//recent search
$(document).on("click", ".city", function () {
    city = $(this).attr("data-name");
    clearData();
    displayCurrentInfo();
    display5DayInfo();

});