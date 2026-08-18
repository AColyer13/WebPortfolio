export interface SkillBlock {
  title: string
  skills: string[]
}

export interface TimelineItem {
  year: string
  title: string
  company: string
  description: string
}

export interface Project {
  id: number
  title: string
  tech: string
  imageUrl: string
  liveUrl?: string
  githubUrl: string
  featured?: boolean
}

export const skillBlocks: SkillBlock[] = [
  {
    title: 'Frontend & Mobile',
    skills: [
      'TypeScript',
      'React 19',
      'Next.js',
      'React Native',
      'Tailwind CSS',
      'Vite',
      'HTML5 / CSS3',
    ],
  },
  {
    title: 'Backend & APIs',
    skills: [
      'Node.js',
      'Express',
      'Python',
      'FastAPI',
      'Flask',
      'REST APIs',
      'WebSockets',
    ],
  },
  {
    title: 'AI, Data & Security',
    skills: [
      'Google Gemini',
      'LangChain / LangGraph',
      'RAG Pipelines',
      'PostgreSQL',
      'Prisma ORM',
      'Firebase / Firestore',
      'OAuth 2.0 / NextAuth',
    ],
  },
  {
    title: 'DevOps & Testing',
    skills: [
      'Docker',
      'AWS',
      'Google Cloud',
      'GitHub Actions CI/CD',
      'Vitest',
      'Playwright',
      'Git',
    ],
  },
]

export const timeline: TimelineItem[] = [
  {
    year: 'Present',
    title: 'AI Search Quality Evaluator',
    company: 'Activus Connect – Remote',
    description:
      'Evaluating user queries to identify severity and factuality issues in AI outputs, delivering feedback that improves model performance for Google Gemini.',
  },
  {
    year: '2022',
    title: 'Account Executive',
    company: 'Citizen Observer – St. Paul, MN',
    description:
      'Led adoption of the tip411 platform across six municipalities through 100+ live product demonstrations, including travel to Dallas, TX and San Diego, CA.',
  },
  {
    year: '2021',
    title: 'Sales Development Representative',
    company: 'Digital River – Minnetonka, MN',
    description:
      'Secured a $500,000+ deal with gaming client Rec Room through targeted outreach and executive meetings.',
  },
  {
    year: '2020',
    title: 'Account Executive',
    company: 'INRY – Eden Prairie, MN',
    description:
      'Managed a $400,000+ pipeline through the full sales cycle. Built relationships with HR and IT stakeholders to position ServiceNow solutions strategically.',
  },
  {
    year: '2019',
    title: 'Business Development Representative',
    company: 'Epicor Software – St. Louis Park, MN',
    description:
      'Qualified $3.7M in opportunities and added $1.1M to pipeline for ERP solutions in manufacturing. Received Excellence Award for consistent performance.',
  },
]

export const projects: Project[] = [
  {
    id: 1,
    title: 'MissionCtrl',
    tech: 'React, Firebase, Firestore, Gemini AI',
    imageUrl: 'images/missionctrl-tr41-groundctrl-new.png',
    liveUrl: 'https://missionctrl.org',
    githubUrl: 'https://github.com/growthwithcoding/TR41-GroundCTRL',
    featured: true,
  },
  {
    id: 2,
    title: 'Valley Forge Automotive',
    tech: 'React, Firebase, Firestore',
    imageUrl: 'images/mechanicapiicon-new.png',
    liveUrl: 'https://valleyforgeautomotive.org',
    githubUrl:
      'https://github.com/AColyer13/Mechanic-API---Copy-with-Testing-and-Documentation',
    featured: true,
  },
  {
    id: 3,
    title: 'Legal Eagle Project',
    tech: 'Next.js, Prisma, AI SDK, NextAuth',
    imageUrl: 'images/legaleagleproject-new.png',
    liveUrl: 'https://legaleagleproject-mu.vercel.app',
    githubUrl: 'https://github.com/AColyer13/legaleagleproject',
    featured: true,
  },
  {
    id: 4,
    title: 'Writing Consultant',
    tech: 'Python, Flask',
    imageUrl: 'images/writing-consultant.png',
    liveUrl: 'https://acolyer13.github.io/writing_consultant/',
    githubUrl: 'https://github.com/AColyer13/writing_consultant',
  },
  {
    id: 5,
    title: 'Event Center Website',
    tech: 'HTML, CSS, JS, PWA',
    imageUrl: 'images/Eventcentericon-new.png',
    liveUrl: 'https://acolyer13.github.io/Event-Center-Website-v2/',
    githubUrl: 'https://github.com/AColyer13/Event-Center-Website-v2',
  },
  {
    id: 6,
    title: 'Dream Vacation App',
    tech: 'React, Vite, Hono, LangGraph, Mapbox',
    imageUrl: 'images/dream-vacation-app.png',
    githubUrl: 'https://github.com/AColyer13/DreamVacationApp',
  },
  {
    id: 7,
    title: 'Swimming Website',
    tech: 'HTML, CSS, JS, PWA',
    imageUrl: 'images/Swimmingsiteicon-new.png',
    liveUrl: 'https://acolyer13.github.io/Swim-Teaching-Website/',
    githubUrl: 'https://github.com/AColyer13/Swim-Teaching-Website',
  },
  {
    id: 8,
    title: 'Stardust',
    tech: 'Next.js, FastAPI, Postgres, PWA',
    imageUrl: 'images/stardust-new.png',
    liveUrl: 'https://acolyer13.github.io/Stardust/',
    githubUrl: 'https://github.com/AColyer13/Stardust',
  },
  {
    id: 9,
    title: 'The Office',
    tech: 'Node.js, Express, Three.js',
    imageUrl: 'images/the-office.png',
    githubUrl: 'https://github.com/AColyer13/the-office',
  },
  {
    id: 10,
    title: 'Immaculate Draft',
    tech: 'HTML, CSS, JavaScript',
    imageUrl: 'images/immaculate-grid-copy-new.png',
    liveUrl: 'https://acolyer13.github.io/Immaculate-Grid-Copy/',
    githubUrl: 'https://github.com/AColyer13/Immaculate-Grid-Copy',
  },
  {
    id: 11,
    title: 'UFO Abductor',
    tech: 'Three.js, WebGL, Vite',
    imageUrl: 'images/ufo-abductor-new.png',
    liveUrl: 'https://acolyer13.github.io/moovellous/',
    githubUrl: 'https://github.com/AColyer13/moovellous',
  },
  {
    id: 12,
    title: 'Minnesota Snowmobile',
    tech: 'HTML, Canvas, JavaScript',
    imageUrl: 'images/minnesota-snowmobile-new.png',
    liveUrl: 'https://acolyer13.github.io/minnesota-snowmobile/',
    githubUrl: 'https://github.com/AColyer13/minnesota-snowmobile',
  },
]

export const featuredProjects = projects.filter((project) => project.featured)

