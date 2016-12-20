var express = require('express');
var request = require('request');
var moment = require('moment');



var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/routes/'));

//  API URLs:
var pinkTrackerURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=838ed1580f4242f09a361dfb6b8ff32c&mapid=40830&max=5&rt=Pink&outputType=json";
var busTrackerBase = "http://ctabustracker.com/bustime/api/v2/getpredictions?key=iKCawwmjUxPi6NQqeYaB2azjw";
var Bus18URL = "&rt=18&stpid=6813,6765&top=5&format=json";
var Bus60URL = "&rt=60&stpid=6375,6337&top=5&format=json";
var wallpaperJSONURL = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US";

var plLoopTimes = []; //array for predicted arrival of Pink line Loop bound trains
var pl54Times = []; //array for predicted arrival of Pink line 54th/cermak bound trains
var bus18East = []; //array for predicted arrival of 18th eastbound buses
var bus18West = []; //array for predicted arrival of 18th westbound buses
var bus60East = []; //array for predicted arrival of 60 eastbound buses
var bus60West = []; //array for predicted arrival of 60 westbound buses
var wallpaperURL;

getPLData();
get18Data();
get60Data();
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
        moment: moment
    })
});

app.listen(8888);
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

function get18Data(){
    var url = busTrackerBase + Bus18URL;
    request({
        url: url,
        json: true
    }, function(err, res, body){
        if (err) throw err;
        else if (!err && res.statusCode === 200){
            var ETAs = body['bustime-response'].prd;
            if (bus18East.length != 0 && bus18West.length != 0){
                bus18East = [];
                bus18West = [];
            }
            ETAs.forEach(function(eta){
                if(eta.rtdir === "Eastbound"){
                    bus18East.push(eta);
                }
                else if(eta.rtdir === "Westbound"){
                    bus18West.push(eta);
                }
            });
        }
    });
}

function get60Data(){
var url = busTrackerBase + Bus60URL;
    request({
        url: url,
        json: true
    }, function(err, res, body){
        if (err) throw err;
        else if (!err && res.statusCode === 200){
            var ETAs = body['bustime-response'].prd;
            if (bus60East.length != 0 && bus60West.length != 0){
                bus60East = [];
                bus60West = [];
            }
            ETAs.forEach(function(eta){
                if(eta.rtdir === "Eastbound"){
                    bus60East.push(eta);
                }
                else if(eta.rtdir === "Westbound"){
                    bus60West.push(eta);
                }
            });
        }
    });
}
function getWeatherData(){

}
function getNewsData(){

}

function getWallpaperOfTheDay(){
    request({
        url: wallpaperJSONURL,
        json: true
    }, function(err, res, body){
        if (err) throw err;
        else if(!err && res.statusCode === 200){
            wallpaperURL = "http://bing.com/" +  body.images[0].url;
            console.log(wallpaperURL);
        }
    })
}