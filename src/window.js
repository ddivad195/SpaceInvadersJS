// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

// Electron's main process that controls the applications lifecycle

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;

var mainWindow;

// Create window
var init = function () {
    mainWindow = new BrowserWindow({width: 1000, height: 650, frame: false, resizable: false});
}

app.on('ready', function () {
    init();
    // Load index file
    mainWindow.loadURL('file://' + __dirname + '/space-invaders/electron.index.html');

    // Open devTools in a separate window
    // mainWindow.openDevTools({detach:true});
});

// Exit app when the window is closed
app.on('window-all-closed', function () {
    app.quit();
});
