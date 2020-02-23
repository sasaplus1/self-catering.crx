module.exports = {
  manifest_version: 2,
  name: 'self catering',
  version: '0.0.0',
  description: '',
  icons: {
    '16': 'icon_16.png',
    '32': 'icon_32.png',
    '64': 'icon_64.png',
    '128': 'icon_128.png'
  },
  background: {
    scripts: ['background.js'],
    persistent: false
  },
  options_page: 'options.html',
  permissions: ['contextMenus', 'clipboardWrite', 'storage', 'tabs']
};
