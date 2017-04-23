/*
    This JS file is the main entry point for the server app. This runs the express server, creates the socket connection with the client side and gets all the necessary data from 
    the APIs.
    (C) Rakesh Das https://rakeshdas.com
*/

var ctaDataFetcher = require('./ctaDataFetcher');
var ridesharingDataFetcher = require('./ridesharingDataFetcher');
var newsDataFetcher = require('./newsDataFetcher.js');
var weatherDataFetcher = require('./weatherDataFetcher');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var request = require('request');
var moment = require('moment');
var os = require('os');


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/routes/'));

//  API URLs:
var wallpaperJSONURL = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US";
var optSys = os.platform(); //determines current os to account for proper file paths
var routesPath; // route path for the server

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

determineProperFilePath();
getWeatherData();
getAllData();
setInterval(getWeatherData, 3600000);
setInterval(function () {
    sendAllData()
}, 1000);
setInterval(function () {
    getAllData()
}, 60000);
getWallpaperOfTheDay();
setInterval(getWallpaperOfTheDay, 10800000) //3 hrs
app.get('/', function (req, res) {
    res.render(routesPath, {
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

function getWeatherData() {
    weatherDataFetcher.getWeatherData();
    currWeather = weatherDataFetcher.currWeather;
    futureWeather = weatherDataFetcher.futureWeather;
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
function determineProperFilePath(){
    if (optSys == 'linux') {
        //absolute path for server
        routesPath = '/var/www/html/BusTrackerNode/views/routes/index';
    }
    else {
        routesPath = 'routes/index';
    }
    console.log("Route: " + routesPath);
}
function getAllData() {
    console.log("getting data...");
    ctaDataFetcher.get18Data();
    ctaDataFetcher.get60Data();
    ctaDataFetcher.getPLData();
    pl54Times = ctaDataFetcher.pl54Times;
    plLoopTimes = ctaDataFetcher.plLoopTimes;
    bus18East = ctaDataFetcher.bus18East;
    bus18West = ctaDataFetcher.bus18West;
    bus60East = ctaDataFetcher.bus60East;
    bus60West = ctaDataFetcher.bus60West;
    ridesharingDataFetcher.getUberData();
    ridesharingDataFetcher.getLyftEtaData();
    lyfts = ridesharingDataFetcher.lyfts;
    ubers = ridesharingDataFetcher.ubers;
    newsDataFetcher.getNewsData();
    news = newsDataFetcher.news;
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