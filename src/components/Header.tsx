import { h } from 'preact';

export default function Header(): h.JSX.Element {
  return (
    <header className="header">
      <h1 className="header__title">
        <img className="header__icon" src="icon.svg" alt="" />
        self catering options
      </h1>
    </header>
  );
}
