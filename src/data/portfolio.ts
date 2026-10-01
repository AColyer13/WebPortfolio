export interface SkillBlock {
  title: string
  skills: string[]
}

export interface TimelineItem {
  /** Omit to show only `end` (e.g. "Present"). */
  start?: string
  end: string
  title: string
  company: string
  description: string
}

export interface Project {
  id: number
  title: string
  tech: string
  /** One or two sentences: what it is, then the most interesting thing about how it works. */
  description: string
  imageUrl: string
  liveUrl?: string
  githubUrl: string
  featured?: boolean
}

export const skillBlocks: SkillBlock[] = [
  {
    title: 'Frontend Engineering',
    skills: [
      'TypeScript',
      'React 19',
      'Next.js',
      'Vite',
      'Tailwind CSS',
      'Radix UI',
      'Framer Motion',
      'React Hook Form',
      'Zustand',
      'TanStack Query',
      'Axios',
      'Three.js',
      'HTML5 / CSS3',
    ],
  },
  {
    title: 'Mobile Development',
    skills: [
      'React Native',
      'Expo & EAS',
      'Flutter',
      'Native iOS',
      'Native Android',
      'React Native Reanimated & Skia',
      'Mobile Architecture',
      'Mobile Release Engineering',
      'Offline-First & Sync',
    ],
  },
  {
    title: 'Backend & API Architecture',
    skills: [
      'Node.js',
      'Express',
      'Hono',
      'FastAPI',
      'Flask',
      'REST API Design',
      'OpenAPI / Swagger',
      'WebSockets / Socket.IO',
      'Zod',
    ],
  },
  {
    title: 'Data, Auth & Security',
    skills: [
      'PostgreSQL',
      'Prisma ORM',
      'SQLModel',
      'DynamoDB',
      'Amazon RDS',
      'Supabase',
      'Firebase / Firestore',
      'Redis',
      'DragonflyDB',
      'Valkey',
      'OAuth 2.0 & Google Sign-In',
      'Auth.js (NextAuth)',
      'JWT & Refresh Tokens',
      'Passwordless Auth',
      'RBAC & Firestore Rules',
      'Rate Limiting',
      'Helmet & CSP',
      'OWASP / AppSec',
      'PII Redaction (Presidio)',
    ],
  },
  {
    title: 'AI / ML Engineering',
    skills: [
      'Claude API',
      'Google Gemini',
      'LangChain',
      'LangGraph',
      'RAG Pipelines',
      'ChromaDB',
      'Prompt Engineering',
      'AI Agent Development',
      'Ollama',
      'Local LLMs',
      'MCP',
      'Cursor',
      'Claude Code',
      'faster-whisper',
    ],
  },
  {
    title: 'Cloud, DevOps & Infrastructure',
    skills: [
      'Docker',
      'AWS',
      'Google Cloud',
      'Microsoft Azure',
      'Cloud Run',
      'Firebase Hosting',
      'Cloudflare',
      'Vercel',
      'Render',
      'CI/CD (GitHub Actions)',
      'Secrets & IAM',
      'Git & Monorepos',
    ],
  },
  {
    title: 'Data Science & Analytics',
    skills: [
      'Python',
      'Pandas',
      'Statistical Analysis',
      'PyTorch',
      'LoRA',
      'PEFT',
      'Matplotlib',
      'Seaborn',
    ],
  },
  {
    title: 'Quality, Testing & Observability',
    skills: [
      'Vitest',
      'Jest',
      'pytest',
      'Playwright',
      'Lighthouse CI',
      'axe Accessibility',
      'Supertest',
      'Mutation Testing',
      'Property-Based Testing',
      'Sentry',
      'OpenTelemetry',
      'Pino Logging',
      'Web Vitals',
    ],
  },
]

export const timeline: TimelineItem[] = [
  {
    end: 'Present',
    title: 'AI Generalist Expert',
    company: 'Mercor – Remote',
    description: 'Helps a top AI lab improve its models.',
  },
  {
    start: 'Nov 2025',
    end: 'Jun 2026',
    title: 'AI Search Quality Evaluator',
    company: 'Activus Connect (Tech Mahindra) – Remote',
    description:
      'Scored LLM search answers against Google quality rubrics. Flagged hallucinations, unsupported claims, and weak sourcing. Wrote structured error notes and pointed models to better sources when answers were wrong.',
  },
  {
    start: 'Sep 2022',
    end: 'Aug 2024',
    title: 'Account Executive',
    company: 'Citizen Observer – St. Paul, MN',
    description:
      'Sold the tip411 public-safety platform to cities, counties, and law enforcement agencies. Ran 100+ live product demos, then followed up with police chiefs, mayors, and city councils, including trips to San Diego and Dallas.',
  },
  {
    start: 'Jul 2021',
    end: 'Jul 2022',
    title: 'Sales Development Representative',
    company: 'Digital River – Minnetonka, MN',
    description:
      'Built and qualified an e-commerce pipeline that helped source and close a $500K+ Rec Room contract.',
  },
  {
    start: 'Oct 2020',
    end: 'Jul 2021',
    title: 'Account Executive',
    company: 'INRY – Eden Prairie, MN',
    description:
      'Ran a $500K+ ServiceNow pipeline with VP and director-level IT and HR buyers. Submitted RFPs and walked buyers through the responses.',
  },
  {
    start: 'May 2019',
    end: 'Jun 2020',
    title: 'Business Development Representative',
    company: 'Epicor Software – St. Louis Park, MN',
    description:
      'Built an ERP pipeline with $1.1M accepted by account executives as qualified. Received an Excellence Award from the CEO.',
  },
]

export const projects: Project[] = [
  {
    id: 1,
    title: 'MissionCtrl',
    tech: 'React, Firebase, Firestore, Gemini AI',
    description:
      'Satellite mission simulator. Plots satellite positions and orbital paths on a 3D globe from TLE data as the mission clock advances, and a Gemini flight assistant answers questions about the current orbit and upcoming burns.',
    imageUrl: 'images/missionctrl-tr41-groundctrl-new.png',
    liveUrl: 'https://missionctrl.org',
    githubUrl: 'https://github.com/growthwithcoding/TR41-GroundCTRL',
    featured: true,
  },
  {
    id: 2,
    title: 'Valley Forge Automotive',
    tech: 'React, Firebase, Firestore',
    description:
      'Shop management system for an auto repair shop: service records, parts inventory, and scheduling. Firestore role rules keep customers and staff out of each other\'s records while admins see everything.',
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
    description:
      'Practice tools for estate attorneys: client files, filing deadlines, and a per-case change log. The built-in assistant answers only from app data, after names and other sensitive details are stripped.',
    imageUrl: 'images/legaleagleproject-new.png',
    liveUrl: 'https://legaleagleproject-mu.vercel.app',
    githubUrl: 'https://github.com/AColyer13/legaleagleproject',
    featured: true,
  },
  {
    id: 4,
    title: 'Writing Consultant',
    tech: 'Python, Flask',
    description:
      'AI writing assistant where one model drafts, a second critiques, and the first rewrites. Runs as a local Flask app, or as a browser-only build where your API key never leaves the page.',
    imageUrl: 'images/writing-consultant.png',
    liveUrl: 'https://acolyer13.github.io/writing_consultant/',
    githubUrl: 'https://github.com/AColyer13/writing_consultant',
  },
  {
    id: 5,
    title: 'Event Center Website',
    tech: 'HTML, CSS, JS, PWA',
    description:
      'Website for an Edina event venue covering tournaments, live music, and private bookings. Five static pages with no build step and no runtime dependencies, installable as a PWA.',
    imageUrl: 'images/Eventcentericon-new.png',
    liveUrl: 'https://acolyer13.github.io/Event-Center-Website-v2/',
    githubUrl: 'https://github.com/AColyer13/Event-Center-Website-v2',
  },
  {
    id: 6,
    title: 'Dream Vacation App',
    tech: 'React, Vite, Hono, LangGraph, Mapbox',
    description:
      'Location-aware AI travel agent. Detects where you are and suggests drivable getaways or fly-away trips, with checked drive times, weather forecasts, maps, and day-by-day itineraries.',
    imageUrl: 'images/dream-vacation-app.png',
    githubUrl: 'https://github.com/AColyer13/DreamVacationApp',
  },
  {
    id: 7,
    title: 'Swimming Website',
    tech: 'HTML, CSS, JS, PWA',
    description:
      'Swim lesson guide that teaches one skill at a time: water safety, body position, kick, arms, timing, then breath, before moving on to the four competitive strokes.',
    imageUrl: 'images/Swimmingsiteicon-new.png',
    liveUrl: 'https://acolyer13.github.io/Swim-Teaching-Website/',
    githubUrl: 'https://github.com/AColyer13/Swim-Teaching-Website',
  },
  {
    id: 8,
    title: 'Stardust',
    tech: 'Next.js, FastAPI, Postgres, PWA',
    description:
      'Guided life storytelling for families: answer prompts, record interviews, and write letters to be opened later. Transcription runs faster-whisper on the server, so audio never goes to a hosted AI service.',
    imageUrl: 'images/stardust-new.png',
    liveUrl: 'https://acolyer13.github.io/Stardust/',
    githubUrl: 'https://github.com/AColyer13/Stardust',
  },
  {
    id: 9,
    title: 'The Office',
    tech: 'Node.js, Express, Three.js',
    description:
      'Walk a 3D Dunder Mifflin Scranton in first person and chat with the characters. Each one is played by an AI model, local through Ollama or any OpenAI-compatible API, prompted to stay in character.',
    imageUrl: 'images/the-office.png',
    githubUrl: 'https://github.com/AColyer13/the-office',
  },
  {
    id: 10,
    title: 'Immaculate Draft',
    tech: 'HTML, CSS, JavaScript',
    description:
      'Baseball trivia game: draft a 10-man lineup from MLB and Negro Leagues history. Answer the trivia question to pick from Hall of Famers; miss it and you choose from non-HOF starters.',
    imageUrl: 'images/immaculate-grid-copy-new.png',
    liveUrl: 'https://acolyer13.github.io/Immaculate-Grid-Copy/',
    githubUrl: 'https://github.com/AColyer13/Immaculate-Grid-Copy',
  },
  {
    id: 11,
    title: 'UFO Abductor',
    tech: 'Three.js, WebGL, Vite',
    description:
      'Claymation-style 3D arcade game. Fly a saucer, beam up cows, dodge farmers, and beat the clock. Every cow you abduct charges your boost.',
    imageUrl: 'images/ufo-abductor-new.png',
    liveUrl: 'https://acolyer13.github.io/moovellous/',
    githubUrl: 'https://github.com/AColyer13/moovellous',
  },
  {
    id: 12,
    title: 'Minnesota Snowmobile',
    tech: 'Three.js, WebGL, JavaScript',
    description:
      'SSX-style 3D snowmobile racer on Minnesota trails like Spirit Mountain and Lake Bemidji. Race five rivals, chain tricks off big kickers to fill your boost, and find the shortcuts.',
    imageUrl: 'images/minnesota-snowmobile-new.png',
    liveUrl: 'https://acolyer13.github.io/minnesota-snowmobile/',
    githubUrl: 'https://github.com/AColyer13/minnesota-snowmobile',
  },
]

export const featuredProjects = projects.filter((project) => project.featured)

