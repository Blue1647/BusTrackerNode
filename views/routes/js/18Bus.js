$(document).ready(
    function () {
        getData18();
        setInterval("getData18()", 60000);
    }
)

function getData18() {
    $(".west18").html("");
    $(".east18").html("");
    $.ajax({
        url: "http://www.ctabustracker.com/bustime/api/v1/getpredictions?key=iKCawwmjUxPi6NQqeYaB2azjw&rt=18&stpid=6813,6765",
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
                    $(".west18").append("<ol>" + formatForTime(time) + "</ol>");
                } else if (direction == 'Eastbound') {
                    $(".east18").append("<ol>" + formatForTime(time) + "</ol>");
                }
            })
            $(xml).find('error').each(function () {
                var msg = ($(this).find('msg').text());
                if (msg == 'No service scheduled') {
                    $(".errWest18").html("No service scheduled :( ");
                    $(".errEast18").html("No service scheduled :( ");
                } else if (msg == "No arrival times") {
                    $(".errWest18").html("No arrival times :( ");
                    $(".errEast18").html("No arrival times :( ");
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
