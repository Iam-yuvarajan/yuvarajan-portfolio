'use client';

import { useState } from 'react';
import { profile } from '@/data/content';

/**
 * Hero portrait. Tapping, hovering or focusing it lights a rotating colour ring.
 * A tap on touch devices latches the ring on, so the effect is reachable without hover.
 */
export default function Portrait() {
  const [lit, setLit] = useState(false);

  return (
    <button
      type="button"
      className={`portrait${lit ? ' is-lit' : ''}`}
      aria-pressed={lit}
      aria-label={`Photo of ${profile.name}. Activate to light the colour ring.`}
      onClick={() => setLit((v) => !v)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setLit(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setLit(false)}
    >
      <span className="portrait__ring" aria-hidden="true" />
      <img className="portrait__img" src="/yuvarajan.jpg" alt="" width={160} height={160} decoding="async" />
    </button>
  );
}
