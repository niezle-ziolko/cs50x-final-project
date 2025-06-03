import Lock from "styles/icons/lock";
import GithubIcon from "styles/icons/github";

export default function Footer() {
  return (
    <footer>
      <h3>Your secure messenger for creating one-time encrypted messages.</h3>
      <Lock />
      <aside className="github">
        <div className="box">
          <div>
            <a href="https://github.com/niezle-ziolko/cs50x-final-project" target="_blank" rel="noreferrer">
              <p>View on GitHub</p>
              <GithubIcon />
            </a>
          </div>
        </div>
      </aside>
    </footer>
  );
};