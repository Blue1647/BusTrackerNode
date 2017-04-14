/*
    This JS file which runs on the client side connects to the backend Node server via a socket and all the data (transit data, news data, Uber/Lyft
    data, weather data, etcc. Is then sent and received via that socket connection.
    (C) 2017 Rakesh Das - https://rakeshdas.com
*/
jQuery(function ($) {
    var plLoopTimes = document.getElementById("PlLoop"); //element for predicted arrival of Pink line Loop bound trains
    var pl54Times = document.getElementById("Pl54"); //element for predicted arrival of Pink line 54th/cermak bound trains
    var bus18East = document.getElementById("east18"); //element for predicted arrival of 18th eastbound buses
    var bus18West = document.getElementById("west18"); //element for predicted arrival of 18th westbound buses
    var bus60East = document.getElementById("east60"); //element for predicted arrival of 60 eastbound buses
    var bus60West = document.getElementById("west60"); //element for predicted arrival of 60 westbound buses
    var ubers = document.getElementById("uber"); //element for predicted arrival of ubers
    var lyfts = document.getElementById("lyft"); //element for predicted arrival of lyfts
    var news = document.getElementById("news") //element for news headlines and abstracts
    var currCond = document.getElementById("curr-cond"); //element for current conditions

    var socket = io.connect();
    socket.on('plLoopTimes', function (data) {
        plLoopTimes.innerHTML = "";
        if(data.length == 0) plLoopTimes.innerHTML = "Sorry, no service is scheduled. <img src=\"img/sad.png\" height=\"50\" width=\"50\"/>";
        data.forEach(function (transitObj) {
            plLoopTimes.innerHTML += "<ol>" + moment(transitObj.arrT).format("h:mm A") + "</ol>";
        });
    });
    socket.on('pl54Times', function (data) {
        pl54Times.innerHTML = "";
        if(data.length == 0) pl54Times.innerHTML = "Sorry, no service is scheduled. <img src=\"img/sad.png\" height=\"50\" width=\"50\"/>";
        data.forEach(function (transitObj) {
            pl54Times.innerHTML += "<ol>" + moment(transitObj.arrT).format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus18East', function (data) {
        bus18East.innerHTML = "";
        if(data.length == 0) bus18East.innerHTML = "Sorry, no service is scheduled. <img src=\"img/sad.png\" height=\"50\" width=\"50\"/>";
        data.forEach(function (eta) {
            bus18East.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus18West', function (data) {
        bus18West.innerHTML = "";
        if(data.length == 0) bus18West.innerHTML = "Sorry, no service is scheduled. <img src=\"img/sad.png\" height=\"50\" width=\"50\"/>";
        data.forEach(function (eta) {
            bus18West.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus60East', function (data) {
        bus60East.innerHTML = "";
        if(data.length == 0) bus60East.innerHTML = "Sorry, no service is scheduled. <img src=\"img/sad.png\" height=\"50\" width=\"50\"/>";
        data.forEach(function (eta) {
            bus60East.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus60West', function (data) {
        bus60West.innerHTML = "";
        if(data.length == 0) bus60West.innerHTML = "Sorry, no service is scheduled. <img src=\"img/sad.png\" height=\"50\" width=\"50\"/>";
        data.forEach(function (eta) {
            bus60West.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('ubers', function (data) {
        ubers.innerHTML = "";
        data.forEach(function (uber) {
            if (Math.floor((uber.estimate) / 60) == 1) {
                ubers.innerHTML += "<ol>" + uber.localized_display_name + ": " + Math.floor((uber.estimate) / 60) + " min away</ol>";
            } else {
                ubers.innerHTML += "<ol>" + uber.localized_display_name + ": " + Math.floor((uber.estimate) / 60) + " mins away</ol>";
            }
        });
    });
    socket.on('lyfts', function (data) {

            console.log("Lyfts = " + JSON.stringify(data));
        lyfts.innerHTML = "";
        data.forEach(function (lyft) {
            if (Math.floor((lyft.eta_seconds) / 60) == 1) {
                lyfts.innerHTML += "<ol>" + lyft.display_name + ": " + Math.floor((lyft.eta_seconds) / 60) + " min away</ol>";
            }
            else {
                lyfts.innerHTML += "<ol>" + lyft.display_name + ": " + Math.floor((lyft.eta_seconds) / 60) + " mins away</ol>";
            }
        });
    });
    socket.on('news', function (data) {
        news.innerHTML = "";
        data.forEach(function (newsData) {
            news.innerHTML += "<b class = \"hl\">" + newsData.title + "</b>" + ": " + newsData.abstract + "&nbsp;" + "&nbsp;" + "&nbsp;" + "&nbsp;" + "&nbsp;" + "&nbsp;"
        });
    });

    socket.on('currWeather', function (data) {
        currCond.innerHTML = "";
        var currTemp = Math.round(data.temp_f);
        var currFeelsLikeTemp = Math.round(data.feelslike_f);
        var currCondStr = data.weather;
        var colors = getColorForTemp(currTemp);
        currCond.innerHTML = "Current temperature: " + currTemp + "&deg;F<br>" + "Feels like: " + currFeelsLikeTemp + "&deg;F<br>" + "Current conditions: " + currCondStr;
        document.getElementById("condIco").src = getIconForCond(currCondStr);
        document.getElementById("curr-heading").style.backgroundColor = colors.head;
        document.getElementById("curr-body").style.backgroundColor = colors.body;
    });
    socket.on('futureWeather', function (data) {
        data.forEach(function (data, i) {
            var dateDay = data.date.weekday;
            var highTemp = data.high.fahrenheit;
            var lowTemp = data.low.fahrenheit;
            var cond = data.conditions;
            var colors = getColorForTemp(highTemp);
            var dayIco = getIconForCond(cond);
            document.getElementById("day" + i + "-heading").innerHTML = dateDay;
            document.getElementById("day" + i + "-heading").style.color = "white";
            document.getElementById("day" + i + "-heading").style.backgroundColor = colors.head;
            document.getElementById("day" + i + "-panel").style.backgroundColor = colors.body;
            document.getElementById("day" + i + "-panel").innerHTML = highTemp + "&deg;F\/" + lowTemp + "&deg;F <br>" + cond + "<br> <img src=\"" + dayIco + "\"\/>"

        });
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
    if (temp > -20 && temp <= -10) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > -9 && temp <= 0) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 1 && temp <= 10) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 11 && temp <= 20) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 21 && temp <= 30) {
        var head = '#002C5A'; //header color
        var body = '#195CA2'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 31 && temp <= 40) {
        var head = '#27AE60'; //header color
        var body = '#2ECC71'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 41 && temp <= 50) {
        var head = '#27AE60'; //header color
        var body = '#2ECC71'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 51 && temp <= 60) {
        var head = '#27AE60'; //header color
        var body = '#2ECC71'; //body color

        return {
            head: head,
            body: body
        };
    } else if (temp > 61 && temp <= 70) {
        var head = '#FFBC00'; //header color
        var body = '#FF9B00'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 71 && temp <= 80) {
        var head = '#FFBC00'; //header color
        var body = '#FF9B00'; //body color
        return {
            head: head,
            body: body
        };
    } else if (temp > 81 && temp <= 90) {
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
    } else {
        var head = '#FFBC00'; //header color
        var body = '#FF9B00'; //body color
        return {
            head: head,
            body: body
        };
    }

}