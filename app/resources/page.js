'use client';

import { useState, useEffect } from 'react';
import './resources.css';
import { useSheet } from '@/app/lib/useSheet';
import { normalizeResource } from '@/app/lib/models';
import Pagination from '@/components/Pagination';

const PER_PAGE = 10;

export default function ResourcesPage() {
  const { rows, loading } = useSheet('resources', normalizeResource);
  const [cat, setCat] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const categories = ['All', ...Array.from(new Set(rows.map((r) => r.category).filter(Boolean)))];

  const q = query.trim().toLowerCase();
  const shown = rows.filter((r) => {
    if (cat !== 'All' && r.category !== cat) return false;
    if (!q) return true;
    return (
      (r.title || '').toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
  useEffect(() => setPage(0), [cat, query]);
  const totalPages = Math.ceil(shown.length / PER_PAGE);
  const paged = shown.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <div className="lib">
      <header className="lib-head">
        <div className="wrap">
          <div className="lib-head-row">
            <div>
              <span className="eyebrow">The Library</span>
              <h1>Playbooks, guides &amp; checklists</h1>
              <p>Practical resources for growing your ophthalmology practice, new ones added regularly.</p>
            </div>
            <label className="lib-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search resources…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search resources"
              />
            </label>
          </div>
        </div>
      </header>

      <section className="lib-body">
        <div className="wrap">
          {categories.length > 2 && (
            <div className="lib-tabs" role="tablist">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={cat === c}
                  className={`lib-tab${cat === c ? ' active' : ''}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="state"><div className="spinner" />Loading resources…</div>
          ) : shown.length === 0 ? (
            <div className="state">Resources are being added, check back soon.</div>
          ) : (
            <>
            <ol className="lib-list">
              {paged.map((r, i) => (
                <li className="lib-row" key={`${r.id}-${i}`}>
                  <div className="lib-tag" aria-hidden="true">{(r.category || 'R').charAt(0)}</div>
                  <div className="lib-main">
                    <div className="lib-cat">{r.category}</div>
                    <h3>{r.title}</h3>
                    {r.description && <p>{r.description}</p>}
                    <div className="lib-meta">
                      {[r.author, r.readTime, r.dateLabel].filter(Boolean).join(' · ')}
                      {r.tags.length > 0 && (
                        <span className="lib-tags"> · {r.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="lib-action">
                    {r.url ? (
                      <a className="btn btn-light" href={r.url} target="_blank" rel="noopener">
                        {r.gated ? 'Get access' : 'Download'}
                      </a>
                    ) : (
                      <span className="lib-soon">Coming soon</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
