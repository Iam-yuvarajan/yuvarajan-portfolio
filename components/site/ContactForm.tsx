'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { contactInfo } from '@/data/portfolio';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const subject = String(form.get('subject') || '').trim();
    const message = String(form.get('message') || '').trim();

    const body = [`From: ${name} <${email}>`, '', message].join('\n');
    const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject || 'Portfolio message')}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  };

  return (
    <form className="contact-form panel" onSubmit={submit}>
      <div className="contact-form__row">
        <label>
          <span className="eyebrow">Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label>
          <span className="eyebrow">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </label>
      </div>
      <label>
        <span className="eyebrow">Subject</span>
        <input name="subject" required placeholder="What is this about?" />
      </label>
      <label>
        <span className="eyebrow">Message</span>
        <textarea name="message" required rows={5} placeholder="A few lines about your idea or opportunity…" />
      </label>
      <div className="contact-form__foot">
        <button type="submit" className="pill pill--submit">Send message <span aria-hidden="true">↗</span></button>
        <p className="eyebrow" role="status">{sent ? 'Your email app should open now.' : 'Opens your email app with the message prefilled.'}</p>
      </div>
    </form>
  );
}
