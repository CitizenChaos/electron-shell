/**
 * 获取PC软件注册表
 */
const { dialog } = require('electron')
let regedit = require('regedit')
exports.getSoftwarePath = function (cb) {
  let uninstallPath =
    'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
  let softwareName = '梵讯房屋管理系统_is1'
  let hasKey = false
  regedit.list(uninstallPath, (err, res) => {
    let keys = res[uninstallPath].keys
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === softwareName) {
        hasKey = true
        break
      }
    }
    if (hasKey) {
      regedit
        .list([uninstallPath + '\\' + softwareName])
        .on('data', function (entry) {
          cb(entry.data.values.DisplayIcon.value)
        })
    } else {
      // 没有安装PC软件
      dialog.showErrorBox('提示', '未检测到梵讯软件')
    }
  })
}
