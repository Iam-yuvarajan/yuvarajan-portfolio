'use client';

import { useEffect, useState } from 'react';

export default function Toaster() {
  const [msg, setMsg] = useState<{ text: string; id: number } | null>(null);
  useEffect(() => {
    let t = 0;
    const on = (e: Event) => {
      setMsg({ text: (e as CustomEvent<string>).detail, id: Date.now() });
      window.clearTimeout(t);
      t = window.setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener('app:toast', on);
    return () => window.removeEventListener('app:toast', on);
  }, []);
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {msg && (
        <div key={msg.id} className="toast mono">
          {msg.text}
        </div>
      )}
    </div>
  );
}
