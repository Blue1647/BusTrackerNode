var request = require('request');
//API URLs:
var uberURL = "https://api.uber.com/v1/estimates/time?start_latitude=41.85841&start_longitude=-87.66033&server_token=9887VDxjbb26U2nMl9osSiKIGY48XGRQ2q_k6jBb";
var lyftTokenRequestURL = "https://api.lyft.com/oauth/token";
var lyftEtaURL = "https://api.lyft.com/v1/eta?lat=41.85841&lng=-87.66033"
var lyftClientId = "rdju0U0Gsr6c";
var lyftClientSecret = "7BAXf3njLApyIJcg7dkADCtfVg4EIwKB";
var lyftAccessToken;

//data arrays
var ubers = []; //array for predicted arrival of Ubers
var lyfts = []; //array for predicted arrival of Lyfts

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

module.exports = {
    getLyftData: getLyftData,
    getLyftEtaData: getLyftEtaData,
    getUberData: getUberData,
    lyfts: lyfts,
    ubers: ubers
}