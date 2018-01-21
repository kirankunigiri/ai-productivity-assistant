const electron = require('electron');
const osascript = require('node-osascript');
const _ = require('lodash');
const moment = require('moment');
const { app, BrowserWindow, ipcMain } = electron;
const ejs = require('ejs');

let mainWindow;
let currentTab = runAppleScript(true) || "";
let visitTime = 0;

app.on('ready', () => {
    console.log("hello");

    const screen = electron.screen.getPrimaryDisplay();
    const { width } = screen.size;
    const { height } = screen.size;

    mainWindow = new BrowserWindow({
        height,
        width,
        webPreferences: {
            backgroundThrottling: false
        }
    });

    mainWindow.setMinimumSize(Math.ceil(width / 2), Math.ceil(height / 1.2));

    mainWindow.loadURL(`file://${__dirname}/public/views/login.html`);
});

ipcMain.on('start', (e, data) => {
    calculateWebsiteTime()
});

function calculateWebsiteTime() {
    setInterval(() => {
        runAppleScript(false);
    }, 1000);
}
//
function runAppleScript(isFirstTime) {
    osascript.executeFile(`${__dirname}/public/applescripts/active_tab_script.scpt`, function(err, result, raw) {
        if (err) {
            return console.error("ERR", err)
        }

        visitTime++;
        console.log(result, currentTab, visitTime);

        if (result !== currentTab && !isFirstTime) {

            console.log("Tab changed", result);

            if (result && currentTab !== "") {
                mainWindow.webContents.send("addWebsiteVisitedTime", { currentTab, visitTime });
            }

            currentTab = result;
            visitTime = 0;
        }
    });
}