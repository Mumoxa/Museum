import { lazy, Suspense, type ReactNode } from 'react';

/* ============================================================================
   THE DEVICES
   ----------------------------------------------------------------------------
   Every interactive device in the book is loaded only when a page that uses
   it is actually read. They are leaves: nothing about the surrounding page
   depends on them, so nothing about the first paint should pay for them.
   The world map used by the globe, and the atlas data, arrive this way too.
   ========================================================================= */

const Compass = lazy(() => import('./Compass').then((m) => ({ default: m.Compass })));
const Globe = lazy(() => import('./Globe').then((m) => ({ default: m.Globe })));
const InkMap = lazy(() => import('./InkMap').then((m) => ({ default: m.InkMap })));
const ShipRoute = lazy(() => import('./ShipRoute').then((m) => ({ default: m.ShipRoute })));
const Castle = lazy(() => import('./Castle').then((m) => ({ default: m.Castle })));
const Robben = lazy(() => import('./Robben').then((m) => ({ default: m.Robben })));
const Territory = lazy(() => import('./Territory').then((m) => ({ default: m.Territory })));
const Democracy = lazy(() => import('./Democracy').then((m) => ({ default: m.Democracy })));
const Votes = lazy(() => import('./Votes').then((m) => ({ default: m.Votes })));
const Portraits = lazy(() => import('./Portraits').then((m) => ({ default: m.Portraits })));
const Timeline = lazy(() => import('./Timeline').then((m) => ({ default: m.Timeline })));
const MatchPuzzle = lazy(() => import('./Puzzles').then((m) => ({ default: m.MatchPuzzle })));
const OrderPuzzle = lazy(() => import('./Puzzles').then((m) => ({ default: m.OrderPuzzle })));
const Journey = lazy(() => import('./Journey').then((m) => ({ default: m.Journey })));
const Certificate = lazy(() => import('./Certificate').then((m) => ({ default: m.Certificate })));

/** Reserve the space a device will need, so nothing jumps when it arrives. */
function DeviceSkeleton() {
  return (
    <div className="device-skeleton" role="status" aria-live="polite">
      <span className="device-skeleton-label">Opening the instrument</span>
      <span className="device-skeleton-block" />
    </div>
  );
}

export function Interactive({ name, note }: { name: string; note?: string; chapterId: string; pageIndex: number }) {
  let node: ReactNode = null;
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
    case 'certificate': node = <Certificate />; break;
    default: node = null;
  }
  if (!node) return null;
  return <Suspense fallback={<DeviceSkeleton />}>{node}</Suspense>;
}
