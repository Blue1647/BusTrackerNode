$(document).ready(
    function () {
        hideAllPanels();
        loadPanels();
        setInterval("loadPanels()", 30000);
    }
)

function loadBusPanel() {
    $(".busPanel").fadeIn("slow");
}

function hideBusPanel() {
    $(".busPanel").fadeOut("slow");
}

function loadWeatherPanel() {
    $(".weatherPanel").fadeIn("slow");
}

function hideWeatherPanel() {
    $(".weatherPanel").fadeOut("slow");
}
function loadRidesharingPanel() {
    $(".ridesharingPanel").fadeIn("slow");
}
function hideRidesharingPanel() {
    $(".ridesharingPanel").fadeOut("slow");
}
function loadSocialPanel() {
    $(".socialPanel").fadeIn("slow");
}
function hideSocialPanel() {
    $(".socialPanel").fadeOut("slow");
}
function hideAllPanels() {
    hideBusPanel();
    hideRidesharingPanel();
    hideWeatherPanel();
    hideSocialPanel();
}

function loadPanels() {
    loadBusPanel();
    setTimeout(function () {
        hideAllPanels();
        loadWeatherPanels();
    }, 15000);
    setTimeout(function () {
        hideAllPanels();
        loadBusPanel();
    }, 30000);
    setTimeout(function () {
        hideAllPanels();
        loadRidesharingPanel();
    }, 45000);
    setTimeout(function () {
        hideAllPanels();
        loadSocialPanel();
    }, 60000);
}
