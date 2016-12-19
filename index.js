var express = require('express');



var app = express();
app.set('view engine', 'ejs');

//  API URLs:
var pinkTrackerURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=838ed1580f4242f09a361dfb6b8ff32c&mapid=40830&max=5&rt=Pinkhttp://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=838ed1580f4242f09a361dfb6b8ff32c&mapid=40830&max=5&rt=Pink&outputType=json";
var busTrackerBase = "http://ctabustracker.com/bustime/api/v2/getpredictions?key=iKCawwmjUxPi6NQqeYaB2azjw";
var Bus18URL = "&rt=18&stpid=6813,6765&top=5&format=json";
var Bus60URL = "&rt=60&stpid=6375,6337&top=5&format=json";



function getPLData() {
    
}


app.get('/', function(req, res) {
   res.render('routes/index') 
});

app.listen(8888);



