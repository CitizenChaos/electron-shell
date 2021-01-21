let regedit = require('regedit')
let fs = require('fs')
exports.getSoftwarePath = function (cb) {
  let clientPath = ''
  regedit
    .list([
      'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\梵讯房屋管理系统_is1'
    ])
    .on('data', function (entry) {
      // TODO: null值判断
      cb(entry.data.values.DisplayIcon.value)
    })
}
