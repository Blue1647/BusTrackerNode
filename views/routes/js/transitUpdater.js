jQuery(function ($) {
    var plLoopTimes = document.getElementById("PlLoop"); //class for predicted arrival of Pink line Loop bound trains
    var pl54Times = document.getElementById("Pl54"); //class for predicted arrival of Pink line 54th/cermak bound trains
    var bus18East = document.getElementById("east18"); //class for predicted arrival of 18th eastbound buses
    var bus18West = document.getElementById("west18"); //class for predicted arrival of 18th westbound buses
    var bus60East = document.getElementById("east60"); //class for predicted arrival of 60 eastbound buses
    var bus60West = document.getElementById("west60"); //class for predicted arrival of 60 westbound buses
    var ubers = document.getElementById("uber"); //class for predicted arrival of ubers
    var currCond = document.getElementById("curr-cond");//class for current conditions
    var day1 = document.getElementById
    var socket = io.connect();
    console.log("Updating data...");
    /*
         plLoopTimes: plLoopTimes,
        pl54Times: pl54Times,
        bus18East: bus18East,
        bus18West: bus18West,
        bus60East: bus60East,
        bus60West: bus60West,
    */
    socket.on('plLoopTimes', function (data) {
        plLoopTimes.innerHTML = "";
        data.forEach(function (transitObj) {
            plLoopTimes.innerHTML += "<ol>" + moment(transitObj.arrT).format("h:mm A") + "</ol>";
        });
    });
    socket.on('pl54Times', function (data) {
        pl54Times.innerHTML = "";
        data.forEach(function (transitObj) {
            pl54Times.innerHTML += "<ol>" + moment(transitObj.arrT).format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus18East', function (data) {
        bus18East.innerHTML = "";
        data.forEach(function (eta) {
            bus18East.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus18West', function (data) {
        bus18West.innerHTML = "";
        data.forEach(function (eta) {
            bus18West.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus60East', function (data) {
        bus60East.innerHTML = "";
        data.forEach(function (eta) {
            bus60East.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus60West', function (data) {
        bus60West.innerHTML = "";
        data.forEach(function (eta) {
            bus60West.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('ubers', function (data) {
        ubers.innerHTML = "";
        data.forEach(function (uber) {
            ubers.innerHTML += "<ol>" + uber.localized_display_name + ": " + Math.floor((uber.estimate) / 60) + " mins away</ol>";
        });
    });
    socket.on('currWeather', function (data) {
        currCond.innerHTML = "";
        var currTemp = Math.round(data.temp_f);
        var currFeelsLikeTemp = Math.round(data.feelslike_f);
        var currCondStr = data.weather;
        var colors = getColorForTemp(currTemp);
        console.log(colors);
        currCond.innerHTML = "Current temperature: " + currTemp + "&deg;F<br>" + "Feels like: " + currFeelsLikeTemp + "&deg;F<br>" + "Current conditions: " + currCondStr;
        document.getElementById("condIco").src = getIconForCond(currCondStr);
        document.getElementById("curr-heading").backgroundColor = colors.head;
        document.getElementById("curr-body").backgroundColor=colors.body;
    });
    socket.on('futureWeather', function (data) {
        // ubers.innerHTML = "";
    });
});




function updateTransit() {
    var socket = io.connect();
    console.log("Updating data...");
    socket.on('plLoopTimes', function (data) {
        console.log(data);
    });

}

function getIconForCond(cond) {
    switch (cond) {
        case "Drizzle":
        case "Freezing Drizzle":
            return '../img/weatherIcons/12.png'
            break;
        case "Rain":
        case "Chance of Rain":
        case "Chance of Freezing Rain":
        case "Chance Rain":
        case "Freezing Rain":
        case "Rain Mist":
        case "Rain Showers":
            return '../img/weatherIcons/40.png'
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
            return '../img/weatherIcons/14.png'
            break;
        case "Ice Crystals":
        case "Ice Pellets":
        case "Ice Pellet Showers":
            return '../img/weatherIcons/10.png'
            break;
        case "Hail":
        case "Hail Showers":
        case "Small Hail Showers":
        case "Small Hail":
            return '../img/weatherIcons/10.png'
            break;
        case "Mist":
            return '../img/weatherIcons/22.png'
            break;
        case "Fog":
        case "Patches of Fog":
        case "Shallow Fog":
        case "Partial Fog":
        case "Freezing Fog":
        case "Fog Patches":
            return '../img/weatherIcons/24.png'
            break;
        case "Thunderstorm":
        case "Chance of a Thunderstorm":
        case "Chance of Thunderstorms":
        case "Thunderstorms and Rain":
        case "Thunderstorms and Snow":
        case "Thunderstorms and Ice Pellets":
        case "Thunderstorms with Hail":
        case "Thunderstorms with Small Hail":
            return '../img/weatherIcons/35.png'
            break;
        case "Overcast":
            return '../img/weatherIcons/30.png'
            break;
        case "Clear":
            return '../img/weatherIcons/32.png'
            break;
        case "Partly Cloudy":
            return '../img/weatherIcons/30.png'
            break;
        case "Mostly Cloudy":
            return '../img/weatherIcons/28.png'
            break;
        case "Scattered Clouds":
            return '../img/weatherIcons/30.png'
            break;
        case "Haze":
            return '../img/weatherIcons/30.png'
            break;
        case "Unknown":
            return '../img/weatherIcons/na.png'
            break;
        default:
            return '../img/weatherIcons/31.png'
            break;
    }
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