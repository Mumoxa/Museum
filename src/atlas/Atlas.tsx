import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  Compass as CompassIcon,
  MapPin,
  X,
  CaretRight,
  Stamp,
} from '@phosphor-icons/react';
import { ERAS, ERA_BY_ID, eraVars } from '../design/era';
import { CHAPTER_START, PAGES } from '../content';
import { useAppState, setProgress, prefersReducedMotion } from '../lib/store';
import { emit } from '../lib/bus';
import { award } from '../lib/achievements';
import { useAtlas, SeaRules, SITES, labelAnchor, type Zone } from './plate';

/* ============================================================================
   THE ATLAS EXPLORER
   ----------------------------------------------------------------------------
   The centrepiece. A hand-atlased plate of southern Africa drawn from real
   coordinates, where every chapter is a place the reader can travel to.
   Two levels: the whole country, and a Cape inset, because an honest atlas
   enlarges a crowded corner instead of stacking labels on top of each other.

   Motion: the whole performance plays ONCE, on first entry, and is skipped
   entirely after that. It is a title sequence, not an ambient loop.
   ========================================================================= */

const SEEN_KEY = 'atlas-opened';

export function Atlas({ onClose, arrival = false }: { onClose: () => void; arrival?: boolean }) {
  const [level, setLevel] = useState<'country' | Zone>('country');
  const [open, setOpen] = useState<string | null>(null);
  const [clusterOpen, setClusterOpen] = useState<string[] | null>(null);
  const [intro, setIntro] = useState(() => {
    try { return localStorage.getItem(SEEN_KEY) !== '1'; } catch { return true; }
  });
  const motion = useAppState((s) => s.settings.motion);
  const reduced = prefersReducedMotion(motion);
  const found = useAppState((s) => s.progress.relics);
  const completed = useAppState((s) => s.progress.completed);
  const current = PAGES[useAppState((s) => s.progress.page)]?.chapter || 'prologue';

  const atlas = useAtlas(1000, 780);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  /* Escape closes the topmost layer, not the whole atlas. */
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    e.stopPropagation();
    if (open) setOpen(null);
    else if (clusterOpen) setClusterOpen(null);
    else onClose();
  }, [open, clusterOpen, onClose]);
  useEffect(() => {
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onKey]);

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [level]);

  /* The title sequence: the plate rises, the mountains unfold, the clouds
     drift, and the marks settle. It plays once. Afterwards the map is simply
     there, which is what a map should be. */
  useEffect(() => {
    if (!intro) return;
    const t = window.setTimeout(() => {
      setIntro(false);
      try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode */ }
      /* Arriving from the cover: the map opens the first chapter for you. */
      if (arrival) setOpen('prologue');
    }, reduced ? 150 : 3400);
    return () => window.clearTimeout(t);
  }, [intro, reduced, arrival]);

  const zone = level === 'country' ? null : atlas.zones[level];
  const visible = useMemo(
    () => SITES.filter((s) => (level === 'country' ? !s.zone : s.zone === level)),
    [level],
  );
  const part = zone ?? atlas;
  const clusters = (zone ? zone.clusters : atlas.clusters).filter((c) =>
    c.ids.some((id) => SITES.find((s) => s.id === id) && (level === 'country' ? !SITES.find((s) => s.id === id)!.zone : SITES.find((s) => s.id === id)!.zone === level)),
  );

  function travel(id: string) {
    emit('goto', CHAPTER_START[id] ?? 0);
    onClose();
  }

  /* Opening an era drawer marks it visited, and once every chapter has been
     opened the reader is made Cartographer. */
  function look(id: string) {
    if (!ERA_BY_ID[id]) return;
    setOpen(id);
    setProgress((p) => {
      const visited = p.visited.includes(id) ? p.visited : [...p.visited, id];
      if (ERAS.every((e) => visited.includes(e.id))) {
        window.setTimeout(() => award('cartographer'), 450);
      }
      return { visited };
    });
  }

  const openEra = open ? ERA_BY_ID[open] : null;

  return (
    <div className="atlas-scrim" role="dialog" aria-modal="true" aria-label="Expedition map">
      <div className="atlas-sheet" ref={sheetRef} data-intro={intro ? '1' : undefined}>
        <header className="atlas-head">
          <div>
            <h2 className="atlas-h" ref={headingRef} tabIndex={-1}>
              {arrival && intro ? 'Your expedition map' : 'Expedition map'}
            </h2>
            <p className="atlas-sub">
              {arrival && intro
                ? 'The country is unfolding out of the paper. Every mark on it is a real place, and every place is a chapter.'
                : level === 'country'
                  ? 'Every mark is a place in your book. Real coordinates, drawn true. Tap a mark to look closer.'
                  : atlas.zones[level].note}
            </p>
          </div>
          <div className="atlas-head-tools">
            <div className="level-switch" role="group" aria-label="Which plate">
              {([['country', 'Whole country'], ['cape', 'The Cape'], ['highveld', 'The Highveld']] as const).map(([k, name]) => (
                <button
                  key={k}
                  type="button"
                  className="tag btn-sm"
                  aria-pressed={level === k}
                  onClick={() => setLevel(k)}
                >
                  {name}
                </button>
              ))}
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close the map">
              <X size={20} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="atlas-body">
          <div className="plate-wrap">
            <svg
              className="plate"
              viewBox={`0 0 ${part.w} ${part.h}`}
              role="img"
              aria-label={
                level === 'country'
                  ? 'Engraved atlas plate of southern Africa showing the position of every place in the book.'
                  : `Engraved plate enlarging ${zone?.name ?? ''}, showing the places in the book that are found there.`
              }
            >
              <SeaRules />
              <rect width={part.w} height={part.h} fill="url(#atlas-sea-grad)" />
              <rect width={part.w} height={part.h} fill="url(#atlas-waves)" />
              {intro && !reduced && (
                <g className="clouds" aria-hidden="true">
                  <g className="cloud cloud-a">
                    <ellipse cx="0" cy="0" rx="150" ry="30" />
                    <ellipse cx="90" cy="10" rx="110" ry="22" />
                    <ellipse cx="-80" cy="8" rx="90" ry="18" />
                  </g>
                  <g className="cloud cloud-b">
                    <ellipse cx="0" cy="0" rx="120" ry="24" />
                    <ellipse cx="-70" cy="9" rx="84" ry="17" />
                  </g>
                </g>
              )}

              {level === 'country' ? (
                <>
                  {/* Neighbours, drawn quieter so the country stays the subject. */}
                  <path d={atlas.land} fill="url(#atlas-land-grad)" stroke="#8a7a4a" strokeWidth="1.4" opacity=".55" />
                  <path d={atlas.focus} fill="#4d4326" stroke="#c9a227" strokeWidth="2.2" />
                  <path d={atlas.focus} fill="url(#atlas-stipple)" opacity=".7" pointerEvents="none" />
                  {/* The two countries inside South Africa, drawn as countries. */}
                  <path d={atlas.enclaves} fill="#3b3524" stroke="#a8924c" strokeWidth="1.2" />
                </>
              ) : (
                <>
                  <path d={part.land} fill="#4d4326" stroke="#c9a227" strokeWidth="2.2" />
                  <path d={part.land} fill="url(#atlas-stipple)" opacity=".7" pointerEvents="none" />
                  {(part as typeof atlas.zones.cape).enclaves && (
                    <path d={(part as typeof atlas.zones.cape).enclaves} fill="#3b3524" stroke="#a8924c" strokeWidth="1.2" />
                  )}
                </>
              )}

              {/* Real mountain ranges as rising engraved marks. */}
              <g className="ridges">
                {(level === 'country' ? atlas.mountains : zone!.ridges).map((m, i) => (
                  <path
                    key={i}
                    d={m.d}
                    fill="#6b5f36"
                    stroke="#d9c88a"
                    strokeWidth="1.1"
                    style={{ animationDelay: `${620 + i * 55}ms` }}
                  />
                ))}
              </g>
              {level !== 'country' && zone!.ridges.map((m, i) => (
                <text key={`rn-${i}`} className="site-label ridge-label" x={m.x + 12} y={m.y - 6}>
                  {m.name}
                </text>
              ))}

              <g className="sites">
                {clusters.map((c, i) => {
                  const primary = c.ids.find((id) => id === current) ?? c.ids[0];
                  const isHere = c.ids.includes(current);
                  const done = c.ids.every((id) => completed.includes(id));
                  const label = c.ids.length > 1 ? `${c.ids.length} places here` : (SITES.find((s) => s.id === primary)?.label ?? '');
                  const lab = labelAnchor(c.x, part.w);
                  return (
                    <g
                      key={c.ids.join('-')}
                      className={`site${isHere ? ' is-here' : ''}${done ? ' is-done' : ''}${c.ids.length > 1 ? ' is-cluster' : ''}`}
                      transform={`translate(${c.x} ${c.y})`}
                      style={{ animationDelay: `${900 + i * 90}ms` }}
                    >
                      <circle className="site-halo" r="15" />
                      {c.ids.length > 1 && <circle className="site-cluster-ring" r="13" />}
                      <circle className="site-dot" r={c.ids.length > 1 ? 8.5 : 6.5} />
                      <text className="site-label" x={lab.x} y="5.5" textAnchor={lab.anchor}>{label}</text>
                      <circle
                        className="site-hit"
                        r="22"
                        tabIndex={0}
                        role="button"
                        aria-label={
                          c.ids.length > 1
                            ? `${c.ids.length} places at this spot: ${c.ids.map((id) => ERA_BY_ID[id]?.title).join(', ')}`
                            : `${label}. ${ERA_BY_ID[primary]?.title ?? ''}`
                        }
                        onClick={() => (c.ids.length > 1 ? setClusterOpen(c.ids) : look(primary))}
                        onKeyDown={(e) => {
                          if (e.key !== 'Enter' && e.key !== ' ') return;
                          e.preventDefault();
                          if (c.ids.length > 1) setClusterOpen(c.ids);
                          else look(primary);
                        }}
                      />
                    </g>
                  );
                })}
              </g>

              <CompassRose x={part.w - 66} y={68} />
              {level === 'country' && <ScaleBar x={54} y={atlas.h - 56} />}
              <PlateCaption
                x={54}
                y={level === 'country' ? atlas.h - 22 : part.h - 16}
                text={
                  level === 'country'
                    ? 'Plate I. Southern Africa, drawn from real longitudes and latitudes.'
                    : `Plate ${zone!.name === 'The Cape' ? 'II' : 'III'}. ${zone!.name}, enlarged from the same coordinates.`
                }
              />
            </svg>

            {/* The plate lies on the desk: a paper edge, a shadow, a stamp line. */}
            <div className="plate-edge" aria-hidden="true" />
          </div>

          <aside className="atlas-index" aria-label="Chapter index">
            <h3 className="atlas-index-h">Contents of the atlas</h3>
            <ol className="leg-list">
              {ERAS.map((e) => {
                const done = completed.includes(e.id);
                const here = e.id === current;
                const relicsHere = e.relics.filter((r) => found.includes(r.id)).length;
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      className={`leg-row${here ? ' is-here' : ''}`}
                      style={eraVars(e.id) as CSSProperties}
                      onClick={() => look(e.id)}
                      aria-current={here ? 'true' : undefined}
                    >
                      <span className="leg-swatch" aria-hidden="true" />
                      <span className="leg-no num">{e.num === 'Prologue' || e.num === 'Epilogue' ? e.num.slice(0, 3) : e.num}</span>
                      <span className="leg-title">{e.title}</span>
                      <span className="leg-marks" aria-hidden="true">
                        {e.relics.length > 0 && (
                          <span className="leg-relic num" title={`${relicsHere} of ${e.relics.length} finds collected`}>
                            {relicsHere}/{e.relics.length}
                          </span>
                        )}
                        {done && <Stamp size={13} weight="fill" className="leg-stamp" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>

        {/* Where four places share almost the same spot, the atlas says so and
            lets the reader pick, instead of printing dots on top of each other. */}
        {clusterOpen && (
          <div className="cluster-sheet" role="dialog" aria-modal="true" aria-label="Places at this spot">
            <div className="cluster-inner">
              <p className="label label-dark">This one spot holds</p>
              <h3 className="cluster-h">{clusterOpen.length} places in your book</h3>
              <ul className="cluster-list">
                {clusterOpen.map((id) => {
                  const site = SITES.find((s) => s.id === id);
                  const era = ERA_BY_ID[id];
                  return (
                    <li key={id} style={eraVars(id) as CSSProperties}>
                      <button type="button" className="cluster-row" onClick={() => { setClusterOpen(null); look(id); }}>
                        <span className="leg-swatch" aria-hidden="true" />
                        <span>
                          <span className="cluster-name">{site?.label}</span>
                          <span className="cluster-chapter">
                            {era?.num === 'Prologue' || era?.num === 'Epilogue' ? era?.num : `Chapter ${era?.num}`}: {era?.title}
                          </span>
                        </span>
                        <CaretRight size={17} weight="bold" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setClusterOpen(null)}>
                Back to the map
              </button>
            </div>
          </div>
        )}

        {/* The era drawer: opens over the plate, never as a plain card list. */}
        {openEra && (
          <div className="era-drawer" role="dialog" aria-modal="true" aria-label={`${openEra.title}, chapter ${openEra.num}`} style={eraVars(openEra.id) as CSSProperties}>
            <div className="era-drawer-inner">
              {openEra.plate && (
                <figure className="era-plate-fig">
                  <img src={`${import.meta.env.BASE_URL}images/art/eras/${openEra.plate}`} alt={openEra.plateAlt ?? ''} />
                  <span className="era-plate-wash" aria-hidden="true" />
                </figure>
              )}
              <div className="era-drawer-text">
                <p className="label">{openEra.num === 'Prologue' || openEra.num === 'Epilogue' ? openEra.num : `Chapter ${openEra.num}`}</p>
                <h3 className="era-drawer-h">{openEra.title}</h3>
                <p className="era-drawer-sub">{openEra.subtitle}</p>
                <p className="era-drawer-mood">{openEra.mood}</p>

                {openEra.relics.length > 0 && (
                  <>
                    <p className="label era-find-label">Things to find on this page</p>
                    <ul className="relic-list">
                      {openEra.relics.map((r) => {
                        const got = found.includes(r.id);
                        return (
                          <li key={r.id} className={got ? 'is-found' : ''}>
                            <RelicMark found={got} />
                            <span>{r.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}

                <div className="era-drawer-actions">
                  <button type="button" className="btn btn-solid" onClick={() => travel(openEra.id)}>
                    Travel here
                    <CaretRight size={17} weight="bold" aria-hidden="true" />
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setOpen(null)}>Back to the map</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="atlas-foot">
          <CompassIcon size={15} weight="bold" aria-hidden="true" />
          <span>
            Coastline and borders from Natural Earth via world-atlas, drawn with d3-geo. Mountain marks and site
            positions are placed at real longitudes and latitudes. Photographs in this book are real photographs
            from Wikimedia Commons, each with its licence on the page.
          </span>
        </footer>
      </div>
    </div>
  );
}

function CompassRose({ x, y }: { x: number; y: number }) {
  return (
    <g className="rose" transform={`translate(${x} ${y})`} aria-hidden="true">
      <circle r="26" fill="none" stroke="rgba(201,162,39,.6)" strokeWidth="1" />
      <circle r="21" fill="none" stroke="rgba(201,162,39,.3)" strokeWidth=".7" />
      <path d="M0 -24 L5 0 L0 24 L-5 0 Z" fill="rgba(201,162,39,.85)" />
      <path d="M-24 0 L0 -5 L24 0 L0 5 Z" fill="rgba(201,162,39,.42)" />
      <text y="-30" textAnchor="middle" className="rose-n">N</text>
    </g>
  );
}

function ScaleBar({ x, y }: { x: number; y: number }) {
  /* Four degrees of latitude at this projection, labelled honestly rather
     than pretending to be a ruler in kilometres. */
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <line x1="0" y1="0" x2="168" y2="0" stroke="rgba(233,215,166,.7)" strokeWidth="1.2" />
      <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(233,215,166,.7)" strokeWidth="1.2" />
      <line x1="84" y1="-3" x2="84" y2="3" stroke="rgba(233,215,166,.45)" strokeWidth="1" />
      <line x1="168" y1="-5" x2="168" y2="5" stroke="rgba(233,215,166,.7)" strokeWidth="1.2" />
      <text x="0" y="17" className="plate-caption">4 degrees of latitude</text>
    </g>
  );
}

function PlateCaption({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} className="plate-caption">
      {text}
    </text>
  );
}

function RelicMark({ found }: { found: boolean }) {
  return (
    <span className={`relic-mark${found ? ' is-found' : ''}`} aria-hidden="true">
      {found ? <Stamp size={14} weight="fill" /> : <MapPin size={14} weight="bold" />}
    </span>
  );
}

/** The find animation: a stamped ring that pops once when a relic is caught. */
export function RelicBurst({ label }: { label: string }) {
  return (
    <div className="relic-burst" role="status">
      <span className="relic-burst-ring" aria-hidden="true" />
      <span className="relic-burst-text">Found: {label}</span>
    </div>
  );
}
