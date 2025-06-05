import Lock from "styles/icons/lock";
import GithubIcon from "styles/icons/github";

export default function Footer() {
  const style = "flex flex-col items-center";

  return (
    <footer>
      <h4>Your secure messenger for creating one-time encrypted messages.</h4>
      <Lock />
      <aside className="github">
        <div className="box z-2 fixed w-50 h-50 right-(--n) bottom-(--n) overflow-(--hdd)">
          <div className={`${style} z-1 w-(--fp) h-(--fp) top-(--n) right-(--n) absolute justify-end rotate-(--ffm)`}>
            <a className={`${style} focus:text-(--g) hover:text-(--g)`} href="https://github.com/niezle-ziolko/cs50x-final-project" target="_blank" rel="noreferrer">
              <p className="text-current mt-(--o) mb-(--o)">View on GitHub</p>
              <GithubIcon />
            </a>
          </div>
        </div>
      </aside>
    </footer>
  );
};