// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

// Application starting point

var remote = require('electron').remote;
var BrowserWindow = require('electron').BrowserWindow;
var app = remote.app;

//Add close / minimize functions to make the on screen buttons functional
function init() {
  document.getElementById("close-btn").addEventListener("click", function (e) {
       app.quit();
  });
  document.getElementById("min-btn").addEventListener("click", function (e) {
       remote.BrowserWindow.getFocusedWindow().minimize();
       //Pause game if minimized while game is in the playstate
       if(game.getCurrentState().stateName === 'PlayState') game.addState(new PauseState(game))
  });
 };

//Call the init function when the DOM loads
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
       init();
  }
};
