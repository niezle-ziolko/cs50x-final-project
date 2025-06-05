export default function NotFound() {
  const style = "w-(--h) h-(--h) relative border-2 rounded-full bg-(--g-100) transform-[rotate(var(--ff))]";
  const style2 = "flex items-center justify-center";

  return (
    <>
      <div className={`${style2} h-126`}>
        <div className={`${style2} mt-20 flex-col`}>
          <div className="antenna w-20 h-20 rounded-full bg-[#f27405] -z-1 ml-0 -mb-24 border-2">
            <div className="a1 absolute bg-transparent w-13 h-14 ml-6 rounded-(--hp) rotate-[140deg] border-3 border-transparent" />
            <div className="a1d -top-19 -left-25 w-(--tw) h-22 relative transform-[rotate(-29deg)]" />
            <div className={`${style} -top-40 -left-7`} />
            <div className="a2d w-(--tw) h-16 -top-40 -left-2 relative transform-[rotate(-8deg)]" />
            <div className={`${style} left-18 -top-56`} />
          </div>
          <div className="tv w-68 h-36 mt-12 rounded-2xl bg-(--or-400) flex justify-center border-2 inset-shadow-[var(--q)_var(--q)_var(--or-200)]">
            <div>
              <svg className="w-3 h-3 absolute mt-(--q) -ml-(--q)" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 189.929 189.929" xmlSpace="preserve">
                <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13 C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z" />
              </svg>
            </div>
            <div className={`${style2} self-center rounded-2xl shadow-[3.5px_3.5px_var(--n)_var(--or-200)]`}>
              <div className="w-auto h-auto rounded-sm">
                <div className={`${style2} w-44 h-31 rounded-sm`}>
                  <div className={`${style2} screen w-52 h-31 border-2 rounded-xl z-99 font-bold text-(--b-100) text-center tracking-wide`}>
                    <span className="z-10 bg-(--b) pl-1 pr-1 text-(--w) text-xs rounded-sm tracking-normal">NOT FOUND</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-x-(--q) self-end">
              <div className="line1" />
              <div className="line2" />
              <div className="line3" />
            </div>
            <div className="buttons-div">
              <div className="b1"><div /></div>
              <div className="b2" />
              <div className="speakers">
                <div className="g1">
                  <div className="g11" />
                  <div className="g12" />
                  <div className="g13" />
                </div>
                <div className="g" />
                <div className="g" />
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="base1" />
            <div className="base2" />
            <div className="base3" />
          </div>
        </div>
      </div>
    </>
  );
}