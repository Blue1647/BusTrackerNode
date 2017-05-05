var request = require('request');

var weatherAPIKey = "12d2e28ea368c6f7"
var currWeatherURL = "http://api.wunderground.com/api/" + weatherAPIKey + "/conditions/q/IL/Chicago.json"
var futureWeatherURL = "http://api.wunderground.com/api/" + weatherAPIKey + "/forecast/q/IL/Chicago.json"
var currWeather = []; //array for current weather conditions
var futureWeather = []; //array for future weather conditions

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


module.exports = {
    getWeatherData: getWeatherData,
    futureWeather: futureWeather,
    currWeather: function () {
        return currWeather;
    }
}