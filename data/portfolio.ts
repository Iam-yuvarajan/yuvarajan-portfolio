/** Content mirrored from the current live portfolio, kept deliberately short and readable. */

export const person = {
  name: 'Yuvarajan J',
  initials: 'YJ',
  role: 'ECE Student · Developer · AI Enthusiast',
  eyebrowRole: 'ECE Student',
  location: 'Hosur, Tamil Nadu, India',
  intro: 'ECE Student · Developer · AI Enthusiast.',
  introExtra: 'I like building things end to end — the interface people touch and the parts behind it.',
  roles: ['Vibe Coder', 'App Developer', 'Website Builder', 'AI Learner'],
  description:
    'Yuvarajan J is an Electronics and Communication Engineering student and developer building Python, web and AI projects, with a growing interest in cloud and cybersecurity.',
  cutout: '/media/intro.png',
};

export const contactInfo = {
  email: 'yuvarajan278@gmail.com',
  emailSubject: "Hello Yuvarajan, let's connect",
  phoneDisplay: '+91 93420 38458',
  phone: '+919342038458',
  whatsapp: '919342038458',
  based: 'Hosur, Tamil Nadu, India',
  openTo: 'Internships & projects',
  replies: 'Within a day',
  resume: '/Yuvarajan_J_Resume.pdf',
  resumeFile: 'Yuvarajan_J_Resume.pdf',
};

export const socials = {
  github: 'https://github.com/Iam-yuvarajan',
  linkedin: 'https://www.linkedin.com/in/yuvarajan-j26/',
  leetcode: 'https://leetcode.com/u/yuvarajan_software',
  instagram: 'https://www.instagram.com/_yuva._.rajan__/',
};

export type NavLink = { to: string; label: string; index: string; ghost: string };

export const nav: NavLink[] = [
  { to: '/experience', label: 'Experience', index: '02', ghost: 'WORK' },
  { to: '/work', label: 'Projects', index: '03', ghost: 'PROJECTS' },
  { to: '/skills', label: 'Skills', index: '04', ghost: 'SKILLS' },
  { to: '/contact', label: 'Contact', index: '05', ghost: 'HELLO' },
];

export const about = {
  index: '01',
  ghost: 'ABOUT',
  paragraphs: [
    "I'm an Electronics and Communication Engineering student who enjoys building software as much as understanding the hardware underneath it. Most of what I know comes from hands-on projects: writing Python, building websites, creating Telegram bots and using AI tools to turn rough ideas into things people can actually use.",
    "I'm working toward a career in the IT industry. Alongside AI, I'm learning cloud technologies and cybersecurity, and I treat every project as a chance to learn something new. My goal is to keep turning ideas into practical solutions and to grow into a versatile IT professional.",
  ],
};

export const stats = [
  { value: '03', label: 'projects shipped' },
  { value: '05', label: 'skill areas' },
  { value: '2024', label: 'started ECE' },
  { value: '∞', label: 'things to learn' },
];

export const experience = [
  {
    role: 'ECE Student & Self-taught Developer',
    organization: 'Sri Sairam College of Engineering',
    period: '2024 – Present',
    location: 'Hosur, Tamil Nadu, India',
    bullets: [
      'Studying Electronics and Communication Engineering while building software on the side.',
      'Learning cloud technologies and cybersecurity alongside AI and web development.',
      'Treating every project as a chance to learn something new and ship it.',
    ],
  },
  {
    role: 'Developer — Personal & Hackathon Projects',
    organization: 'Independent',
    period: '2024 – Present',
    location: 'Remote',
    bullets: [
      'Built YUVA AI, a password-gated personal AI chat assistant.',
      'Built Sollunga AI Bot, a Telegram order bot that understands Tamil, English and Tanglish.',
      'Built Trust CV, a zero-trust integrity platform for computer vision pipelines, for Smart India Hackathon.',
    ],
  },
];

export const education = [
  {
    degree: 'B.E./B.Tech in Electronics and Communication Engineering',
    institution: 'Sri Sairam College of Engineering',
    period: '2024 – Present',
    stats: [
      { label: 'Current semester', value: '5th' },
      { label: 'CGPA (through 5th sem)', value: '6.68 / 10' },
    ],
  },
  {
    degree: 'Higher Secondary (12th)',
    institution: 'SDA Hr Sec School',
    period: '2023 – 2024',
    stats: [{ label: 'Percentage', value: '75%' }],
  },
  {
    degree: 'Secondary (10th)',
    institution: 'SDA Hr Sec School',
    period: '2020 – 2021',
    stats: [{ label: 'Percentage', value: '77%' }],
  },
];

export type SkillItem = { name: string; note?: string; icon?: string; invert?: boolean };
export type SkillGroup = { title: string; items: SkillItem[] };

const devicon = (slug: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${slug}.svg`;

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages & Web',
    items: [
      { name: 'Python', icon: devicon('python/python-original') },
      { name: 'HTML', icon: devicon('html5/html5-original') },
      { name: 'CSS', icon: devicon('css3/css3-original') },
      { name: 'JavaScript', note: 'Basic', icon: devicon('javascript/javascript-original') },
    ],
  },
  {
    title: 'Tools & Platforms',
    items: [
      { name: 'Git', icon: devicon('git/git-original') },
      { name: 'GitHub', icon: devicon('github/github-original'), invert: true },
      { name: 'Telegram Bot API', icon: 'send' },
    ],
  },
  {
    title: 'AI & Vision',
    items: [
      { name: 'AI / LLM tools & prompting', icon: 'sparkles' },
      { name: 'Computer Vision', note: 'Basic', icon: devicon('opencv/opencv-original') },
    ],
  },
  {
    title: 'Hardware',
    items: [
      { name: 'Electronics fundamentals', icon: 'cpu' },
      { name: 'Embedded fundamentals', icon: 'circuit-board' },
    ],
  },
  {
    title: 'Currently learning',
    items: [
      { name: 'Cloud', note: 'Learning', icon: 'cloud' },
      { name: 'Cybersecurity', note: 'Learning', icon: 'shield' },
    ],
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  period: string;
  language: string;
  domain: string;
  outcome: string;
  status: 'public' | 'private';
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: 'YUVA AI',
    description:
      'A password-protected AI companion that greets you and talks like a friend, a brother or another close relationship of your choice.',
    tags: ['JavaScript', 'Node.js', 'Express', 'Groq'],
    period: 'Aug 2026',
    language: 'JavaScript',
    domain: 'Conversational AI',
    outcome: 'Live voice companion with 3 relationship modes and persistent memory',
    status: 'public',
    live: 'https://yuva-ai.onrender.com/',
  },
  {
    title: 'Sollunga Bot',
    description:
      'An AI agent that takes shop orders over Telegram or WhatsApp in Tanglish or English, and also from voice messages. The shopkeeper gets a message and approves or rejects each order.',
    tags: ['Python', 'Telegram', 'WhatsApp', 'Voice Input'],
    period: 'Oct 2026',
    language: 'Python',
    domain: 'Retail automation',
    outcome: 'Multilingual text + voice orders with owner approval',
    status: 'public',
    github: 'https://github.com/Iam-yuvarajan/solluga-ai',
  },
  {
    title: 'Trust-CV',
    description:
      'Smart India Hackathon project. Detects poisoned images and fake or duplicate images, gives each image a trust percentage, can quarantine suspicious files inside the app, and has a live camera mode that shows the trust percentage in real time.',
    tags: ['Python', 'TypeScript', 'Vision', 'SIH 2026'],
    period: 'Sep 2026',
    language: 'Python',
    domain: 'Image security',
    outcome: 'SIH 2026, top 40 finalist in selection',
    status: 'public',
    github: 'https://github.com/Iam-yuvarajan/Trust-CV-SIH',
  },
  {
    title: 'Discovery Agent',
    description:
      'An app that links the gaps between industries, such as stores and their stock, so supply and demand can find each other.',
    tags: ['Python', 'LLM', 'AI Agents'],
    period: 'Nov 2026',
    language: 'Python',
    domain: 'Supply & industry',
    outcome: 'Working prototype, walkthrough on request',
    status: 'private',
  },
];
