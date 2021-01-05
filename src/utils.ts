import { browser as chrome } from 'webextension-polyfill-ts';

import mustache from 'mustache';

const name = 'self catering';

/**
 */
export function copyToClipboard(value: string): void {
  const textarea = document.createElement('textarea');

  document.body.appendChild(textarea);

  textarea.value = value;
  textarea.select();

  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 */
export function detachChildren(parentElement: HTMLElement): DocumentFragment {
  const range = document.createRange();

  range.selectNodeContents(parentElement);

  return range.extractContents();
}

/**
 */
export async function getConfig(): Promise<Record<string, unknown>> {
  const data = await chrome.storage.local.get(name);

  return data[name];
}

/**
 */
export function getDefaultTemplates(): {
  name: string;
  template: string;
  hash: string;
}[] {
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
export async function getDigest(message: string): Promise<string> {
  const uint8Message = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Message);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getSelectedTabs(): Promise<
  Pick<chrome.tabs.Tab, 'favIconUrl' | 'status' | 'title' | 'url'>[]
> {
  // NOTE: copy PWA window if currentWindow is false
  const query = { currentWindow: true, highlighted: true };

  const tabs = await chrome.tabs.query(query);

  const sets = new Set<
    Pick<chrome.tabs.Tab, 'favIconUrl' | 'status' | 'title' | 'url'>
  >();

  for (const tab of tabs) {
    const { favIconUrl, status, title, url } = tab;

    sets.add({
      favIconUrl,
      status,
      title,
      url
    });
  }

  return Array.from(sets);
}

/**
 */
export async function renderTemplate(
  template: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>
): Promise<string> {
  return mustache.render(`{{#view}}${template}{{/view}}`, {
    view: data || (await getSelectedTabs())
  });
}

/**
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setConfig(config: Record<string, any>): Promise<void> {
  return chrome.storage.local.set({ [name]: config });
}
