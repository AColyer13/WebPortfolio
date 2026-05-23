export interface Skill {
  name: string;
  icon: string;
}

export interface SkillBlock {
  title: string;
  skills: Skill[];
}

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description: string;
}

interface Project {
  id: number;
  title: string;
  tech: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl: string;
}

/** Skills in display order: Block 1 (top) → Block 8 (bottom). */
export const skillBlocks: SkillBlock[] = [
  {
    title: 'Core web / JS',
    skills: [
      { name: 'Vite', icon: 'fas fa-bolt' },
      { name: 'React', icon: 'fab fa-react' },
      { name: 'React Native', icon: 'fas fa-mobile-screen' },
      { name: 'Flutter', icon: 'fas fa-mobile-screen-button' },
      { name: 'React Router', icon: 'fas fa-route' },
      { name: 'React Query', icon: 'fas fa-arrows-rotate' },
      { name: 'JavaScript', icon: 'fab fa-js' },
      { name: 'TypeScript', icon: 'fas fa-i-cursor' },
      { name: 'Tailwind CSS', icon: 'fas fa-wind' },
      { name: 'Node.js', icon: 'fab fa-node-js' },
      { name: 'Express.js', icon: 'fas fa-server' },
      { name: 'React Hook Form', icon: 'fas fa-clipboard-list' },
      { name: 'Framer Motion', icon: 'fas fa-film' },
      { name: 'Python', icon: 'fab fa-python' },
      { name: 'FastAPI', icon: 'fas fa-bolt' },
      { name: 'Flask', icon: 'fas fa-flask' },
      { name: 'Java', icon: 'fab fa-java' },
    ],
  },
  {
    title: 'UI / 3D / content',
    skills: [
      { name: 'Radix UI', icon: 'fas fa-layer-group' },
      { name: 'Disco UI', icon: 'fas fa-compact-disc' },
      { name: 'Lucide', icon: 'fas fa-icons' },
      { name: 'Three.js & R3F', icon: 'fas fa-cube' },
      { name: 'Recharts', icon: 'fas fa-chart-bar' },
      { name: 'React Markdown', icon: 'fab fa-markdown' },
    ],
  },
  {
    title: 'Data, auth, realtime',
    skills: [
      { name: 'Firebase (Auth, Firestore, Hosting)', icon: 'fas fa-fire' },
      { name: 'SQL', icon: 'fas fa-table' },
      { name: 'Socket.IO', icon: 'fas fa-satellite-dish' },
      { name: 'JWT & OAuth', icon: 'fas fa-key' },
      { name: 'Zod', icon: 'fas fa-list-check' },
    ],
  },
  {
    title: 'API, docs, integration',
    skills: [
      { name: 'OpenAPI', icon: 'fas fa-file-code' },
      { name: 'Postman', icon: 'fas fa-paper-plane' },
      { name: 'Axios', icon: 'fas fa-arrows-up-down' },
      { name: 'SMTP / Email APIs', icon: 'fas fa-envelope' },
    ],
  },
  {
    title: 'Testing & quality',
    skills: [
      { name: 'Jest', icon: 'fas fa-vial' },
      { name: 'Supertest', icon: 'fas fa-flask' },
      { name: 'Vitest', icon: 'fas fa-check-double' },
      { name: 'Playwright', icon: 'fas fa-play-circle' },
      { name: 'Lighthouse', icon: 'fas fa-lightbulb' },
      { name: 'axe', icon: 'fas fa-universal-access' },
      { name: 'Firebase Emulators', icon: 'fas fa-flask-vial' },
    ],
  },
  {
    title: 'DevOps & cloud',
    skills: [
      { name: 'Git', icon: 'fab fa-git-alt' },
      { name: 'GitHub Actions', icon: 'fab fa-github' },
      { name: 'Docker', icon: 'fab fa-docker' },
      { name: 'Google Cloud', icon: 'fab fa-google' },
      { name: 'AWS', icon: 'fab fa-aws' },
      { name: 'Cloud Run', icon: 'fas fa-person-running' },
      { name: 'CI/CD', icon: 'fas fa-code-branch' },
      { name: 'Secrets & IAM', icon: 'fas fa-user-shield' },
    ],
  },
  {
    title: 'Security & architecture',
    skills: [
      { name: 'OWASP / AppSec', icon: 'fas fa-shield-alt' },
      { name: 'Helmet', icon: 'fas fa-hard-hat' },
      { name: 'CSP', icon: 'fas fa-shield-halved' },
      { name: 'Rate Limiting', icon: 'fas fa-gauge' },
    ],
  },
  {
    title: 'AI',
    skills: [
      { name: 'Gemini API', icon: 'fab fa-google' },
      { name: 'Claude Code', icon: 'fas fa-feather-pointed' },
      { name: 'Cursor', icon: 'images/cursor.svg' },
      { name: 'AI Agent Development', icon: 'fas fa-robot' },
      { name: 'Prompt Engineering', icon: 'fas fa-wand-magic-sparkles' },
      { name: 'AI Rate Limiting', icon: 'fas fa-gauge' },
      { name: 'Local LLMs', icon: 'fas fa-microchip' },
      { name: 'OpenClaw', icon: 'fas fa-shrimp' },
    ],
  },
];

export const skills: Skill[] = skillBlocks.flatMap((block) => block.skills);

export const timeline: TimelineItem[] = [
  {
    year: 'Present',
    title: 'AI Search Quality Evaluator',
    company: 'Activus Connect – Remote',
    description: 'Evaluating user queries to identify severity and factuality issues in AI outputs, delivering feedback that improves model performance for Google Gemini.',
  },
  {
    year: '2022',
    title: 'Account Executive',
    company: 'Citizen Observer – St. Paul, MN',
    description: 'Led adoption of the tip411 platform across six municipalities through 100+ live product demonstrations, including travel to Dallas, TX and San Diego, CA.',
  },
  {
    year: '2021',
    title: 'Sales Development Representative',
    company: 'Digital River – Minnetonka, MN',
    description: 'Secured a $500,000+ deal with gaming client Rec Room through targeted outreach and executive meetings.',
  },
  {
    year: '2020',
    title: 'Account Executive',
    company: 'INRY – Eden Prairie, MN',
    description: 'Managed $400,000+ pipeline through full sales cycle; built relationships with HR and IT stakeholders to position ServiceNow solutions strategically.',
  },
  {
    year: '2019',
    title: 'Business Development Representative',
    company: 'Epicor Software – St. Louis Park, MN',
    description: 'Qualified $3.7M in opportunities and added $1.1M to pipeline for ERP solutions in manufacturing. Received Excellence Award for consistent performance.',
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: 'Valley Forge Automotive',
    tech: 'React, Firebase, Firestore',
    imageUrl: 'images/mechanicapiicon.png',
    liveUrl: 'https://valleyforgeautomotive.org',
    githubUrl: 'https://github.com/AColyer13/Mechanic-API---Copy-with-Testing-and-Documentation',
  },
  {
    id: 2,
    title: 'MissionCtrl',
    tech: 'React, Firebase, Firestore, Gemini AI',
    imageUrl: 'images/missionctrl-tr41-groundctrl.png',
    liveUrl: 'https://missionctrl.org',
    githubUrl: 'https://github.com/growthwithcoding/TR41-GroundCTRL',
  },
  {
    id: 3,
    title: 'Immaculate Draft',
    tech: 'HTML, CSS, JavaScript',
    imageUrl: 'images/immaculate-grid-copy.png',
    liveUrl: 'https://acolyer13.github.io/Immaculate-Grid-Copy/',
    githubUrl: 'https://github.com/AColyer13/Immaculate-Grid-Copy',
  },
  {
    id: 4,
    title: 'Vikes Quiz App',
    tech: 'JavaScript',
    imageUrl: 'images/vikingsquizicon.png',
    liveUrl: 'https://acolyer13.github.io/vikes-quiz-app/',
    githubUrl: 'https://github.com/AColyer13/vikes-quiz-app',
  },
  {
    id: 5,
    title: 'Event Center Website',
    tech: 'HTML, CSS, JS',
    imageUrl: 'images/Eventcentericon.png',
    liveUrl: 'https://acolyer13.github.io/Event-Center-Example-Website/',
    githubUrl: 'https://github.com/AColyer13/Event-Center-Example-Website',
  },
  {
    id: 6,
    title: 'Swimming Website',
    tech: 'HTML, CSS, JS',
    imageUrl: 'images/Swimmingsiteicon.png',
    liveUrl: 'https://acolyer13.github.io/Swim-Teaching-Website/',
    githubUrl: 'https://github.com/AColyer13/Swim-Teaching-Website',
  },
];
