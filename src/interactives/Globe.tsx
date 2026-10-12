import { useEffect, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { world110 } from './geo';
import { useAppState, prefersReducedMotion } from '../lib/store';

// A slowly turning globe on canvas. It pauses when the page is hidden or motion is reduced.
export function Globe() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const motion = useAppState((s) => s.settings.motion);
  const reduced = prefersReducedMotion(motion);
  const [spin, setSpin] = useState(!reduced);

  useEffect(() => { setSpin(!reduced); }, [reduced]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = 360;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    const proj = geoOrthographic().scale(size / 2 - 8).translate([size / 2, size / 2]).clipAngle(90);
    const path = geoPath(proj, ctx);
    const graticule = geoGraticule10();
    let rot = 20;
    let raf = 0;
    const draw = () => {
      proj.rotate([rot, -20, 0]);
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      path({ type: 'Sphere' } as never);
      ctx.fillStyle = '#1b2f4f';
      ctx.fill();
      ctx.beginPath();
      path(graticule as never);
      ctx.strokeStyle = 'rgba(201,168,90,0.35)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.beginPath();
      world110.features.forEach((f) => path(f as never));
      ctx.fillStyle = '#c9a85a';
      ctx.fill();
      ctx.strokeStyle = '#f4ecd8';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.beginPath();
      path({ type: 'Sphere' } as never);
      ctx.strokeStyle = 'rgba(244,236,216,0.8)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      if (spin) {
        rot += 0.25;
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [spin]);

  return (
    <figure className="globe" role="img" aria-label="A slowly turning globe showing the continents, with Africa in view. Decorative.">
      <canvas ref={ref} aria-hidden="true" />
      <figcaption className="globe-cap">
        <button type="button" className="ghost small" aria-pressed={spin} onClick={() => setSpin((s) => !s)} disabled={reduced}>
          {spin ? 'Pause the globe' : 'Turn the globe'}
        </button>
        {reduced && <span className="muted"> The globe is still because reduced motion is on.</span>}
      </figcaption>
    </figure>
  );
}
