/**
 * Content for the recreated portfolio.
 * The visual language follows the reference portfolio (rotating mark landing,
 * particle fields, mono bordered cards, horizontal flip-card projects),
 * while every fact here belongs to Yuvarajan J.
 */

export const profile = {
  name: 'Yuvarajan J',
  initials: 'YJ',
  role: 'AI Engineer · ECE Student',
  shortHeadline: 'AI Engineer • Builder • ECE Student',
  location: 'Hosur, Tamil Nadu, India',
  email: 'yuvarajan278@gmail.com',
  resume: '/Yuvarajan_J_Resume.pdf',
  introImage: '/media/intro.png',
  spaceman: '/media/spaceman.png',
  availability: 'Open to AI roles · internships',
  timezone: 'IST (Asia/Kolkata)',
  replyTime: 'Within 24 hours',
  about:
    'I’m Yuvarajan J, an AI engineer and ECE student based in Hosur, Tamil Nadu. I build AI-powered tools and web applications — Python at the core, a clean interface on the surface, and a fast, experimental workflow that turns ideas into working products. My Trust-CV project was a top 40 finalist in the Smart India Hackathon 2026 selection round.',
  links: {
    github: 'https://github.com/Iam-yuvarajan',
    linkedin: '',
    leetcode: 'https://leetcode.com/u/yuvarajan_software/',
    huggingface: 'https://huggingface.co/yuvarajan-pixel',
  },
};

export const site = {
  url: 'https://jyuvarajan.vercel.app',
  title: 'Yuvarajan J | AI Engineer',
  description:
    'Yuvarajan J is an AI engineer and ECE student from Hosur, Tamil Nadu. He builds AI tools and web apps with Python, JavaScript and LLMs, and was a Smart India Hackathon 2026 top 40 finalist.',
  keywords: [
    'Yuvarajan J',
    'AI engineer',
    'Python',
    'web applications',
    'ECE',
    'Hosur',
    'Smart India Hackathon',
    'portfolio',
  ],
  copyright: '© 2026 Yuvarajan J',
};

export type NavLink = { to: string; label: string };

export const nav: NavLink[] = [
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/work', label: 'Projects' },
  { to: '/ai-lab', label: 'AI Lab' },
  { to: '/speaking', label: 'Speaking' },
  { to: '/open-source', label: 'Open Source' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
];

export type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  demo: string;
  source: string;
  image: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: 'YUVA AI',
    description:
      'A password-protected AI companion that greets you and talks like a friend, a brother or another close relationship of your choice.',
    tags: ['JavaScript', 'Node.js', 'Groq', 'Voice'],
    demo: 'https://yuva-ai.onrender.com/',
    source: '',
    image: '/media/project-yuva.svg',
  },
  {
    id: 2,
    title: 'Sollunga Bot',
    description:
      'An AI agent that takes shop orders over Telegram or WhatsApp in Tanglish or English — including voice notes — and asks the shopkeeper to approve each order.',
    tags: ['Python', 'Telegram', 'WhatsApp', 'Voice'],
    demo: '',
    source: 'https://github.com/Iam-yuvarajan/solluga-ai',
    image: '/media/project-sollunga.svg',
  },
  {
    id: 3,
    title: 'Trust-CV',
    description:
      'Detects poisoned, fake and duplicate images, gives each image a trust score, quarantines suspicious files, and shows a live score in camera mode. SIH 2026 top 40 finalist.',
    tags: ['Python', 'TypeScript', 'Vision', 'SIH 2026'],
    demo: '',
    source: 'https://github.com/Iam-yuvarajan/Trust-CV-SIH',
    image: '/media/project-trust.svg',
  },
  {
    id: 4,
    title: 'Discovery Agent',
    description:
      'An app that links the gaps between industries — such as stores and their stock — so supply and demand can find each other.',
    tags: ['Python', 'LLM', 'Prototype'],
    demo: '',
    source: '',
    image: '/media/project-discovery.svg',
  },
];

export type Feature = {
  id: number;
  title: string;
  tags: string[];
  date: string;
  image: string;
  href: string;
  internal?: boolean;
};

export const features: Feature[] = [
  {
    id: 1,
    title: 'Smart India Hackathon 2026 · Top 40 finalist',
    tags: ['SIH 2026', 'Trust-CV', 'Achievement'],
    date: 'Selection round · 2026',
    image: '/media/project-trust.svg',
    href: '/experience',
    internal: true,
  },
  {
    id: 2,
    title: 'YUVA AI · live companion',
    tags: ['JavaScript', 'Groq', 'AI'],
    date: 'Live demo',
    image: '/media/project-yuva.svg',
    href: 'https://yuva-ai.onrender.com/',
  },
  {
    id: 3,
    title: 'Trust-CV · image trust scoring',
    tags: ['Python', 'Vision', 'Open Source'],
    date: 'Source on GitHub',
    image: '/media/project-trust.svg',
    href: 'https://github.com/Iam-yuvarajan/Trust-CV-SIH',
  },
  {
    id: 4,
    title: 'Sollunga Bot · orders from voice',
    tags: ['Telegram', 'WhatsApp', 'Tanglish'],
    date: 'Source on GitHub',
    image: '/media/project-sollunga.svg',
    href: 'https://github.com/Iam-yuvarajan/solluga-ai',
  },
  {
    id: 5,
    title: 'LeetCode · yuvarajan_software',
    tags: ['DSA', 'Practice', 'Java'],
    date: 'Coding profile',
    image: '/media/thumb-code.svg',
    href: profile.links.leetcode,
  },
  {
    id: 6,
    title: 'Hugging Face · yuvarajan-pixel',
    tags: ['Models', 'AI', 'Experiments'],
    date: 'Profile',
    image: '/media/thumb-ai.svg',
    href: profile.links.huggingface,
  },
  {
    id: 7,
    title: 'Résumé · download or view',
    tags: ['PDF', 'Résumé', '2026'],
    date: 'Yuvarajan_J_Resume.pdf',
    image: '/media/thumb-resume.svg',
    href: profile.resume,
  },
  {
    id: 8,
    title: 'SIH 2026 · participant certificate',
    tags: ['Certificate', 'SIH 2026'],
    date: 'Smart India Hackathon',
    image: '/media/thumb-cert.svg',
    href: '/media/YUVARAJAN-J-Participant-Certificate.pdf',
  },
];

export type ExperienceCard =
  | { kind: 'text'; id: string; title: string; body: string }
  | { kind: 'list'; id: string; title: string; meta?: string; items: string[] }
  | { kind: 'numbers'; id: string; title: string; numbers: { value: string; label: string }[] };

export const experienceCards: ExperienceCard[] = [
  {
    kind: 'text',
    id: 'who',
    title: 'Yuvarajan J',
    body: 'AI engineer and ECE student from Hosur, Tamil Nadu. I take AI and web ideas from a rough prompt to something people can actually use.',
  },
  {
    kind: 'text',
    id: 'focus',
    title: 'What I work on',
    body: 'AI agents, LLM-backed tools, image security, conversational interfaces, web apps and the small automations that make a build feel complete.',
  },
  {
    kind: 'numbers',
    id: 'numbers',
    title: 'Numbers',
    numbers: [
      { value: '4', label: 'main projects' },
      { value: 'Top 40', label: 'SIH 2026 selection' },
      { value: '6.68', label: 'CGPA' },
      { value: '77%', label: '10th standard' },
      { value: '72%', label: '12th standard' },
      { value: '2028', label: 'expected graduation' },
    ],
  },
  {
    kind: 'list',
    id: 'sih',
    title: 'Smart India Hackathon 2026 · Top 40 finalist',
    meta: '2026 · India',
    items: [
      'Built Trust-CV: trust scoring for poisoned, fake and duplicate images.',
      'Added a quarantine flow for suspicious files inside the app.',
      'Built a live camera mode that shows the trust percentage in real time.',
      'Reached the top 40 in the SIH 2026 selection round.',
    ],
  },
  {
    kind: 'list',
    id: 'builds',
    title: 'Independent builds',
    meta: '2026 – present · Hosur / Bengaluru',
    items: [
      'YUVA AI — password-protected companion with three relationship modes and persistent memory.',
      'Sollunga Bot — text and voice orders over Telegram / WhatsApp with owner approval.',
      'Trust-CV — image trust scoring, quarantine and live camera mode.',
      'Discovery Agent — connects supply and demand across industries.',
    ],
  },
  {
    kind: 'list',
    id: 'college',
    title: 'B.E. Electronics and Communication Engineering',
    meta: 'Sri Sairam College of Engineering · Anekal, Bengaluru · 2024 – present',
    items: [
      'CGPA 6.68; expected graduation 2028.',
      'Building AI and web projects alongside coursework.',
      'Core coursework and self-directed work in Python, Java and web technologies.',
    ],
  },
  {
    kind: 'list',
    id: 'school',
    title: 'Schooling · SDA Hr Sec School, Hosur',
    meta: '2020 – 2023',
    items: [
      '10th standard · 77% · 2020 – 2021.',
      '12th standard · 72% · 2022 – 2023.',
    ],
  },
  {
    kind: 'list',
    id: 'languages',
    title: 'Languages',
    items: [
      'Tamil — native; everyday and technical conversation.',
      'English — fluent; working language for code, documentation and interviews.',
    ],
  },
];

export type SkillGroup = { title: string; values: string };

export const skillCards: { heading: string; icon: 'code' | 'palette'; intro: string; groups: SkillGroup[] }[] = [
  {
    heading: 'Software Developer',
    icon: 'code',
    intro: 'I like turning an idea into a small, useful system — from the data model to the interface.',
    groups: [
      { title: 'Languages and backend', values: 'Python, Java, JavaScript, TypeScript, Node.js, Express' },
      { title: 'Web', values: 'HTML, CSS, REST APIs, web application development' },
      { title: 'Data and storage', values: 'SQLite, Python data tooling' },
    ],
  },
  {
    heading: 'AI Builder',
    icon: 'palette',
    intro: 'Models are tools. The interesting part is shaping them into something a person can actually use.',
    groups: [
      { title: 'LLMs and agents', values: 'Groq, Gemini, prompt design, agentic workflows' },
      { title: 'Vision and voice', values: 'Image trust scoring, voice input, conversational interfaces' },
      { title: 'Ways of working', values: 'Vibe coding, rapid prototyping, iteration with real users' },
    ],
  },
];
