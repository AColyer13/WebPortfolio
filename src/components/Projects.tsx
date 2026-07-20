import { useId, useRef, useEffect, useState } from 'react'
import { featuredProjects, projects } from '../data/portfolio'
import {
  containerClass,
  sectionBlockClass,
} from '../utils/layoutClasses'
import { positionCalloutPopover } from './calloutPopover'
import { Icon } from './Icons'

/** Convert a tech stack string into a list of mono chips. */
function techChips(tech: string): string[] {
  return tech
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

/**
 * Short role description derived from the project's tech stack. We lean on
 * recognizable technology names plus whether there's a live URL. Mirrors
 * the original generator so the copy survives the layout migration.
 */
function describeProject(project: (typeof projects)[number]): string {
  const tech = techChips(project.tech).map((t) => t.toLowerCase())
  const lines: string[] = []

  if (tech.some((t) => t === 'react' || t.startsWith('next.js'))) {
    lines.push('Component-driven UI, with server-rendered routes where they earn it.')
  } else if (tech.includes('html') && tech.includes('css')) {
    lines.push('Static site built by hand with custom CSS and vanilla JS.')
  }

  if (tech.includes('firebase') || tech.includes('firestore')) {
    lines.push('Realtime data layer backed by Firestore rules and Cloud Functions.')
  } else if (tech.includes('python') || tech.includes('flask') || tech.includes('fastapi')) {
    lines.push('Python API on the back end. The client talks to it over HTTPS.')
  } else if (tech.includes('node.js') || tech.includes('express')) {
    lines.push('Node + Express backend, small JSON / SSR footprint.')
  } else if (tech.includes('hono')) {
    lines.push('Hono API at the edge with fast cold starts and minimal middleware.')
  }

  if (tech.includes('postgres') || tech.includes('prisma') || tech.includes('sqlmodel')) {
    lines.push('Persistent Postgres data store accessed through Prisma or SQLModel.')
  }

  if (tech.some((t) => t.includes('ai') || t.includes('gemini') || t.includes('langgraph') || t.includes('openai'))) {
    lines.push('AI-assisted flows: generation, classification, or agentic steps.')
  }

  if (tech.includes('three.js') || tech.includes('webgl') || tech.includes('canvas')) {
    lines.push('Real-time 3D or canvas rendering in the browser.')
  }

  if (tech.includes('pwa')) {
    lines.push('Installable PWA with an offline-capable service worker.')
  }

  if (project.liveUrl) {
    lines.push('Live demo is deployed. Full source on GitHub.')
  } else {
    lines.push('Source-only release. Repo on GitHub.')
  }

  return lines.join(' ')
}

/**
 * Convert a raster source path (e.g. `images/foo.png`) into the variants
 * produced by `scripts/generate-image-variants.mjs`. The script always
 * writes `<base>-<width>.{png|jpg,avif,webp}` for the same widths, so the
 * `<picture>` markup can be derived from the source + width list.
 */
function pictureSrcSet(
  source: string,
  widths: number[],
  format: 'avif' | 'webp' | 'png',
): string {
  const lastDot = source.lastIndexOf('.')
  const base = lastDot >= 0 ? source.slice(0, lastDot) : source
  return widths
    .map((width) => `${base}-${width}.${format} ${width}w`)
    .join(', ')
}

/** Map a project id to a `~/projects/<slug>` style path. */
function projectPath(project: (typeof projects)[number]): string {
  const slug = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `~/projects/${slug}/`
}

interface ProjectRowProps {
  project: (typeof projects)[number]
  index: number
  /** True if this card sits in the visible featured slice. */
  isFeatured: boolean
}

/**
 * Single project card.
 *
 * Reuses the original `<article>` + `<picture>` + `<source>` shell so the
 * existing variant pipeline keeps working and the markup stays readable to
 * screen readers. The terminal aesthetic is applied via the `.hm-proj`
 * class — that layer sits over the original chrome without replacing it.
 */
function ProjectRow({ project, index, isFeatured }: ProjectRowProps) {
  const chips = techChips(project.tech)
  const summary = describeProject(project)
  const widths = [640, 1280]

  const popoverId = useId()
  const triggerId = `${popoverId}-trigger`
  const wrapperRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const popover = document.getElementById(popoverId) as
      | (HTMLElement & { showPopover?: () => void; hidePopover?: () => void })
      | null
    const trigger = triggerRef.current
    if (!popover || !trigger) return

    const positionPopover = () => positionCalloutPopover(popover, trigger)

    const openPopover = () => {
      if (typeof popover.showPopover === 'function') popover.showPopover()
      positionPopover()
    }

    const closePopover = () => {
      if (typeof popover.hidePopover === 'function') popover.hidePopover()
    }

    openPopover()

    const onScrollOrResize = () => {
      if (popover.matches?.(':popover-open')) positionPopover()
    }

    const onOutside = (event: MouseEvent) => {
      const wrapper = wrapperRef.current
      if (!wrapper?.contains(event.target as Node)) {
        setOpen(false)
        closePopover()
      }
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        closePopover()
      }
    }

    const outsideHandle = window.setTimeout(() => {
      window.addEventListener('pointerdown', onOutside)
    }, 0)

    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(outsideHandle)
      window.removeEventListener('pointerdown', onOutside)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('keydown', onKey)
      if (popover.matches?.(':popover-open')) closePopover()
    }
  }, [open, popoverId])

  const onToggle = () => setOpen((value) => !value)

  // First card in the visible featured slice gets priority loading; rest of
  // featured cards load eagerly too so the page never feels half-rendered.
  // Cards revealed only after the user expands the section load lazily.
  const isFirstFeatured = isFeatured && index === 0
  const loading: 'eager' | 'lazy' = isFirstFeatured || isFeatured ? 'eager' : 'lazy'
  const fetchPriority = isFirstFeatured ? 'high' : undefined

  return (
    <article
      ref={wrapperRef as React.RefObject<HTMLElement>}
      className="hm-proj portfolio-item-outer"
      id={`project-${project.id}`}
    >
      <p className="hm-proj__path">
        <strong>$</strong> ls {projectPath(project)}
      </p>

      <div className="hm-proj__media">
        <picture>
          <source
            type="image/avif"
            srcSet={pictureSrcSet(project.imageUrl, widths, 'avif')}
          />
          <source
            type="image/webp"
            srcSet={pictureSrcSet(project.imageUrl, widths, 'webp')}
          />
          <img
            src={`${project.imageUrl.replace(/\.[^.]+$/, '')}-1280.png`}
            srcSet={pictureSrcSet(project.imageUrl, widths, 'png')}
            width={project.imageWidth}
            height={project.imageHeight}
            alt={`${project.title} preview`}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding="async"
            className="hm-proj__img"
          />
        </picture>
      </div>

      <h3 className="hm-proj__title">{project.title}</h3>
      <p className="hm-proj__copy">{summary}</p>
      <div className="hm-proj__chips">
        {chips.map((chip) => (
          <span key={chip} className="hm-proj__chip">
            {chip}
          </span>
        ))}
      </div>

      <div className="hm-proj__actions">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            className="hm-proj__link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live demo`}
          >
            <Icon name="external-link-alt" className="text-fluid-1" aria-hidden />
            live
          </a>
        ) : null}
        <a
          href={project.githubUrl}
          className="hm-proj__link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} source on GitHub`}
        >
          <Icon name="github-alt" className="text-fluid-1" aria-hidden />
          source
        </a>
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={popoverId}
          aria-label={`About ${project.title}. Show summary and tech stack`}
          className="skill-info-btn right-2 bottom-2 size-4 hm-proj__info"
          onClick={onToggle}
        >
          <span aria-hidden>[i]</span>
        </button>
      </div>

      <div
        id={popoverId}
        popover="manual"
        className="hm-skill-popover"
        role="dialog"
        aria-label={`${project.title} details`}
      >
        <h4 className="hm-skill-popover__name">{project.title}</h4>
        <p className="hm-skill-popover__desc">{summary}</p>
        <p className="hm-skill-popover__app">
          <strong>// stack:</strong>
        </p>
        <ul className="hm-skill-popover__chips">
          {chips.map((chip) => (
            <li key={chip}>{chip}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function Projects() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? projects : featuredProjects
  const hiddenCount = projects.length - featuredProjects.length

  // Track which cards were featured vs revealed — the loading strategy
  // differs between the two (eager for visible, lazy for revealed-after-expand).
  const featuredIds = new Set(featuredProjects.map((p) => p.id))
  let featuredCursor = 0

  return (
    <section id="projects" className={sectionBlockClass}>
      <div className={containerClass}>
        <header className="hm-section-head">
          <span className="hm-section-head__prompt">
            find ~/projects -maxdepth 1 -type d
          </span>
          <h2 className="hm-section-head__title"># projects</h2>
        </header>

        <div className="mx-auto max-w-64rem">
          {visible.map((project) => {
            const isFeatured = featuredIds.has(project.id)
            const idx = isFeatured ? featuredCursor++ : 0
            return (
              <ProjectRow
                key={project.id}
                project={project}
                index={idx}
                isFeatured={isFeatured}
              />
            )
          })}
        </div>

        {hiddenCount > 0 ? (
          <div className="mt-4 text-center">
            <button
              type="button"
              className="hm-about__btn hm-about__btn--ghost"
              onClick={() => setShowAll((open) => !open)}
              aria-expanded={showAll}
            >
              {showAll
                ? 'show --fewer'
                : `View all projects (+${hiddenCount})`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
