$(document).ready(
    function () {
        getDataWeather();
        getFutureWeather();
        setInterval("getDataWeather()", 3600000);

    }
)

function getDataWeather() {
    $.ajax({
        url: "http://api.wunderground.com/api/12d2e28ea368c6f7/conditions/q/IL/Chicago.json",
        type: "GET",
        dataType: "text",
        success: function (data) {
            var json = $.parseJSON(data);
            var currTemp = Math.round(json.current_observation.temp_f);
            var currCond = json.current_observation.weather;
            var feelsLike = Math.round(json.current_observation.feelslike_f);
            var color = getColorForTemp(currTemp);
            fillCurrWeatherPanel(currTemp, currCond, currCond, feelsLike); //this function makes sure that the panel doesn't get flooded

        }
    });
}

function fillCurrWeatherPanel(temp, cond, ico, feelsLike) {
    var color = getColorForTemp(temp);
    $(".temp").html("");
    $(".temp").html("<h1>Current Temperature: " + temp + "&deg;F</h1>Feels Like: " + feelsLike + "&deg;F");
    $(".cond").append("<p>Current Conditions: " + cond + "</p>");
    $("#condIco").attr('src', getIconForCond(ico));
    $(".curr-heading").css("background-color", color.head);
    $(".curr-body").css("background-color", color.body);

}

function getFutureWeather() {
    $.ajax({
        url: "http://api.wunderground.com/api/12d2e28ea368c6f7/forecast/q/IL/Chicago.json",
        type: "GET",
        dataType: "text",
        success: function (data) {
            var json = $.parseJSON(data);
            for (i = 1; i < 4; i++) {
                var dateDay = json.forecast.simpleforecast.forecastday[i].date.weekday
                var highTemp = json.forecast.simpleforecast.forecastday[i].high.fahrenheit;
                var lowTemp = json.forecast.simpleforecast.forecastday[i].low.fahrenheit;
                var cond = json.forecast.simpleforecast.forecastday[i].conditions;
                var color = getColorForTemp(highTemp);
                console.log(color);
                var dayIco = getIconForCond(json.forecast.simpleforecast.forecastday[i].conditions);
                $(".day" + i + "-heading").html(dateDay);
                $(".day" + i + "-panel").html(highTemp + "&deg;F\/" + lowTemp + "&deg;F <br>" + cond + "<br> <img src=\"" + dayIco + "\"\/>");
                $(".day" + i + "-heading").css("background-color", color.head);
                $(".day" + i + "-panel").css("background-color", color.body);
            }
        }
    });
}

function getColorForTemp(temp) {
    if (temp > -20 && temp < -10) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > -9 && temp < 0) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 1 && temp < 10) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 11 && temp < 20) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 21 && temp < 30) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 31 && temp < 40) {
        var head = '#365902'; //header color
        var body = '#C6D93B'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 41 && temp < 50) {
        var head = '#365902'; //header color
        var body = '#C6D93B'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 51 && temp < 60) {
        var head = '#365902'; //header color
        var body = '#C6D93B'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 61 && temp < 70) {
        var head = '#FFBC00'; //header color
        var body = '#FF9B00'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 71 && temp < 80) {
        var head = '#FF9B00'; //header color
        var body = '#FFBC00'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 81 && temp < 90) {
        var head = '#FF4C0C'; //header color
        var body = '#FF7300'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp >= 91) {
        var head = '#FF4C0C'; //header color
        var body = '#FF7300'; //body color
        return {
            head: head,
            body: body
        };
    }

}

function getIconForCond(cond) {
    switch (cond) {
        case "Drizzle":
        case "Freezing Drizzle":
            return '/BusTracker/img/weatherIcons/12.png'
            break;
        case "Rain":
        case "Chance of Rain":
        case "Chance of Freezing Rain":
        case "Chance Rain":
        case "Freezing Rain":
        case "Rain Mist":
        case "Rain Showers":
            return '/BusTracker/img/weatherIcons/40.png'
            break;
        case "Snow":
        case "Chance of Flurries":
        case "Flurries":
        case "Chance of Snow":
        case "Chance of Sleet":
        case "Snow Showers":
        case "Snow Blowing Snow Mist":
        case "Blowing Snow":
        case "Snow Grains":
            return '/BusTracker/img/weatherIcons/14.png'
            break;
        case "Ice Crystals":
        case "Ice Pellets":
        case "Ice Pellet Showers":
            return '/BusTracker/img/weatherIcons/10.png'
            break;
        case "Hail":
        case "Hail Showers":
        case "Small Hail Showers":
        case "Small Hail":
            return '/BusTracker/img/weatherIcons/10.png'
            break;
        case "Mist":
            return '/BusTracker/img/weatherIcons/22.png'
            break;
        case "Fog":
        case "Patches of Fog":
        case "Shallow Fog":
        case "Partial Fog":
        case "Freezing Fog":
        case "Fog Patches":
            return '/BusTracker/img/weatherIcons/24.png'
            break;
        case "Thunderstorm":
        case "Chance of a Thunderstorm":
        case "Chance of Thunderstorms":
        case "Thunderstorms and Rain":
        case "Thunderstorms and Snow":
        case "Thunderstorms and Ice Pellets":
        case "Thunderstorms with Hail":
        case "Thunderstorms with Small Hail":
            return '/BusTracker/img/weatherIcons/35.png'
            break;
        case "Overcast":
            return '/BusTracker/img/weatherIcons/30.png'
            break;
        case "Clear":
            return '/BusTracker/img/weatherIcons/32.png'
            break;
        case "Partly Cloudy":
            return '/BusTracker/img/weatherIcons/30.png'
            break;
        case "Mostly Cloudy":
            return '/BusTracker/img/weatherIcons/28.png'
            break;
        case "Scattered Clouds":
            return '/BusTracker/img/weatherIcons/30.png'
            break;
        case "Haze":
            return '/BusTracker/img/weatherIcons/30.png'
            break;
        case "Unknown":
            return '/BusTracker/img/weatherIcons/na.png'
            break;
        default:
            return '/BusTracker/img/weatherIcons/31.png'
            break;
    }
}
