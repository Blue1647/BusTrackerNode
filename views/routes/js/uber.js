var uberServerToken = "9887VDxjbb26U2nMl9osSiKIGY48XGRQ2q_k6jBb";
var latitude = 41.85841;
var longitude = -87.66033;
$(document).ready(
    function () {
        getEstimatesForUserLocation();
    })

function getEstimatesForUserLocation() {
    $.ajax({
        url: "https://api.uber.com/v1/estimates/time",
        dataType: "text",
        headers: {
            Authorization: "Token " + uberServerToken
        },
        data: {
            start_latitude: latitude,
            start_longitude: longitude
        },
        success: function (result) {
            var json = $.parseJSON(result);
            console.log(json.times);
        }
    });
};
/*JavaScript


https://api.uber.com/v1/estimates/time?start_latitude=41.85841&start_longitude= -87.66033&server_token=9887VDxjbb26U2nMl9osSiKIGY48XGRQ2q_k6jBb*/
