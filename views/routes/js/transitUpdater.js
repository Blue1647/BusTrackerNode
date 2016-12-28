jQuery(function ($) {
    var plLoopTimes = document.getElementById("PlLoop"); //class for predicted arrival of Pink line Loop bound trains
    var pl54Times = document.getElementById("Pl54"); //class for predicted arrival of Pink line 54th/cermak bound trains
    var bus18East = document.getElementById("east18"); //class for predicted arrival of 18th eastbound buses
    var bus18West = document.getElementById("west18"); //class for predicted arrival of 18th westbound buses
    var bus60East = document.getElementById("east60"); //class for predicted arrival of 60 eastbound buses
    var bus60West = document.getElementById("west60"); //class for predicted arrival of 60 westbound buses
    var ubers = document.getElementById("uber"); //class for predicted arrivalof ubers
    var socket = io.connect();
    console.log("Updating data...");
    /*
         plLoopTimes: plLoopTimes,
        pl54Times: pl54Times,
        bus18East: bus18East,
        bus18West: bus18West,
        bus60East: bus60East,
        bus60West: bus60West,
    */
    socket.on('plLoopTimes', function (data) {
        plLoopTimes.innerHTML = "";
        data.forEach(function (transitObj) {
            plLoopTimes.innerHTML += "<ol>" + moment(transitObj.arrT).format("h:mm A") + "</ol>";
        });
    });
    socket.on('pl54Times', function (data) {
        pl54Times.innerHTML = "";
        data.forEach(function (transitObj) {
            pl54Times.innerHTML += "<ol>" + moment(transitObj.arrT).format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus18East', function (data) {
        bus18East.innerHTML = "";
        data.forEach(function (eta) {
            bus18East.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus18West', function (data) {
        bus18West.innerHTML= "";
        data.forEach(function (eta) {
            bus18West.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus60East', function (data) {
        bus60East.innerHTML = "";
        data.forEach(function (eta) {
            bus60East.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('bus60West', function (data) {
        bus60West.innerHTML = "";
        data.forEach(function (eta) {
            bus60West.innerHTML += "<ol>" + moment(new Date).add(eta.prdctdn, 'm').format("h:mm A") + "</ol>";
        });
    });
    socket.on('ubers', function (data) {
        ubers.innerHTML = "";
        data.forEach(function (uber) {
            ubers.innerHTML += "<ol>" + uber.localized_display_name + ": " + Math.floor((uber.estimate)/60) + " mins away</ol>";
        });
    });

});




function updateTransit() {
    var socket = io.connect();
    console.log("Updating data...");
    socket.on('plLoopTimes', function (data) {
        console.log(data);
    });

}

