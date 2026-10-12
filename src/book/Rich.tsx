import { GLOSSARY } from '../content/glossary';
import { emit } from '../lib/bus';
import { splitSentences } from '../content';

/** Renders text with [[term]] markup as tappable glossary buttons. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[\[(.+)\]\]$/.exec(part);
        if (!m) return <span key={i}>{part}</span>;
        const term = m[1];
        if (!GLOSSARY[term]) return <span key={i}>{term}</span>;
        return (
          <button
            key={i}
            type="button"
            className="term"
            onClick={(e) => { e.stopPropagation(); emit('glossary', term); }}
            aria-label={`Define ${term}`}
          >
            {term}
          </button>
        );
      })}
    </>
  );
}

/** A paragraph split into sentences so narration can highlight the one being read. */
export function Sentences({ raw, keyPrefix, highlight, as = 'p', className }: {
  raw: string;
  keyPrefix: string;
  highlight: string | null;
  as?: 'p' | 'h3' | 'h4' | 'div' | 'span';
  className?: string;
}) {
  const sents = splitSentences(raw);
  const Tag = as as 'p';
  return (
    <Tag className={className}>
      {sents.map((s, j) => {
        const key = `${keyPrefix}:${j}`;
        const speaking = highlight === key;
        return (
          <span key={j} data-sentence={key} className={speaking ? 'sentence speaking' : 'sentence'}>
            <Rich text={s} />{' '}
          </span>
        );
      })}
    </Tag>
  );
}
