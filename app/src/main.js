const { app, BrowserWindow, dialog, screen } = require('electron');
const { autoUpdater } = require('electron-updater');
const process = require('process');
const getPort = require('get-port');
import server from '../server';
var log = require('electron-log');

log.transports.file.level = 'info';
autoUpdater.logger = log;

setInterval(() => {
  autoUpdater.checkForUpdates();
}, 50000)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow;
const defaultServerPort = 5659;
let serverUrl;
const startServer = () => getPort({ port: defaultServerPort })
  .then((port) => {
    serverUrl = server.init(port);
  });

startServer();

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width > 1680 ? 1680 : width,
    height: height > 1050 ? 1050 : height,
    minHeight: 576,
    minWidth: 769,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(serverUrl);

  mainWindow.on('closed', () => { mainWindow = null })

};


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.on('ready', async () => {
  createWindow();
  log.info('app-ready');
  process.env.GITHUB_TOKEN = "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";
  const ser = 'https://update.electronjs.org';
  const feed = `${ser}/shreyas-kinage/phaeton-public-desktop/${process.platform}-${process.arch}/${app.getVersion()}`;
  autoUpdater.setFeedURL(feed);
  // var update = require('update-electron-app');

  // update({
  //   repo: 'shreyas-kinage/phaeton-public-desktop',
  //   updateInterval: '5 minutes',
  //   notifyUser: true,
  //   logger: log,
  // });

  autoUpdater.checkForUpdatesAndNotify();

  const options = {
    buttons: ['OK'],
    message: `Phaeton is ready ${app.getVersion()} \n URL: ${feed}`,
  };
  dialog.showMessageBox(mainWindow, options, () => { });
});

autoUpdater.on('error', (error) => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Close'],
    defaultId: 0,
    message: 'Error ' + `${error}`,
    detail: 'Error'
  }, response => {
    if (response === 0) {
      setTimeout(() => autoUpdater.quitAndInstall(), 5000);
    }
  });
})

autoUpdater.on('update-downloaded', (event, info) => {
  let message = app.getName() + ' ' + info.releaseName + ' is now available. It will be installed the next time you restart the application.';
  if (info.releaseNotes) {
    const splitNotes = info?.releaseNotes?.split(/[^\r]\n/);
    message += '\n\nRelease notes:\n';
    splitNotes.forEach(notes => {
      message += notes + '\n\n';
    });
  }
  // Ask user to update the app
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    message: 'A new version of ' + app.getName() + ' has been downloaded',
    detail: message
  }, response => {
    if (response === 0) {
      setTimeout(() => autoUpdater.quitAndInstall(), 1);
    }
  });
});

// /*checking for updates*/
// autoUpdater.on("checking-for-update", (info) => {
//   log.info(info);
//   const options = {
//     buttons: ['OK'],
//     message: `'Phaeton Checking for updates /n Version' ${app.getVersion()}`,
//   };
//   dialog.showMessageBox(mainWindow, options, () => { });
// });

// /*No updates available*/
// autoUpdater.on("update-not-available", info => {
//   log.info(info);
//   const options = {
//     buttons: ['OK'],
//     message: `'Phaeton Checking for updates ${info} /n Version' ${app.getVersion()}`,
//   };
//   dialog.showMessageBox(mainWindow, options, () => { });
//   //your code
// });

// /*New Update Available*/
// autoUpdater.on("update-available", info => {
//   log.info(info);
//   const options = {
//     buttons: ['OK'],
//     message: `'Update available ${info} /n Version' ${app.getVersion()}`,
//   };
//   dialog.showMessageBox(mainWindow, options, () => { });
//   //your code
// });

// /*Download Status Report*/
// autoUpdater.on("download-progress", progressObj => {
//   log.info(progressObj);
//   const options = {
//     buttons: ['OK'],
//     message: `'Download in progess /n Version' ${app.getVersion()}`,
//   };
//   dialog.showMessageBox(mainWindow, options, () => { });
//   //your code
// });

// /*Download Completion Message*/
// autoUpdater.on("update-downloaded", info => {
//   log.info(info);
//   const options = {
//     buttons: ['OK'],
//     message: `'Downloaded the update ${info} /n Version' ${app.getVersion()}`,
//   };
//   dialog.showMessageBox(mainWindow, options, () => { });
//   //your code
// });

// autoUpdater.on("error", (error) => {
//   log.info(error);
//   console.error('There was a problem updating the application');
//   // eslint-disable-next-line no-console
//   console.error(error);
//   const options = {
//     buttons: ['OK'],
//     message: `'Phaeton Error ${error} \n Version' ${app.getVersion()}`,
//   };
//   dialog.showMessageBox(mainWindow, options, () => { });
// });
