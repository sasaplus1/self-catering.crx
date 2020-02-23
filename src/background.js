import {
  copyToClipboard,
  getConfig,
  // getSelectedTabs,
  renderTemplate
} from './logic';

async function onInstalled() {
  const store = Object.assign(
    {
      templates: [
        {
          name: 'copy title and URL',
          template: '{{ title }}\n{{{ url }}}\n',
          hash: 'default item 1'
        },
        {
          name: 'copy as Markdown list',
          template: '- [{{ title }}]({{{ url }}})\n',
          hash: 'default item 2'
        }
      ]
    },
    await getConfig()
  );

  const { templates } = store;

  const contexts = ['page_action'];

  for (let template of templates) {
    const { name: title, hash: id } = template;

    chrome.contextMenus.create({
      id,
      title,
      contexts
    });
  }
}

async function onClicked(info) {
  const { menuItemId: hash } = info;

  if (!hash) {
    return;
  }

  const store = Object.assign(
    {
      templates: [
        {
          name: 'copy title and URL',
          template: '{{ title }}\n{{{ url }}}\n',
          hash: 'default item 1'
        },
        {
          name: 'copy as Markdown list',
          template: '- [{{ title }}]({{{ url }}})\n',
          hash: 'default item 2'
        }
      ]
    },
    await getConfig()
  );

  const template = store.templates.find(template => template.hash === hash);

  if (!template) {
    return;
  }

  const { template: html } = template;

  copyToClipboard(await renderTemplate(html));
}

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.contextMenus.onClicked.addListener(onClicked);
