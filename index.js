/*
    This JS file is the main entry point for the server app. This runs the express server, creates the socket connection with the client side and gets all the necessary data from 
    the APIs.
    (C) Rakesh Das https://rakeshdas.com
*/


var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var request = require('request');
var moment = require('moment');



app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/routes/'));

//  API URLs:
var pinkTrackerURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=838ed1580f4242f09a361dfb6b8ff32c&mapid=40830&max=5&rt=Pink&outputType=json";
var busTrackerBase = "http://ctabustracker.com/bustime/api/v2/getpredictions?key=iKCawwmjUxPi6NQqeYaB2azjw";
var Bus18URL = "&rt=18&stpid=6813,6765&top=5&format=json";
var Bus60URL = "&rt=60&stpid=6375,6337&top=5&format=json";
var wallpaperJSONURL = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US";
var uberURL = "https://api.uber.com/v1/estimates/time?start_latitude=41.85841&start_longitude=-87.66033&server_token=9887VDxjbb26U2nMl9osSiKIGY48XGRQ2q_k6jBb";
var lyftTokenRequestURL = "https://api.lyft.com/oauth/token";
var lyftEtaURL = "https://api.lyft.com/v1/eta?lat=41.85841&lng=-87.66033"
var nyTimesApi = "http://api.nytimes.com/svc/topstories/v1/home.json?api-key=12b3c10727f9a45375d342ed28c48176:11:72542931";
var lyftClientId = "rdju0U0Gsr6c";
var lyftClientSecret = "7BAXf3njLApyIJcg7dkADCtfVg4EIwKB";
var lyftAccessToken;
var weatherAPIKey = "12d2e28ea368c6f7"
var currWeatherURL = "http://api.wunderground.com/api/" + weatherAPIKey + "/conditions/q/IL/Chicago.json"
var futureWeatherURL = "http://api.wunderground.com/api/" + weatherAPIKey + "/forecast/q/IL/Chicago.json"

var plLoopTimes = []; //array for predicted arrival of Pink line Loop bound trains
var pl54Times = []; //array for predicted arrival of Pink line 54th/cermak bound trains
var bus18East = []; //array for predicted arrival of 18th eastbound buses
var bus18West = []; //array for predicted arrival of 18th westbound buses
var bus60East = []; //array for predicted arrival of 60 eastbound buses
var bus60West = []; //array for predicted arrival of 60 westbound buses
var ubers = []; //array for predicted arrival of Ubers
var lyfts = []; //array for predicted arrival of Lyfts
var currWeather = []; //array for current weather conditions
var futureWeather = []; //array for future weather conditions
var news = []; //array for news headlines and abstracts
var wallpaperURL; // bing wallpaper of the day URL 
var time = moment(new Date).format("dddd, MMMM D, YYYY hh:mm:ss A");

getWeatherData();
getAllData();
setInterval(function () {
    getAllData()
}, 60000);
setInterval(getWeatherData, 3600000);
setInterval(function () {
    sendAllData()
}, 1000);
getWallpaperOfTheDay();
app.get('/', function (req, res) {
    res.render('routes/index', {
        plLoopTimes: plLoopTimes,
        pl54Times: pl54Times,
        bus18East: bus18East,
        bus18West: bus18West,
        bus60East: bus60East,
        bus60West: bus60West,
        wallpaperURL: wallpaperURL,
        time: time,
        moment: moment,
        ubers: ubers,
        news: news
    })
});


server.listen(8888);
console.log("Running server on http://localhost:8888 ....");

function getPLData() {
    request({
        url: pinkTrackerURL,
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        else if (!err, res.statusCode === 200) {
            var ETAs = body.ctatt.eta
            if (plLoopTimes.length != 0 || pl54Times.length != 0) {
                pl54Times = [];
                plLoopTimes = [];
            }
            if (ETAs.length != 0) {
                ETAs.forEach(function (eta) {

                    if (eta.destNm === "Loop") {
                        plLoopTimes.push(eta);
                    } else {
                        pl54Times.push(eta);
                    }
                });
            }
        }
    });
}

function get18Data() {
    var url = busTrackerBase + Bus18URL;
    request({
        url: url,
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        else if (!err && res.statusCode === 200) {
            var ETAs = body['bustime-response'].prd;
            if (ETAs != null) {
                if (bus18East.length != 0 && bus18West.length != 0) {
                    bus18East = [];
                    bus18West = [];
                }
                ETAs.forEach(function (eta) {
                    if (eta.rtdir === "Eastbound") {
                        bus18East.push(eta);
                    } else if (eta.rtdir === "Westbound") {
                        bus18West.push(eta);
                    }
                });
            } 
        }
    });
}

function get60Data() {
    var url = busTrackerBase + Bus60URL;
    request({
        url: url,
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        else if (!err && res.statusCode === 200) {
            var ETAs = body['bustime-response'].prd;
            if (ETAs != null) {
                if (bus60East.length != 0 && bus60West.length != 0) {
                    bus60East = [];
                    bus60West = [];
                }
                ETAs.forEach(function (eta) {
                    if (eta.rtdir === "Eastbound") {
                        bus60East.push(eta);
                    } else if (eta.rtdir === "Westbound") {
                        bus60West.push(eta);
                    }
                });
            } else {
                bus60West.push("Sorry, no service is scheduled!");
                bus60East.push("Sorry, no service is scheduled!");
            }
        }

    });
}

function getUberData() {
    request({
        url: uberURL,
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        else if (!err && res.statusCode === 200) {
            var uberArr = body.times;
            if (ubers.length != 0) ubers = [];
            uberArr.forEach(function (uber) {
                if (uber.localized_display_name === "uberPOOL" || uber.localized_display_name === "uberX" || uber.localized_display_name === "UberBLACK") {
                    ubers.push(uber);
                }
            })
        }
    })
}

function getLyftData() {
    console.log("getting lyft token...");
    var headers = {
        'Content-Type': 'application/json'
    };

    var dataString = '{"grant_type": "client_credentials", "scope": "public"}';

    var options = {
        url: lyftTokenRequestURL,
        method: 'POST',
        headers: headers,
        body: dataString,
        jsonp: true,
        auth: {
            'user': lyftClientId,
            'pass': lyftClientSecret
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(response.body);
            lyftAccessToken = json.access_token;
            getLyftEtaData();
        } else if (error) {

            console.log(error);
        }
    }
    request(options, callback);

}

function getLyftEtaData() {
    if (lyftAccessToken == null) {
        setTimeout(getLyftData, 50);
    }
    var headers = {
        'Authorization': 'Bearer ' + lyftAccessToken
    };

    var options = {
        url: lyftEtaURL,
        headers: headers
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(response.body);
            lyfts = json.eta_estimates;
        }

        else if (response.statusCode == 401) {
            //if access_token has expired (access_token has lifespan of 24 hrs)
            getLyftData();
        }
    }
    request(options, callback);

}

function getWeatherData() {
    request({
        url: currWeatherURL,
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        else if (!err && res.statusCode === 200) {
            currWeather = body.current_observation;
        }
    });
    request({
        url: futureWeatherURL,
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        else if (!err && res.statusCode === 200) {
            for (var i = 1; i < 4; i++) {
                futureWeather.push(body.forecast.simpleforecast.forecastday[i]);
            }
        }

    })

}

function getNewsData() {
    request({
        url: nyTimesApi,
        json: true
    }, function (err, res, body) {
        news = body.results;
    })

}

function getWallpaperOfTheDay() {
    request({
        url: wallpaperJSONURL,
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        else if (!err && res.statusCode === 200) {
            wallpaperURL = "http://bing.com/" + body.images[0].url;
        }
    })
}

function getAllData() {
    console.log("getting transit data...");
    get18Data();
    get60Data();
    getPLData();
    getUberData();
    getLyftEtaData();
    getNewsData();
}

function sendAllData() {
    io.sockets.emit('pl54Times', pl54Times);
    io.sockets.emit('plLoopTimes', plLoopTimes);
    io.sockets.emit('bus18East', bus18East);
    io.sockets.emit('bus18West', bus18West);
    io.sockets.emit('bus60East', bus60East);
    io.sockets.emit('bus60West', bus60West);
    io.sockets.emit('ubers', ubers);
    io.sockets.emit('lyfts', lyfts);
    io.sockets.emit('currWeather', currWeather);
    io.sockets.emit('futureWeather', futureWeather);
    io.sockets.emit('news', news);


}