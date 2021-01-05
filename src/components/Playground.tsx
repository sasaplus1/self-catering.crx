import { h } from 'preact';

export type Props = {
  template: string;
  onInputTemplate: h.JSX.GenericEventHandler<HTMLTextAreaElement>;
  preview: string;
};

export default function Playground(props: Props): h.JSX.Element {
  const { template, onInputTemplate, preview } = props;

  return (
    <details className="playground">
      <summary className="playground__summary">playground</summary>
      <a
        className="playground__link"
        href="https://github.com/janl/mustache.js#templates"
      >
        see mustache template references
      </a>
      <div className="playground__content">
        <label className="playground__label">
          template
          <br />
          <textarea className="playground__textarea" onInput={onInputTemplate}>
            {template}
          </textarea>
        </label>
        <label className="playground__label">
          preview
          <br />
          <textarea className="playground__textarea" readOnly>
            {preview}
          </textarea>
        </label>
      </div>
    </details>
  );
}
