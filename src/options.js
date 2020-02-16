import { getConfig, getDigest, setConfig } from './logic';

const store = {};

function onClickAdd() {
  const templateList = document.getElementById('js-template-list');

  const templateElement = document.getElementById('js-template-item-form');
  const templateMarkup = templateElement.innerText;

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

async function onClickSave() {
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

  await setConfig({ templates: Array.from(set) });
}

async function onDOMContentLoaded() {
  document.addEventListener('click', onClickRemove, false);

  //----------------------------------------------------------------------------

  const addButton = document.getElementById('js-add-template-button');

  if (addButton) {
    addButton.addEventListener('click', onClickAdd, false);
  }

  //----------------------------------------------------------------------------

  const saveButton = document.getElementById('js-save-button');

  if (saveButton) {
    saveButton.addEventListener('click', onClickSave, false);
  }

  //----------------------------------------------------------------------------

  const data = await getConfig();

  Object.assign(store, { ...data });

  const parser = new DOMParser();
  const templateElement = document.getElementById('js-template-item-form');
  const templateMarkup = templateElement.innerText.trim().replace(/\n\s+/g, '');

  const doc = parser.parseFromString(templateMarkup, 'text/html');
  const templateItem = doc.body.firstElementChild;

  const templateItems = data.templates.map(function({ name, template }) {
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

  list.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);
