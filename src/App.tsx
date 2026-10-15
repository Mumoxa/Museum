import { useEffect, useState } from 'react';
import { CHAPTER_START } from './content';
import { setProgress } from './lib/store';
import { MuseumHub } from './chrome/MuseumHub';
import { LegacyApp } from './LegacyApp';

type Destination = 'book' | 'atlas' | 'passport' | 'cover';
type View = 'hub' | Destination;

function viewFromUrl(): View {
  const query = new URLSearchParams(window.location.search).get('view');
  return query === 'book' || query === 'atlas' || query === 'passport' || query === 'cover'
    ? query
    : 'hub';
}

/**
 * The family dashboard is the default front door. The thoroughly researched
 * 116-page storybook is retained and continues to own narration, puzzles,
 * historical sources, atlas, bookmarks and earned progress.
 */
export function App() {
  const [view, setView] = useState<View>(viewFromUrl);

  useEffect(() => {
    const onHistory = () => setView(viewFromUrl());
    window.addEventListener('popstate', onHistory);
    return () => window.removeEventListener('popstate', onHistory);
  }, []);

  function openBook(destination: Destination = 'book', chapterId?: string) {
    if (chapterId && Object.prototype.hasOwnProperty.call(CHAPTER_START, chapterId)) {
      setProgress({ page: CHAPTER_START[chapterId] });
    }
    window.history.pushState({ museumView: destination }, '', window.location.pathname + '?view=' + destination);
    setView(destination);
    window.scrollTo(0, 0);
  }

  function returnToHub() {
    window.history.pushState({ museumView: 'hub' }, '', window.location.pathname);
    setView('hub');
    document.title = "Luchelle's Museum — A Journey Through South African History";
    window.scrollTo(0, 0);
  }

  return view === 'hub'
    ? <MuseumHub openBook={openBook} />
    : <>
        <button className="hub-return" type="button" onClick={returnToHub}>
          ← Museum home
        </button>
        <LegacyApp key={view} />
      </>;
}