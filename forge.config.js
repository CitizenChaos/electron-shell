module.exports = {
  packagerConfig: {
    icon: 'assets/favicon1',
    appCopyright: '上海梵讯网络技术有限公司',
    asar: true,
    overwrite: true
  },
  // electronRebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'group_electron'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  // publishers: [],
  // plugins: [],
  // hooks: {},
  // buildIdentifier: ''
}
