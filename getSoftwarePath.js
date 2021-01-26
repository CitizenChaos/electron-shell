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
    console.log(hasKey)
    if (hasKey) {
      regedit
        .list([regeditPath + '\\' + softwareName])
        .on('data', function (entry) {
          cb(entry.data.values.DisplayIcon.value)
        })
    }
  })
}
