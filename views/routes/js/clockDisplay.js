$(document).ready(
    function () {
        setInterval(runFunction, 1000);
    })

function runFunction() {
    var time = new Date().toString("dddd, MMMM d, yyyy h:mm:ss tt");
    var timeField = document.getElementById('time');
    timeField.innerHTML = time;
};
