import mustache from 'mustache';

import { name } from './manifest';

/**
 * @param {string} value
 */
export function copyToClipboard(value) {
  const textarea = document.createElement('textarea');

  document.body.appendChild(textarea);

  textarea.value = value;
  textarea.select();

  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 * @param {HTMLElement} parentElement
 * @return {DocumentFragment}
 */
export function detachChildren(parentElement) {
  const range = document.createRange();

  range.selectNodeContents(parentElement);

  return range.extractContents();
}

export function getConfig() {
  return new Promise(function (resolve) {
    chrome.storage.local.get(name, function (data) {
      resolve(data[name]);
    });
  });
}

export function getDefaultTemplates() {
  return [
    {
      name: 'copy title and URL',
      template: '{{{ title }}}\n{{{ url }}}\n\n',
      hash: 'default item 1'
    },
    {
      name: 'copy as Markdown list',
      template: '- [{{{ title }}}]({{{ url }}})\n',
      hash: 'default item 2'
    }
  ];
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 */
export async function getDigest(message) {
  const uint8Message = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Message);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getSelectedTabs() {
  return new Promise(function (resolve) {
    // NOTE: copy PWA window if currentWindow is false
    const query = { currentWindow: true, highlighted: true };

    chrome.tabs.query(query, function (tabs) {
      const set = new Set();

      for (const tab of tabs) {
        const { favIconUrl, pendingUrl, status, title, url } = tab;

        set.add({
          favIconUrl,
          pendingUrl,
          status,
          title,
          url
        });
      }

      resolve(Array.from(set));
    });
  });
}

/**
 * @param {string} template
 * @param {Object} data
 */
export async function renderTemplate(template, data) {
  const view = data || (await getSelectedTabs());

  return mustache.render(`{{#view}}${template}{{/view}}`, { view });
}

/**
 * @param {Object} config
 */
export function setConfig(config) {
  return new Promise(function (resolve) {
    chrome.storage.local.set({ [name]: config }, resolve);
  });
}
