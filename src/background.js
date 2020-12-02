import {
  copyToClipboard,
  getDefaultTemplates,
  getConfig,
  renderTemplate
} from './utils';

async function getTemplates() {
  const { templates } = Object.assign(
    {
      templates: getDefaultTemplates()
    },
    await getConfig()
  );

  return templates;
}

/**
 * @see https://developer.chrome.com/extensions/contextMenus#event-onClicked
 */
async function onInstalled() {
  const contexts = ['all', 'page_action'];

  const templates = await getTemplates();

  for (const template of templates) {
    const { name: title, hash: id } = template;

    chrome.contextMenus.create({
      // browser.menu.create({
      id,
      title,
      contexts
    });
  }
}

/**
 * @param {Object} info
 * @see https://developer.chrome.com/extensions/contextMenus#event-onClicked
 */
async function onClicked(info) {
  const { menuItemId: hash } = info;

  if (!hash) {
    return;
  }

  const templates = await getTemplates();

  const template = templates.find((template) => template.hash === hash);

  if (!template) {
    return;
  }

  const { template: html } = template;

  copyToClipboard(await renderTemplate(html));
}

chrome.contextMenus.onClicked.addListener(onClicked);
chrome.runtime.onInstalled.addListener(onInstalled);

// chrome.browserAction.onClicked.addListener(function() {
//   chrome.browserAction.openPopup && chrome.browserAction.openPopup();
// });
