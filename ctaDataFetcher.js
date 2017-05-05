/*
    This JS file is the handles calling the CTA API and getting the necessary data from it.
    (C) Rakesh Das https://rakeshdas.com
*/


var request = require('request');

//  API URLs:
var pinkTrackerURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=838ed1580f4242f09a361dfb6b8ff32c&mapid=40830&max=5&rt=Pink&outputType=json";
var busTrackerBase = "http://ctabustracker.com/bustime/api/v2/getpredictions?key=iKCawwmjUxPi6NQqeYaB2azjw";
var Bus18URL = "&rt=18&stpid=6813,6765&top=5&format=json";
var Bus60URL = "&rt=60&stpid=6375,6337&top=5&format=json";

//data arrays:
var plLoopTimes = []; //array for predicted arrival of Pink line Loop bound trains
var pl54Times = []; //array for predicted arrival of Pink line 54th/cermak bound trains
var bus18East = []; //array for predicted arrival of 18th eastbound buses
var bus18West = []; //array for predicted arrival of 18th westbound buses
var bus60East = []; //array for predicted arrival of 60 eastbound buses
var bus60West = []; //array for predicted arrival of 60 westbound buses




function getPLData() {
    console.log("getting PL data...");  
    request({
        url: pinkTrackerURL,
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        else if (!err, res.statusCode === 200) {
            if (body.ctatt.eta != undefined || body.ctatt.eta != null) {
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
            else {
                pl54Times = [];
                plLoopTimes = [];
            }
        }
        console.log("After 54th response " + pl54Times.length);
        console.log("After loop response " + plLoopTimes.length);
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

module.exports = {
    get18Data: get18Data,
    get60Data: get60Data,
    getPLData: getPLData,
    plLoopTimes: function () {
        return plLoopTimes;
    },
    pl54Times: function () {
        return pl54Times;
    },
    bus18East: bus18East,
    bus18West:bus18West,
    bus60East: bus60East,
    bus60West: bus60West
}