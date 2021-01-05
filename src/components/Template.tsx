import { h } from 'preact';

export type Props = {
  name: string;
  onClickRemove: h.JSX.GenericEventHandler<HTMLButtonElement>;
  onInputTemplate: h.JSX.GenericEventHandler<HTMLTextAreaElement>;
  template: string;
};

export default function Template(props: Props): h.JSX.Element {
  const { name, onClickRemove, onInputTemplate, template } = props;

  return (
    <li className="template-item item">
      <div className="item__container item__editor">
        <label className="item__label">
          name
          <br />
          <input className="item__input" value={name} />
        </label>
        <label className="item__label">
          template
          <br />
          <textarea className="item__textarea" onInput={onInputTemplate}>
            {template}
          </textarea>
        </label>
      </div>
      <div className="item__container item__control">
        <button
          className="item__button"
          aria-label="remove template"
          onClick={onClickRemove}
        >
          &times;
        </button>
      </div>
    </li>
  );
}
