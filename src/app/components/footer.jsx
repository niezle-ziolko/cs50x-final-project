import Lock from "styles/icons/lock";
import GithubIcon from "styles/icons/github";

export default function Footer() {
  return (
    <footer className="u1 align-center mb-4 md:mx-qp border-t-2 border-t-bl-100">
      <h4>Your secure messenger for creating one-time encrypted messages.</h4>
      <Lock />
      <aside className="github">
        <div className="z-2 fixed w-50 h-50 right-0 bottom-0 overflow-hidden after:content-[''] after:block after:absolute after:left-0 after:right-0 after:bottom-0 after:z-0 after:border-t-[12.5rem] after:border-t-transparent after:border-l-[12.5rem] after:border-l-transparent after:border-b-[12.5rem] after:border-b-(--color-b-200)">
          <div className="u12 z-1 w-full h-full top-0 right-0 absolute justify-end -rotate-(--ff)">
            <a className="u12 focus:text-g-100 hover:text-g-100 text-white text-base font-mono no-underline px-6 pt-[.1875rem] pb-6 m-0 -mb-5 transition-colors duration-[150ms] ease-[cubic-bezier(1,-.115,.975,.855)]" href="https://github.com/niezle-ziolko/cs50x-final-project" target="_blank" rel="noreferrer">
              <p className="text-current mt-4 mb-4">View on GitHub</p>
              <GithubIcon />
            </a>
          </div>
        </div>
      </aside>
    </footer>
  );
};