import {
  detachChildren,
  getConfig,
  getDefaultTemplates,
  getDigest,
  renderTemplate,
  setConfig
} from './utils';

const store = {};

//------------------------------------------------------------------------------

async function restoreTemplates(templates) {
  const parser = new DOMParser();
  const templateElement = document.getElementById('js-template-item-form');
  const templateMarkup = templateElement.innerText.trim().replace(/\n\s+/g, '');

  const doc = parser.parseFromString(templateMarkup, 'text/html');
  const templateItem = doc.body.firstElementChild;

  const templateItems = templates.map(function ({ name, template }) {
    const element = templateItem.cloneNode(true);

    element.querySelector('.js-name').value = name;
    element.querySelector('.js-template').value = template;

    return element;
  });

  const fragment = document.createDocumentFragment();

  for (const i of templateItems) {
    fragment.appendChild(i);
  }

  const list = document.getElementById('js-template-list');

  detachChildren(list);

  list.appendChild(fragment);
}

async function updatePlayground() {
  const playgroundTextArea = document.getElementById('js-playground-template');
  const previewTextArea = document.getElementById('js-playground-preview');

  if (!playgroundTextArea || !previewTextArea) {
    return;
  }

  const template = playgroundTextArea.value;

  previewTextArea.value = await renderTemplate(template, [
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
  ]);
}

//------------------------------------------------------------------------------

function onClickAddTemplate() {
  const templateList = document.getElementById('js-template-list');

  const templateElement = document.getElementById('js-template-item-form');
  const templateMarkup = templateElement.innerText.trim().replace(/\n\s+/g, '');

  templateList.insertAdjacentHTML('beforeend', templateMarkup);
}

async function onClickRemove(event) {
  const removeButton = event.target;

  if (
    !/button/i.test(removeButton.tagName) ||
    !removeButton.classList.contains('js-remove-button')
  ) {
    return;
  }

  const templateItem = removeButton.closest('.template-item');

  templateItem.parentElement.removeChild(templateItem);
}

function onClickResetTemplates() {
  if (!window.confirm('Do you really reset templates?')) {
    return;
  }

  Object.assign(store, { templates: getDefaultTemplates() });

  const { templates } = store;

  restoreTemplates(templates);
}

async function onClickSaveTemplates() {
  const templateList = document.getElementById('js-template-list');
  const templateItems = templateList.getElementsByTagName('li');

  const set = new Set();

  for (const item of templateItems) {
    const name = item.querySelector('.js-name').value;
    const template = item.querySelector('.js-template').value;

    const hash = await getDigest(String(Date.now()) + name + template);

    set.add({
      hash,
      name,
      template
    });
  }

  const templates = Array.from(set);

  await setConfig({ templates });

  await chrome.contextMenus.removeAll(function () {
    return Promise.resolve();
  });

  const contexts = ['page_action'];

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

      toast.classList.remove('saved');
      toast.removeAttribute('aria-live');
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
    playgroundTextArea.value = '{{{ title }}}\n{{{ url }}}\n\n';
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
