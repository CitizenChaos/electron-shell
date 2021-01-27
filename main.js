const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { getSoftwarePath } = require('./getSoftwarePath')
const { spawn } = require('child_process')
const getMAC = require('getmac').default
const { hostname } = require('os')
const axios = require('axios')

var currentLoginID = 0
require('dotenv').config()

// const env = process.env.NODE_ENV
const env = 'pro'
const apiUrlPrefixes = {
  local: 'http://localhost:51138',
  pro: 'http://account.fooww.com'
}

const vshowUrlPrefixes = {
  local: 'http://192.168.1.108:8081/group/',
  pro: 'https://beta-vshow.fooww.com/group-electron/'
}

let urlPrefix = apiUrlPrefixes[env.toLowerCase()]
let vshowUrlPrefix = vshowUrlPrefixes[env.toLowerCase()]

const requestLogout = async (loginID) => {
  return axios.get(
    `${urlPrefix}/api/login/logout?groupUserOperateLogID=${loginID}`
  )
}

let win = null

// ensure app only one instance
const getTheLock = app.requestSingleInstanceLock()
if (!getTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (win) {
      if (win.isMinimized()) {
        win.restore()
      }
      win.focus()
    }
  })
  app
    .whenReady()
    .then(createWindow)
    .then((window) => (win = window))
}

// create browser window
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.maximize()
  Menu.setApplicationMenu(null)
  // win.webContents.openDevTools()

  win.loadURL(vshowUrlPrefix)

  win.webContents.on('render-process-gone', async (e) => {
    await requestLogout(currentLoginID)
  })
  return win
}

// register event
app.on('window-all-closed', async (e) => {
  await requestLogout(currentLoginID)
  app.exit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('openPC', (event, arg) => {
  getSoftwarePath((clientPath) => {
    console.log('clientPath', clientPath)
    console.log('arg', arg)
    spawn('cmd', ['/c', clientPath, arg])
  })
})
// 获取MAC
ipcMain.on('getMachineInfo', (event) => {
  event.reply('replyMachineInfo', {
    location: getMAC(),
    machineName: hostname()
  })
})

ipcMain.on('login-success', (e, arg) => {
  currentLoginID = arg.loginID
})
