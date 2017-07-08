const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// IPC for conveying events between main process and render processes.
const {ipcMain} = require('electron')

const path = require('path')
const url = require('url')
const fs = require('fs')

require('dotenv').config()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 650,
      minWidth: 600,
      icon: path.join(__dirname, './gui/images/logo.ico'),
      show: false
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './gui/app/index.html'),
      protocol: 'file:',
      slashes: true
    }))

    // Open dev tools
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })

    // Global var for main window.
    global.renderWindow = mainWindow;

    // Register the Kill Switch
    mixerConnect.shortcut();
}

function pathExists(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, (err) => {
      if(err) {
        //ENOENT means Error NO ENTity found, aka the file/folder doesn't exist.
        if(err.code === 'ENOENT') {
          // This folder doesn't exist. Resolve and create it.
          resolve();
        } else {
          // Some weird error happened other than the path missing.
          console.log(err)
        };
      } else {
        // This folder exists. Reject and don't touch it.
        console.log('Path Found: '+path)
        reject();
      }
    });
  });
};

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', function(){
    
    // Create the user-settings folder if it doesn't exist. It's required 
    // for the folders below that are within it
    pathExists("./user-settings/")
    .then((resolve) => {
      console.log("Can't find the user-settings folder, creating one now...");
      fs.mkdir("./user-settings");
    });

    // Create the scripts folder if it doesn't exist
    pathExists("./user-settings/scripts/")
    .then((resolve) => {
      console.log("Can't find the scripts folder, creating one now...");
      fs.mkdir("./user-settings/scripts");
    })
    
    // Create the overlay settings folder if it doesn't exist.
    pathExists("./user-settings/overlay-settings/")
    .then((resolve) => {
      console.log("Can't find the overlay-settings folder, creating one now...");
      fs.mkdir("./user-settings/overlay-settings");
    })
    
    // Create the port.js file if it doesn't exist.
    pathExists("./user-settings/overlay-settings/port.js")
    .then((resolve) => {
      fs.writeFile('./user-settings/overlay-settings/port.js', `window.WEBSOCKET_PORT = 8080`, 
        'utf8', () => { console.log(`Set overlay port to: 8080`)});
    })  

    // Create the controls folder if it doesn't exist.
    pathExists("./user-settings/controls")
    .then((resolve) => {
      console.log("Can't find the controls folder, creating one now...");
      fs.mkdir("./user-settings/controls");
    })  

    // Create the log folder if it doesn't exist.
    pathExists("./user-settings/logs")
    .then((resolve) => {
      console.log("Can't find the log folder, creating one now...");
      fs.mkdir("./user-settings/logs");
    })  
    
    createWindow()
    renderWindow.webContents.on('did-finish-load', function() {
        renderWindow.show();
    });
  })

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  process.on('uncaughtException', function(error) {
      // Handle the error
      renderWindow.webContents.send('error', "There was an unhandled error. Please see /user-settings/logs for more details.");
      errorLog(error);
  });

  // When Quittin.
  app.on('will-quit', () => {
    // Unregister all shortcuts.
    mixerConnect.shortcutUnregister();
  });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Interactive handler
const mixerConnect = require('./lib/interactive/mixer-interactive.js');

// Errors
function errorLog(error){
  var date = new Date();
  var fileName = (date.getMonth()+1)+'-'+date.getDate()+'-'+date.getFullYear()+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds()
  fs.readFile('./user-settings/controls/'+lastBoard+'.json', (err, data) => {
    if(!err){
      var lastBoard = data;
    } else {
      var lastBoard = "Error getting last board json.";
    }
    var stream = fs.createWriteStream("./user-settings/logs/"+fileName+".log");
      stream.once('open', function(fd) {
      stream.write(error+'\r\n');
      stream.end();
    });

    console.log('Wrote error to file.')
  });
}