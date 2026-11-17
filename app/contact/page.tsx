import type { Metadata } from 'next';
import { contactInfo, socials } from '@/data/portfolio';
import PageShell from '@/components/site/PageShell';
import { CopyEmail, Reveal } from '@/components/site/Chrome';
import { GithubIcon, LinkedinIcon, LinkIcon } from '@/components/ref/Icons';
import ContactForm from '@/components/site/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Yuvarajan J',
  description: 'Get in touch with Yuvarajan J for internships, projects and opportunities.',
};

export default function ContactPage() {
  return (
    <PageShell index="05" ghost="HELLO" title="Contact">
      <h1 className="page-title">Let&apos;s build something great.</h1>
      <p className="page-intro">Open to internships, projects and opportunities where I can learn and contribute. The quickest way to reach me is email — or leave a note below.</p>

      <Reveal className="contact-hero">
        <CopyEmail />
        <dl className="contact-info">
          <div>
            <dt className="eyebrow">Based in</dt>
            <dd>{contactInfo.based}</dd>
          </div>
          <div>
            <dt className="eyebrow">Open to</dt>
            <dd>{contactInfo.openTo}</dd>
          </div>
          <div>
            <dt className="eyebrow">Phone</dt>
            <dd>
              <a href={`tel:${contactInfo.phone}`}>{contactInfo.phoneDisplay}</a>
              {' · '}
              <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp <LinkIcon size={13} /></a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Replies</dt>
            <dd>{contactInfo.replies}</dd>
          </div>
        </dl>
        <div className="pill-row">
          <a className="pill" href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(contactInfo.emailSubject)}`}>Email <LinkIcon size={14} /></a>
          <a className="pill" href={contactInfo.resume} download={contactInfo.resumeFile}>Resume ↓</a>
          <a className="pill" href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon size={17} /></a>
          <a className="pill" href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon size={17} /></a>
        </div>
      </Reveal>

      <Reveal className="contact-form-wrap">
        <h2 className="section-title">Send a message</h2>
        <ContactForm />
      </Reveal>
    </PageShell>
  );
}
