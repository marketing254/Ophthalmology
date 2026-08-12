'use client';

// Compact numbered pagination with a sliding window + first/last.
export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const go = (p) => onPage(Math.max(0, Math.min(totalPages - 1, p)));
  const window = [];
  const from = Math.max(0, page - 1);
  const to = Math.min(totalPages - 1, page + 1);
  for (let i = from; i <= to; i += 1) window.push(i);

  return (
    <nav className="pgn" aria-label="Pagination">
      <button className="pgn-btn pgn-nav" onClick={() => go(page - 1)} disabled={page === 0} aria-label="Previous page">←</button>

      {from > 0 && (
        <>
          <button className="pgn-btn" onClick={() => go(0)}>1</button>
          {from > 1 && <span className="pgn-gap">…</span>}
        </>
      )}

      {window.map((n) => (
        <button key={n} className={`pgn-btn${n === page ? ' active' : ''}`} onClick={() => go(n)} aria-current={n === page ? 'page' : undefined}>
          {n + 1}
        </button>
      ))}

      {to < totalPages - 1 && (
        <>
          {to < totalPages - 2 && <span className="pgn-gap">…</span>}
          <button className="pgn-btn" onClick={() => go(totalPages - 1)}>{totalPages}</button>
        </>
      )}

      <button className="pgn-btn pgn-nav" onClick={() => go(page + 1)} disabled={page >= totalPages - 1} aria-label="Next page">→</button>
    </nav>
  );
}
