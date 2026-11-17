import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { contactInfo, person, socials } from '@/data/portfolio';
import { CursorGlow, Header, ParticleField, QuickNav, SocialRail } from '@/components/site/Chrome';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-six-blue-80.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${person.name} | AI Engineer, Builder`, template: `%s | ${person.name}` },
  description: person.description,
  applicationName: `${person.name} Portfolio`,
  authors: [{ name: person.name, url: siteUrl }],
  creator: person.name,
  keywords: ['Yuvarajan J', 'ECE', 'developer', 'AI', 'Python', 'portfolio', 'Hosur'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: `${person.name} Portfolio`,
    title: `${person.name} | AI Engineer, Builder`,
    description: person.description,
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: `${person.name} | AI Engineer, Builder`, description: person.description },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  url: siteUrl,
  jobTitle: person.role,
  email: `mailto:${contactInfo.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hosur',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  sameAs: [socials.github, socials.linkedin, socials.leetcode, socials.instagram],
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: `${person.name} Portfolio`,
  url: siteUrl,
  inLanguage: 'en-IN',
  publisher: { '@type': 'Person', name: person.name },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- global stylesheet in the root layout */}
        <link
          href="https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;600;700&family=Pacifico&family=Source+Sans+Pro:wght@400;600;700&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <ParticleField />
        <Header />
        <SocialRail />
        <QuickNav />
        <CursorGlow />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
