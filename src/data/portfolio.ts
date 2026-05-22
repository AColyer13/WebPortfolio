export interface Skill {
  name: string;
  icon: string;
}

export interface SkillBlock {
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
    skills: [
      { name: 'Vite', icon: 'fas fa-bolt' },
      { name: 'React', icon: 'fab fa-react' },
      { name: 'React Router', icon: 'fas fa-route' },
      { name: 'React Query', icon: 'fas fa-arrows-rotate' },
      { name: 'JavaScript', icon: 'fab fa-js' },
      { name: 'Python', icon: 'fab fa-python' },
      { name: 'TypeScript', icon: 'fas fa-i-cursor' },
      { name: 'HTML5', icon: 'fab fa-html5' },
      { name: 'CSS3', icon: 'fab fa-css3-alt' },
      { name: 'Tailwind CSS', icon: 'fas fa-wind' },
      { name: 'npm', icon: 'fab fa-npm' },
      { name: 'Node.js', icon: 'fab fa-node-js' },
      { name: 'Express.js', icon: 'fas fa-server' },
      { name: 'REST APIs', icon: 'fas fa-plug' },
      { name: 'SPA', icon: 'fas fa-window-maximize' },
      { name: 'PWA', icon: 'fas fa-mobile-screen' },
      { name: 'React Hook Form', icon: 'fas fa-clipboard-list' },
      { name: 'Framer Motion', icon: 'fas fa-film' },
      { name: 'PostCSS', icon: 'fas fa-code' },
      { name: 'Java', icon: 'fab fa-java' },
      { name: 'Flask', icon: 'fas fa-flask' },
      { name: 'FastAPI', icon: 'fas fa-bolt' },
      { name: 'Django', icon: 'fas fa-diagram-project' },
    ],
  },
  {
    skills: [
      { name: 'Radix UI', icon: 'fas fa-layer-group' },
      { name: 'shadcn/ui', icon: 'fas fa-cubes' },
      { name: 'Lucide', icon: 'fas fa-icons' },
      { name: 'Three.js', icon: 'fas fa-cube' },
      { name: 'React Three Fiber', icon: 'fas fa-cubes' },
      { name: 'WebGL', icon: 'fas fa-gamepad' },
      { name: 'D3.js', icon: 'fas fa-chart-line' },
      { name: 'Recharts', icon: 'fas fa-chart-bar' },
      { name: 'React Markdown', icon: 'fab fa-markdown' },
    ],
  },
  {
    skills: [
      { name: 'Firebase', icon: 'fas fa-fire' },
      { name: 'Firebase Auth', icon: 'fas fa-lock' },
      { name: 'Firestore', icon: 'fas fa-database' },
      { name: 'SQL', icon: 'fas fa-table' },
      { name: 'Socket.IO', icon: 'fas fa-satellite-dish' },
      { name: 'WebSockets', icon: 'fas fa-exchange-alt' },
      { name: 'JWT', icon: 'fas fa-key' },
      { name: 'OAuth', icon: 'fas fa-right-to-bracket' },
      { name: 'Zod', icon: 'fas fa-list-check' },
      { name: 'UUID', icon: 'fas fa-fingerprint' },
    ],
  },
  {
    skills: [
      { name: 'OpenAPI', icon: 'fas fa-file-code' },
      { name: 'Swagger', icon: 'fas fa-book-open' },
      { name: 'Postman', icon: 'fas fa-paper-plane' },
      { name: 'Axios', icon: 'fas fa-arrows-up-down' },
      { name: 'CORS', icon: 'fas fa-shield' },
      { name: 'SMTP / Email APIs', icon: 'fas fa-envelope' },
    ],
  },
  {
    skills: [
      { name: 'Jest', icon: 'fas fa-vial' },
      { name: 'Supertest', icon: 'fas fa-flask' },
      { name: 'Vitest', icon: 'fas fa-check-double' },
      { name: 'Playwright', icon: 'fas fa-play-circle' },
      { name: 'E2E Testing', icon: 'fas fa-route' },
      { name: 'Lighthouse', icon: 'fas fa-lightbulb' },
      { name: 'Core Web Vitals', icon: 'fas fa-gauge-high' },
      { name: 'axe', icon: 'fas fa-universal-access' },
      { name: 'CodeQL', icon: 'fas fa-code-branch' },
      { name: 'npm audit', icon: 'fab fa-npm' },
      { name: 'Firebase Emulators', icon: 'fas fa-flask-vial' },
    ],
  },
  {
    skills: [
      { name: 'Git', icon: 'fab fa-git-alt' },
      { name: 'GitHub Actions', icon: 'fab fa-github' },
      { name: 'Docker', icon: 'fab fa-docker' },
      { name: 'Firebase Hosting', icon: 'fas fa-cloud' },
      { name: 'Firebase App Hosting', icon: 'fas fa-cloud-arrow-up' },
      { name: 'Google Cloud', icon: 'fab fa-google' },
      { name: 'AWS', icon: 'fab fa-aws' },
      { name: 'Cloud Run', icon: 'fas fa-person-running' },
      { name: 'Secret Manager', icon: 'fas fa-user-secret' },
      { name: 'Secrets & IAM', icon: 'fas fa-user-shield' },
      { name: 'CI/CD', icon: 'fas fa-code-branch' },
    ],
  },
  {
    skills: [
      { name: 'OWASP / AppSec', icon: 'fas fa-shield-alt' },
      { name: 'Helmet', icon: 'fas fa-hard-hat' },
      { name: 'CSP', icon: 'fas fa-shield-halved' },
      { name: 'Rate Limiting', icon: 'fas fa-gauge' },
      { name: 'Repository Pattern', icon: 'fas fa-folder-tree' },
      { name: 'Middleware', icon: 'fas fa-filter' },
      { name: 'Error Handling', icon: 'fas fa-triangle-exclamation' },
    ],
  },
  {
    skills: [
      { name: 'Gemini', icon: 'fab fa-google' },
      { name: 'OpenAI', icon: 'fas fa-brain' },
      { name: 'Claude', icon: 'fas fa-feather-pointed' },
      { name: 'xAI', icon: 'fas fa-rocket' },
      { name: 'Prompt Engineering', icon: 'fas fa-wand-magic-sparkles' },
      { name: 'AI Rate Limiting', icon: 'fas fa-robot' },
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
