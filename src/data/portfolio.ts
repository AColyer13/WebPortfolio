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
      { name: 'JavaScript', icon: 'fab fa-js' },
      { name: 'PWA', icon: 'images/pwa.svg' },
      { name: 'TypeScript', icon: 'images/typescript.svg' },
      { name: 'React', icon: 'images/react.svg' },
      { name: 'Vite', icon: 'images/vite.svg' },
      { name: 'React Router', icon: 'images/reactrouter.svg' },
      { name: 'React Query', icon: 'images/tanstack.svg' },
      { name: 'Tailwind CSS', icon: 'images/tailwindcss.svg' },
      { name: 'Node.js', icon: 'fab fa-node-js' },
      { name: 'Express.js', icon: 'images/express.svg' },
      { name: 'React Hook Form', icon: 'images/reacthookform.svg' },
      { name: 'Framer Motion', icon: 'images/framer.svg' },
      { name: 'React Native', icon: 'images/react-native.svg' },
      { name: 'Flutter', icon: 'images/flutter.svg' },
      { name: 'Python', icon: 'fab fa-python' },
      { name: 'FastAPI', icon: 'images/fastapi.svg' },
      { name: 'Flask', icon: 'images/flask.svg' },
      { name: 'Java', icon: 'fab fa-java' },
    ],
  },
  {
    title: 'UI / 3D / content',
    skills: [
      { name: 'Radix UI', icon: 'images/radixui.svg' },
      { name: 'Lucide', icon: 'images/lucide.svg' },
      { name: 'Recharts', icon: 'images/recharts.svg' },
      { name: 'React Markdown', icon: 'fab fa-markdown' },
      { name: 'Three.js & R3F', icon: 'images/threedotjs.svg' },
      { name: 'Disco UI', icon: 'fas fa-compact-disc' },
    ],
  },
  {
    title: 'Data, auth, realtime',
    skills: [
      { name: 'SQL', icon: 'fas fa-table' },
      { name: 'PostgreSQL', icon: 'images/postgresql.svg' },
      { name: 'Amazon RDS', icon: 'images/amazon-rds.svg' },
      { name: 'DynamoDB', icon: 'images/dynamodb.svg' },
      { name: 'Firebase', icon: 'images/firebase.svg' },
      { name: 'AWS Amplify', icon: 'images/aws-amplify.svg' },
      { name: 'Firestore', icon: 'images/firestore-hosting.svg' },
      { name: 'Cognito', icon: 'images/cognito.svg' },
      { name: 'JWT & OAuth', icon: 'fas fa-key' },
      { name: 'Zod', icon: 'images/zod.svg' },
      { name: 'Amazon API Gateway', icon: 'images/api-gateway.svg' },
      { name: 'Socket.IO', icon: 'images/socketdotio.svg' },
    ],
  },
  {
    title: 'API, docs, integration',
    skills: [
      { name: 'Axios', icon: 'images/axios.svg' },
      { name: 'OpenAPI', icon: 'images/swagger.svg' },
      { name: 'Postman', icon: 'images/postman.svg' },
      { name: 'SMTP / Email APIs', icon: 'fas fa-envelope' },
    ],
  },
  {
    title: 'Testing & quality',
    skills: [
      { name: 'Vitest', icon: 'images/vitest.svg' },
      { name: 'Jest', icon: 'images/jest.svg' },
      { name: 'Playwright', icon: 'images/playwright.svg' },
      { name: 'Lighthouse', icon: 'fas fa-lightbulb' },
      { name: 'axe', icon: 'fas fa-universal-access' },
      { name: 'Supertest', icon: 'images/supertest.svg' },
      { name: 'Firebase Emulators', icon: 'fas fa-flask-vial' },
    ],
  },
  {
    title: 'DevOps & cloud',
    skills: [
      { name: 'Git', icon: 'fab fa-git-alt' },
      { name: 'GitHub Actions', icon: 'fab fa-github' },
      { name: 'CI/CD', icon: 'fas fa-code-branch' },
      { name: 'Docker', icon: 'fab fa-docker' },
      { name: 'Google Cloud', icon: 'images/googlecloud.svg' },
      { name: 'AWS', icon: 'fab fa-aws' },
      { name: 'Cloud Run', icon: 'images/cloudrun.svg' },
      { name: 'Secrets & IAM', icon: 'fas fa-user-shield' },
    ],
  },
  {
    title: 'Security & architecture',
    skills: [
      { name: 'OWASP / AppSec', icon: 'images/owasp.svg' },
      { name: 'CSP', icon: 'fas fa-shield-halved' },
      { name: 'Helmet', icon: 'fas fa-hard-hat' },
      { name: 'Rate Limiting', icon: 'fas fa-sliders' },
    ],
  },
  {
    title: 'AI',
    skills: [
      { name: 'Gemini API', icon: 'images/googlegemini.svg' },
      { name: 'Cursor', icon: 'images/cursor.svg' },
      { name: 'Claude Code', icon: 'images/claude-code.svg' },
      { name: 'Prompt Engineering', icon: 'fas fa-wand-magic-sparkles' },
      { name: 'AI Agent Development', icon: 'fas fa-robot' },
      { name: 'AI Rate Limiting', icon: 'fas fa-gauge-high' },
      { name: 'Local LLMs', icon: 'fas fa-microchip' },
      { name: 'OpenClaw', icon: 'images/openclaw.svg' },
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
