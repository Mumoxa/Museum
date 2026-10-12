import { lazy, Suspense } from 'react';
import { Compass } from './Compass';
import { Globe } from './Globe';
import { InkMap } from './InkMap';
import { ShipRoute } from './ShipRoute';
import { Castle } from './Castle';
import { Robben } from './Robben';
import { Territory } from './Territory';
import { Democracy } from './Democracy';
import { Votes } from './Votes';
import { Portraits } from './Portraits';
import { Timeline } from './Timeline';
import { MatchPuzzle, OrderPuzzle } from './Puzzles';
import { Journey } from './Journey';

// The certificate is loaded only when it is needed.
const Certificate = lazy(() => import('./Certificate').then((m) => ({ default: m.Certificate })));

export function Interactive({ name, note }: { name: string; note?: string; chapterId: string; pageIndex: number }) {
  let node: JSX.Element | null;
  switch (name) {
    case 'compass': node = <Compass />; break;
    case 'globe': node = <Globe />; break;
    case 'inkmap': node = <InkMap note={note} />; break;
    case 'shiproute': node = <ShipRoute />; break;
    case 'castle': node = <Castle />; break;
    case 'robben': node = <Robben />; break;
    case 'territory': node = <Territory />; break;
    case 'democracy': node = <Democracy />; break;
    case 'votes': node = <Votes />; break;
    case 'portraits': node = <Portraits note={note} />; break;
    case 'timeline': node = <Timeline compact />; break;
    case 'match': node = <MatchPuzzle note={note} />; break;
    case 'order': node = <OrderPuzzle note={note} />; break;
    case 'journey': node = <Journey />; break;
    case 'certificate': node = <Suspense fallback={<p>Loading the certificate…</p>}><Certificate /></Suspense>; break;
    default: node = null;
  }
  return node;
}
