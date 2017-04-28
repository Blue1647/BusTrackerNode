/*
    This JS file is the handles calling the NewsAPI and getting the necessary data from it.
    (C) Rakesh Das https://rakeshdas.com
*/


var request = require('request');
var newsApiKey = "0d58b36380f045f48f7aa174c8083ba6";
var cnnNewsUrl = "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=" + newsApiKey;
var businessInsiderNewsUrl = "https://newsapi.org/v1/articles?source=business-insider&sortBy=top&apiKey=" + newsApiKey;
var apNewsUrl = "https://newsapi.org/v1/articles?source=associated-press&sortBy=top&apiKey=" + newsApiKey;
var nyTimesApiKey_DEV = "e2a3619e1d594b4f8e774a4dbb2083bf";
var nyTimesApiKey_RELEASE = "12b3c10727f9a45375d342ed28c48176:11:72542931";
var nyTimesApi = "http://api.nytimes.com/svc/topstories/v1/home.json?api-key=" + nyTimesApiKey_DEV;

var newsUrls = [cnnNewsUrl, businessInsiderNewsUrl, apNewsUrl];

var news = []; //array for news headlines and abstracts

function getNewsData() {
    request({
        url: nyTimesApi,
        json: true
    }, function (err, res, body) {
        news = body.results;
    });


}


function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}


module.exports = {
    getNewsData: getNewsData,
    news: news
}