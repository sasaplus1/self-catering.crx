import mustache from 'mustache';

import { name } from './manifest';

export function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

export function copyToClipboard(value) {
  const textarea = document.createElement('textarea');

  textarea.style = `
    height: 1px;
    left: -1px;
    position: fixed;
    top: 0;
    width: 1px;
  `;

  document.body.appendChild(textarea);
  textarea.value = value;
  textarea.select();

  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function getConfig() {
  return new Promise(function(resolve) {
    chrome.storage.local.get(name, function(data) {
      resolve(data[name]);
    });
  });
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 */
export async function getDigest(message) {
  const uint8Message = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Message);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function getSelectedTabs() {
  return new Promise(function(resolve) {
    // NOTE: copy PWA window if currentWindow is false
    const query = { currentWindow: true, highlighted: true };

    chrome.tabs.query(query, function(tabs) {
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

export async function renderTemplate(template, data) {
  const view = data || (await getSelectedTabs());

  return mustache.render(`{{#view}}${template}{{/view}}`, { view });
}

export function setConfig(configs) {
  return new Promise(function(resolve) {
    chrome.storage.local.set({ [name]: configs }, resolve);
  });
}
