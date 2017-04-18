var request = require('request');
var newsApiKey = "0d58b36380f045f48f7aa174c8083ba6";
var cnnNewsUrl = "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=" + newsApiKey;
var businessInsiderNewsUrl = "https://newsapi.org/v1/articles?source=business-insider&sortBy=top&apiKey=" + newsApiKey;
var ApNewsUrl = "https://newsapi.org/v1/articles?source=associated-press&sortBy=top&apiKey=" + newsApiKey;

var news = []; //array for news headlines and abstracts

function getNewsData() {
    getCnnData();
    getBusinessInsiderData();
    getApData();

    //wait for the apis to return data
    setTimeout(function(){}, 2000);
    shuffle(news);
}

function getCnnData() {
    request({
        url: cnnNewsUrl,
        json: true
    }, function (err, res, body) {
        body.articles.forEach(function(article) {
            news.push(article);
        });
    })
}

function getBusinessInsiderData() {
    request({
        url: businessInsiderNewsUrl,
        json: true
    }, function (err, res, body) {
        body.articles.forEach(function(article) {
            news.push(article);
        });
    })
}


function getApData() {
    request({
        url: ApNewsUrl,
        json: true
    }, function (err, res, body) {
        body.articles.forEach(function(article) {
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