import { useMemo, useState } from 'react';
import {
  ArrowRight, BookOpen, BookBookmark, Compass, MapTrifold, Stamp,
  Sparkle, Trophy, Sun, Moon, TextAa, PencilSimple, Check,
  MagnifyingGlass, MapPin, SpeakerHigh, SealCheck, CaretRight,
} from '@phosphor-icons/react';
import { CHAPTERS, CHAPTER_START } from '../content';
import { ERAS } from '../design/era';
import { setProgress, setSettings, useAppState } from '../lib/store';

type Tab = 'overview' | 'chapters' | 'relics' | 'map' | 'passport';
type Destination = 'book' | 'atlas' | 'passport' | 'cover';

const chapters = CHAPTERS.filter((c) => /^\d+$/.test(c.num));
const eraOf = (id: string) => ERAS.find((e) => e.id === id);
const finds = ERAS.filter((e) => /^\d+$/.test(e.num)).flatMap((e) =>
  e.relics.map((relic) => ({ ...relic, chapter: e })),
);
const base = import.meta.env.BASE_URL;
const imageFor = (chapterId: string) =>
  base + 'images/art/eras/' + (eraOf(chapterId)?.plate || 'era-deep-time.jpg');

const navigation = [
  { id: 'overview' as Tab, name: 'Welcome & Quick Start', Icon: Compass },
  { id: 'chapters' as Tab, name: '12 History Chapters', Icon: BookOpen },
  { id: 'relics' as Tab, name: 'Relic Hunter Cabinet', Icon: Sparkle },
  { id: 'map' as Tab, name: 'Historical South Africa Map', Icon: MapTrifold },
  { id: 'passport' as Tab, name: 'Passport & Certificate', Icon: Trophy },
];

export function MuseumHub({ openBook }: {
  openBook: (destination?: Destination, chapterId?: string) => void;
}) {
  const progress = useAppState((s) => s.progress);
  const settings = useAppState((s) => s.settings);
  const [tab, setTab] = useState<Tab>('overview');
  const [nameEditing, setNameEditing] = useState(false);
  const [name, setName] = useState(progress.name || 'Luchelle');
  const [search, setSearch] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>(
    chapters.find((c) => !progress.completed.includes(c.id))?.id || chapters[0].id,
  );
  const [mapChapter, setMapChapter] = useState('ch1');

  const completed = progress.completed.filter((id) => chapters.some((c) => c.id === id));
  const next = chapters.find((c) => !completed.includes(c.id)) || chapters[0];
  const found = finds.filter((r) => progress.relics.includes(r.id));
  const journey = Math.round((completed.length / chapters.length) * 100);
  const allProgress = Math.round(
    (completed.length + found.length) / (chapters.length + finds.length) * 100,
  );
  const active = chapters.find((c) => c.id === selectedChapter) || chapters[0];
  const mapped = chapters.find((c) => c.id === mapChapter) || chapters[0];
  const filtered = useMemo(() => chapters.filter((c) =>
    (c.title + ' ' + c.subtitle + ' ' + c.mood).toLowerCase().includes(search.toLowerCase().trim())
  ), [search]);

  function saveName() {
    const clean = name.trim().slice(0, 32) || 'Explorer';
    setProgress({ name: clean });
    setName(clean);
    setNameEditing(false);
  }
  function selectTab(nextTab: Tab) {
    setTab(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function read(chapterId: string) {
    openBook('book', chapterId);
  }
  const stats = [
    { label: 'Chapters completed', value: completed.length + ' / ' + chapters.length, Icon: BookOpen },
    { label: 'Relics collected', value: found.length + ' / ' + finds.length, Icon: Sparkle },
    { label: 'Pages explored', value: progress.seen.length, Icon: BookBookmark },
    { label: 'Achievements', value: progress.badges.length, Icon: Trophy },
  ];

  return (
    <div className={'hub hub-' + (settings.lamp === 'dim' ? 'night' : settings.lamp === 'cool' ? 'daylight' : 'warm')}>
      <a href="#hub-content" className="hub-skip">Skip to museum activities</a>
      <header className="hub-topbar">
        <div className="hub-shell hub-topbar-inner">
          <button className="hub-brand" type="button" onClick={() => selectTab('overview')} aria-label="Museum home">
            <span className="hub-brand-emblem" aria-hidden="true">✦</span>
            <span className="hub-brand-copy">
              <strong>Luchelle's Museum</strong>
              <span>South African Time Machine</span>
            </span>
          </button>
          <div className="hub-topbar-actions">
            <span className="hub-count"><Stamp size={17} weight="bold" /> {completed.length}/{chapters.length} stamps</span>
            <span className="hub-count"><Sparkle size={17} weight="bold" /> {found.length} relics</span>
            <button className="hub-tool" type="button"
              title={settings.lamp === 'dim' ? 'Switch to warm light' : 'Change reading lamp'}
              onClick={() => setSettings({ lamp: settings.lamp === 'warm' ? 'cool' : settings.lamp === 'cool' ? 'dim' : 'warm' })}>
              {settings.lamp === 'dim' ? <Moon size={18} /> : <Sun size={18} />}
              <span className="hub-tool-label">{settings.lamp === 'cool' ? 'Daylight' : settings.lamp === 'dim' ? 'Night' : 'Warm'}</span>
            </button>
            <button className="hub-tool" type="button" aria-pressed={settings.parentNotes}
              onClick={() => setSettings({ parentNotes: !settings.parentNotes })}>
              <span>Parent guide {settings.parentNotes ? 'on' : 'off'}</span>
            </button>
            <button className="hub-tool hub-text-scale" type="button" title="Toggle large text"
              onClick={() => setSettings({ scale: settings.scale === 'large' ? 'normal' : 'large' })}>
              <TextAa size={19} /> {settings.scale === 'large' ? 'A+' : 'A'}
            </button>
          </div>
        </div>
      </header>

      <div className="hub-shell">
        <section className="hub-hero" aria-labelledby="hub-title">
          <div className="hub-hero-copy">
            <div className="hub-eyebrow"><span>AN INTERACTIVE FAMILY HERITAGE ADVENTURE</span><span>AGES 5–10 & FAMILIES</span></div>
            <h1 id="hub-title">Your adventure through <em>South Africa's history</em> begins here.</h1>
            <p>Meet the people, discover the places, and unlock the stories that shaped our country — one chapter, clue and discovery at a time.</p>
            <div className="hub-hero-actions">
              <button className="hub-button hub-button-primary" type="button" onClick={() => read(next.id)}>
                <BookOpen size={19} /> {progress.seen.length ? 'Continue the adventure' : 'Begin exploring'} <ArrowRight size={18} />
              </button>
              <button className="hub-button hub-button-secondary" type="button" onClick={() => selectTab('chapters')}>
                Explore all chapters
              </button>
            </div>
          </div>
          <div className="hub-hero-art">
            <img src={imageFor('ch2')} alt="Illustrated ancient South African landscape" />
            <span className="hub-hero-medal" aria-hidden="true"><Compass size={29} weight="duotone" /></span>
            <div className="hub-hero-tag">TWELVE CHAPTERS · ONE REMARKABLE STORY</div>
          </div>
        </section>

        <div className="hub-under-hero">
          <div className="hub-explorer">
            <span className="hub-avatar" aria-hidden="true">{(progress.name || 'L')[0].toUpperCase()}</span>
            {nameEditing ? (
              <form className="hub-name-form" onSubmit={(e) => { e.preventDefault(); saveName(); }}>
                <label htmlFor="hub-explorer-name">Explorer's name</label>
                <input id="hub-explorer-name" value={name} maxLength={32}
                  onChange={(e) => setName(e.target.value)} />
                <button type="submit" className="hub-small-button" aria-label="Save explorer name"><Check size={18}/></button>
              </form>
            ) : (
              <button type="button" className="hub-name-btn" onClick={() => { setName(progress.name || 'Luchelle'); setNameEditing(true); }}>
                <span>Explorer <strong>{progress.name || 'Luchelle'}</strong></span><PencilSimple size={15} />
              </button>
            )}
          </div>
          <div className="hub-hero-progress">
            <span>{allProgress}% of your museum adventure collected</span>
            <div className="hub-progress-rail" role="progressbar" aria-label="Museum adventure progress"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={allProgress}>
              <span style={{ width: allProgress + '%' }} />
            </div>
          </div>
        </div>

        <nav aria-label="Museum sections" className="hub-tabs">
          {navigation.map(({ id, name, Icon }) => (
            <button key={id} type="button" className={'hub-tab' + (tab === id ? ' is-active' : '')}
              aria-current={tab === id ? 'page' : undefined} onClick={() => selectTab(id)}>
              <Icon size={19} weight={tab === id ? 'fill' : 'regular'} />
              <span>{name}</span>
            </button>
          ))}
          <button className="hub-tab hub-tab-reader" type="button" onClick={() => openBook('book')}>
            <BookBookmark size={19} /><span>Cozy Story Reader</span><CaretRight size={15} />
          </button>
        </nav>

        <main id="hub-content" className="hub-content">
          {tab === 'overview' && (
            <div className="hub-enter">
              <section className="hub-welcome-card hub-card">
                <div>
                  <span className="hub-kicker">YOUR NEXT CHAPTER · {next.num} OF {chapters.length}</span>
                  <h2>Where shall we travel today?</h2>
                  <p>{next.subtitle}</p>
                  <div className="hub-welcome-actions">
                    <button className="hub-button hub-button-primary" onClick={() => read(next.id)} type="button">
                      Read: {next.title} <ArrowRight size={18}/>
                    </button>
                    <button className="hub-inline-link" type="button" onClick={() => selectTab('chapters')}>Choose another chapter</button>
                  </div>
                </div>
                <img src={imageFor(next.id)} alt={eraOf(next.id)?.plateAlt || next.title} />
              </section>
              <section aria-label="Your adventure so far" className="hub-stat-grid">
                {stats.map(({ label, value, Icon }) => (
                  <article className="hub-stat hub-card" key={label}>
                    <Icon size={26} weight="duotone" />
                    <strong>{value}</strong><span>{label}</span>
                  </article>
                ))}
              </section>
              <div className="hub-two-column">
                <section className="hub-card hub-feature">
                  <div className="hub-section-head">
                    <div><span className="hub-kicker">HISTORY TRAIL</span><h2>Choose your next story</h2></div>
                    <button className="hub-inline-link" type="button" onClick={() => selectTab('chapters')}>View all 12 <ArrowRight size={16}/></button>
                  </div>
                  <div className="hub-chapter-samples">
                    {chapters.slice(0, 4).map((ch) => (
                      <button type="button" key={ch.id} className="hub-sample" onClick={() => read(ch.id)}>
                        <img src={imageFor(ch.id)} alt="" loading="lazy" />
                        <span><small>CHAPTER {ch.num}</small><strong>{ch.title}</strong><span>{ch.mood}</span></span>
                        {completed.includes(ch.id) ? <SealCheck size={21} weight="fill" /> : <CaretRight size={21}/>}
                      </button>
                    ))}
                  </div>
                </section>
                <div className="hub-aside-stack">
                  <section className="hub-card hub-feature hub-map-teaser">
                    <div><span className="hub-kicker">EXPLORE THE ATLAS</span><h2>History happened somewhere.</h2>
                    <p>Find kingdoms, coastlines, battlefields and landmarks across South Africa.</p>
                    <button className="hub-inline-link" type="button" onClick={() => selectTab('map')}>Explore historical map <ArrowRight size={16}/></button></div>
                    <MapTrifold size={67} weight="duotone" aria-hidden="true" />
                  </section>
                  <section className="hub-card hub-feature hub-relic-teaser">
                    <span className="hub-kicker">RELIC HUNTER'S CABINET</span><h2>Every object tells a story.</h2>
                    <p>You have found {found.length} of {finds.length} historical objects hidden inside the book.</p>
                    <button className="hub-inline-link" type="button" onClick={() => selectTab('relics')}>Open the cabinet <ArrowRight size={16}/></button>
                  </section>
                </div>
              </div>
            </div>
          )}

          {tab === 'chapters' && (
            <section className="hub-enter">
              <div className="hub-section-head hub-section-title">
                <div><span className="hub-kicker">THE STORY OF SOUTH AFRICA</span><h2>Twelve chapters. Thousands of years.</h2>
                <p>Choose a story to read. Your bookmarks, quiz answers and discoveries are saved on this device.</p></div>
                <label className="hub-search"><MagnifyingGlass size={19}/><span className="hub-visually-hidden">Search chapters</span>
                  <input type="search" placeholder="Find a chapter..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                </label>
              </div>
              <div className="hub-chapter-grid">
                {filtered.map((ch) => (
                  <article key={ch.id} className={'hub-card hub-chapter-card' + (selectedChapter === ch.id ? ' is-selected' : '')}>
                    <button type="button" className="hub-chapter-card-select" onClick={() => setSelectedChapter(ch.id)} aria-label={'See details: ' + ch.title}>
                      <div className="hub-chapter-photo"><img src={imageFor(ch.id)} alt="" loading="lazy" />
                        <span>CHAPTER {ch.num}</span>{completed.includes(ch.id) && <b><Check size={14}/> Stamped</b>}</div>
                      <div className="hub-chapter-info"><h3>{ch.title}</h3><p>{ch.subtitle}</p><small>{ch.mood}</small></div>
                    </button>
                    <button type="button" className="hub-button hub-button-primary hub-chapter-read" onClick={() => read(ch.id)}>
                      Open chapter <ArrowRight size={16}/>
                    </button>
                  </article>
                ))}
              </div>
              {filtered.length === 0 && <p role="status">No chapter matched your search. Try a different word.</p>}
              <div className="hub-card hub-selected">
                <span className="hub-kicker">CHAPTER SPOTLIGHT</span>
                <h2>{active.title}</h2><p>{active.subtitle}</p>
                <p>{active.mood}</p>
                <button type="button" className="hub-button hub-button-primary" onClick={() => read(active.id)}>Read this full chapter <ArrowRight size={17}/></button>
              </div>
            </section>
          )}

          {tab === 'relics' && (
            <section className="hub-enter">
              <div className="hub-section-title"><span className="hub-kicker">THE RELIC HUNTER'S CABINET</span>
                <h2>Discover the objects that history left behind.</h2>
                <p>Find a hidden relic in the storybook to add it to your collection. Objects you haven't found yet are shown as mysteries.</p>
              </div>
              <div className="hub-relic-grid">
                {finds.map((r) => {
                  const discovered = progress.relics.includes(r.id);
                  return <article key={r.id} className={'hub-card hub-relic-card' + (discovered ? ' is-found' : '')}>
                    <div className="hub-relic-mark"><Sparkle size={31} weight="duotone"/></div>
                    <span className="hub-kicker">{discovered ? 'RELIC DISCOVERED' : 'HIDDEN TREASURE'}</span>
                    <h3>{discovered ? r.name : 'A mystery from Chapter ' + r.chapter.num}</h3>
                    <p>{discovered ? r.note : 'Read the chapter and look closely at the illustrated scene to reveal this treasure.'}</p>
                    <button className="hub-inline-link" type="button" onClick={() => read(r.chapter.id)}>
                      {discovered ? 'Revisit the story' : 'Look for this relic'} <ArrowRight size={16}/>
                    </button>
                  </article>;
                })}
              </div>
            </section>
          )}

          {tab === 'map' && (
            <section className="hub-enter">
              <div className="hub-section-title"><span className="hub-kicker">THE HISTORICAL ATLAS</span>
                <h2>Travel across time and place.</h2>
                <p>Choose an era to discover where its stories unfolded, or open the interactive atlas to explore its locations and historical routes.</p>
              </div>
              <div className="hub-map-layout">
                <div className="hub-card hub-map-illustration">
                  <img src={imageFor(mapChapter)} alt={eraOf(mapChapter)?.plateAlt || 'A historical landscape of South Africa'} />
                  <div className="hub-map-veil"><MapPin size={22}/><span>{mapped.title}</span></div>
                </div>
                <div className="hub-card hub-map-sidebar">
                  <span className="hub-kicker">EXPEDITION NOTES</span>
                  <h3>{mapped.title}</h3><p>{mapped.subtitle}</p>
                  <div className="hub-map-choices">
                    {chapters.map((ch) => <button type="button" key={ch.id} className={mapChapter === ch.id ? 'is-active' : ''}
                      onClick={() => setMapChapter(ch.id)}>{ch.num}. {ch.title}</button>)}
                  </div>
                  <div className="hub-map-buttons">
                    <button type="button" className="hub-button hub-button-primary" onClick={() => openBook('atlas', mapped.id)}>
                      Open interactive atlas <ArrowRight size={17}/>
                    </button>
                    <button type="button" className="hub-inline-link" onClick={() => read(mapped.id)}>Read the chapter</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {tab === 'passport' && (
            <section className="hub-enter">
              <div className="hub-section-title"><span className="hub-kicker">YOUR EXPLORER PASSPORT</span>
                <h2>{progress.name || 'Luchelle'}'s discoveries</h2>
                <p>Each completed chapter earns a stamp. Keep reading to collect relics and badges, then make a certificate of your journey.</p>
              </div>
              <div className="hub-passport-head hub-card">
                <div className="hub-passport-symbol"><Stamp size={57} weight="duotone"/></div>
                <div><span className="hub-kicker">SOUTH AFRICAN TIME MACHINE</span>
                  <h3>Junior Heritage Explorer</h3><p>{progress.name || 'Luchelle'}</p>
                  <strong>{journey}% of chapters completed</strong>
                  <div className="hub-progress-rail"><span style={{ width: journey + '%' }}/></div>
                </div>
                <button type="button" className="hub-button hub-button-primary" onClick={() => openBook('passport')}>
                  View passport & certificate <ArrowRight size={16}/>
                </button>
              </div>
              <div className="hub-stamp-grid">
                {chapters.map((ch) => <button type="button" key={ch.id} className={'hub-stamp hub-card' + (completed.includes(ch.id) ? ' is-earned' : '')}
                  onClick={() => read(ch.id)}>
                  <Stamp size={34} weight={completed.includes(ch.id) ? 'fill' : 'regular'} />
                  <strong>Chapter {ch.num}</strong><span>{ch.title}</span>
                  <small>{completed.includes(ch.id) ? 'STAMP EARNED' : 'YET TO DISCOVER'}</small>
                </button>)}
              </div>
            </section>
          )}
        </main>
      </div>
      <footer className="hub-footer">
        <div className="hub-shell">
          <span>Luchelle's Museum · Discover South Africa together</span>
          <span>Research, sources and credits remain available in the full storybook.</span>
          <button type="button" onClick={() => openBook('cover')}>Open original book cover <BookOpen size={16}/></button>
        </div>
      </footer>
    </div>
  );
}