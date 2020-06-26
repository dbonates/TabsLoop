let timerID;
let timerLimit = 5;
var timeRemaining = timerLimit;
var runningTimer = false;

document.addEventListener('DOMContentLoaded', function () {
    loadPreferences();
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'TOOGLE_TIMER') {
        runningTimer ? stopTimer() : startTimer(request.value);
        
    }
    return true;
});

function loadPreferences() {

    chrome.storage.local.get('timerLimit', function(result) {
        let val = result['timerLimit'];
        recoveredTimerLimit = Number(val);
        timerLimit = isNaN(recoveredTimerLimit) ? timerLimit : recoveredTimerLimit;
        
        startTimerIfNeeded();

      });
}

function startTimerIfNeeded() {
    chrome.storage.local.get('isOn', function (result) {
        if (result['isOn']) {
            startTimer();
        }
    });
}

function startTimer(value) {
    if (!isNaN(value)) { timerLimit = Number(value); }
    timerID = setInterval(() => {
        updateTabs();
    }, 1000);
    runningTimer = true;
    return true
}

function stopTimer() {
    timeRemaining = timerLimit
    clearInterval(timerID);
    runningTimer = false;
}

function updateTabs() {

    chrome.tabs.query({ currentWindow: true }, function (tabs) {

        var totalTabs = tabs.length;
        var activeTabIndex;

        for (let index = 0; index < tabs.length; index++) {
            if (tabs[index].highlighted) {
                activeTabIndex = index;
            }
        }

        timeRemaining--;
        if (timeRemaining < 1) {
            activeTabIndex++;
            if (activeTabIndex > totalTabs - 1) {
                activeTabIndex = 0;
            }

            chrome.tabs.highlight({ 'tabs': activeTabIndex }, function () { });
            timeRemaining = timerLimit;
        }
    });
}
