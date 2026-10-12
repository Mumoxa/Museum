import type { QuizQ } from '../content/types';
import { useAppState, setProgress, getState } from '../lib/store';
import { award } from '../lib/achievements';
import { chime } from '../lib/sfx';
import { CHAPTERS } from '../content';

const EMPTY_ANSWERS: Record<number, number> = {};

export function Quiz({ chapterId, questions }: { chapterId: string; questions: QuizQ[] }) {
  const answers = useAppState((s) => s.progress.quiz[chapterId] ?? EMPTY_ANSWERS);
  const sound = useAppState((s) => s.settings.sound);
  const volume = useAppState((s) => s.settings.soundVolume);
  const answered = Object.keys(answers).length;
  const correct = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0);
  const allDone = answered === questions.length;

  function choose(qi: number, oi: number) {
    const s = getState();
    const current = s.progress.quiz[chapterId] ?? {};
    const next = { ...current, [qi]: oi };
    setProgress((p) => ({ quiz: { ...p.quiz, [chapterId]: next } }));
    award('quiz-first');
    const isRight = questions[qi].answer === oi;
    if (sound) chime(volume, isRight);
    const nowAnswered = Object.keys(next).length;
    if (nowAnswered === questions.length) {
      const score = questions.reduce((n, q, i) => n + (next[i] === q.answer ? 1 : 0), 0);
      setProgress((p) => ({ completed: p.completed.includes(chapterId) ? p.completed : [...p.completed, chapterId] }));
      award(`done-${chapterId}`);
      if (score === questions.length) award('perfect-quiz');
      const done = getState().progress.completed.length;
      if (done >= CHAPTERS.length) award('all-chapters');
    }
  }

  return (
    <section className="quiz" aria-labelledby={`quiz-${chapterId}`}>
      <h3 id={`quiz-${chapterId}`} className="quiz-title">Quick check</h3>
      <p className="quiz-intro">Tap an answer. You can change your mind. The explanation appears after each choice.</p>
      <ol className="quiz-list">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const has = chosen !== undefined;
          const right = has && chosen === q.answer;
          return (
            <li key={qi} className="quiz-item">
              <p className="quiz-q"><strong>{qi + 1}.</strong> {q.q}</p>
              <div className="quiz-options" role="group" aria-label={`Answers for question ${qi + 1}`}>
                {q.options.map((opt, oi) => {
                  const pressed = chosen === oi;
                  return (
                    <button
                      key={oi}
                      type="button"
                      className={`quiz-opt ${pressed ? (right ? 'is-right' : 'is-wrong') : ''}`}
                      aria-pressed={pressed}
                      onClick={() => choose(qi, oi)}
                    >
                      <span className="quiz-letter" aria-hidden="true">{String.fromCharCode(65 + oi)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {has && (
                <p className={`quiz-feedback ${right ? 'ok' : 'nope'}`} role="status">
                  <strong>{right ? 'Correct.' : `Not quite. The answer is ${String.fromCharCode(65 + q.answer)}.`}</strong> {q.explain}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      {allDone && (
        <p className="quiz-score" role="status">
          You got <strong>{correct}</strong> out of {questions.length} right. This chapter is now marked complete in your passport.
        </p>
      )}
    </section>
  );
}
