'use strict';

var electron = require('electron');
var firebase = require('firebase');
var osascript = require('node-osascript');
var _ = require('lodash');
var moment = require('moment');

var app = electron.app,
    BrowserWindow = electron.BrowserWindow,
    ipcMain = electron.ipcMain;


var mainWindow = void 0;
// let currentTab = runAppleScript(true) || "";
var visitTime = 0;

app.on('ready', function () {
    console.log("hello");

    var screen = electron.screen.getPrimaryDisplay();
    var width = screen.size.width;
    var height = screen.size.height;


    mainWindow = new BrowserWindow({
        height: height,
        width: width,
        webPreferences: {
            backgroundThrottling: false
        }
    });

    mainWindow.setMinimumSize(Math.ceil(width / 2), Math.ceil(height / 1.2));

    mainWindow.loadURL('file://' + __dirname + '/public/views/index.html');
});

ipcMain.on('start', function () {
    console.log("hello");
    calculateWebsiteTime();
});

function calculateWebsiteTime() {
    setInterval(function () {
        runAppleScript(false);
    }, 1000);
}
//
function runAppleScript(isFirstTime) {
    console.log("hello");
    osascript.executeFile(__dirname + '/src/applescripts/active_tab_script.scpt', function (err, result, raw) {
        if (err) {
            return console.error("ERR", err);
        }

        visitTime++;
        console.log(result, currentTab, visitTime);

        if (result !== currentTab && !isFirstTime) {

            console.log("Tab changed", result);

            if (result && currentTab !== "") {
                // mainWindow.webContents.send("addWebsiteVisitedTime:data", { currentTab, visitTime });
                //doFirebaseStuff({ currentTab, visitTime });
            }

            currentTab = result;
            visitTime = 0;
        }
    });
}