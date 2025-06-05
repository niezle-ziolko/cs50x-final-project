import Lock from "styles/icons/lock";
import GithubIcon from "styles/icons/github";

export default function Footer() {
  const style = "flex flex-col items-center";

  return (
    <footer>
      <h3>Your secure messenger for creating one-time encrypted messages.</h3>
      <Lock />
      <aside className="github">
        <div className="box z-2 fixed w-50 h-50 right-(--null) bottom-(--null) overflow-(--hdd)">
          <div className={`${style} z-1 w-(--f) h-(--f) top-(--null) right-(--null) absolute justify-end rotate-(--ffm)`}>
            <a className={`${style} focus:text-(--gray) hover:text-(--gray)`} href="https://github.com/niezle-ziolko/cs50x-final-project" target="_blank" rel="noreferrer">
              <p className="text-current mt-(--o) mb-(--o)">View on GitHub</p>
              <GithubIcon />
            </a>
          </div>
        </div>
      </aside>
    </footer>
  );
};