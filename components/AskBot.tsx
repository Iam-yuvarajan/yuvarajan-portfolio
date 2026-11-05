'use client';

import { useEffect, useRef, useState } from 'react';
import { askBot } from '@/data/content';
import { prefersReducedMotion } from '@/lib/client';
import { Rich } from '@/lib/text';

/** Small pause so the answer feels like a reply rather than an instant form result. */
const THINK_MS = 380;

export default function AskBot() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const timer = useRef(0);
  const active = askBot.questions.find((q) => q.id === activeId) ?? null;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = (id: string) => {
    window.clearTimeout(timer.current);
    if (id === activeId && !thinking) return;
    setActiveId(id);
    if (prefersReducedMotion()) {
      setThinking(false);
      return;
    }
    setThinking(true);
    timer.current = window.setTimeout(() => setThinking(false), THINK_MS);
  };

  const clear = () => {
    window.clearTimeout(timer.current);
    setActiveId(null);
    setThinking(false);
  };

  return (
    <div className="askbot" data-reveal>
      <div className="askbot__head mono">
        <span className="askbot__id">
          <span className="dot" aria-hidden="true" />
          {askBot.kicker} · online
        </span>
        <span className="askbot__mode">{askBot.status}</span>
      </div>

      <p className="askbot__sub">{askBot.sub}</p>

      <div className="askbot__qs" role="group" aria-label="Pick a question">
        {askBot.questions.map((q) => (
          <button
            key={q.id}
            type="button"
            className="askbot__q"
            aria-pressed={activeId === q.id}
            aria-controls="askbot-thread"
            onClick={() => pick(q.id)}
          >
            {q.q}
          </button>
        ))}
      </div>

      <div id="askbot-thread" className="askbot__thread" aria-live="polite" aria-atomic="true">
        {!active && <p className="askbot__empty mono">{askBot.empty}</p>}
        {active && (
          <div className="askbot__exchange">
            <p className="askbot__echo mono">
              <span aria-hidden="true">&gt;</span> {active.q}
            </p>
            <div className="askbot__reply">
              <span className="askbot__avatar mono" aria-hidden="true">
                YJ
              </span>
              <div className="askbot__bubble">
                <span className="askbot__who mono">{askBot.kicker}</span>
                {thinking ? (
                  <>
                    <span className="askbot__typing" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="sr-only">Thinking…</span>
                  </>
                ) : (
                  <p className="askbot__a">
                    <Rich text={active.a} />
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {active && (
        <button
          type="button"
          className="askbot__clear mono"
          onClick={clear}
          aria-label="Clear the current answer"
        >
          {askBot.clear}
        </button>
      )}
    </div>
  );
}
