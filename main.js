const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const { getSoftwarePath } = require('./getSoftwarePath')
const path = require('path')
function createWindow() {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })

  win.maximize()
  Menu.setApplicationMenu(null)
  // win.webContents.openDevTools()
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

  // win.loadURL('https://test-vshow.fooww.com/group/')
  win.loadURL('http://localhost:8081/group/')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('openPC', (event, arg) => {
  getSoftwarePath((clientPath) => {
    console.log(clientPath)
    shell.openPath(path.join(clientPath))
  })
})
