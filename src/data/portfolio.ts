export interface Skill {
  name: string;
  icon: string;
  /** Short, scannable explanation of what the technology does. */
  description: string;
  /** One-line professional application — when/why I reach for it in client work. */
  application: string;
}

export interface SkillBlock {
  title: string;
  /** One-line summary of the discipline for the block header. */
  summary: string;
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
  imageWidth: number;
  imageHeight: number;
  liveUrl?: string;
  githubUrl: string;
  featured?: boolean;
}

/**
 * Skills displayed top-to-bottom in the Skills section.
 * Each block is a top-level engineering discipline (not a stack list) so the
 * page reads like a senior engineer's competence map, not a tooling inventory.
 */
export const skillBlocks: SkillBlock[] = [
  {
    title: 'Frontend Engineering',
    summary: 'Production user interfaces for the web: fast, accessible, animated.',
    skills: [
      {
        name: 'TypeScript',
        icon: 'images/typescript.svg',
        description:
          'JavaScript with static types bolted on. Catches shape mismatches at the editor and in CI before anyone hits save.',
        application:
          'Default language across all UI work. tsc and ESLint run on every PR, so the boundary between "compiles on my machine" and "ships" stays small.',
      },
      {
        name: 'React 19',
        icon: 'images/react.svg',
        description:
          'Component model with concurrent rendering, Suspense, server components, plus the newer use hook and Actions API.',
        application:
          'Primary UI framework. Composable component systems, Suspense-driven data flows, and the Actions/useTransition patterns that shipped in client work this year.',
      },
      {
        name: 'Next.js 16',
        icon: 'images/nextdotjs.svg',
        description:
          'Full-stack React framework. File-based routing, RSC, server actions, edge runtime, and PPR caching layered on top.',
        application:
          'Chosen for SEO-critical dashboards and SSR apps where TTFB matters. Wires up cleanly with Prisma, NextAuth, and Vercel deploys.',
      },
      {
        name: 'Vite 7',
        icon: 'images/vite.svg',
        description:
          'Native-ESM dev server over a single persistent connection, with Rollup-driven production builds.',
        application:
          'Default build pipeline for SPAs and micro-frontends. The Rolldown bundler shaves 800ms off the typical prod build, and library-mode authoring cuts the dev loop to under a second — the speed a multi-developer team actually needs to ship.',
      },
      {
        name: 'Tailwind CSS 4',
        icon: 'images/tailwindcss.svg',
        description:
          'Utility-first CSS with v4 CSS-first config, container queries, and zero runtime class generation.',
        application:
          'Default for design-system-driven UIs. Tokens live in CSS variables and map to OKLCH so themes stay colour-accurate.',
      },
      {
        name: 'Radix UI',
        icon: 'images/radixui.svg',
        description:
          'Unstyled, accessible primitives (dialog, dropdown, popover) with WAI-ARIA behaviour built in.',
        application:
          'We use it because focus traps and keyboard navigation come for free. Every dialog, menu, and toast in a client app lands on top of a Radix primitive, so the keyboard story stays consistent without me writing it twice.',
      },
      {
        name: 'Framer Motion',
        icon: 'images/framer.svg',
        description:
          'Declarative React animation library with physics-based springs, layout animations, and gesture support.',
        application:
          'Owned the motion strategy on client work: hero choreography, route transitions, shared-element flows. Everything sits behind `useReducedMotion`, so the polish degrades for users who opt out instead of just running.',
      },
      {
        name: 'React Hook Form',
        icon: 'images/reacthookform.svg',
        description:
          'Performant form library using uncontrolled refs to avoid re-renders, with first-class Zod resolver support.',
        application:
          'I reach for this the moment a form gets past three fields, paired with Zod so every input has the same shape downstream. Stops the "controlled-component-all-the-things" re-render death-spiral before it starts.',
      },
      {
        name: 'Zustand',
        icon: 'images/zustand.svg',
        description:
          'Minimal hook-based state store with selector subscriptions, middleware, and near-zero boilerplate.',
        application:
          'Replaces Redux for client-only state where the team would otherwise be paying for ceremony. The Dream Vacation trip planner stores the itinerary graph, undo stack, and map viewport behind one typed store.',
      },
      {
        name: 'TanStack Query',
        icon: 'images/tanstack.svg',
        description:
          'Asynchronous state manager for server data. Caching, dedupe, optimistic updates, background refetch.',
        application:
          'Every remote fetch in production React code lands here. Cache-invalidation contracts (per-resource query keys, exact vs. prefix invalidation) get reviewed line by line in PRs because a wrong invalidation is the kind of bug that doesn\'t reproduce in staging.',
      },
    ],
  },
  {
    title: 'Mobile Development',
    summary: 'Cross-platform and native mobile: release engineering, performance budgets, production app stores.',
    skills: [
      {
        name: 'React Native',
        icon: 'images/react-native.svg',
        description:
          'Cross-platform native-rendering framework with Fabric, TurboModules, Hermes, and synchronous JSI bindings instead of the legacy bridge.',
        application:
          'Default for cross-platform clients that share a TypeScript codebase with the web app. Native modules ship in Swift and Kotlin when the JS thread can\'t cut it.',
      },
      {
        name: 'Expo & EAS',
        icon: 'images/expo.svg',
        description:
          'Managed React Native platform with EAS Build/Submit/Update, config plugins, dev clients, and OTA JS bundles.',
        application:
          'Used for pre-production and over-the-air update tracks. EAS Build produces signed iOS/Android binaries for CI-driven TestFlight and Play internal releases, which removes the Mac fleet problem.',
      },
      {
        name: 'Flutter',
        icon: 'images/flutter.svg',
        description:
          'Dart-based UI toolkit that compiles to native ARM. Impeller/Skia rendering, isolates for concurrency, an expressive widget tree.',
        application:
          'Reached for design-heavy, brand-sensitive mobile surfaces where pixel-perfect motion and 120fps rendering are non-negotiable. Riverpod for state, go_router for typed navigation.',
      },
      {
        name: 'Native iOS',
        icon: 'images/ios-swift.svg',
        description:
          'Apple platform stack: Swift 5.10, SwiftUI, UIKit interop, Combine, structured concurrency, and actors.',
        application:
          'Used for the platform-specific surface of a cross-platform app, App Clip and Widget extensions, and any feature where the RN bridge cost won\'t do. Auth flows, ARKit, Apple Pay.',
      },
      {
        name: 'Native Android',
        icon: 'images/android.svg',
        description:
          'Modern Android stack: Kotlin 2.0, Jetpack Compose, Coroutines/Flow, Room, Hilt DI, and KMP for shared business logic.',
        application:
          'Chosen for Android-only surfaces and KMP-shared modules. Compose state hoisting and snapshot-based animations give me SwiftUI\'s pace without the Apple-only constraint.',
      },
      {
        name: 'React Native Reanimated & Skia',
        icon: 'orbit',
        description:
          'UI-thread animations via worklets. Skia GPU rendering for complex vectors, gradients, and 60fps gestures.',
        application:
          'It is what keeps the scrubbers on the trip-planner map at 60fps when the JS thread falls behind. Layout transitions and shared-element transitions handle navigation polish without me hand-tuning anything.',
      },
      {
        name: 'Mobile Architecture',
        icon: 'images/arch-hexagon.svg',
        description:
          'Cross-cutting concerns: monorepo module boundaries, feature flagging, dependency injection, navigation graphs, typed contracts between native and JS.',
        application:
          'The module breakdown (`features/*`, `ui/*`, `data/*`) and dependency rules came out of one too many 200-screen apps that were impossible to navigate. Navigation graphs are first-class, not a side-effect of auth state.',
      },
      {
        name: 'Mobile Release Engineering',
        icon: 'images/fastlane.svg',
        description:
          'Fastlane lanes, signing management, store metadata, phased releases, crash gating, reproducible builds.',
        application:
          'CI-driven Fastlane lanes produce signed IPAs/AABs with identities synced through match. Release-train policy gates every rollout on crash-free session percentage from the previous build.',
      },
      {
        name: 'Offline-First & Sync',
        icon: 'images/offline-sync.svg',
        description:
          'Local persistence (SQLite/WatermelonDB/Realm), conflict resolution (CRDTs, last-writer-wins with vector clocks), background sync, queue replay.',
        application:
          'Default architecture for field-tool apps. The offline write log replays on reconnect with idempotency keys, so retries never produce duplicates or lose updates.',
      },
    ],
  },
  {
    title: 'Backend & API Architecture',
    summary: 'Server runtimes, REST and streaming surfaces, contracts, request pipelines.',
    skills: [
      {
        name: 'Node.js 22',
        icon: 'images/nodejs.svg',
        description:
          'Cross-platform JavaScript runtime with native HTTP/2, fetch, WebStreams, test runner, and built-in watch mode.',
        application:
          'Default server runtime for JavaScript services. Runs the GroundCTRL REST + Socket.IO backend on Node 22.',
      },
      {
        name: 'Express 5',
        icon: 'images/express.svg',
        description:
          'Minimal, unopinionated HTTP framework with mature middleware composition. The v5 promise-aware error pipeline routes async rejections to `next(err)` automatically.',
        application:
          'My default for new Node services. The first PR in any repo I own adds Helmet, CORS with an allowlist, and a per-route rate limit in one commit, before the first route handler lands.',
      },
      {
        name: 'Hono',
        icon: 'images/hono.svg',
        description:
          'Tiny, edge-native web framework built on Web Standards. Runs on Node, Bun, Deno, Workers.',
        application:
          'Used for the Dream Vacation app API for its small footprint and first-class streaming/edge deploy story.',
      },
      {
        name: 'FastAPI',
        icon: 'images/fastapi.svg',
        description:
          'Type-hint-driven Python framework with automatic OpenAPI generation, async support, and Pydantic validation.',
        application:
          'Stardust\'s interview API runs on FastAPI. The Pydantic schemas double as the runtime contract and the single source of truth for the auto-generated /docs page, so they can\'t drift.',
      },
      {
        name: 'Flask',
        icon: 'images/flask.svg',
        description:
          'Lightweight WSGI microframework for Python. Minimal core, pluggable extensions, a stable request lifecycle.',
        application:
          'Used for small Python services where FastAPI overhead isn\'t earned. The writing-consultant project is one of these.',
      },
      {
        name: 'REST API Design',
        icon: 'images/rest.svg',
        description:
          'Resource-oriented HTTP. Correct status codes, idempotency keys, cursor pagination, structured error envelopes, `Problem+JSON` for machine-readable failures.',
        application:
          'REST contracts are reviewed before implementation. Nouns over verbs, idempotency keys on every mutation, cursor pagination so deep lists stay stable as data grows.',
      },
      {
        name: 'OpenAPI / Swagger',
        icon: 'images/swagger.svg',
        description:
          'Vendor-neutral spec language for HTTP APIs with codegen for clients and servers and interactive docs on the side.',
        application:
          'Every server emits OpenAPI. Clients generated with openapi-typescript keep front and back end in lockstep.',
      },
      {
        name: 'Socket.IO',
        icon: 'images/socketdotio.svg',
        description:
          'Real-time bidirectional event channel over WebSockets. Auto-reconnect, rooms, acknowledgement callbacks.',
        application:
          'MissionCtrl satellite telemetry streams run over Socket.IO. Same for the event-driven leaderboard updates in flight-sim sessions — clients reconnect without me writing retry logic.',
      },
      {
        name: 'Axios',
        icon: 'images/axios.svg',
        description:
          'Promise-based HTTP client with interceptors, transformers, automatic JSON, configurable timeouts.',
        application:
          'Default fetch wrapper in Node/React code. Interceptors carry retry policy and structured error mapping.',
      },
    ],
  },
  {
    title: 'AI / ML Engineering',
    summary: 'LLM orchestration, agent design, prompt and runtime operations for production AI features.',
    skills: [
      {
        name: 'LangChain',
        icon: 'images/langchain.svg',
        description:
          'Composable framework for chaining LLMs, tools, retrievers, and memory with first-class streaming.',
        application:
          'Used in the Dream Vacation app and Stardust to compose RAG pipelines, structured output, and tool calling.',
      },
      {
        name: 'LangGraph',
        icon: 'images/langgraph.svg',
        description:
          'Graph-based orchestration layer for stateful, multi-actor agent workflows. Cycles, branching, persistence.',
        application:
          'The trip-planner agent in the Dream Vacation app is a supervisor/worker graph with checkpoints. When a sub-task stalls the supervisor retries, when a tool call outlasts its budget the graph just rolls back to the last checkpoint.',
      },
      {
        name: 'Prompt Engineering',
        icon: 'wand-magic-sparkles',
        description:
          'Discipline of structuring prompts. System context, few-shot examples, tool schema, constraint framing, eval.',
        application:
          'Every model call has a prompt template with regression tests against an eval set. Red-teamed before launch.',
      },
      {
        name: 'AI Agent Development',
        icon: 'robot',
        description:
          'Tool-using agents that plan, observe, and loop. Explicit budgets, retries, structured outputs, audit-grade telemetry.',
        application:
          'Shipped production agents for trip planning, satellite tutoring, and AI content redaction. Every agent has a per-turn tool budget, deterministic structured-output schemas, and an audit log keyed to a stable request id.',
      },
      {
        name: 'Ollama',
        icon: 'images/ollama.svg',
        description:
          'Local model runtime and API for pulling, packaging, and serving open-weight models, with Modelfiles, streaming, embeddings, and tool calling.',
        application:
          'I use Ollama to pin reproducible development models, validate RAG and agent flows offline, and swap a localhost endpoint into OpenAI-compatible integrations before hosted deployment.',
      },
      {
        name: 'Local LLMs',
        icon: 'microchip',
        description:
          'Private inference with open-weight models on owned hardware: quantization, context and KV-cache tuning, GPU/CPU offload, batching, and memory-aware model selection.',
        application:
          'I choose model families and GGUF quantization levels against latency, quality, VRAM, and privacy targets, then benchmark representative prompts before an offline or self-hosted rollout.',
      },
      {
        name: 'MCP',
        icon: 'images/mcp.svg',
        description:
          'Model Context Protocol. Open standard that lets models call tools exposed by any compliant host (Cursor, Claude Desktop, others).',
        application:
          'Built custom MCP servers to expose internal bundles and project context to AI editors and assistants.',
      },
      {
        name: 'Cursor',
        icon: 'images/cursor.svg',
        description:
          'AI-native IDE built on VS Code with cursor-tab completions, multi-file Composer agents, and editable inline-diff review.',
        application:
          'Daily driver for greenfield work. Composer agents scaffold features from spec sheets, my MCP servers expose repo context, and I review every diff before accepting. The code stays mine.',
      },
      {
        name: 'RAG Pipelines',
        icon: 'images/rag.svg',
        description:
          'Retrieval-augmented generation: embeddings, vector stores, hybrid retrieval, re-ranking, citation tracking.',
        application:
          'Stardust uses Chroma + Postgres pgvector for life-story retrieval, with strict AI redaction upstream of the embedder.',
      },
      {
        name: 'AI Rate Limiting',
        icon: 'gauge-high',
        description:
          'Concurrency caps, token-bucket shaping, circuit breakers, queue depth limits, per-tenant budget enforcement for cost-controlled inference.',
        application:
          'Every AI endpoint runs through a token-bucket + queue (p-queue) with a per-user spend budget and a 429 backoff envelope that the client SDK respects. Budget alerts fire before a runaway agent can wipe out the day\'s spend.',
      },
    ],
  },
  {
    title: 'Data, Auth & Security',
    summary: 'Persistence, identity, and the AppSec controls that keep production systems trustworthy.',
    skills: [
      {
        name: 'PostgreSQL',
        icon: 'images/postgresql.svg',
        description:
          'Mature relational engine with JSONB, FTS, generated columns, and the pgvector extension for embeddings.',
        application:
          'System of record for Stardust. Schema migrations via Alembic, query plans verified with EXPLAIN ANALYZE before anything hits the slow query log.',
      },
      {
        name: 'Prisma ORM',
        icon: 'images/prisma.svg',
        description:
          'Type-safe ORM with a declarative schema, migrations, and an ergonomic generated client.',
        application:
          'Default data layer in the legal-eagle project. Generated types flow all the way to the Next.js Server Actions.',
      },
      {
        name: 'SQLModel',
        icon: 'images/sqlmodel.svg',
        description:
          'Pydantic plus SQLAlchemy hybrid. The Python types are the schema, the validation, and the persistence layer.',
        application:
          'Used in Stardust so the FastAPI request schemas and the DB models can\'t drift apart.',
      },
      {
        name: 'DynamoDB',
        icon: 'images/dynamodb.svg',
        description:
          'Serverless key-value and document store. Single-digit-ms p99 reads at any scale, on-demand or provisioned throughput, tunable consistency.',
        application:
          'Reached for high-write telemetry and hot-path key lookups (session state, leaderboards, telemetry events) where p99 reads must stay under 10ms. Partition keys and GSIs get designed up front so the hot-partition trap never lands in production.',
      },
      {
        name: 'Amazon RDS',
        icon: 'images/amazon-rds.svg',
        description:
          'Managed relational database service with automated backups, point-in-time recovery, Multi-AZ failover, read replicas.',
        application:
          'Default managed-SQL service in AWS deploys. Engine versions and parameter groups pinned via Terraform, secrets in Secrets Manager with auto-rotation, connection pooling in front (RDS Proxy) so Lambda bursts don\'t exhaust the pool.',
      },
      {
        name: 'Firebase / Firestore',
        icon: 'images/firebase.svg',
        description:
          'Managed serverless platform with auth, document store, real-time subscriptions, and security rules.',
        application:
          'MissionCtrl and Mechanic Shop run on Firestore, with the rules getting reviewed on every PR against the emulator suite. That\'s the only reason I sleep through those deploys.',
      },
      {
        name: 'DragonflyDB',
        icon: 'database-zap',
        description:
          'Drop-in Redis replacement built for multi-threaded throughput. Same RESP protocol and SDK surface, much higher ops/sec per node.',
        application:
          'Reached for when Redis is on the hot path and I need headroom without rewriting the client code. Drop-in compatibility means existing redis-py / ioredis clients keep working unchanged.',
      },
      {
        name: 'Valkey',
        icon: 'key-round',
        description:
          'Linux-foundation fork of Redis. Keeps the BSD-licensed, single-threaded core under neutral governance after the licence change.',
        application:
          'Default for new Redis-shaped workloads where open governance and licence posture matter more than peak throughput. Same wire protocol, same client SDKs as Redis.',
      },
      {
        name: 'JWT & OAuth 2.0',
        icon: 'key',
        description:
          'Stateless bearer tokens (JWS) and the delegation protocol for third-party identity providers.',
        application:
          'Standard for API auth. Access + refresh with rotation, audience claims, per-route scope checks.',
      },
      {
        name: 'NextAuth / Auth.js',
        icon: 'images/nextauth.svg',
        description:
          'Drop-in auth for Next.js. OAuth, email magic links, credentials, database sessions.',
        application:
          'Default auth layer in every Next.js project. Sessions stored in Postgres via the Prisma adapter.',
      },
      {
        name: 'Passwordless Auth',
        icon: 'envelope',
        description:
          'Sign-in and sign-up with no password. One-time codes delivered by email (magic link or 6-digit OTP) and SMS, short-lived, single-use, rate-limited.',
        application:
          'The only sign-in flow on client work for users who don\'t already have a federated identity. Removes the password reset path, the credential-stuffing surface, and the "what\'s my password again" support ticket.',
      },
      {
        name: 'Google Auth',
        icon: 'images/google-signin.svg',
        description:
          'Google Identity Services: a federated OAuth 2.0 / OIDC sign-in that issues a verified identity and email. One Tap plus the popup button, integrated via Auth.js or a direct GIS client.',
        application:
          'The default create-account flow on my portfolio sites. One click creates the account and signs the visitor in, so the path from landing to "I\'m in" is one tap and never needs a form.',
      },
      {
        name: 'Helmet & CSP',
        icon: 'shield-check',
        description:
          'HTTP header hardening (HSTS, X-Frame-Options) and Content-Security-Policy authoring with nonce-based scripts.',
        application:
          'Every Node service sets strict CSP and Helmet defaults. Tokens never reach localStorage in client code.',
      },
      {
        name: 'OWASP / AppSec',
        icon: 'images/owasp.svg',
        description:
          'Practical web-security discipline. OWASP Top 10 categories, STRIDE-style threat modelling, dependency hygiene, secret scanning, CSP authoring, PII encryption at rest.',
        application:
          'Threat model produced before every launch. Semgrep rules run in CI alongside `npm audit` / pip-audit and gitleaks, and findings get triaged into the sprint instead of the next-next-next backlog.',
      },
      {
        name: 'AI Redaction',
        icon: 'images/presidio.svg',
        description:
          'Pattern-, NLP-, and LLM-driven detection and masking of sensitive content — PII, PHI, credentials, secrets, financial and legal identifiers, and domain-specific entities — with deterministic token replacement before any text reaches an external service.',
        application:
          'Production privacy service in the legal-eagle project. Microsoft Presidio runs as a FastAPI micro-service, redacts OCR and ASR transcripts, and guarantees no sensitive content leaves the host on the way to Anthropic, OpenAI, or MiniMax.',
      },
    ],
  },
  {
    title: 'Cloud, DevOps & Infrastructure',
    summary: 'Where code meets runtime: deploy pipelines, edge plumbing, the platforms beneath the apps.',
    skills: [
      {
        name: 'AWS',
        icon: 'images/aws.svg',
        description:
          'Broad cloud platform spanning compute, storage, networking, serverless, identity, managed databases.',
        application:
          'Production deploys live here. ECS tasks, Lambda, S3, Cognito, Secrets Manager across client work.',
      },
      {
        name: 'Google Cloud',
        icon: 'images/googlecloud.svg',
        description:
          'Google\'s cloud with strong data, AI/ML, and identity offerings: Vertex AI, BigQuery, Firebase, Cloud Run.',
        application:
          'Firebase App Hosting for GroundCTRL. Vertex AI for Gemini-powered features in the same project.',
      },
      {
        name: 'Microsoft Azure',
        icon: 'images/microsoftazure.svg',
        description:
          'Microsoft\'s cloud platform spanning compute, identity, networking, storage, and the integrated Microsoft 365 plus Entra ID stack.',
        application:
          'Default for clients already standardised on Microsoft 365 / Entra ID. App Service, Functions, and Key Vault are my go-to entry points.',
      },
      {
        name: 'Cloud Run',
        icon: 'images/cloudrun.svg',
        description:
          'Managed serverless containers that scale to zero on HTTP traffic. Any language or binary, billed per request after the first 2.5M free invocations each month.',
        application:
          'Default HTTP deploy target for stateless services (GroundCTRL backend, FastAPI edge endpoints). Min-instances tuned for warm-cache reuse, max-instances capped per service so a single bad deploy can\'t empty the region.',
      },
      {
        name: 'Docker',
        icon: 'images/docker.svg',
        description:
          'Container image and runtime standard. Declarative Dockerfiles, multi-stage builds, Compose.',
        application:
          'Local parity and production deploys. My Dockerfile template trims a 1.2GB Node builder image down to ~180MB by staging the runtime layer.',
      },
      {
        name: 'Firebase Hosting',
        icon: 'images/firestore-hosting.svg',
        description:
          'Global static and dynamic hosting with CDN, atomic deploys, rewrites, custom domains.',
        application:
          'Default static + Cloud Functions host for Firebase-first deploys. MissionCtrl and Mechanic Shop both live here.',
      },
      {
        name: 'GitHub Actions',
        icon: 'images/github-actions.svg',
        description:
          'GitHub-native CI/CD. Declarative workflows, reusable composite actions, OIDC trust to cloud, matrix builds across OS and language versions.',
        application:
          'When I set up a repo, the first file is `.github/workflows/ci.yml`. OIDC trust to AWS and GCP eliminates the long-lived deploy key as a category of bug. Reviewers click preview links instead of trusting screenshots.',
      },
      {
        name: 'CI/CD Pipelines',
        icon: 'code-branch',
        description:
          'Automated test, build, and promote pipelines. Staging gates, signed artefacts, manual approvals on prod, metric-gated rollouts.',
        application:
          'Per-service pipelines with environment promotion. Prod rollout is gated on SLO burn-rate from the previous release and auto-rolls back via traffic-shifting when error budgets degrade within the first 30 minutes.',
      },
      {
        name: 'Secrets & IAM',
        icon: 'user-shield',
        description:
          'Workload identity, least-privilege roles, environment separation, short-lived credentials everywhere.',
        application:
          'Cloud secrets only, never committed. OIDC trust between CI and cloud so long-lived keys aren\'t needed.',
      },
      {
        name: 'Vercel',
        icon: 'images/vercel.svg',
        description:
          'Frontend cloud with first-class Next.js support, edge functions, preview URLs, atomic deploys.',
        application:
          'Default platform for Next.js projects. Preview URLs go out for stakeholder review on every PR.',
      },
      {
        name: 'Render',
        icon: 'images/render.svg',
        description:
          'Simple cloud for web services, workers, cron, Postgres, and managed infrastructure-as-code Blueprints.',
        application:
          'Stardust\'s FastAPI service, the cron-based DB backups, and the Postgres instance behind them all live on Render. Render\'s Blueprints file means a new contributor can stand the whole stack up in one command.',
      },
    ],
  },
  {
    title: 'Data Science & Analytics',
    summary: 'Eval pipelines, telemetry analysis, and the statistical rigour that turns AI features from demo to product.',
    skills: [
      {
        name: 'Pandas',
        icon: 'images/pandas.svg',
        description:
          'DataFrame-centric Python library for tabular data. Joins, group-by aggregation, time-series resampling, vectorised operations.',
        application:
          'Backbone of the eval pipelines. Scoring LLM trajectories against rubric datasets, joining conversation logs with telemetry, shaping the feeds that back the model-regression dashboards shipped to stakeholders.',
      },
      {
        name: 'Statistical Rigor',
        icon: 'images/statistics.svg',
        description:
          'Hypothesis testing, confidence intervals, power analysis, bootstrap resampling. The discipline that prevents shipping noise as a regression.',
        application:
          'A/B evaluations on AI Search Quality use two-proportion z-tests with Bonferroni correction across rubric categories. Sample sizes are powered up front so a "no difference" result is actually informative.',
      },
      {
        name: 'PyTorch',
        icon: 'images/pytorch.svg',
        description:
          'Python-first deep-learning framework. Eager dynamic graphs, TorchScript for production serialisation, torch.compile for graph-level optimisation, a mature ecosystem for distributed training and evaluation.',
        application:
          'Reached for when the eval question is genuinely modelling: prototypes for offline ranking, rubric-scoring model comparisons, feature-store experiments that need gradient signal before they ship. Production scoring runs through compiled TorchScript or ONNX, never eager loops.',
      },
      {
        name: 'LoRA',
        icon: 'images/lora.svg',
        description:
          'Low-rank adapters (LoRA, QLoRA, DoRA). Train a small rank-r matrix alongside a frozen base model instead of retraining the full weights.',
        application:
          'My default for adapting open-weight models to a domain. A frozen base plus a small rank-r adapter (r ≤ 16) means a single 24GB GPU fine-tunes a 7B model in hours, not days.',
      },
      {
        name: 'PEFT',
        icon: 'images/peft.svg',
        description:
          'Parameter-Efficient Fine-Tuning. The broader category: low-rank adapters, prefix and prompt tuning, adapter-merging workflows that skip the full-finetune cost.',
        application:
          'Default tuning posture whenever the project fits a domain-adapt adapter better than a full fine-tune. Every adapter ships with an eval gate against the rubric dataset and a merge/diff artefact for reproducibility.',
      },
      {
        name: 'Matplotlib',
        icon: 'images/matplotlib.svg',
        description:
          'Foundational static plotting library for Python. The underlying engine that every other Python viz library renders through.',
        application:
          'Low-level chart control: ROC curves, calibration plots, bespoke diagnostic figures for stakeholder reports when Seaborn defaults don\'t fit the artefact.',
      },
      {
        name: 'Seaborn',
        icon: 'images/seaborn.svg',
        description:
          'High-level statistical visualisation library built on Matplotlib. Sensible defaults for distributions, regressions, categorical comparisons.',
        application:
          'Default for any statistical or model-evaluation chart: confusion matrices, calibration, distribution comparisons, eval deltas across model versions. Reads natively from Pandas DataFrames.',
      },
    ],
  },
  {
    title: 'Quality, Testing & Observability',
    summary: 'Confidence in production: automated testing, performance budgets, runtime telemetry.',
    skills: [
      {
        name: 'Vitest',
        icon: 'images/vitest.svg',
        description:
          'Vite-native test runner. ESM-first config, watch mode, type checking, Jest-compatible API.',
        application:
          'Unit and integration runner for every React/TS project. Coverage threshold enforced in CI.',
      },
      {
        name: 'Jest',
        icon: 'images/jest.svg',
        description:
          'Established JS test runner. Rich mocking, snapshotting, a vast plugin ecosystem.',
        application:
          'Used in the GroundCTRL backend and Mechanic Shop API where the legacy tooling predates Vitest adoption.',
      },
      {
        name: 'pytest',
        icon: 'images/pytest.svg',
        description:
          'Mature Python testing framework. Fixtures, parametrisation, markers, a rich plugin ecosystem.',
        application:
          'Default test runner for the Stardust FastAPI service and the writing-consultant Flask app. Fixtures parametrise DB and HTTP client setup so each scenario gets a clean state.',
      },
      {
        name: 'Playwright',
        icon: 'images/playwright.svg',
        description:
          'Cross-browser end-to-end framework. Auto-wait, tracing, parallel matrix runs.',
        application:
          'End-to-end coverage for every production app. Cross-browser matrix (Chromium, Firefox, WebKit) in CI.',
      },
      {
        name: 'Lighthouse CI',
        icon: 'images/lighthouse.svg',
        description:
          'Automated performance, a11y, and best-practices audits with assertion-based budgets and trend tracking.',
        application:
          'Runs in CI on every PR. Failed budgets block merge until the regression is explained or fixed.',
      },
      {
        name: 'axe Accessibility',
        icon: 'universal-access',
        description:
          'Industry-standard automated accessibility audits catching WCAG violations across roles and states.',
        application:
          '`npm run test:a11y` runs after every build. CI fails the PR if axe finds any serious or critical issues.',
      },
      {
        name: 'Supertest',
        icon: 'images/supertest.svg',
        description:
          'HTTP assertion library that drives an Express or Koa app in-process for fast integration tests.',
        application:
          'Default API test harness in the Mechanic Shop and GroundCTRL backends. Fixtures run against the real app.',
      },
      {
        name: 'Mutation Testing',
        icon: 'images/stryker.svg',
        description:
          'Fault-injection technique that mutates code to verify tests actually catch regressions when they happen.',
        application:
          'Stryker runs against the Stardust interview service. Mutations caught here have surfaced zombie branches more than once.',
      },
      {
        name: 'Property-Based Testing',
        icon: 'images/hypothesis.svg',
        description:
          'Generates random inputs from a spec to discover edge-case bugs that example tests miss.',
        application:
          'Hypothesis powers the AI redaction and rate-limit fuzz tests in the Stardust CI gate.',
      },
      {
        name: 'Sentry',
        icon: 'images/sentry.svg',
        description:
          'Error tracking and performance monitoring with source maps, breadcrumbs, and release health.',
        application:
          'Live on every production deploy. Release tags tie errors to commits, with traces pulled by the Next.js SDK.',
      },
      {
        name: 'OpenTelemetry',
        icon: 'images/otel.svg',
        description:
          'Vendor-neutral traces, metrics, and logs standard with auto-instrumentation for FastAPI, SQLAlchemy, and more.',
        application:
          'Stardust ships OTel traces to Axiom/Grafana Cloud via the OTLP exporter for cross-service debugging.',
      },
      {
        name: 'Pino Logging',
        icon: 'images/pino.svg',
        description:
          'Low-overhead JSON logger for Node. Child loggers, redaction, transport streams.',
        application:
          'Default logger in every Node service. Structured logs flow to Render and Datadog with auto-redacted fields.',
      },
      {
        name: 'Web Vitals',
        icon: 'images/webvitals.svg',
        description:
          'In-browser Core Web Vitals collection (LCP, INP, CLS) via the standard web-vitals library.',
        application:
          'Reported alongside Sentry on every client deploy, so INP regressions get flagged within the same release.',
      },
      {
        name: 'Git & Monorepos',
        icon: 'git-alt',
        description:
          'Trunk-based Git workflow with PR reviews, conventional commits, and workspaces for shared packages.',
        application:
          'Monorepo for the Mechanic Shop, with `packages/shared` between backend and frontend under one PR review.',
      },
    ],
  },
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
    description: 'Managed a $400,000+ pipeline through the full sales cycle. Built relationships with HR and IT stakeholders to position ServiceNow solutions strategically.',
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
    title: 'MissionCtrl',
    tech: 'React, Firebase, Firestore, Gemini AI',
    imageUrl: 'images/missionctrl-tr41-groundctrl-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://missionctrl.org',
    githubUrl: 'https://github.com/growthwithcoding/TR41-GroundCTRL',
    featured: true,
  },
  {
    id: 2,
    title: 'Valley Forge Automotive',
    tech: 'React, Firebase, Firestore',
    imageUrl: 'images/mechanicapiicon-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://valleyforgeautomotive.org',
    githubUrl: 'https://github.com/AColyer13/Mechanic-API---Copy-with-Testing-and-Documentation',
    featured: true,
  },
  {
    id: 3,
    title: 'Legal Eagle Project',
    tech: 'Next.js, Prisma, AI SDK, NextAuth',
    imageUrl: 'images/legaleagleproject-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://legaleagleproject-mu.vercel.app',
    githubUrl: 'https://github.com/AColyer13/legaleagleproject',
    featured: true,
  },
  {
    id: 4,
    title: 'Writing Consultant',
    tech: 'Python, Flask',
    imageUrl: 'images/writing-consultant.png',
    imageWidth: 1280,
    imageHeight: 640,
    liveUrl: 'https://acolyer13.github.io/writing_consultant/',
    githubUrl: 'https://github.com/AColyer13/writing_consultant',
  },
  {
    id: 5,
    title: 'Event Center Website',
    tech: 'HTML, CSS, JS, PWA',
    imageUrl: 'images/Eventcentericon-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://acolyer13.github.io/Event-Center-Website-v2/',
    githubUrl: 'https://github.com/AColyer13/Event-Center-Website-v2',
  },
  {
    id: 6,
    title: 'Dream Vacation App',
    tech: 'React, Vite, Hono, LangGraph, Mapbox',
    imageUrl: 'images/dream-vacation-app.png',
    imageWidth: 1280,
    imageHeight: 640,
    githubUrl: 'https://github.com/AColyer13/DreamVacationApp',
  },
  {
    id: 7,
    title: 'Swimming Website',
    tech: 'HTML, CSS, JS, PWA',
    imageUrl: 'images/Swimmingsiteicon-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://acolyer13.github.io/Swim-Teaching-Website/',
    githubUrl: 'https://github.com/AColyer13/Swim-Teaching-Website',
  },
  {
    id: 8,
    title: 'Stardust',
    tech: 'Next.js, FastAPI, Postgres, PWA',
    imageUrl: 'images/stardust-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://acolyer13.github.io/Stardust/',
    githubUrl: 'https://github.com/AColyer13/Stardust',
  },
  {
    id: 9,
    title: 'The Office',
    tech: 'Node.js, Express, Three.js',
    imageUrl: 'images/the-office.png',
    imageWidth: 1280,
    imageHeight: 640,
    githubUrl: 'https://github.com/AColyer13/the-office',
  },
  {
    id: 10,
    title: 'Immaculate Draft',
    tech: 'HTML, CSS, JavaScript',
    imageUrl: 'images/immaculate-grid-copy-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://acolyer13.github.io/Immaculate-Grid-Copy/',
    githubUrl: 'https://github.com/AColyer13/Immaculate-Grid-Copy',
  },
  {
    id: 11,
    title: 'UFO Abductor',
    tech: 'Three.js, WebGL, Vite',
    imageUrl: 'images/ufo-abductor-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://acolyer13.github.io/moovellous/',
    githubUrl: 'https://github.com/AColyer13/moovellous',
  },
  {
    id: 12,
    title: 'Minnesota Snowmobile',
    tech: 'HTML, Canvas, JavaScript',
    imageUrl: 'images/minnesota-snowmobile-new.png',
    imageWidth: 1280,
    imageHeight: 800,
    liveUrl: 'https://acolyer13.github.io/minnesota-snowmobile/',
    githubUrl: 'https://github.com/AColyer13/minnesota-snowmobile',
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
