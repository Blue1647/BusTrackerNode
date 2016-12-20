$(document).ready(
    function () {
        $(".weatherPanels").hide();
        $(".busPanels").hide();
        loadPanels();
        setInterval("loadPanels()", 30000);
    }
)

function loadBusPanels() {
    $(".busPanels").fadeIn("slow");
}

function hideBusPanels() {
    $(".busPanels").fadeOut("slow");
}

function loadWeatherPanels() {
    $(".weatherPanels").fadeIn("slow");
}

function hideWeatherPanels() {
    $(".weatherPanels").fadeOut("slow");
}

function loadPanels() {
    loadBusPanels();
    setTimeout(function () {
        hideBusPanels();
        loadWeatherPanels();
    }, 15000);
    setTimeout(function () {
        hideWeatherPanels();
        loadBusPanels();
    }, 30000);
}
