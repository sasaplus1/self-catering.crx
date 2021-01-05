import { browser as chrome } from 'webextension-polyfill-ts';

import {
  detachChildren,
  getConfig,
  getDefaultTemplates,
  getDigest,
  renderTemplate,
  setConfig
} from './utils';

import type { ContextMenus } from 'webextension-polyfill-ts';

const store: { templates: ReturnType<typeof getDefaultTemplates> } = {
  templates: []
};

//------------------------------------------------------------------------------

async function restoreTemplates(
  templates: ReturnType<typeof getDefaultTemplates>
): Promise<void> {
  const templateElement = document.getElementById('js-template-item-form');

  if (!templateElement) {
    return;
  }

  const templateMarkup = templateElement.innerText.trim().replace(/\n\s+/g, '');

  const parser = new DOMParser();
  const doc = parser.parseFromString(templateMarkup, 'text/html');
  const templateItem = doc.body.firstElementChild;

  if (!templateItem) {
    return;
  }

  const templateItems = templates.map(function ({ name, template }) {
    const element = templateItem.cloneNode(true);

    if (!element) {
      return;
    }

    const nameElement = (element as Element).querySelector(
      '.js-name'
    ) as HTMLInputElement;

    if (nameElement) {
      nameElement.value = name;
    }

    const templateElement = (element as Element).querySelector(
      '.js-template'
    ) as HTMLTextAreaElement;

    if (templateElement) {
      templateElement.value = template;
    }

    return element;
  });

  const fragment = document.createDocumentFragment();

  for (const i of templateItems) {
    if (i === undefined) {
      continue;
    }

    fragment.appendChild(i);
  }

  const list = document.getElementById('js-template-list');

  if (list) {
    detachChildren(list);
    list.appendChild(fragment);
  }
}

async function updatePlayground() {
  const playgroundTextArea = document.getElementById('js-playground-template');
  const previewTextArea = document.getElementById('js-playground-preview');

  if (!playgroundTextArea || !previewTextArea) {
    return;
  }

  const template = (playgroundTextArea as HTMLTextAreaElement).value;

  (previewTextArea as HTMLTextAreaElement).value = await renderTemplate(
    template,
    [
      {
        url: 'https://www.google.com',
        title: 'Google'
      },
      {
        url: 'https://www.youtube.com',
        title: 'YouTube'
      },
      {
        url:
          'https://user@pass:example.com:8080/p/a/t/h/?query=string&query=string#hash',
        title: 'Example'
      }
    ]
  );
}

//------------------------------------------------------------------------------

function onClickAddTemplate(): void {
  const templateList = document.getElementById('js-template-list');

  const templateElement = document.getElementById('js-template-item-form');

  if (!templateElement) {
    return;
  }

  const templateMarkup = templateElement.innerText.trim().replace(/\n\s+/g, '');

  if (templateList) {
    templateList.insertAdjacentHTML('beforeend', templateMarkup);
  }
}

async function onClickRemove(event: MouseEvent): Promise<void> {
  const removeButton = event.target as HTMLElement;

  if (!removeButton) {
    return;
  }

  if (
    !/button/i.test(removeButton.tagName) ||
    !removeButton.classList.contains('js-remove-button')
  ) {
    return;
  }

  const templateItem = removeButton.closest('.template-item');

  if (templateItem && templateItem.parentElement) {
    templateItem.parentElement.removeChild(templateItem);
  }
}

function onClickResetTemplates(): void {
  if (!window.confirm('Do you really reset templates?')) {
    return;
  }

  Object.assign(store, { templates: getDefaultTemplates() });

  const { templates } = store;

  restoreTemplates(templates);
}

async function onClickSaveTemplates(): Promise<void> {
  const templateList = document.getElementById('js-template-list');

  if (!templateList) {
    return;
  }

  const templateItems = templateList.getElementsByTagName('li');

  const sets = new Set<ReturnType<typeof getDefaultTemplates>[0]>();

  for (const item of templateItems) {
    const nameElement = item.querySelector('.js-name');

    if (!nameElement) {
      continue;
    }

    const name = (nameElement as HTMLInputElement).value;

    const templateElement = item.querySelector('.js-template');

    if (!templateElement) {
      continue;
    }

    const template = (templateElement as HTMLTextAreaElement).value;

    const hash = await getDigest(String(Date.now()) + name + template);

    sets.add({
      hash,
      name,
      template
    });
  }

  const templates = Array.from(sets);

  await setConfig({ templates });

  await chrome.contextMenus.removeAll();

  const contexts: ContextMenus.ContextType[] = ['page_action'];

  for (const template of templates) {
    const { name: title, hash: id } = template;

    chrome.contextMenus.create({
      id,
      title,
      contexts
    });
  }

  const savedToast = document.getElementById('js-toast-save');

  if (!savedToast) {
    return;
  }

  savedToast.addEventListener(
    'animationend',
    function (event) {
      const toast = event.target;

      if (!toast) {
        return;
      }

      (toast as HTMLDivElement).classList.remove('saved');
      (toast as HTMLDivElement).removeAttribute('aria-live');
    },
    { capture: false, once: true, passive: true }
  );

  savedToast.classList.add('saved');
  savedToast.setAttribute('aria-live', 'polite');
}

function onInputPlayground() {
  updatePlayground();
}

async function onDOMContentLoaded() {
  document.addEventListener('click', onClickRemove, {
    capture: false,
    passive: true
  });

  //----------------------------------------------------------------------------

  const addTemplateButton = document.getElementById('js-add-template-button');

  if (addTemplateButton) {
    addTemplateButton.addEventListener('click', onClickAddTemplate, {
      capture: false,
      passive: true
    });
  }

  //----------------------------------------------------------------------------

  const saveTemplatesButton = document.getElementById(
    'js-save-templates-button'
  );

  if (saveTemplatesButton) {
    saveTemplatesButton.addEventListener('click', onClickSaveTemplates, {
      capture: false,
      passive: true
    });
  }

  //----------------------------------------------------------------------------

  const resetTemplatesButton = document.getElementById(
    'js-reset-templates-button'
  );

  if (resetTemplatesButton) {
    resetTemplatesButton.addEventListener('click', onClickResetTemplates, {
      capture: false,
      passive: true
    });
  }

  //----------------------------------------------------------------------------

  const playgroundTextArea = document.getElementById('js-playground-template');

  if (playgroundTextArea) {
    (playgroundTextArea as HTMLTextAreaElement).value =
      '{{{ title }}}\n{{{ url }}}\n\n';
    playgroundTextArea.addEventListener('input', onInputPlayground, {
      capture: false,
      passive: true
    });

    updatePlayground();
  }

  //----------------------------------------------------------------------------

  const data = await getConfig();

  Object.assign(store, { templates: getDefaultTemplates() }, { ...data });

  const { templates } = store;

  restoreTemplates(templates);
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded, {
  capture: false,
  passive: true
});
