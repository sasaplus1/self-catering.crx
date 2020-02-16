import {
  copyToClipboard,
  getConfig,
  getSelectedTabs,
  renderTemplate
} from './logic';

const store = {};

async function onClick(event) {
  const { target: element } = event;

  if (!/button/i.test(element.tagName)) {
    return;
  }

  const hash = element.getAttribute('data-template-hash');
  const template = store.templates.find(template => template.hash === hash);

  if (!template) {
    return;
  }

  const { template: html } = template;

  copyToClipboard(await renderTemplate(html));

  window.close();
}

async function onDOMContentLoaded() {
  document.addEventListener('click', onClick, false);

  //----------------------------------------------------------------------------

  Object.assign(
    store,
    {
      templates: [
        {
          name: 'copy as Markdown list',
          template: '- [{{ title }}]({{{ url }}})\n',
          hash: 'dummy hash'
        }
      ]
    },
    {
      tabs: await getSelectedTabs()
    },
    await getConfig()
  );

  const { tabs, templates } = store;

  //----------------------------------------------------------------------------

  const parser = new DOMParser();
  const templateElement = document.getElementById('js-template-item-html');
  const templateMarkup = templateElement.innerText.trim().replace(/\n\s+/g, '');

  const elements = [];

  for (let template of templates) {
    const data = {
      ...template,
      example: await renderTemplate(template.template, tabs.slice(0, 3))
    };

    const doc = parser.parseFromString(
      await renderTemplate(templateMarkup, data),
      'text/html'
    );

    elements.push(doc.body.firstElementChild);
  }

  //----------------------------------------------------------------------------

  const fragment = document.createDocumentFragment();

  for (let element of elements) {
    fragment.appendChild(element);
  }

  //----------------------------------------------------------------------------

  const templateList = document.getElementById('js-template-list');

  if (templateList) {
    templateList.appendChild(fragment);
  }
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);
