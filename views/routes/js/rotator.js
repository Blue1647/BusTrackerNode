/*
    This JS file which runs on the client side is responsible for rotating through all of the panels in the application. The panels are the busPanel, ridesharingPanel, weatherPanel,
    and socialPanel.
    (C) 2017 Rakesh Das - https://rakeshdas.com
*/


$(document).ready(
    function () {
        hideAllPanels();
        loadPanels();
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
    $(".weatherPanel").hide();
    $(".busPanel").hide();
    $(".socialPanel").hide();
    $(".ridesharingPanel").hide();
}

function loadPanels() {
    loadBusPanel();
    setInterval(function () {
        hideBusPanel();
        loadRidesharingPanel();
        setTimeout(hideAllPanels, 15000);
        setTimeout(loadWeatherPanel, 15000);
        setTimeout(hideAllPanels, 30000);
        setTimeout(loadSocialPanel, 30000);
        setTimeout(hideAllPanels, 45000);
        setTimeout(loadBusPanel, 45000);
    }, 60100);
}