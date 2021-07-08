const { app,BrowserWindow, ipcMain, autoUpdater, dialog} = require('electron');
const url = require("url");
const path = require("path");

let appWindow

function initWindow() {
    appWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
    nodeIntegration: true
    }
})

// Electron Build Path
// appWindow.loadURL(
//     url.format({
//     pathname: path.join(__dirname, `/dist/index.html`),
//     protocol: "file:",
//     slashes: true
//     })
// );
appWindow.loadURL(`file://${__dirname}/dist/index.html`);

// Initialize the DevTools.
appWindow.webContents.openDevTools()

appWindow.on('closed', function () {
    appWindow = null
})
}

app.on('ready', initWindow)

// Close when all windows are closed.
app.on('window-all-closed', function () {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (win === null) {
        initWindow()
    }
})

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

const server = 'https://github.com/panvalkar1994/electron-app';
const feed = `${server}/releases/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL({ url:feed })

setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)

  
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }
  
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
  })
  