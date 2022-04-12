const { app, BrowserWindow, dialog, screen } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const log = require('electron-log');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width > 1680 ? 1680 : width,
    height: height > 1050 ? 1050 : height,
    minHeight: 576,
    minWidth: 769,
    center: true,
    webPreferences: {}
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../../src/index.html'));

};

autoUpdater.autoDownload = true;
autoUpdater.logger = log;

log.info('starting...');

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

app.on('ready', () => {
  createWindow();


  autoUpdater.checkForUpdatesAndNotify();

  const options = {
    buttons: ['OK'],
    message: `Phaeton is ready ${app.getVersion()} \n https://update.electronjs.org/shreyas-kinage/phaeton-public-desktop/${process.platform}-${process.arch}/1.0.7`,
  };
  dialog.showMessageBox(mainWindow, options, () => { });

  autoUpdater.setFeedURL(`https://update.electronjs.org/shreyas-kinage/phaeton-public-desktop/${process.platform}-${process.arch}/1.0.7`)

  /*checking for updates*/
  autoUpdater.on("checking-for-update", () => {
    const options = {
      buttons: ['OK'],
      message: `'Phaeton Checking for updates /n Version' ${app.getVersion()}`,
    };
    dialog.showMessageBox(mainWindow, options, () => { });
  });

  /*No updates available*/
  autoUpdater.on("update-not-available", info => {
    log.info(info);
    const options = {
      buttons: ['OK'],
      message: `'Phaeton Checking for updates ${info} /n Version' ${app.getVersion()}`,
    };
    dialog.showMessageBox(mainWindow, options, () => { });
    //your code
  });

  /*New Update Available*/
  autoUpdater.on("update-available", info => {
    log.info(info);
    const options = {
      buttons: ['OK'],
      message: `'Update available ${info} /n Version' ${app.getVersion()}`,
    };
    dialog.showMessageBox(mainWindow, options, () => { });
    //your code
  });

  /*Download Status Report*/
  autoUpdater.on("download-progress", progressObj => {
    log.info(progressObj);
    const options = {
      buttons: ['OK'],
      message: `'Download in progess /n Version' ${app.getVersion()}`,
    };
    dialog.showMessageBox(mainWindow, options, () => { });
    //your code
  });

  /*Download Completion Message*/
  autoUpdater.on("update-downloaded", info => {
    log.info(info);
    const options = {
      buttons: ['OK'],
      message: `'Downloaded the update ${info} /n Version' ${app.getVersion()}`,
    };
    dialog.showMessageBox(mainWindow, options, () => { });
    //your code
  });

  autoUpdater.on("error", (error) => {
    console.error('There was a problem updating the application');
    log.info(error);
    // eslint-disable-next-line no-console
    console.error(error);
    const options = {
      buttons: ['OK'],
      message: `'Phaeton Error ${error} \n Version' ${app.getVersion()}`,
    };
    dialog.showMessageBox(mainWindow, options, () => { });
  });


  autoUpdater.checkForUpdatesAndNotify();

  // var updateApp = require('update-electron-app');

  // updateApp({
  //   repo: 'shreyas-kinage/phaeton-public-desktop', // defaults to package.json
  //   updateInterval: '5 minutes',
  //   notifyUser: true,
  //   logger: log,
  // });
});


