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

var plLoopTimes = []; //array for predicted arrival of Pink line Loop bound trains
var pl54Times = []; //array for predicted arrival of Pink line 54th/cermak bound trains
var bus18East = []; //array for predicted arrival of 18th eastbound buses
var bus18West = []; //array for predicted arrival of 18th westbound buses
var bus60East = []; //array for predicted arrival of 60 eastbound buses
var bus60West = []; //array for predicted arrival of 60 westbound buses
var ubers = []; //array for predicted arrival of Ubers
var lyfts = []; //array for predicted arrival of Lyfts
var wallpaperURL; // bing wallpaper of the day URL 
var time = moment(new Date).format("dddd, MMMM D, YYYY hh:mm:ss A");

getTransitData();
getUberData();
setInterval(function () { getTransitData() }, 60000);
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
        moment: moment
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
            ETAs.forEach(function (eta) {

                if (eta.destNm === "Loop") {
                    plLoopTimes.push(eta);
                }
                else {
                    pl54Times.push(eta);
                }
            });
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
                    }
                    else if (eta.rtdir === "Westbound") {
                        bus18West.push(eta);
                    }
                });
            }
            else {
                
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
                    }
                    else if (eta.rtdir === "Westbound") {
                        bus60West.push(eta);
                    }
                });
            }
            else {
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
                if (uber.localized_display_name === "uberPOOL" || uber.localized_display_name === "uberX") {
                    ubers.push(uber);
                }
            })
        }
    }
    )
}
function getWeatherData() {

}
function getNewsData() {

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

function getTransitData() {
    console.log("getting transit data...");
    get18Data();
    get60Data();
    getPLData();
    var test = "this is a test";
    io.sockets.emit('pl54Times', pl54Times);
    io.sockets.emit('plLoopTimes', plLoopTimes);
}