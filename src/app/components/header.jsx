import ThemeButton from "./buttons/theme-button";

import Logo from "styles/icons/logo";

export default function Header(){
  return(
    <header>
      <div className="box">
        <div className="logo">
          <Logo />
          <h1>Enigma</h1>
        </div>
        <div className="button">
          <ThemeButton />
        </div>
      </div>
    </header>
  );
};