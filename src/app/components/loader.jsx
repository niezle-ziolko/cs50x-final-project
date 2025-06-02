export default function Loader() {
  // Array of letters to display in the loading animation
  const letters = ["L", "o", "a", "d", "i", "n", "g"];

  return (
    // Container div that centers the loader and applies font style
    <div className="flex justify-center items-center font-[var(--primary-font-family)]">
      {letters.map((letter, index) => (
        <div
          key={index}
          className="inline-block animate-[turnover_2s_linear_infinite]"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};