import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppState, setProgress } from '../lib/store';
import { CHAPTERS } from '../content';

// The certificate is drawn on a canvas, so it can be downloaded as a PNG or printed.
// Nothing is uploaded: the name and progress stay on this device.
export function Certificate() {
  const name = useAppState((s) => s.progress.name);
  const completed = useAppState((s) => s.progress.completed);
  const badges = useAppState((s) => s.progress.badges);
  const [draft, setDraft] = useState(name);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [url, setUrl] = useState<string>('');
  const date = useMemo(() => new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }), []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = 1200, H = 850;
    c.width = W; c.height = H;
    ctx.fillStyle = '#f7f0dc';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#8a6a2b';
    ctx.lineWidth = 10;
    ctx.strokeRect(36, 36, W - 72, H - 72);
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, W - 120, H - 120);
    ctx.fillStyle = '#14213d';
    ctx.textAlign = 'center';
    ctx.font = '600 60px Georgia, serif';
    ctx.fillText("Luchelle’s South African Time Machine", W / 2, 165);
    ctx.font = 'italic 30px Georgia, serif';
    ctx.fillStyle = '#5a4a2a';
    ctx.fillText('Certificate of Time Travel', W / 2, 215);
    ctx.font = '26px Georgia, serif';
    ctx.fillStyle = '#2a2420';
    ctx.fillText('This certifies that', W / 2, 300);
    ctx.font = '700 84px Georgia, serif';
    ctx.fillStyle = '#14213d';
    ctx.fillText(name || 'Luchelle', W / 2, 395);
    ctx.font = '26px Georgia, serif';
    ctx.fillStyle = '#2a2420';
    const lines = [
      'has journeyed from the first painters of Blombos Cave to the South Africa of today,',
      'and has learned to ask: who was here, who wrote it down, and what is still open?',
    ];
    lines.forEach((l, i) => ctx.fillText(l, W / 2, 462 + i * 40));
    ctx.font = '24px Georgia, serif';
    ctx.fillText(`Chapters completed: ${completed.length} of ${CHAPTERS.length}   ·   Badges earned: ${badges.length}`, W / 2, 582);
    ctx.font = 'italic 22px Georgia, serif';
    ctx.fillStyle = '#5a4a2a';
    ctx.fillText(`Issued ${date}`, W / 2, 650);
    ctx.font = '20px Georgia, serif';
    ctx.fillText('A learning record for home use. It is not an official qualification.', W / 2, 700);
    ctx.fillStyle = '#8a6a2b';
    ctx.beginPath();
    ctx.arc(W / 2, 760, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f7f0dc';
    ctx.font = '700 26px Georgia, serif';
    ctx.fillText('★', W / 2, 770);
    setUrl(c.toDataURL('image/png'));
  }, [name, completed, badges, date]);

  return (
    <div className="certificate">
      <form className="cert-form" onSubmit={(e) => { e.preventDefault(); setProgress({ name: draft.trim().slice(0, 40) || 'Luchelle' }); }}>
        <label htmlFor="cert-name">Name on the certificate</label>
        <div className="cert-row">
          <input id="cert-name" value={draft} maxLength={40} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" className="btn small">Update name</button>
        </div>
      </form>
      <div className="cert-preview">
        <canvas ref={canvasRef} className="cert-canvas" role="img" aria-label={`Certificate for ${name || 'Luchelle'}, issued ${date}`} />
      </div>
      <div className="cert-actions">
        <a className="btn small" href={url} download="luchelles-time-machine-certificate.png" aria-disabled={!url}>Save as image (PNG)</a>
        <button type="button" className="ghost small" onClick={() => window.print()}>Print</button>
      </div>
      <p className="caption-small">The certificate is made in your browser. Your name is saved only on this device.</p>
    </div>
  );
}
