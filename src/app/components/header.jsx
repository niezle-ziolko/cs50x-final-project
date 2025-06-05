import Link from "next/link";

import ThemeButton from "./buttons/theme-button";

import Logo from "styles/icons/logo";

export default function Header() {
  const primary = "flex items-center";

  return (
    <header className="flex px-(--qp) bg-(--bl) justify-between">
      <Link href="/">
        <div className={primary}>
          <Logo />
          <h1>Enigma</h1>
        </div>
      </Link>
      <div className={primary}>
        <ThemeButton />
      </div>
    </header>
  );
};