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
  browser_action: {
    default_icon: {
      '16': 'icon_16.png',
      '32': 'icon_32.png',
      '64': 'icon_64.png',
      '128': 'icon_128.png'
    },
    default_title: 'self catering',
    default_popup: 'popup.html'
  },
  options_page: 'options.html',
  permissions: ['clipboardWrite', 'storage', 'tabs']
};
