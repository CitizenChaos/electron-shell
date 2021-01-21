const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const { getSoftwarePath } = require('./getSoftwarePath')
const { spawn } = require('child_process')
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // win.maximize()
  Menu.setApplicationMenu(null)
  // win.webContents.openDevTools()

  // win.loadURL('https://test-vshow.fooww.com/group/')
  // win.loadURL('http://192.168.1.108:8081/group/')
  win.loadURL('https://beta-vshow.fooww.com/group-electron/')
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
    spawn('cmd', ['/c', clientPath, arg])
  })
})
