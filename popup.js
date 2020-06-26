var timerToogle;
var isOn;
var totalTimer;

document.addEventListener('DOMContentLoaded', function () {
  timerToogle = document.getElementById('toogleTimer');
  timerToogle.addEventListener("click", toogleTimer);
  totalTimer = document.getElementById('totalTimer');

  chrome.storage.local.get('isOn', function(result) {
    isOn = result['isOn'];
    timerToogle.innerHTML = isOn ? "Stop" : "Start";
  });

  chrome.storage.local.get('timerLimit', function(result) {
    let timerLimitValue = result['timerLimit'];
    totalTimer.value = timerLimitValue == undefined ? 10 : timerLimitValue;
  });

});


function toogleTimer() {
  chrome.runtime.sendMessage({ cmd: 'TOOGLE_TIMER', value: totalTimer.value });
  isOn = !isOn;
  
  chrome.storage.local.set({"timerLimit": totalTimer.value}, function(){});
  chrome.storage.local.set({"isOn": isOn}, function(){});
 
  timerToogle.innerHTML = isOn ? "Stop" : "Start";
}
