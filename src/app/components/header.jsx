import Link from "next/link";

import ThemeButton from "./buttons/theme-button";

import Logo from "styles/icons/logo";

export default function Header() {
  return (
    <header className="flex md:px-qp px-2 bg-bl-100 justify-between">
      <Link href="/">
        <div className="u15">
          <Logo />
          <h1>Enigma</h1>
        </div>
      </Link>
      <div className="u15">
        <ThemeButton />
      </div>
    </header>
  );
};