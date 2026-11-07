/**
 * Single source of truth for every piece of personal text on the site.
 *
 * Conventions
 * - `{{PLACEHOLDER}}` marks a value that has not been supplied yet. The UI renders
 *   these as visibly-marked dummy text. Every one is listed in MISSING.md.
 * - `*word*` inside headings/paragraphs renders as italic, accent-coloured emphasis.
 * - Never add repository, demo or source URLs for the projects. See `projects` below.
 */

/* ------------------------------------------------------------------ types */

import type { WorldId } from './worlds';

export type { WorldId };
export type Tier = 'daily' | 'production' | 'shipped';

export interface Skill {
  name: string;
  category: string;
  tier: Tier;
  note: string;
}

export interface Metric {
  value: string;
  label: string;
  source: string;
}

export interface Stage {
  id: string;
  /** Bar label on the timeline, e.g. "School · SDA Hr Sec School". */
  label: string;
  title: string;
  org: string;
  location: string;
  /** Human-readable date range shown in the detail panel. */
  range: string;
  /**
   * Years used to place the bar. `ongoing: true` draws the bar to the end of the axis
   * ("present"). `from === to` renders a single-year marker. Omit when dates are unknown:
   * the row is listed without a bar.
   */
  chart?: { from: number; to: number; ongoing?: boolean };
  bullets: string[];
  highlight: string;
  stack: string[];
}

export interface Language {
  name: string;
  level: string;
  note: string;
}

export interface ProjectLink {
  kind: 'live' | 'source';
  label: string;
  href: string;
}

export interface Project {
  title: string;
  desc: string;
  tech: string[];
  domain: string;
  outcome: string;
  /** Public links. A project without links is shown as private. */
  links: ProjectLink[];
}

/* ---------------------------------------------------------------- profile */

const GITHUB_USERNAME = 'Iam-yuvarajan';

export const profile = {
  name: 'Yuvarajan J',
  firstName: 'Yuvarajan',
  lastName: 'J',
  initials: 'YJ',
  /**
   * Name pronunciation shown beside the hero name.
   * `display` is the written hint; `speak` is what the browser voice reads out.
   * Drop a recording at `public/name.mp3` to use your own voice instead — the
   * button prefers the file and only falls back to the browser voice if it is missing.
   */
  pronunciation: { display: 'yu-va-raj-an', speak: 'yoo vah raj an' },
  role: 'AI Engineer · ECE Student',
  shortRole: 'AI Engineer',
  availability: 'Open to AI roles · internships',
  passStatus: 'open to work',
  timezone: 'IST (Asia/Kolkata)',
  timezoneShort: 'IST',
  tzName: 'Asia/Kolkata',
  email: 'yuvarajan278@gmail.com',
  baseLocation: 'Hosur, Tamil Nadu', // from Yuvarajan_Resume.pdf
  /** Display hostname for the loader and shell. Never used in URLs. */
  host: 'jyuvarajan',
  replyTime: 'Within 24 hours',
  resume: { href: '/Yuvarajan-J-Resume.pdf', file: 'Yuvarajan-J-Resume.pdf' },
  serial: 'YJ-2026-0001',
  revision: 'Rev. 2026.11',
  links: {
    leetcode: 'https://leetcode.com/u/yuvarajan_software/',
    huggingface: 'https://huggingface.co/yuvarajan-pixel',
    linkedin: '', // not provided yet; the button, palette action and shell line appear once this is filled
    github: `https://github.com/${GITHUB_USERNAME}`, // shown only if showGithub is true
  },
  showGithub: true,
};

export const site = {
  /** Canonical public address, used for search engines (canonical URL, sitemap, Open Graph). */
  url: 'https://jyuvarajan.vercel.app',
  /** Google/search title. Also the source of the Person entity name. */
  title: 'J Yuvarajan | AI Engineer',
  /** Search identity, using the same name order as the Google title. */
  personName: 'J Yuvarajan',
  firstName: 'J',
  lastName: 'Yuvarajan',
  description:
    'J Yuvarajan: AI engineer and ECE student from Hosur, Tamil Nadu. Builds AI tools and web apps with Python, JavaScript and LLMs. SIH 2026 top 40 finalist. Open to AI engineer roles and internships.',
  keywords: ['J Yuvarajan', 'Yuvarajan J', 'Yuvarajan', 'AI engineer', 'AI developer', 'web application developer', 'ECE', 'Python', 'Hosur', 'Bengaluru', 'portfolio'],
  copyright: '© 2026 J Yuvarajan',
  builtWith: 'Designed & built by hand. Next.js, GSAP, plain CSS.',
};

export const legal = {
  updated: 'November 2026',
  disclaimer: 'This is a general notice for a personal website, not legal advice.',
  privacy: [
    {
      h: 'The short version',
      p: 'This is a personal portfolio. There is no analytics, no tracking, no advertising and no cookies set by this site.',
    },
    {
      h: 'Contact form',
      p: 'The contact form does not send or store anything. Pressing the button only opens your own mail app with the message pre-filled. Nothing is saved on this site.',
    },
    {
      h: 'Hosting logs',
      p: 'The site is hosted on Vercel. Like any web host, Vercel may keep short-lived technical logs (for example IP address, browser and requested page) to run and protect the service. I do not use these logs to track visitors.',
    },
    {
      h: 'Questions',
      p: 'Email ' + profile.email + ' with any privacy question or removal request.',
    },
  ],
  terms: [
    {
      h: 'What this site is',
      p: 'A personal portfolio of ' + profile.name + '. It is provided for information only.',
    },
    {
      h: 'Content',
      p: 'The text, design and project descriptions on this site are mine unless stated otherwise. Please ask before reusing them.',
    },
    {
      h: 'No warranty',
      p: 'Everything here is provided "as is", without any warranty. I am not liable for any loss arising from using the site.',
    },
  ],
};

/* ----------------------------------------------------------------- worlds */

// Worlds, palettes and the section registry live in ./worlds.ts (single source of truth).
export { worlds, sections, allSections } from './worlds';

/* ------------------------------------------------------------------- hero */

export const hero = {
  metaLeft: `Portfolio · ${profile.revision}`,
  intro:
    'I’m J Yuvarajan. I build AI-powered tools and web applications. Python at the core, HTML on the surface, and a *vibe-coding* workflow that turns ideas into working products fast.',
  ctaPrimary: 'See the work ↓',
  ctaResume: 'Download resume',
  stats: [
    { value: '4', label: 'main projects' },
    { value: '6.68', label: 'CGPA' },
    { value: '1', label: 'hackathon · SIH 2026' },
  ],
  passCaption: 'grab me, it swings ↘',
  passFlipHint: 'flip the pass',
  passBackHint: 'tap the card to flip back',
  marqueeLead: 'Built with',
  marquee: ['Python', 'Java', 'HTML', 'AI', 'Web apps', 'Vibe coding'],
};

/* --------------------------------------------------------------- projects */

/** Only add links you want public: the API serialises this list as-is. No links = shown as private. */
export const projects: Project[] = [
  {
    title: 'YUVA AI',
    desc: 'A password-protected AI companion that greets you and talks like a friend, a brother or another close relationship of your choice.',
    tech: ['JavaScript', 'Node.js', 'Express', 'Groq'],
    domain: 'Conversational AI',
    outcome: 'Live voice companion with 3 relationship modes and persistent memory',
    links: [{ kind: 'live', label: 'Live demo', href: 'https://yuva-ai.onrender.com/' }],
  },
  {
    title: 'Sollunga Bot',
    desc: 'An AI agent that takes shop orders over Telegram or WhatsApp in Tanglish or English, and also from voice messages. The shopkeeper gets a message and approves or rejects each order.',
    tech: ['Python', 'Telegram', 'WhatsApp', 'voice input'],
    domain: 'Retail automation',
    outcome: 'Multilingual text + voice orders with owner approval',
    links: [{ kind: 'source', label: 'Source on GitHub', href: 'https://github.com/Iam-yuvarajan/solluga-ai' }],
  },
  {
    title: 'Trust-CV',
    desc: 'Smart India Hackathon project. Detects poisoned images and fake or duplicate images, gives each image a trust percentage, can quarantine suspicious files inside the app, and has a live camera mode that shows the trust percentage in real time.',
    tech: ['Python', 'TypeScript'], // languages listed on the public GitHub repo
    domain: 'Image security',
    outcome: 'SIH 2026, top 40 finalist in selection',
    links: [{ kind: 'source', label: 'Source on GitHub', href: 'https://github.com/Iam-yuvarajan/Trust-CV-SIH' }],
  },
  {
    title: 'Discovery Agent',
    desc: 'An app that links the gaps between industries, such as stores and their stock, so supply and demand can find each other.',
    tech: ['Python', 'LLM'],
    domain: 'Supply & industry',
    outcome: 'Working prototype, walkthrough on request',
    links: [],
  },
];

export const work = {
  heading: 'Main *projects*.',
  sub: 'Four builds I\'m proudest of. Try one live, read the source of two, and ask me for a walkthrough of any of them.',
  badges: {
    live: 'Live',
    source: 'Open source',
    private: 'Private · details on request',
  },
  ask: 'Ask me about it →',
  caption: '> python main.py',
};

/* -------------------------------------------------------------- education */

export const education = {
  college: {
    name: 'Sri Sairam College of Engineering',
    place: 'Anekal, Bengaluru',
    cgpa: 6.68,
    branch: 'Electronics and Communication Engineering', // from Yuvarajan_Resume.pdf
    years: '2024 – present',
    graduation: '2028 (expected)',
  },
  school: {
    name: 'SDA Hr Sec School',
    place: 'Hosur',
    tenthPercent: 77,
    twelfthPercent: 72,
    tenthYear: '2020 – 2021',
    twelfthYear: '2022 – 2023',
  },
};

export const journey = {
  heading: 'Education & *journey*.',
  sub: 'From school in Hosur to engineering in Bengaluru, and the projects built along the way.',
  timelineStart: 2020,
  timelineEnd: 2026,
};

export const metrics: Metric[] = [
  { value: '77%', label: '10th', source: 'SDA Hr Sec School, Hosur' },
  { value: '72%', label: '12th', source: 'SDA Hr Sec School, Hosur' },
  { value: '6.68', label: 'CGPA', source: 'Sri Sairam College of Engineering' },
  { value: '4', label: 'main projects', source: 'Python & AI' },
];

export const stages: Stage[] = [
  {
    id: 'school-10',
    label: 'School · 10th',
    title: 'Secondary School (10th)',
    org: education.school.name,
    location: education.school.place,
    range: education.school.tenthYear,
    chart: { from: 2020, to: 2021 },
    bullets: ['Completed 10th standard', 'Scored 77%'],
    highlight: '77% in 10th',
    stack: [],
  },
  {
    id: 'school-12',
    label: 'School · 12th',
    title: 'Higher Secondary (12th)',
    org: education.school.name,
    location: education.school.place,
    range: education.school.twelfthYear,
    chart: { from: 2022, to: 2023 },
    bullets: ['Completed 12th standard', 'Scored 72%'],
    highlight: '72% in 12th',
    stack: [],
  },
  {
    id: 'college',
    label: 'College · Sri Sairam College of Engineering',
    title: `B.E. ${education.college.branch}`,
    org: education.college.name,
    location: education.college.place,
    range: education.college.years,
    chart: { from: 2024, to: 2026, ongoing: true },
    bullets: ['B.E. Electronics and Communication Engineering', 'CGPA 6.68', 'Expected graduation 2028', 'Building AI and web projects alongside coursework'],
    highlight: 'CGPA 6.68',
    stack: ['Python', 'Java', 'HTML'],
  },
  {
    id: 'projects',
    label: 'Projects · YUVA AI, Sollunga Bot, Trust-CV, Discovery Agent',
    title: 'Main projects',
    org: 'Independent',
    location: profile.baseLocation,
    range: '2026 – present (still updating)',
    chart: { from: 2026, to: 2026, ongoing: true },
    bullets: [
      'YUVA AI: password-protected AI companion with relationship modes',
      'Sollunga Bot: order-taking agent for shops over Telegram / WhatsApp, text and voice',
      'Trust-CV: trust scoring for poisoned, fake and duplicate images, with a live camera mode',
      'Discovery Agent: connects supply and demand across industries',
    ],
    highlight: '4 private builds, walkthroughs on request',
    stack: ['Python', 'AI', 'Telegram', 'WhatsApp', 'Vibe coding'],
  },
  {
    id: 'sih-2026',
    label: 'Achievement · Smart India Hackathon 2026',
    title: 'Smart India Hackathon 2026, top 40 finalist in selection',
    org: 'Smart India Hackathon',
    location: 'India',
    range: '2026',
    chart: { from: 2026, to: 2026 },
    bullets: ['Trust-CV: image trust scoring, quarantine and live camera mode'],
    highlight: 'Top 40 finalist in selection',
    stack: ['Python'],
  },
  // {{INTERNSHIP_OR_EXPERIENCE}}: add Stage entries here when supplied (none yet, so none rendered).
];

/** Spoken languages, shown beside education. */
export const languages: Language[] = [
  { name: 'Tamil', level: 'Native', note: 'Mother tongue; everyday and technical conversation.' },
  { name: 'English', level: 'Fluent', note: 'Working language for code, documentation and interviews.' },
];

/* ------------------------------------------------------------------ stack */

export const stack = {
  heading: 'Depth over *buzzwords*.',
  sub: "Honest about what I reach for daily and what I'm still learning. Hover or tap anything for context.",
  tiers: [
    { id: 'daily' as Tier, title: 'Daily drivers', desc: 'What I open every single day.' },
    { id: 'production' as Tier, title: 'Production-proven', desc: 'Used to ship real, working builds.' },
    { id: 'shipped' as Tier, title: 'Shipped with', desc: 'Learned and used in coursework.' },
  ],
};

export const skills: Skill[] = [
  { name: 'Python', category: 'Languages', tier: 'daily', note: 'Core language for the AI projects and bots' },
  { name: 'AI', category: 'AI', tier: 'daily', note: 'Powers YUVA AI, Sollunga Bot and Discovery Agent' },
  { name: 'Vibe coding', category: 'Methodologies', tier: 'daily', note: 'AI-assisted build workflow for fast iteration' },
  { name: 'HTML', category: 'Frontend', tier: 'daily', note: 'Web interfaces' },
  { name: 'Web application development', category: 'Frontend', tier: 'production', note: 'Building full web apps end to end' },
  { name: 'Java', category: 'Languages', tier: 'shipped', note: 'Used in college coursework' },
];

/* ------------------------------------------------------------------ shell */

export const shell = {
  heading: 'Poke the *backend*.',
  sub: 'A working terminal wired to the API this site runs on. Real requests, real latency, no mock JSON.',
  tries: ['help', 'curl /api/stats', 'git log', 'cat impact.json', 'cat resume', 'cd ~/agents', 'sudo hire yuvarajan'],
  hireMessage: [
    '[sudo] password for guest: ********',
    'Verifying clearance ... granted',
    'Hiring Yuvarajan J ... ✓ offer drafted',
    `Next step: email ${profile.email}`,
  ],
};

/* --------------------------------------------------------- github graph */

export const github = {
  username: GITHUB_USERNAME,
  heading: 'GitHub Contributions',
  sub: 'A year of commits, pushes and late-night fixes.',
  loading: 'Loading contribution graph…',
  error: 'The contribution graph could not load. Open the profile instead.',
  profile: 'Open GitHub profile',
  totalSuffix: 'contributions in the last year',
};

/* -------------------------------------------------------------------- ask */

export const ask = {
  heading: 'Ask me *anything*.',
  sub: 'Pre-written answers to the questions I get asked most, plus what I have been building lately.',
};

/* ---------------------------------------------------------------- ask bot */

/** The click-only interview bot on the Ask page. Answers are pre-written, never generated. */
export const askBot = {
  kicker: 'ask-yuva',
  status: 'preset answers · no live model',
  sub: 'Pick a question. The bot answers in my own words — no typing needed.',
  empty: 'Choose a question above to see the answer.',
  clear: 'clear answer',
  questions: [
    {
      id: 'roles',
      q: 'What roles are you looking for?',
      a: 'AI engineer or similar AI/software roles, plus internships. I am an ECE student at Sri Sairam College of Engineering, Bengaluru, and I build AI tools end to end.',
    },
    {
      id: 'stack',
      q: 'What is your main stack?',
      a: 'Python for AI and backend work, JavaScript/Node/Express for web, FastAPI for services, and Groq or Gemini for LLMs. SQLite when a project needs storage.',
    },
    {
      id: 'trustcv',
      q: 'Walk me through Trust-CV.',
      a: 'It detects poisoned, fake and duplicate images, gives each image a trust score, quarantines suspicious files and runs a live camera mode. It was a *Smart India Hackathon 2026 top-40 finalist* in selection.',
    },
    {
      id: 'sollunga',
      q: 'What does Sollunga Bot do?',
      a: 'It takes shop orders over Telegram or WhatsApp in Tamil, Tanglish or English, including voice notes. Python prices and stock-checks every order, then the owner accepts or rejects it. There is a FastAPI dashboard for stock and sales.',
    },
    {
      id: 'yuva',
      q: 'What is YUVA AI?',
      a: 'A password-protected AI companion with creator, brother and friend modes, voice input/output and persistent memory. Vanilla JavaScript frontend, Node/Express backend, Groq for the model.',
    },
    {
      id: 'hire',
      q: 'Why should we hire you?',
      a: 'I ship working builds, not just prototypes. I have taken four AI and web projects from idea to a usable product across the LLM, backend and UI. I am early in my career and looking for a team where I can learn fast and own real work.',
    },
    {
      id: 'contact',
      q: 'How do I contact you?',
      a: `Email ${profile.email}. The resume download and social links are in the header and contact section.`,
    },
  ],
};

/* ---------------------------------------------------------------- contact */

export const contact = {
  heading: 'Building something that needs *intelligence*?',
  formHint: 'opens in your mail app, nothing stored',
  submit: 'Draft the email →',
  facts: [
    { k: 'Based in', v: profile.baseLocation },
    { k: 'Status', v: profile.availability },
    { k: 'Timezone', v: 'IST, Asia/Kolkata' },
    { k: 'Replies', v: profile.replyTime },
  ],
};

/* ----------------------------------------------------------------- loader */

export const loader = {
  command: '$ yuvarajan build --worlds client,server,agents,whoami',
  // Per-world lines live in worlds.ts (bootLines).
};

/* ----------------------------------------------------------------- helpers */

export function visibleLinks() {
  const l = profile.links;
  const list = [
    { id: 'linkedin', label: 'LinkedIn', href: l.linkedin },
    { id: 'leetcode', label: 'LeetCode', href: l.leetcode },
    { id: 'huggingface', label: 'Hugging Face', href: l.huggingface },
  ];
  if (profile.showGithub) list.push({ id: 'github', label: 'GitHub', href: l.github });
  return list.filter((x) => x.href.trim() !== '');
}
