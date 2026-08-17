// Server-safe letter-by-letter reveal. Words stay unbreakable so lines wrap
// at word boundaries; a visually-hidden copy keeps the text readable to
// screen readers while the animated letters are aria-hidden.
export default function LetterReveal({ text, delay = 80, step = 24 }) {
  const words = text.split(' ');
  let i = 0;
  return (
    <span className="lr">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span className="lr-w">
              {word.split('').map((ch, c) => (
                <span className="lr-ch" key={c} style={{ animationDelay: `${delay + i++ * step}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </span>
  );
}
