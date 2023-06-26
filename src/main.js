const { app, BrowserWindow, ipcMain , Menu} = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require('path');
const functions = require('./functions.js')

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.send('res', res = {resType: 'version', version: app.getVersion()});

  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        // {
        //   label: 'Info'
        //   ,click()
        //   {

        //   }
        // },
        {
          type: 'separator'
        },
        {
          label: 'Exit'
          ,click()
          {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Info',
      submenu: [
        {
          label: 'Instructions'
          ,click()
          {

          }
        },
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  mainWindow.on('close', (event) =>
	{
		if(app.quitting)
		{
			mainWindow = null;
		}

		else
		{
			event.preventDefault();
			mainWindow.hide();
		}
	});

  ipcMain.handle('req', async (event, req) => {
    res = 
    {
      error: null, 
      body: {}
    };

    return functions.req(req, res);
  })

  //Start Updater
  const server = "https://updater-hazel.vercel.app"
  const url = `${server}/update/${process.platform}/${app.getVersion()}`
  console.log(url);
  mainWindow.webContents.send('res', res = {resType: 'url', url: url})

  autoUpdater.setFeedURL({ provider: 'generic' ,url })
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 10000)

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    console.log(event, releaseNotes, releaseName);
    mainWindow.webContents.send('res', res = {resType: 'downloaded'});
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('checking-for-update', (event, releaseNotes, releaseName) => {
    mainWindow.webContents.send('res', res = {resType: 'checking'});
  })

  autoUpdater.on('update-available', (event, releaseNotes, releaseName) => {
    mainWindow.webContents.send('res', res = {resType: 'available'});
  })

  autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application')
    console.error(message)
    mainWindow.webContents.send('res', res = {resType: 'error', msg: message});
  })
  //End Updater
  
  // autoUpdater.checkForUpdatesAndNotify();

  mainWindow.loadFile(path.join(__dirname, '/view/html/index.html'));
  mainWindow.webContents.openDevTools();
};
Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});
app.on('ready', createWindow);
app.on('activate', () => { mainWindow.show(); });
app.on('before-quit', () => { app.quitting = true; });

app.whenReady().then(() => {});



