'use client';

import { useState } from 'react';
import { contact, profile, visibleLinks } from '@/data/content';
import { copyText, toast } from '@/lib/client';
import { Rich } from '@/lib/text';
import SectionHead from './SectionHead';

type Field = 'name' | 'email' | 'message';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const [form, setForm] = useState<Record<Field, string>>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [touched, setTouched] = useState(false);

  const validate = (f = form) => {
    const e: Partial<Record<Field, string>> = {};
    if (!f.name.trim()) e.name = 'Tell me your name.';
    if (!EMAIL_RE.test(f.email.trim())) e.email = 'That email does not look right.';
    if (f.message.trim().length < 10) e.message = 'A little more detail, please (10+ characters).';
    return e;
  };

  const set = (k: Field) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...form, [k]: ev.target.value };
    setForm(next);
    if (touched) setErrors(validate(next));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`c-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const subject = `Hello from ${form.name.trim()}`;
    const body = `${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copy = async () => toast((await copyText(profile.email)) ? 'copied' : 'copy failed');

  const field = (k: Field, label: string, type: 'text' | 'email' | 'area', autoComplete: string) => (
    <div className={`field${errors[k] ? ' has-err' : ''}`}>
      <label htmlFor={`c-${k}`} className="mono">
        {label}
        <span aria-hidden="true">*</span>
      </label>
      {type === 'area' ? (
        <textarea
          id={`c-${k}`}
          rows={5}
          value={form[k]}
          onChange={set(k)}
          required
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? `c-${k}-err` : undefined}
        />
      ) : (
        <input
          id={`c-${k}`}
          type={type}
          value={form[k]}
          onChange={set(k)}
          autoComplete={autoComplete}
          required
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? `c-${k}-err` : undefined}
        />
      )}
      {errors[k] && (
        <span id={`c-${k}-err`} className="form-err mono">
          {errors[k]}
        </span>
      )}
    </div>
  );

  return (
    <section id="contact" className="section section--contact" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHead id="contact" heading={contact.heading} sub="" />

        <button type="button" className="big-email" onClick={copy} data-reveal aria-label={`Copy email ${profile.email}`}>
          <span>{profile.email}</span>
          <span className="big-email__hint mono">click to copy</span>
        </button>

        <div className="contact-grid">
          <div data-reveal>
            <dl className="facts">
              {contact.facts.map((f) => (
                <div key={f.k}>
                  <dt className="mono">{f.k}</dt>
                  <dd>
                    <Rich text={f.v} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="contact-links">
              {visibleLinks().map((l) => (
                <a key={l.id} className="btn btn--ghost" href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} ↗
                </a>
              ))}
              <a className="btn btn--ghost" href={`mailto:${profile.email}`}>
                Email ↗
              </a>
              <a className="btn btn--ghost" href={profile.resume.href} target="_blank" rel="noopener noreferrer">
                View resume ↗
              </a>
              <a className="btn btn--primary" href={profile.resume.href} download={profile.resume.file}>
                Download resume ↓
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submit} noValidate data-reveal>
            {field('name', 'Name', 'text', 'name')}
            {field('email', 'Email', 'email', 'email')}
            {field('message', 'Message', 'area', 'off')}
            <div className="contact-form__foot">
              <button type="submit" className="btn btn--primary">
                {contact.submit}
              </button>
              <span className="mono hint">{contact.formHint}</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
