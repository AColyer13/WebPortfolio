interface Skill {
  name: string;
  icon: string;
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

export const skills: Skill[] = [
  { name: 'JavaScript', icon: 'fab fa-js' },
  { name: 'HTML5', icon: 'fab fa-html5' },
  { name: 'CSS3', icon: 'fab fa-css3-alt' },
  { name: 'React', icon: 'fab fa-react' },
  { name: 'Vite', icon: 'fas fa-bolt' },
  { name: 'React Router', icon: 'fas fa-route' },
  { name: 'Node.js', icon: 'fab fa-node-js' },
  { name: 'Express.js', icon: 'fas fa-server' },
  { name: 'REST APIs', icon: 'fas fa-plug' },
  { name: 'Firebase (Auth, Firestore)', icon: 'fas fa-fire' },
  { name: 'NoSQL', icon: 'fas fa-database' },
  { name: 'OAuth / JWT', icon: 'fas fa-key' },
  { name: 'Jest', icon: 'fas fa-vial' },
  { name: 'Playwright', icon: 'fas fa-play-circle' },
  { name: 'Git', icon: 'fab fa-git-alt' },
  { name: 'GitHub Actions', icon: 'fab fa-github' },
  { name: 'Docker', icon: 'fab fa-docker' },
  { name: 'Postman', icon: 'fas fa-paper-plane' },
  { name: 'npm', icon: 'fab fa-npm' },
  { name: 'TypeScript', icon: 'fas fa-i-cursor' },
  { name: 'Python', icon: 'fab fa-python' },
  { name: 'Java', icon: 'fab fa-java' },
  { name: 'Flask', icon: 'fas fa-flask' },
  { name: 'FastAPI', icon: 'fas fa-bolt' },
  { name: 'Django', icon: 'fas fa-diagram-project' },
  { name: 'Gemini', icon: 'fab fa-google' },
  { name: 'xAI', icon: 'fas fa-rocket' },
  { name: 'OpenAI', icon: 'fas fa-brain' },
  { name: 'Claude', icon: 'fas fa-feather-pointed' },
  { name: 'OpenClaw', icon: 'fas fa-shrimp' },
  { name: 'DynamoDB', icon: 'fas fa-database' },
  { name: 'PostgreSQL', icon: 'fas fa-database' },
  { name: 'Redis', icon: 'R' },
  { name: 'OWASP / AppSec', icon: 'fas fa-shield-alt' },
  { name: 'Secrets & IAM', icon: 'fas fa-user-shield' },
  { name: 'OpenAPI', icon: 'fas fa-file-code' },
  { name: 'Zod', icon: 'fas fa-list-check' },
  { name: 'React Query', icon: 'fas fa-arrows-rotate' },
  { name: 'PWA', icon: 'fas fa-mobile-screen' },
];

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
