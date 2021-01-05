import { h } from 'preact';

export type Props = {
  onClickAdd: () => void;
  onClickReset: () => void;
  onClickSave: () => void;
};

export default function Controls(props: Props): h.JSX.Element {
  const { onClickAdd, onClickReset, onClickSave } = props;

  return (
    <div className="controls">
      <button
        className="controls__button controls__add-template"
        onClick={onClickAdd}
      >
        add template
      </button>
      <button className="controls__button" onClick={onClickSave}>
        save templates
      </button>
      <button className="controls__button" onClick={onClickReset}>
        reset templates
      </button>
    </div>
  );
}
