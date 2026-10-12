import { useMemo, useState, type CSSProperties } from 'react';
import { Stamp, MagnifyingGlass, BookmarkSimple } from '@phosphor-icons/react';
import { ERAS, eraVars } from '../design/era';
import { CHAPTERS } from '../content';
import { useAppState, setProgress } from '../lib/store';
import { BADGES } from '../lib/achievements';

/* ============================================================================
   THE PASSPORT
   ----------------------------------------------------------------------------
   Everything the reader has collected, as a traveller's document rather than
   a dashboard: the stamped pages of a real passport booklet, a cabinet shelf
   of objects found, and the collection kept in ink.
   ========================================================================= */

export function Passport() {
  const p = useAppState((s) => s.progress);
  const [name, setName] = useState(p.name);
  const earned = useMemo(() => new Set(p.badges), [p.badges]);
  const totalRelics = useMemo(() => ERAS.flatMap((e) => e.relics).length, []);
  const solved = Object.keys(p.puzzles).length;

  return (
    <div className="passport">
      <div className="passport-head">
        <span className="label label-dark">Traveller</span>
        <span className="passport-name">{p.name || 'Luchelle'}</span>
        <div className="passport-counts">
          <span><b className="num">{p.relics.length}</b> of {totalRelics} objects found</span>
          <span><b className="num">{p.completed.length}</b> of {CHAPTERS.length} chapters finished</span>
          <span><b className="num">{p.glossary.length}</b> words learned</span>
          <span><b className="num">{solved}</b> puzzles solved</span>
          <span><b className="num">{p.bookmarks.length}</b> pages saved</span>
        </div>
      </div>

      <h3 className="subhead">Pages stamped</h3>
      <p className="muted">
        A chapter is stamped when you finish its quiz. Nothing here is graded, and nothing leaves this device.
      </p>
      <div className="passport-grid">
        {ERAS.map((e) => {
          const done = p.completed.includes(e.id);
          const visited = p.visited.includes(e.id);
          return (
            <div
              className="stamp-card"
              key={e.id}
              data-earned={done ? '1' : '0'}
              style={eraVars(e.id) as CSSProperties}
            >
              <span className="stamp-seal" aria-hidden="true">
                {done ? <Stamp size={18} weight="fill" /> : <span className="num" style={{ fontSize: '.72rem' }}>{visited ? '·' : ''}</span>}
              </span>
              <span className="stamp-label">{e.title}</span>
              <span className="stamp-hint">
                {done
                  ? 'Stamped'
                  : visited
                    ? 'Opened on the map. Finish the quiz to stamp it.'
                    : 'Not opened yet'}
              </span>
            </div>
          );
        })}
      </div>

      <h3 className="subhead">Your cabinet</h3>
      <p className="muted">
        Objects you have found on the illustrated plates. Look closely at the pictures: some things are hidden in
        them.
      </p>
      <div className="shelf">
        {ERAS.filter((e) => e.relics.length > 0).map((e) => (
          e.relics.map((r) => {
            const got = p.relics.includes(r.id);
            return (
              <div className="shelf-row" key={r.id} data-found={got ? '1' : '0'} style={eraVars(e.id) as CSSProperties}>
                <span className="relic-mark" aria-hidden="true" style={got ? undefined : { borderColor: 'var(--deep-line)' }}>
                  {got ? <Stamp size={14} weight="fill" style={{ color: 'var(--verify-lit)' }} /> : <MagnifyingGlass size={14} weight="bold" />}
                </span>
                <span>
                  <strong style={{ fontWeight: got ? 700 : 400 }}>{got ? r.name : 'Still hidden'}</strong>
                  <span className="shelf-era" style={{ display: 'block' }}>{e.num === 'Prologue' || e.num === 'Epilogue' ? e.num : `Chapter ${e.num}`}</span>
                </span>
                <span className="muted">{got ? 'Collected' : 'Not found'}</span>
              </div>
            );
          })
        ))}
      </div>

      <h3 className="subhead">Museum stamps</h3>
      <div className="passport-grid">
        {BADGES.map((b) => {
          const got = earned.has(b.id);
          return (
            <div className="stamp-card" key={b.id} data-earned={got ? '1' : '0'}>
              <span className="stamp-seal" aria-hidden="true">
                {got ? <Stamp size={18} weight="fill" /> : null}
              </span>
              <span className="stamp-label">{b.label}</span>
              <span className="stamp-hint">{got ? 'Earned' : b.hint}</span>
            </div>
          );
        })}
      </div>

      <h3 className="subhead">Your saved pages</h3>
      {p.bookmarks.length === 0 ? (
        <p className="muted">
          <BookmarkSimple size={15} weight="bold" aria-hidden="true" style={{ display: 'inline', marginRight: 6 }} />
          Nothing saved yet. Use Save this page at the foot of any page.
        </p>
      ) : null}
      <ul className="bm-list">
        {p.bookmarks.map((b) => (
          <li key={b.page}>
            <span className="muted">{b.label}</span>
          </li>
        ))}
      </ul>

      <form
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          setProgress({ name: name.trim().slice(0, 40) || 'Luchelle' });
        }}
      >
        <label htmlFor="passport-name">
          Name on your certificate
          <input id="passport-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-solid btn-sm">Save name</button>
      </form>
      <p className="muted caption-small">
        Chapter colours on these stamps are part of the illustration, not a status code. The seal is.
      </p>
    </div>
  );
}
