$(document).ready(
    function () {
        getData60();
        setInterval("getData60()", 60000);
    }
)

function getData60() {
    $(".west60").html("");
    $(".east60").html("");
    $.ajax({
        url: "http://www.ctabustracker.com/bustime/api/v1/getpredictions?key=iKCawwmjUxPi6NQqeYaB2azjw&rt=60&stpid=6375,6337&top=5",
        type: "GET",
        dataType: "html",
        success: function (data) {
            var xml = $.parseXML(data)
            $(xml).find('prd').each(function () {
                function formatForTime(timeToFormat) {
                    var splitArray = timeToFormat.split(' ');
                    var convertedTime = tConvert(splitArray[1]);
                    return convertedTime;
                }
                var time = ($(this).find('prdtm').text());
                var direction = ($(this).find('rtdir').text());
                if (direction == 'Westbound') {
                    $(".west60").append("<ol>" + formatForTime(time) + "</ol>");
                } else if (direction == 'Eastbound') {
                    $(".east60").append("<ol>" + formatForTime(time) + "</ol>");
                }
            })
            $(xml).find('error').each(function () {
                var msg = ($(this).find('msg').text());
                if (msg == 'No service scheduled') {
                    $(".errWest60").html("No service scheduled :( ");
                    $(".errEast60").html("No service scheduled :( ");
                } else if (msg == "No arrival times") {
                    $(".errWest60").html("No arrival times :( ");
                    $(".errEast60").html("No arrival times :( ");
                }
            });
        }
    });

}

function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
};
