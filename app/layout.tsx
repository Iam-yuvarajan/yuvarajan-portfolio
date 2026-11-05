import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter, JetBrains_Mono } from 'next/font/google';
import { education, profile, site, visibleLinks } from '@/data/content';
import { DEFAULT_WORLD, initialWorldScript, themeColors, worldsCss } from '@/data/worlds';
import './globals.css';

// Provisional font choices, see MISSING.md.
const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.title}` },
  description: site.description,
  applicationName: site.title,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  keywords: site.keywords,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: site.title,
    title: site.title,
    description: site.description,
    locale: 'en_IN',
    firstName: profile.firstName,
    lastName: profile.lastName,
  },
  twitter: { card: 'summary', title: site.title, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export const viewport: Viewport = {
  themeColor: themeColors[DEFAULT_WORLD], // updated per world at runtime (lib/world.ts)
  width: 'device-width',
  initialScale: 1,
};

/** Structured data so search engines know the site is about this person. */
const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: site.url,
  jobTitle: 'AI & Web Application Developer',
  email: `mailto:${profile.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Hosur', addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: education.college.name },
  sameAs: visibleLinks().map((l) => l.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* World palettes, generated from data/worlds.ts. */}
        <style id="worlds" dangerouslySetInnerHTML={{ __html: worldsCss() }} />
        {/* Pick the world from the URL hash before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: initialWorldScript }} />
        {/* Hide content under paper until the boot loader mounts (first visit per session only). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(location.pathname==='/'&&sessionStorage.getItem('yj:booted')!=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('boot-pending');setTimeout(function(){document.documentElement.classList.remove('boot-pending')},3000)}}catch(e){}",
          }}
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        {children}
      </body>
    </html>
  );
}
