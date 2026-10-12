import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Copy, Printer, DownloadSimple, LinkSimple, BookmarkSimple } from '@phosphor-icons/react';
import { CHAPTERS, CHAPTER_START, PAGES, CHAPTER_BY_ID } from '../content';
import { SOURCES } from '../content/sources';
import { ERAS, eraVars } from '../design/era';
import { useAppState, setProgress, setSettings, resetAll, getState } from '../lib/store';
import { narrator } from '../lib/narration';
import { emit } from '../lib/bus';
import { Timeline } from '../interactives/Timeline';
import { Dialog } from './Dialog';
import { Passport } from './Passport';

export type PanelName = 'contents' | 'timeline' | 'passport' | 'sources' | 'settings';

export function PanelHost({ panel, onClose, sourceIds }: { panel: PanelName; onClose: () => void; sourceIds: string[] }) {
  switch (panel) {
    case 'contents':
      return <Dialog title="Contents" onClose={onClose}><ContentsPanel onDone={onClose} /></Dialog>;
    case 'timeline':
      return <Dialog title="Deep time to 2026" onClose={onClose} wide><Timeline /></Dialog>;
    case 'passport':
      return <Dialog title="Your museum passport" onClose={onClose} wide><Passport /></Dialog>;
    case 'sources':
      return <Dialog title="Evidence and credits" onClose={onClose} wide><SourcesPanel focus={sourceIds} /></Dialog>;
    case 'settings':
      return <Dialog title="Settings" onClose={onClose} wide><SettingsPanel /></Dialog>;
  }
}

/* ---------------------------------------------------------------------------
   Contents: the printed table of contents, with each chapter's own tint.
   -------------------------------------------------------------------------- */
function ContentsPanel({ onDone }: { onDone: () => void }) {
  const completed = useAppState((s) => s.progress.completed);
  const bookmarks = useAppState((s) => s.progress.bookmarks);
  const current = useAppState((s) => s.progress.page);
  const currentChapter = PAGES[current]?.chapter;

  return (
    <div className="contents">
      <ol className="toc">
        {CHAPTERS.map((c) => {
          const era = ERAS.find((e) => e.id === c.id);
          return (
            <li key={c.id} style={eraVars(c.id) as CSSProperties}>
              <button
                type="button"
                className={`toc-btn${currentChapter === c.id ? ' current' : ''}`}
                onClick={() => { emit('goto', CHAPTER_START[c.id]); onDone(); }}
                aria-current={currentChapter === c.id ? 'true' : undefined}
              >
                <span className="toc-num">{c.num}</span>
                <span>
                  <span className="toc-title">{c.title}</span>
                  {era?.mood && <span className="toc-mood">{era.mood}</span>}
                </span>
                <span className="toc-state">{completed.includes(c.id) ? 'Stamped' : ''}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <h3 className="subhead">Saved pages</h3>
      {bookmarks.length === 0 ? (
        <p className="muted">
          <BookmarkSimple size={15} weight="bold" aria-hidden="true" style={{ display: 'inline', marginRight: 6 }} />
          Nothing saved yet. Use Save this page at the foot of any page.
        </p>
      ) : (
        <ul className="bm-list">
          {bookmarks.map((b) => (
            <li key={b.page}>
              <button type="button" className="ghost small" onClick={() => { emit('goto', b.page); onDone(); }}>
                {b.label}
              </button>
              <button
                type="button"
                className="ghost tiny"
                aria-label={`Remove the bookmark for ${b.label}`}
                onClick={() => setProgress({ bookmarks: getState().progress.bookmarks.filter((x) => x.page !== b.page) })}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Evidence: every photograph and every written source, on one ledger.
   -------------------------------------------------------------------------- */
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
      <p className="note-banner">
        This book carries three kinds of picture and never mixes them up. <strong>Photographs</strong> are real
        photographs from Wikimedia Commons, with each licence read from the Commons record itself. <strong>Chapter
        plates</strong> are paintings made for this book: they show a typical place from a period in a period palette,
        and they are not photographs and not evidence for any claim. <strong>Maps</strong> are drawn in your browser
        from real longitudes and latitudes. Photographs that could not be verified were left out rather than guessed
        at, including the Mapungubwe golden rhinoceros (its description conflicts with a museum record) and Sam
        Nzima&rsquo;s 1976 photograph (its licence could not be confirmed).
      </p>

      <h3 className="subhead">Illustrated plates ({ERAS.filter((e) => e.plate).length})</h3>
      <p className="muted caption-small">
        Painted for this book. Chapters 7 and 9 have no plate: they use their own photographs, and their places are on
        the map instead.
      </p>
      <ul className="src-list">
        {ERAS.filter((e) => e.plate).map((e) => (
          <li key={e.id}>
            <strong>{e.num === 'Prologue' || e.num === 'Epilogue' ? e.num : `Chapter ${e.num}`}: {e.title}</strong>
            <div className="muted">{e.plateAlt}</div>
          </li>
        ))}
      </ul>

      <h3 className="subhead">Photographs ({photos.length})</h3>
      <ul className="src-list">
        {photos.map((ph, i) => (
          <li key={i}>
            <strong>{CHAPTER_BY_ID[PAGES[ph.page].chapter]?.title ?? ''}</strong>
            <div>{ph.caption}</div>
            <div className="muted">
              Photograph by {ph.credit}, {ph.license}.{' '}
              <a href={ph.url} target="_blank" rel="noopener noreferrer">Commons record</a>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="subhead">Maps</h3>
      <ul className="src-list">
        <li>
          <strong>Coastlines and borders</strong>
          <div className="muted">
            Natural Earth, public domain, distributed by the <code>world-atlas</code> package, projected in your
            browser with d3-geo. The seven countries this book draws are extracted into a single small file; the
            extraction is checked by projecting both versions and comparing the output.
          </div>
        </li>
        <li>
          <strong>Places, mountains and their coordinates</strong>
          <div className="muted">
            Every site marker sits at the real longitude and latitude of the place it names. Mountain marks are placed
            at real named ranges. The Cape and Highveld plates are enlargements of the same coordinates, because those
            places are only a few kilometres apart and cannot be lettered honestly on one plate.
          </div>
        </li>
      </ul>

      <h3 className="subhead">Written sources</h3>
      {!showAll && (
        <button type="button" className="ghost small" onClick={() => setShowAll(true)}>Show all sources</button>
      )}
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
      <p className="caption-small">
        Some sources are secondary summaries used to check dates and figures. Where sources disagree, this book gives a
        range or says so plainly.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Settings: reading comfort first, then sound, then narration, then data.
   -------------------------------------------------------------------------- */
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
        <legend>Reading</legend>
        <label className="radio">
          <input type="radio" name="scale" checked={st.scale === 'normal'} onChange={() => setSettings({ scale: 'normal' })} />
          Normal text
        </label>
        <label className="radio">
          <input type="radio" name="scale" checked={st.scale === 'large'} onChange={() => setSettings({ scale: 'large' })} />
          Larger text
        </label>
        <label className="check">
          <input type="checkbox" checked={st.simple} onChange={(e) => setSettings({ simple: e.target.checked })} />
          Plain reading: one scrolling column, no page turning
        </label>
        <label className="check">
          <input type="checkbox" checked={st.parentNotes} onChange={(e) => setSettings({ parentNotes: e.target.checked })} />
          Show the notes for a grown-up reading alongside
        </label>
      </fieldset>

      <fieldset>
        <legend>The lamp</legend>
        <p className="muted caption-small">
          The room stays dark and the page stays lit. This only changes the temperature of the light on the paper.
        </p>
        {([
          ['warm', 'Warm, like a desk lamp'],
          ['cool', 'Cool, like a reading room'],
          ['dim', 'Dim, for late at night'],
        ] as const).map(([k, text]) => (
          <label className="radio" key={k}>
            <input type="radio" name="lamp" checked={st.lamp === k} onChange={() => setSettings({ lamp: k })} />
            {text}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Motion</legend>
        {(['system', 'reduced', 'full'] as const).map((m) => (
          <label key={m} className="radio">
            <input type="radio" name="motion" value={m} checked={st.motion === m} onChange={() => setSettings({ motion: m })} />
            {m === 'system'
              ? 'Follow my device setting'
              : m === 'reduced'
                ? 'Calm: no page turn, no unfolding map'
                : 'Full: the whole show'}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Sound</legend>
        <label className="check">
          <input type="checkbox" checked={st.sound} onChange={(e) => setSettings({ sound: e.target.checked })} />
          Page turns and chimes (off until you turn it on)
        </label>
        <label className="range-label">
          Volume
          <input
            type="range" min={0} max={1} step={0.05} value={st.soundVolume}
            onChange={(e) => setSettings({ soundVolume: Number(e.target.value) })}
            disabled={!st.sound}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Reading aloud</legend>
        {!narrator.supported && (
          <p className="nope">
            This browser cannot read pages aloud. Every word is on the page to read, and Chrome, Edge, Safari and
            Firefox on a device with a speech voice will read it.
          </p>
        )}
        <label className="select-label">
          Voice
          <select
            value={st.voiceURI}
            onChange={(e) => { setSettings({ voiceURI: e.target.value }); narrator.setVoiceByURI(e.target.value); }}
            disabled={!narrator.supported}
          >
            <option value="">Browser default</option>
            {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
        <label className="select-label">
          Speed
          <select
            value={st.rate}
            onChange={(e) => { const r = Number(e.target.value); setSettings({ rate: r }); narrator.setRate(r); }}
            disabled={!narrator.supported}
          >
            {[0.75, 0.9, 1, 1.15, 1.3].map((r) => <option key={r} value={r}>{r} times normal</option>)}
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Your data</legend>
        <p className="muted caption-small">
          Everything is stored in this browser, on this device. There is no account and no server. Resetting removes
          your place, your finds, your bookmarks, your quiz answers, your stamps and your certificate name.
        </p>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm('Reset everything saved on this device? This cannot be undone.')) resetAll();
          }}
        >
          Reset everything
        </button>
      </fieldset>

      <fieldset>
        <legend>Certificate</legend>
        <p className="muted caption-small">
          Your certificate lives at the back of the book, on the last page, and can be printed or saved as a picture.
        </p>
        <div className="cert-actions">
          <button type="button" className="ghost small" onClick={() => emit('goto', CHAPTER_START.epilogue)}>
            <LinkSimple size={14} weight="bold" aria-hidden="true" />
            Go to the certificate
          </button>
          <button
            type="button"
            className="ghost small"
            onClick={() => { void navigator.clipboard?.writeText(window.location.href); emit('toast', 'Link copied'); }}
          >
            <Copy size={14} weight="bold" aria-hidden="true" />
            Copy a link to the book
          </button>
        </div>
        <p className="muted caption-small" style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center', marginTop: 'var(--s-3)' }}>
          <Printer size={15} weight="bold" aria-hidden="true" />
          <DownloadSimple size={15} weight="bold" aria-hidden="true" />
          Printing uses your device's print dialog, so it works with any printer you already have.
        </p>
      </fieldset>
    </div>
  );
}
