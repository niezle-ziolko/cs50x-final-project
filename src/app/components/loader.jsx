export default function Loader() {
  const letters = ["L", "o", "a", "d", "i", "n", "g"];

  return (
    <div className="flex justify-center items-center font-[var(--primary-font-family)]">
      {letters.map((letter, index) => (
        <div
          key={index}
          className="inline-block animate-[obrot_2s_linear_infinite]"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};