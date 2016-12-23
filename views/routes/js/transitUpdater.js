jQuery(function($){
    var plLoopTimes = document.getElementById("PlLoop"); //class for predicted arrival of Pink line Loop bound trains
    var pl54Times = document.getElementById("Pl54"); //class for predicted arrival of Pink line 54th/cermak bound trains
    var bus18East = document.getElementById("east18"); //class for predicted arrival of 18th eastbound buses
    var bus18West = document.getElementById("west18"); //class for predicted arrival of 18th westbound buses
    var bus60East = document.getElementById("east60"); //class for predicted arrival of 60 eastbound buses
    var bus60West = document.getElementById("west60"); //class for predicted arrival of 60 westbound buses
    var socket = io.connect();
    console.log("Updating data...");
    socket.on('plLoopTimes', function(data){
        console.log(data);
    });

});




function updateTransit() {
    var socket = io.connect();
    console.log("Updating data...");
    socket.on('plLoopTimes', function(data){
        console.log(data);
    });

}

