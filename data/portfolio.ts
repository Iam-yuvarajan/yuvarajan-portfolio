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
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: 'YUVA AI',
    description:
      'A personal AI chat assistant where conversations are unlocked with a password, so only people I share it with can use it.',
    tags: ['JavaScript', 'AI', 'Web App'],
    period: 'Aug 2026',
    language: 'JavaScript',
    github: 'https://github.com/Iam-yuvarajan/personal-ai',
    live: 'https://yuva-ai.onrender.com/',
  },
  {
    title: 'Sollunga AI Bot',
    description:
      'An AI-powered Telegram bot that takes orders for local Indian shops. Customers can order in Tamil, English or Tanglish.',
    tags: ['Python', 'Telegram Bot', 'AI'],
    period: 'Oct 2026',
    language: 'Python',
    github: 'https://github.com/Iam-yuvarajan/solluga-ai',
  },
  {
    title: 'Trust CV',
    description:
      'A zero-trust integrity platform for computer vision pipelines, built for Smart India Hackathon. It adds cryptographic lineage and tamper evidence from dataset to model inference.',
    tags: ['Python', 'Computer Vision', 'SIH'],
    period: 'Sep 2026',
    language: 'Python',
    github: 'https://github.com/Iam-yuvarajan/Trust-CV-SIH',
    live: 'https://trust-cv-sih.vercel.app',
  },
  {
    title: 'Four Worlds Portfolio',
    description:
      'A themed personal portfolio built with Next.js, TypeScript and GSAP, with an interactive Q&A panel, API routes and a GitHub contributions heatmap.',
    tags: ['Next.js', 'TypeScript', 'GSAP'],
    period: 'Nov 2026',
    language: 'TypeScript',
    github: 'https://github.com/Iam-yuvarajan/yuvarajan-portfolio',
    live: 'https://jyuvarajan.vercel.app',
  },
  {
    title: 'Password Generator',
    description:
      'A Python command-line tool that creates strong random passwords with a chosen length, mixing uppercase, lowercase, digits and special characters.',
    tags: ['Python', 'CLI', 'Security'],
    period: 'Aug 2026',
    language: 'Python',
    github: 'https://github.com/Iam-yuvarajan/password-generator',
  },
  {
    title: 'Bunk Calc',
    description:
      'A small attendance calculator that tells you how many classes you can safely skip, or how many you need to attend to hit your target percentage.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    period: 'Oct 2026',
    language: 'HTML',
    github: 'https://github.com/Iam-yuvarajan/Bunk-Calc',
  },
];
