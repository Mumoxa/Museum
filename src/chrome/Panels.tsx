import { useEffect, useMemo, useState } from 'react';
import { CHAPTERS, CHAPTER_START, PAGES, CHAPTER_BY_ID } from '../content';
import { SOURCES } from '../content/sources';
import { useAppState, setProgress, setSettings, resetAll, getState } from '../lib/store';
import { BADGES } from '../lib/achievements';
import { emit } from '../lib/bus';
import { Timeline } from '../interactives/Timeline';
import { narrator } from '../lib/narration';
import { Dialog } from './Dialog';

export type PanelName = 'contents' | 'timeline' | 'passport' | 'sources' | 'settings';

export function PanelHost({ panel, onClose, sourceIds }: { panel: PanelName; onClose: () => void; sourceIds: string[] }) {
  switch (panel) {
    case 'contents': return <Dialog title="Contents and bookmarks" onClose={onClose}><ContentsPanel onDone={onClose} /></Dialog>;
    case 'timeline': return <Dialog title="Timeline: deep time to 2026" onClose={onClose} wide><Timeline /></Dialog>;
    case 'passport': return <Dialog title="Achievement passport" onClose={onClose} wide><PassportPanel /></Dialog>;
    case 'sources': return <Dialog title="Sources and credits" onClose={onClose} wide><SourcesPanel focus={sourceIds} /></Dialog>;
    case 'settings': return <Dialog title="Settings" onClose={onClose} wide><SettingsPanel /></Dialog>;
  }
}

function ContentsPanel({ onDone }: { onDone: () => void }) {
  const completed = useAppState((s) => s.progress.completed);
  const bookmarks = useAppState((s) => s.progress.bookmarks);
  const current = useAppState((s) => s.progress.page);
  const currentChapter = PAGES[current]?.chapter;
  return (
    <div className="contents">
      <h3 className="subhead">Chapters</h3>
      <ol className="toc">
        {CHAPTERS.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={`toc-btn ${currentChapter === c.id ? 'current' : ''}`}
              onClick={() => { emit('goto', CHAPTER_START[c.id]); onDone(); }}
              aria-current={currentChapter === c.id ? 'true' : undefined}
            >
              <span className="toc-num">{c.num === 'Prologue' || c.num === 'Epilogue' ? c.num : `Chapter ${c.num}`}</span>
              <span className="toc-title">{c.title}</span>
              <span className="toc-state">{completed.includes(c.id) ? 'Quiz done' : ''}</span>
            </button>
          </li>
        ))}
      </ol>
      <h3 className="subhead">Bookmarks</h3>
      {bookmarks.length === 0 && <p className="muted">No bookmarks yet. Use “Bookmark this page” at the foot of any page.</p>}
      <ul className="bm-list">
        {bookmarks.map((b) => (
          <li key={b.page}>
            <button type="button" className="ghost small" onClick={() => { emit('goto', b.page); onDone(); }}>{b.label}</button>
            <button type="button" className="ghost tiny" aria-label={`Remove bookmark ${b.label}`} onClick={() => setProgress({ bookmarks: getState().progress.bookmarks.filter((x) => x.page !== b.page) })}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PassportPanel() {
  const p = useAppState((s) => s.progress);
  const [name, setName] = useState(p.name);
  const earned = new Set(p.badges);
  const solved = Object.keys(p.puzzles).length;
  const chapterCount = CHAPTERS.length;
  return (
    <div className="passport">
      <p className="passport-stats">
        <span><strong>{p.completed.length}</strong> of {chapterCount} chapter quizzes done</span>
        <span><strong>{p.glossary.length}</strong> words defined</span>
        <span><strong>{solved}</strong> puzzles solved</span>
        <span><strong>{p.bookmarks.length}</strong> bookmarks</span>
      </p>
      <p className="muted">Badges are earned by reading, exploring and answering. They are not graded, and nothing is shared.</p>
      <ul className="badge-grid">
        {BADGES.map((b) => (
          <li key={b.id} className={earned.has(b.id) ? 'badge earned' : 'badge'}>
            <span className="badge-seal" aria-hidden="true">{earned.has(b.id) ? '★' : '○'}</span>
            <span className="badge-label">{b.label}</span>
            <span className="badge-hint">{earned.has(b.id) ? 'Earned' : b.hint}</span>
          </li>
        ))}
      </ul>
      <form className="inline-form" onSubmit={(e) => { e.preventDefault(); setProgress({ name: name.trim().slice(0, 40) || 'Luchelle' }); }}>
        <label htmlFor="passport-name">Name for the certificate</label>
        <input id="passport-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="btn small">Save name</button>
      </form>
    </div>
  );
}

function SourcesPanel({ focus }: { focus: string[] }) {
  const ids = Object.keys(SOURCES);
  const photos = useMemo(() => {
    const list: { caption: string; credit: string; license: string; url: string; page: number }[] = [];
    PAGES.forEach((pg, i) => pg.side.blocks.forEach((b) => {
      if (b.t === 'fig') list.push({ caption: b.caption, credit: b.credit, license: b.license, url: b.url, page: i });
    }));
    return list;
  }, []);
  const [showAll, setShowAll] = useState(focus.length === 0);
  const ordered = [...focus, ...ids.filter((i) => !focus.includes(i))];
  return (
    <div className="sources">
      <p className="note-banner">Every photograph here is a real photograph from Wikimedia Commons, with its licence checked on the Commons record. No AI-generated or reconstructed images are used. Photographs that could not be verified are left out: the Mapungubwe golden rhinoceros photo (its description conflicts with a museum record) and Sam Nzima’s famous 1976 photograph (its licence could not be verified).</p>
      <h3 className="subhead">Photographs in this book ({photos.length})</h3>
      <ul className="src-list">
        {photos.map((ph, i) => (
          <li key={i}>
            <strong>{CHAPTER_BY_ID[PAGES[ph.page].chapter]?.title ?? ''}</strong>: {ph.caption}
            <div className="muted">Photo: {ph.credit}, {ph.license}. <a href={ph.url} target="_blank" rel="noopener noreferrer">Source page</a></div>
          </li>
        ))}
      </ul>
      <h3 className="subhead">Written sources</h3>
      {!showAll && <button type="button" className="ghost small" onClick={() => setShowAll(true)}>Show all sources</button>}
      <ul className="src-list">
        {(showAll ? ordered : focus).map((id) => {
          const s = SOURCES[id];
          if (!s) return null;
          return (
            <li key={id} className={focus.includes(id) ? 'focused' : ''}>
              <strong>{s.title}</strong>
              <div className="muted">{s.publisher}{s.note ? `. ${s.note}` : ''}</div>
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>
            </li>
          );
        })}
      </ul>
      <p className="caption-small">Some sources are secondary summaries used to check dates and figures. Where sources disagree, the book gives a range or says so.</p>
    </div>
  );
}

function SettingsPanel() {
  const st = useAppState((s) => s.settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  useEffect(() => {
    const load = () => setVoices(narrator.voices());
    load();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', load);
      return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load);
    }
    return undefined;
  }, []);
  return (
    <div className="settings">
      <fieldset>
        <legend>Motion</legend>
        {(['system', 'reduced', 'full'] as const).map((m) => (
          <label key={m} className="radio">
            <input type="radio" name="motion" value={m} checked={st.motion === m} onChange={() => setSettings({ motion: m })} />
            {m === 'system' ? 'Follow my device setting' : m === 'reduced' ? 'Reduce motion (no page-turn animation)' : 'Full motion'}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Sound effects</legend>
        <label className="check">
          <input type="checkbox" checked={st.sound} onChange={(e) => setSettings({ sound: e.target.checked })} />
          Page-turn and quiz sounds (off unless you turn them on)
        </label>
        <label className="range-label">
          Volume
          <input type="range" min={0} max={1} step={0.05} value={st.soundVolume} onChange={(e) => setSettings({ soundVolume: Number(e.target.value) })} disabled={!st.sound} />
        </label>
      </fieldset>
      <fieldset>
        <legend>Reading</legend>
        <label className="check">
          <input type="checkbox" checked={st.simple} onChange={(e) => setSettings({ simple: e.target.checked })} />
          Simplified reading mode (one page at a time, no page-turn effects)
        </label>
        <label className="check">
          <input type="checkbox" checked={st.largeText} onChange={(e) => setSettings({ largeText: e.target.checked })} />
          Larger text
        </label>
        <label className="check">
          <input type="checkbox" checked={st.parentNotes} onChange={(e) => setSettings({ parentNotes: e.target.checked })} />
          Show parent notes (for a grown-up reading alongside)
        </label>
      </fieldset>
      <fieldset>
        <legend>Narration voice and speed</legend>
        {!narrator.supported && <p className="nope">This browser cannot read pages aloud. Try Chrome, Edge, Safari or Firefox on a device with a speech voice. The text is always there to read.</p>}
        <label className="select-label">
          Voice
          <select value={st.voiceURI} onChange={(e) => { setSettings({ voiceURI: e.target.value }); narrator.setVoiceByURI(e.target.value); }} disabled={!narrator.supported}>
            <option value="">Browser default</option>
            {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
        <label className="select-label">
          Speed
          <select value={st.rate} onChange={(e) => { const r = Number(e.target.value); setSettings({ rate: r }); narrator.setRate(r); }} disabled={!narrator.supported}>
            {[0.75, 0.9, 1, 1.15, 1.3].map((r) => <option key={r} value={r}>{r}×</option>)}
          </select>
        </label>
      </fieldset>
      <fieldset>
        <legend>Your data</legend>
        <p className="muted">Everything is stored on this device. Resetting removes your place, bookmarks, quiz answers, badges, questions and certificate name.</p>
        <button type="button" className="ghost danger" onClick={() => {
          if (window.confirm('Reset all progress on this device? This cannot be undone.')) resetAll();
        }}>Reset all progress</button>
      </fieldset>
    </div>
  );
}
