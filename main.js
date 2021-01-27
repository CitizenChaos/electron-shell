const {
  app,
  BrowserWindow,
  Menu,
  ipcMain
} = require('electron')
const {
  getSoftwarePath
} = require('./getSoftwarePath')
const {
  spawn
} = require('child_process')
const {
  networkInterfaces
} = require('os')
const axios = require("axios")
var currentLoginId = 0;
require('dotenv').config()

const env = process.env.ENV_MODE
console.log(env)
const apiUrlPrefixes = {
  "local": "http://localhost:51138",
  "test": "http://test-account.fooww.com",
  "pro": "http://account.fooww.com"
}

const vshowUrlPrefixes = {
  "local": "http://192.168.1.108:8081/group/",
  "test": "https://test-vshow.fooww.com/group/",
  "pro": "https://vshow.fooww.com/group-electron/"
}

let urlPrefix = apiUrlPrefixes[env.toLowerCase()]
let vshowUrlPrefix = vshowUrlPrefixes[env.toLowerCase()]

const requestLogout = async loginId => {
  return axios.get(`${urlPrefix}/api/login/logout?groupUserOperateLogID=${loginId}`)
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
  app.whenReady().then(createWindow).then(window => win = window)
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

  // win.maximize()
  // Menu.setApplicationMenu(null)
  win.webContents.openDevTools()

  // win.loadURL('https://test-vshow.fooww.com/group/')
  win.loadURL(vshowUrlPrefix)
  // win.loadURL('https://beta-vshow.fooww.com/group-electron/')
  win.webContents.on('render-process-gone', async e => {
    await requestLogout(currentLoginId);
  })
  return win;
}


// register event
app.on('window-all-closed', async (e) => {
  await requestLogout(currentLoginId);
  app.exit();
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
// 获取网络
ipcMain.on('getMAC', (event) => {
  let interface = networkInterfaces()
  event.reply('replyMAC', interface)
})

ipcMain.on("login-success", (e, arg) => {
  currentLoginId = arg.loginId;
})