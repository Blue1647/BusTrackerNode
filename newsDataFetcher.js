var request = require('request');
var async = require('async');
var newsApiKey = "0d58b36380f045f48f7aa174c8083ba6";
var cnnNewsUrl = "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=" + newsApiKey;
var businessInsiderNewsUrl = "https://newsapi.org/v1/articles?source=business-insider&sortBy=top&apiKey=" + newsApiKey;
var apNewsUrl = "https://newsapi.org/v1/articles?source=associated-press&sortBy=top&apiKey=" + newsApiKey;

var newsUrls = [cnnNewsUrl, businessInsiderNewsUrl, apNewsUrl];

var news = []; //array for news headlines and abstracts

function getNewsData() {

    async.map(newsUrls, function (url, callback) {
        request(url, function (err, res, body) {
            // body.articles.forEach(function (article) {
            //     news.push(article);
            // });
            callback(err, body);
        });
    },
        function (err, results) {
            results.forEach(function(result){
                news.push(JSON.parse(result).articles);
            })
            if (err) throw err;
            console.log(news);
        });
}

function getCnnData() {
    request({
        url: cnnNewsUrl,
        json: true
    }, function (err, res, body) {
        body.articles.forEach(function (article) {
            news.push(article);
        });
    })
}

function getBusinessInsiderData() {
    request({
        url: businessInsiderNewsUrl,
        json: true
    }, function (err, res, body) {
        body.articles.forEach(function (article) {
            news.push(article);
        });
    })
}


function getApData() {
    request({
        url: apNewsUrl,
        json: true
    }, function (err, res, body) {
        body.articles.forEach(function (article) {
            news.push(article);
        });
    })
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