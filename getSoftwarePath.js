/**
 * 获取PC软件注册表
 */
const { dialog } = require('electron')
let regedit = require('regedit')
exports.getSoftwarePath = function (cb) {
  let regeditPath =
    'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
  let softwareName = '梵讯房屋管理系统_is1'
  let hasKey = false
  regedit.list(regeditPath, (err, res) => {
    let keys = res[regeditPath].keys
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === '梵讯房屋管理系统_is1') {
        hasKey = true
        break
      }
    }
    if (hasKey) {
      regedit
        .list([regeditPath + '\\' + softwareName])
        .on('data', function (entry) {
          cb(entry.data.values.DisplayIcon.value)
        })
    } else {
      // 没有安装PC软件
      dialog.showErrorBox('提示', '未检测到梵讯软件')
    }
  })
}
