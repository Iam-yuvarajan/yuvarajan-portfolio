'use client';

import { useState } from 'react';

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be blocked; the mailto link beside this still works.
    }
  };

  return (
    <button type="button" className="copy-email" onClick={copy} aria-label={`Copy ${email}`}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
