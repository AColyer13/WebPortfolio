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
          'Strict-superset dialect of JavaScript that adds static typing, structural inference, and editor-time guarantees.',
        application:
          'Default language across all UI work; tsc / ESLint gates prevent type drift shipping to production.',
      },
      {
        name: 'React 19',
        icon: 'images/react.svg',
        description:
          'Component model with concurrent rendering, suspense, server components, and the new use hook and actions APIs.',
        application:
          'Primary UI framework — composable component systems, suspense-driven data flows, and the actions/useTransition patterns shipped in client work this year.',
      },
      {
        name: 'Next.js 16',
        icon: 'images/nextdotjs.svg',
        description:
          'Full-stack React framework with file-based routing, RSC, server actions, edge runtime, and PPR caching.',
        application:
          'Chosen for SEO-critical dashboards and SSR apps where TTFB matters; integrates Prisma, NextAuth, and Vercel deploys.',
      },
      {
        name: 'Vite 7',
        icon: 'images/vite.svg',
        description:
          'Native-ESM dev server with HMR over a single persistent connection and Rollup-driven production builds.',
        application:
          'Default build pipeline for SPAs and micro-frontends; library-mode authoring and the new Rolldown bundler keep the prod artefact tree-shaken and the dev loop under a second — non-negotiable for the teams that own these repos.',
      },
      {
        name: 'Tailwind CSS 4',
        icon: 'images/tailwindcss.svg',
        description:
          'Utility-first CSS framework with v4 CSS-first config, container queries, and zero-runtime class generation.',
        application:
          'Used for design-system-driven UIs; tokens live in CSS variables and map to OKLCH for theme parity.',
      },
      {
        name: 'Radix UI',
        icon: 'images/radixui.svg',
        description:
          'Unstyled, accessible primitives (dialog, dropdown, popover) that ship WAI-ARIA-compliant behaviour out of the box.',
        application:
          'Underpins every dialog, menu, and toast in client apps; consistent focus traps and keyboard navigation.',
      },
      {
        name: 'Framer Motion',
        icon: 'images/framer.svg',
        description:
          'Declarative React animation library with physics-based springs, layout animations, and gesture support.',
        application:
          'Owned the motion strategy on client work — hero choreography, route transitions, and shared-element flows; kept everything behind `useReducedMotion` so the polish degrades gracefully for users who opt out.',
      },
      {
        name: 'React Hook Form',
        icon: 'images/reacthookform.svg',
        description:
          'Performant form library using uncontrolled refs to avoid re-renders, with first-class Zod resolver support.',
        application:
          'Paired with Zod schemas for typed forms; common pattern in CRM-style apps with multi-step validation.',
      },
      {
        name: 'Zustand',
        icon: 'images/zustand.svg',
        description:
          'Minimal, hook-based state store with selector subscriptions, middleware, and zero boilerplate.',
        application:
          'Replaces Redux for client-only state where the team doesn\'t need the ceremony; the Dream Vacation trip planner stores the itinerary graph, undo stack, and map viewport behind a single typed store.',
      },
      {
        name: 'TanStack Query',
        icon: 'images/tanstack.svg',
        description:
          'Asynchronous state manager for server data with caching, dedupe, optimistic updates, and background refetch.',
        application:
          'Owns every remote fetch in production React code; cache-invalidation contracts (per-resource query keys, exact vs. prefix invalidation) are reviewed in PRs because they\'re load-bearing for correctness.',
      },
    ],
  },
  {
    title: 'Mobile Development',
    summary: 'Cross-platform and native mobile: release engineering, performance budgets, production app stores.',
    skills: [
      {
        name: 'React Native (New Architecture)',
        icon: 'images/react-native.svg',
        description:
          'Cross-platform native-rendering framework with Fabric, TurboModules, Hermes, and synchronous JSI bindings replacing the legacy bridge.',
        application:
          'Default for cross-platform clients that need to share a TypeScript codebase with the web app — including structured-concurrency native modules authored in Swift and Kotlin.',
      },
      {
        name: 'Expo & EAS',
        icon: 'images/expo.svg',
        description:
          'Managed React Native platform with EAS Build/Submit/Update, config plugins, dev clients, and OTA JS bundles.',
        application:
          'Used in pre-production and over-the-air update tracks; EAS Build produces signed iOS/Android binaries for CI-driven TestFlight and Play internal releases without owning a Mac fleet.',
      },
      {
        name: 'Flutter',
        icon: 'images/flutter.svg',
        description:
          'Dart-based UI toolkit compiling to native ARM with Impeller/Skia rendering, isolates for concurrency, and an expressive widget tree.',
        application:
          'Reached for design-heavy, brand-sensitive mobile surfaces where pixel-perfect motion and 120fps rendering are non-negotiable — paired with Riverpod for state and go_router for typed navigation.',
      },
      {
        name: 'Native iOS (Swift / SwiftUI)',
        icon: 'images/ios-swift.svg',
        description:
          'Apple platform stack: Swift 5.10, SwiftUI, UIKit interop, Combine, structured concurrency, and Swift Concurrency actors.',
        application:
          'Used for the platform-specific surface of a cross-platform app, App Clip / Widget extensions, and any feature where the RN bridge cost is unacceptable — auth flows, ARKit, and Apple Pay.',
      },
      {
        name: 'Native Android (Kotlin / Jetpack Compose)',
        icon: 'images/android-kotlin.svg',
        description:
          'Modern Android stack: Kotlin 2.0, Jetpack Compose, Coroutines/Flow, Room, Hilt DI, and KMP for shared business logic.',
        application:
          'Chosen for Android-only surfaces and KMP-shared modules; Compose state hoisting and snapshot-based animations give the same dev cadence as SwiftUI.',
      },
      {
        name: 'React Native Reanimated & Skia',
        icon: 'images/reanimated.svg',
        description:
          'High-performance UI thread animations via worklets; Skia GPU rendering for complex vectors, gradients, and 60fps gestures.',
        application:
          'Powers gesture-driven surfaces (map pinch/pan, scrubbers, sheets) where the JS thread can\'t keep up; layout transitions and shared element transitions for navigation polish.',
      },
      {
        name: 'Mobile Architecture',
        icon: 'images/arch-hexagon.svg',
        description:
          'Cross-cutting concerns: monorepo module boundaries, feature flagging, dependency injection, navigation graphs, and typed contracts between native and JS.',
        application:
          'Establishes the module taxonomy (features/*, ui/*, data/*) and the dependency rules so the app stays navigable at 200+ screens; navigation graphs are first-class, not a side-effect of auth state.',
      },
      {
        name: 'Mobile Release Engineering',
        icon: 'images/fastlane.svg',
        description:
          'Fastlane lanes, signing management, store metadata, phased releases, crash gating, and reproducible builds.',
        application:
          'CI-driven Fastlane lanes produce signed IPAs/AABs with code-signing identities synced via match; release-train policy gates every rollout on crash-free session % from the previous build.',
      },
      {
        name: 'Offline-First & Sync',
        icon: 'images/offline-sync.svg',
        description:
          'Local persistence (SQLite/WatermelonDB/Realm), conflict resolution (CRDTs / last-writer-wins + vector clocks), background sync, and queue replay.',
        application:
          'Default architecture for field-tool apps; the offline write log replays on reconnect with idempotency keys so retries never produce duplicates or lost updates.',
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
          'Default server runtime for JavaScript services; runs the GroundCTRL REST + Socket.IO backend on Node 22.',
      },
      {
        name: 'Express 5',
        icon: 'images/express.svg',
        description:
          'Minimal, unopinionated HTTP framework with mature middleware composition and the v5 promise-aware error pipeline that finally routes async rejections to `next(err)`.',
        application:
          'Powers the MissionCtrl and Mechanic Shop REST APIs behind a layered middleware chain: Helmet for headers, CORS with an allowlist, rate limiting per route, request validation, then the handler — never the other way around.',
      },
      {
        name: 'Hono',
        icon: 'images/hono.svg',
        description:
          'Ultra-fast, edge-native web framework built on Web Standards; runs on Node, Bun, Deno, Workers, and more.',
        application:
          'Used for the Dream Vacation app API for its tiny footprint and first-class streaming/edge deploy story.',
      },
      {
        name: 'FastAPI',
        icon: 'images/fastapi.svg',
        description:
          'Type-hint-driven Python framework with automatic OpenAPI generation, async support, and Pydantic validation.',
        application:
          'Powers the Stardust interview API; Pydantic schemas double as the single source of truth for both runtime and the auto-generated /docs.',
      },
      {
        name: 'Flask',
        icon: 'images/flask.svg',
        description:
          'Lightweight WSGI microframework for Python — minimal core, pluggable extensions, and a stable request lifecycle.',
        application:
          'Used for small Python services where FastAPI overhead is unnecessary; the writing-consultant project runs Flask.',
      },
      {
        name: 'REST API Design',
        icon: 'images/rest.svg',
        description:
          'Resource-oriented HTTP design with correct status codes, idempotency keys, cursor pagination, structured error envelopes, and `Problem+JSON` for machine-readable failures.',
        application:
          'REST contracts are reviewed before implementation: nouns over verbs, idempotency keys on every mutation, and cursor pagination so deep lists stay stable as data grows.',
      },
      {
        name: 'OpenAPI / Swagger',
        icon: 'images/swagger.svg',
        description:
          'Vendor-neutral spec language for HTTP APIs with codegen for clients/servers and interactive docs out of the box.',
        application:
          'Every server emits OpenAPI; clients generated with openapi-typescript keep front and back end in lockstep.',
      },
      {
        name: 'Socket.IO',
        icon: 'images/socketdotio.svg',
        description:
          'Real-time bidirectional event channel over WebSockets with auto-reconnect, rooms, and acknowledgement callbacks.',
        application:
          'Powers MissionCtrl satellite telemetry streams and event-driven leaderboard updates in flight sims.',
      },
      {
        name: 'Axios',
        icon: 'images/axios.svg',
        description:
          'Promise-based HTTP client with interceptors, transformers, automatic JSON, and configurable timeouts.',
        application:
          'Default fetch wrapper in Node/React code; interceptors carry retry policy and structured error mapping.',
      },
    ],
  },
  {
    title: 'AI / ML Engineering',
    summary: 'LLM orchestration, agent design, prompt and runtime operations for production AI features.',
    skills: [
      {
        name: 'OpenAI API',
        icon: 'images/openai.svg',
        description:
          'Hosted GPT-4o / o-series models with chat, tools, structured outputs, vision, and assistants endpoints.',
        application:
          'Front-line provider in the legal-eagle triage flow and one of three LLM providers behind the LangChain router; structured outputs (`response_format` + JSON Schema) are how I make model calls deterministic enough to trust in production.',
      },
      {
        name: 'Anthropic Claude',
        icon: 'images/anthropic.svg',
        description:
          'Claude family (Sonnet, Haiku, Opus) with extended context, tool use, and computer-use capabilities.',
        application:
          'Production reasoning tier — long-context redlines, careful instruction following, and agent planning.',
      },
      {
        name: 'Google Gemini',
        icon: 'images/googlegemini.svg',
        description:
          'Google\'s multimodal model family with image/video input, JSON mode, and a generous free tier.',
        application:
          'Drives the MissionCtrl explainable-satellite tutor; also evaluates models day-job in the AI Search Quality role.',
      },
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
          'Graph-based orchestration layer for stateful, multi-actor agent workflows with cycles, branching, and persistence.',
        application:
          'Underpins the trip-planner agent in the Dream Vacation app — supervisor/worker graph with checkpoints.',
      },
      {
        name: 'Prompt Engineering',
        icon: 'wand-magic-sparkles',
        description:
          'Discipline of structuring prompts: system context, few-shot examples, tool schema, constraint framing, and eval.',
        application:
          'Every model call has a prompt template with regression tests against an eval set; red-teamed before launch.',
      },
      {
        name: 'AI Agent Development',
        icon: 'robot',
        description:
          'Tool-using agents that plan, observe, and loop — with explicit budgets, retries, structured outputs, and audit-grade telemetry.',
        application:
          'Shipped production agents for trip planning, satellite tutoring, and PII redaction; every agent has a per-turn tool budget, deterministic structured-output schemas, and an audit log keyed to a stable request id.',
      },
      {
        name: 'Ollama / Local LLMs',
        icon: 'images/ollama.svg',
        description:
          'Local model runner exposing an OpenAI-compatible API for quantised open models like Llama, Mistral, and Qwen.',
        application:
          'Default fallback provider for offline/dev workflows and a cost shield for bursty workloads.',
      },
      {
        name: 'MCP — Model Context Protocol',
        icon: 'images/mcp.svg',
        description:
          'Open standard that lets models call tools exposed by any compliant host (Cursor, Claude Desktop, etc.).',
        application:
          'Built custom MCP servers to expose internal bundles and project context to AI editors and assistants.',
      },
      {
        name: 'Cursor',
        icon: 'images/cursor.svg',
        description:
          'AI-native IDE built on VS Code with cursor-tab completions, multi-file Composer agents, and editable inline-diff review.',
        application:
          'Daily driver for greenfield work — Composer agents scaffold features from spec sheets, my MCP servers expose repo context, and I review every diff before accepting so the code stays mine.',
      },
      {
        name: 'RAG Pipelines',
        icon: 'images/rag.svg',
        description:
          'Retrieval-augmented generation: embeddings, vector stores, hybrid retrieval, re-ranking, and citation tracking.',
        application:
          'Stardust uses Chroma + Postgres pgvector for life-story retrieval with strict PII redaction upstream.',
      },
      {
        name: 'AI Rate Limiting',
        icon: 'gauge-high',
        description:
          'Concurrency caps, token-bucket shaping, circuit breakers, queue depth limits, and per-tenant budget enforcement for cost-controlled inference.',
        application:
          'Every AI endpoint runs through a token-bucket + queue (p-queue) with a per-user spend budget and a 429 backoff envelope that the client SDK respects; budget alerts ping before a runaway agent can wipe out the day\'s spend.',
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
          'System of record for Stardust; schema migrations via Alembic, query plans verified with EXPLAIN ANALYZE.',
      },
      {
        name: 'Prisma ORM',
        icon: 'images/prisma.svg',
        description:
          'Type-safe ORM with a declarative schema, migrations, and ergonomic generated client.',
        application:
          'Default data layer in the legal-eagle project — generated types flow all the way to the Next.js Server Actions.',
      },
      {
        name: 'SQLModel',
        icon: 'images/sqlmodel.svg',
        description:
          'Pydantic + SQLAlchemy hybrid — Python types are the schema, the validation, and the persistence layer.',
        application:
          'Used in Stardust so the FastAPI request schemas and the DB models cannot drift apart.',
      },
      {
        name: 'DynamoDB',
        icon: 'images/dynamodb.svg',
        description:
          'Serverless key-value / document store with single-digit-ms p99 reads at any scale, on-demand or provisioned throughput, and tunable consistency.',
        application:
          'Reached for high-write telemetry and hot-path key lookups (session/state, leaderboards, telemetry events) where p99 reads must stay under 10ms; partition keys and GSIs are designed up front to avoid the hot-partition trap.',
      },
      {
        name: 'Amazon RDS',
        icon: 'images/amazon-rds.svg',
        description:
          'Managed relational database service with automated backups, point-in-time recovery, Multi-AZ failover, and read replicas.',
        application:
          'Default managed-SQL service in AWS deploys; engine versions and parameter groups are pinned via Terraform, secrets live in Secrets Manager with auto-rotation, and connection pooling sits in front (RDS Proxy) so Lambda bursts don\'t exhaust the pool.',
      },
      {
        name: 'Firebase / Firestore',
        icon: 'images/firebase.svg',
        description:
          'Managed serverless platform with auth, document store, real-time subscriptions, and security rules.',
        application:
          'Underpins the MissionCtrl and Mechanic Shop back ends; rules reviewed on every PR with the emulator suite.',
      },
      {
        name: 'Upstash Redis',
        icon: 'images/upstash.svg',
        description:
          'Serverless Redis compatible with the standard SDK; pay-per-request with HTTP and edge runtimes so it cold-starts without provisioned nodes.',
        application:
          'Powers rate limiting, session lookups, and the agent conversation cache in the trip planner; HTTP-only mode keeps it usable from edge runtimes where a TCP socket isn\'t available.',
      },
      {
        name: 'JWT & OAuth 2.0',
        icon: 'key',
        description:
          'Stateless bearer tokens (JWS) and the delegation protocol for third-party identity providers.',
        application:
          'Standard for API auth; access + refresh with rotation, audience claims, and per-route scope checks.',
      },
      {
        name: 'NextAuth / Auth.js',
        icon: 'images/nextauth.svg',
        description:
          'Drop-in auth for Next.js supporting OAuth, email magic links, credentials, and database sessions.',
        application:
          'Default auth layer in every Next.js project; sessions stored in Postgres via the Prisma adapter.',
      },
      {
        name: 'Helmet & CSP',
        icon: 'hard-hat',
        description:
          'HTTP header hardening (HSTS, X-Frame-Options) and Content-Security-Policy authoring with nonce-based scripts.',
        application:
          'Every Node service sets strict CSP and Helmet defaults; tokens never reach localStorage in client code.',
      },
      {
        name: 'OWASP / AppSec',
        icon: 'images/owasp.svg',
        description:
          'Practical web-security discipline: STRIDE-style threat modelling, dependency hygiene, secret scanning, CSP authoring, and PII encryption at rest.',
        application:
          "Threat model produced before every launch; Semgrep rules run in CI alongside `npm audit`/pip-audit and gitleaks, and findings are triaged into the sprint — not punted to 'later'.",
      },
      {
        name: 'PII Redaction (Presidio)',
        icon: 'images/presidio.svg',
        description:
          'Pattern- and NLP-based detection of personally identifiable information (names, emails, phones, SSNs, IDs) with deterministic token replacement before any text reaches an external service.',
        application:
          'Production privacy-service in the legal-eagle project: Microsoft Presidio runs as a FastAPI micro-service, redacts OCR/ASR transcripts, and guarantees no PII leaves the host on the way to Anthropic/OpenAI/MiniMax.',
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
          'Broad cloud platform spanning compute, storage, networking, serverless, identity, and managed databases.',
        application:
          'Used for production deploys — ECS tasks, Lambda, S3, Cognito, and Secrets Manager across client work.',
      },
      {
        name: 'Google Cloud',
        icon: 'images/googlecloud.svg',
        description:
          'Google\'s cloud with strong data, AI/ML, and identity offerings (Vertex AI, BigQuery, Firebase, Cloud Run).',
        application:
          'Firebase App Hosting for GroundCTRL and Vertex AI for Gemini-powered features in the same project.',
      },
      {
        name: 'Microsoft Azure',
        icon: 'images/microsoftazure.svg',
        description:
          'Microsoft\'s cloud platform spanning compute, identity, networking, storage, and integrated Microsoft 365 + Entra ID services.',
        application:
          'Use for clients already standardized on Microsoft 365 / Entra ID; App Service, Functions, and Key Vault are my go-to entry points.',
      },
      {
        name: 'Cloud Run',
        icon: 'images/cloudrun.svg',
        description:
          'Managed serverless containers that scale to zero on HTTP traffic, support any language/binary, and bill per request after the first 2.5M free invocations.',
        application:
          'Default HTTP deploy target for stateless services (GroundCTRL backend, FastAPI edge endpoints); min-instances tuned for warm-cache reuse, max-instances capped per service so a single bad deploy can\'t exhaust the region.',
      },
      {
        name: 'Docker',
        icon: 'docker',
        description:
          'Container image and runtime standard with declarative Dockerfiles, multi-stage builds, and Compose.',
        application:
          'Used for local parity and production deploys; multi-stage Dockerfiles keep prod images minimal.',
      },
      {
        name: 'Firebase Hosting',
        icon: 'images/firestore-hosting.svg',
        description:
          'Global static + dynamic hosting with CDN, atomic deploys, rewrites, and custom domains.',
        application:
          'Default static + Cloud Functions host for Firebase-first deploys (MissionCtrl, Mechanic Shop).',
      },
      {
        name: 'GitHub Actions',
        icon: 'github',
        description:
          'GitHub-native CI/CD with declarative workflows, reusable composite actions, OIDC trust to cloud, and matrix builds across OS/language versions.',
        application:
          'Pipelines authored as a product: shared composite actions for setup, required-status checks on `main`, OIDC trust to AWS/GCP so long-lived deploy keys aren\'t a thing, and per-PR preview environments so reviewers click a link instead of trusting a screenshot.',
      },
      {
        name: 'CI/CD Pipelines',
        icon: 'code-branch',
        description:
          'Automated test → build → promote pipelines with staging gates, signed artifacts, manual approvals on prod, and metric-gated rollouts.',
        application:
          'Per-service pipelines with environment promotion; prod rollout is gated on SLO burn-rate from the previous release and auto-rolls back via traffic-shifting when error budgets degrade within the first 30 minutes.',
      },
      {
        name: 'Secrets & IAM',
        icon: 'user-shield',
        description:
          'Workload identity, least-privilege roles, environment separation, and short-lived credentials everywhere.',
        application:
          'Cloud secrets only — never committed; OIDC trust between CI and cloud so long-lived keys are unnecessary.',
      },
      {
        name: 'Vercel',
        icon: 'images/vercel.svg',
        description:
          'Frontend cloud with first-class Next.js support, edge functions, preview URLs, and atomic deploys.',
        application:
          'Default platform for Next.js projects; preview URLs used for stakeholder review on every PR.',
      },
      {
        name: 'Render',
        icon: 'images/render.svg',
        description:
          'Simple cloud for web services, workers, cron, Postgres, and managed infrastructure-as-code Blueprints.',
        application:
          'Hosts the Stardust FastAPI service, cron-based DB backups, and the Postgres instance behind it.',
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
          'DataFrame-centric Python library for tabular data manipulation, joins, group-by aggregation, time-series resampling, and vectorised operations.',
        application:
          'Backbone of the eval pipelines: scoring LLM trajectories against rubric datasets, joining conversation logs with telemetry, and shaping the feeds that back model-regression dashboards shipped to stakeholders.',
      },
      {
        name: 'Statistical Rigor',
        icon: 'images/statistics.svg',
        description:
          'Hypothesis testing, confidence intervals, power analysis, and bootstrap resampling — the discipline that prevents shipping noise as a regression.',
        application:
          'A/B evaluations on AI Search Quality use two-proportion z-tests with Bonferroni correction across rubric categories; sample sizes are powered up front so a "no difference" result is actually informative.',
      },
      {
        name: 'PyTorch',
        icon: 'images/pytorch.svg',
        description:
          'Python-first deep-learning framework with eager dynamic graphs, TorchScript for production serialisation, torch.compile for graph-level optimisation, and a mature ecosystem for distributed training and evaluation.',
        application:
          'Reach for PyTorch when the eval question is genuinely modelling — prototypes for offline ranking, rubric-scoring model comparisons, or feature-store experiments that need gradient signal before they ship; production scoring runs through compiled TorchScript or ONNX, never eager loops.',
      },
      {
        name: 'LoRA / Parameter-Efficient Fine-Tuning',
        icon: 'images/lora.svg',
        description:
          'Parameter-efficient adaptation: low-rank adapters (LoRA / QLoRA / DoRA), prefix/prompt tuning, and adapter-merging workflows that avoid full-finetune cost without giving up task fit.',
        application:
          'Default tuning posture for adapting open-weight models to a domain — frozen base + small rank-r adapters (r ≤ 16) means a single 24GB GPU fine-tunes a 7B model in hours, not days; every adapter ships with an eval gate against the rubric dataset and a merge/diff artefact for reproducibility.',
      },
      {
        name: 'Matplotlib',
        icon: 'images/matplotlib.svg',
        description:
          'Foundational static plotting library for Python — the underlying engine that every other Python viz library renders through.',
        application:
          'Reached for low-level chart control: ROC curves, calibration plots, and bespoke diagnostic figures for stakeholder reports when Seaborn defaults don\'t fit the artefact.',
      },
      {
        name: 'Seaborn',
        icon: 'images/seaborn.svg',
        description:
          'High-level statistical visualisation library built on Matplotlib with sensible defaults for distributions, regressions, and categorical comparisons.',
        application:
          'Default for any statistical or model-evaluation chart — confusion matrices, calibration, distribution comparisons, eval deltas across model versions — reads natively from Pandas DataFrames.',
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
          'Vite-native test runner with ESM-first config, watch mode, type checking, and Jest-compatible API.',
        application:
          'Unit and integration runner for every React/TS project; coverage threshold enforced in CI.',
      },
      {
        name: 'Jest',
        icon: 'images/jest.svg',
        description:
          'Established JS test runner with rich mocking, snapshotting, and a vast plugin ecosystem.',
        application:
          'Used in the GroundCTRL backend and Mechanic Shop API where the legacy tooling predates Vitest adoption.',
      },
      {
        name: 'pytest',
        icon: 'images/pytest.svg',
        description:
          'Mature Python testing framework with fixtures, parametrization, markers, and a rich plugin ecosystem.',
        application:
          'Default test runner for the Stardust FastAPI service and writing-consultant Flask app — fixtures parametrize DB and HTTP client setup so each scenario gets a clean state.',
      },
      {
        name: 'Playwright',
        icon: 'images/playwright.svg',
        description:
          'Cross-browser end-to-end framework with auto-wait, tracing, and parallel matrix runs.',
        application:
          'End-to-end coverage for every production app; cross-browser matrix (Chromium / Firefox / WebKit) in CI.',
      },
      {
        name: 'Lighthouse CI',
        icon: 'lightbulb',
        description:
          'Automated performance / a11y / best-practices audits with assertion-based budgets and trend tracking.',
        application:
          'Runs in CI on every PR; failed budgets block merge until the regression is explained or fixed.',
      },
      {
        name: 'axe Accessibility',
        icon: 'universal-access',
        description:
          'Industry-standard automated accessibility audits catching WCAG violations across roles and states.',
        application:
          'npm run test:a11y runs after every build; CI fails the PR if axe finds any serious or critical issues.',
      },
      {
        name: 'Supertest',
        icon: 'images/supertest.svg',
        description:
          'HTTP assertion library that drives an Express/Koa app in-process for fast integration tests.',
        application:
          'Default API test harness in the Mechanic Shop and GroundCTRL backends — fixtures run against the real app.',
      },
      {
        name: 'Mutation Testing',
        icon: 'images/stryker.svg',
        description:
          'Fault-injection technique that mutates code to verify tests actually catch regressions, not just run.',
        application:
          'Stryker runs against the Stardust interview service; mutations caught here removed zombie branches.',
      },
      {
        name: 'Property-Based Testing',
        icon: 'images/hypothesis.svg',
        description:
          'Generates random inputs from a spec to discover edge-case bugs that example tests miss.',
        application:
          'Hypothesis powers the PII redaction and rate-limit fuzz tests in the Stardust CI gate.',
      },
      {
        name: 'Sentry',
        icon: 'images/sentry.svg',
        description:
          'Error tracking and performance monitoring with source maps, breadcrumbs, and release health.',
        application:
          'Live on every production deploy — release tags tie errors to commits with traces pulled by the Next.js SDK.',
      },
      {
        name: 'OpenTelemetry',
        icon: 'images/otel.svg',
        description:
          'Vendor-neutral traces/metrics/logs standard with auto-instrumentation for FastAPI, SQLAlchemy, and more.',
        application:
          'Stardust ships OTel traces to Axiom/Grafana Cloud via the OTLP exporter for cross-service debugging.',
      },
      {
        name: 'Pino Logging',
        icon: 'images/pino.svg',
        description:
          'Low-overhead JSON logger for Node with child loggers, redaction, and transport streams.',
        application:
          'Default logger in every Node service — structured logs flow to Render/Datadog with auto-redacted fields.',
      },
      {
        name: 'Web Vitals',
        icon: 'images/webvitals.svg',
        description:
          'In-browser Core Web Vitals collection (LCP, INP, CLS) via the standard web-vitals library.',
        application:
          'Reported alongside Sentry on every client deploy so INP regressions get flagged within the same release.',
      },
      {
        name: 'Git & Monorepos',
        icon: 'git-alt',
        description:
          'Trunk-based Git workflow with PR reviews, conventional commits, and workspaces for shared packages.',
        application:
          'Monorepo for the Mechanic Shop with packages/shared between backend and frontend under a single PR review.',
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
