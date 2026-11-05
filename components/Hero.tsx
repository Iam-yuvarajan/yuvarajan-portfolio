import { hero, profile } from '@/data/content';
import { Rich, isPlaceholder } from '@/lib/text';
import AccessPass from './AccessPass';
import Clock from './Clock';

export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-name" tabIndex={-1}>
      <div className="wrap hero__grid">
        <div className="hero__text">
          <div className="hero__meta mono" data-reveal>
            <span>{hero.metaLeft}</span>
            <span>
              <Rich text={profile.baseLocation} /> · <Clock />
            </span>
            <span className="pill">
              <span className="dot" aria-hidden="true" />
              {profile.availability}
            </span>
          </div>

          <h1 id="hero-name" className="hero__name" data-reveal>
            <span>{profile.firstName}</span>
            <span>
              <em className="em">{profile.lastName}.</em>
            </span>
          </h1>

          <p className="hero__role mono" data-reveal>
            {profile.role}
          </p>
          <p className="hero__intro" data-reveal>
            <Rich text={hero.intro} />
          </p>

          <div className="hero__ctas" data-reveal>
            <a className="btn btn--primary" href="#work">
              {hero.ctaPrimary}
            </a>
            <a className="btn btn--ghost" href={profile.resume.href} download={profile.resume.file}>
              {hero.ctaResume} ↓
            </a>
            <a className="link-underline mono" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>

          <dl className="hero__stats" data-reveal>
            {hero.stats.map((s) => (
              <div key={s.label} className="stat">
                <dt className="mono">
                  <Rich text={s.label} />
                </dt>
                <dd className="stat__value">
                  {isPlaceholder(s.value) ? <Rich text={s.value} /> : <span data-count={s.value}>{s.value}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <AccessPass />
      </div>

      <div className="marquee" aria-label={`${hero.marqueeLead}: ${hero.marquee.join(', ')}`}>
        <div className="marquee__track" aria-hidden="true">
          {[0, 1].map((n) => (
            <div className="marquee__group" key={n}>
              <span className="marquee__lead mono">{hero.marqueeLead}</span>
              {hero.marquee.map((m) => (
                <span key={m} className="marquee__item">
                  {m}
                  <span className="marquee__sep">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
