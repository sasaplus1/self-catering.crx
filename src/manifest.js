module.exports = {
  manifest_version: 2,
  name: 'self catering',
  version: '0.0.0',
  description: '',
  icons: {
    '16': 'icon_32.png',
    '48': 'icon_32.png',
    '128': 'icon_32.png'
  },
  browser_action: {
    default_icon: {
      '16': 'icon_32.png',
      '24': 'icon_32.png',
      '32': 'icon_32.png'
    },
    default_title: 'self catering',
    default_popup: 'popup.html'
  },
  options_page: 'options.html',
  permissions: ['clipboardWrite', 'storage', 'tabs']
};
