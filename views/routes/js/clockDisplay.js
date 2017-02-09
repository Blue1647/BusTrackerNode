$(document).ready(
    function () {
        setInterval(runFunction, 1000);
    })

function runFunction() {
    var time = moment(new Date).format("dddd, MMMM D, YYYY hh:mm:ss A");
    var timeField = document.getElementById('time');
    timeField.innerHTML = time;
};
