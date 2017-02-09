$(document).ready(
    function () {
        getDataPL();
        setInterval("getDataPL()", 60000);

    }
)

function getDataPL() {
    $(".PlLoop").html("");
    $(".Pl54").html("");
    $.ajax({
        url: "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=838ed1580f4242f09a361dfb6b8ff32c&mapid=40830&max=5&rt=Pink",
        type: "GET",
        dataType: "html",
        success: function (data) {
            var xml = $.parseXML(data)
            $(xml).find('eta').each(function () {

                var time = ($(this).find('arrT').text());
                var direction = ($(this).find('destNm').text());
                var splitTime = time.split(' ');
                if (direction == 'Loop') {
                    $(".PlLoop").append("<ol>" + formatForTime(time) + "</ol>");
                } else if (direction == '54th\/Cermak') {
                    $(".Pl54").append("<ol>" + formatForTime(time) + "</ol>");
                }
            });
        }
    });

}

function formatForTime(timeToFormat) {
    var splitArray = timeToFormat.split(' ');
    var hrMin = splitArray[1].substring(0, 5);
    console.log(tConvert(hrMin));
    var convertedTime = tConvert(hrMin);
    return convertedTime;
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
