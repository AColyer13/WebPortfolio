import { useEffect, useId, useRef, useState } from 'react'
import { featuredProjects, projects } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { pictureSrcSet } from '../utils/pictureSources'
import { imgCardThumbClass, portfolioCardClass } from '../utils/layoutClasses'
import { positionCalloutPopover } from './calloutPopover'
import { Section } from './Section'
import { Icon } from './Icons'

const CARD_WIDTHS = [640, 1280] as const
const CARD_SIZES = '(min-width: 60rem) 33vw, (min-width: 36rem) 50vw, 100vw'

type ImagePriority = 'high' | 'eager' | 'lazy'

function imagePriorityForIndex(index: number): ImagePriority {
  if (index === 0) return 'high'
  if (index < featuredProjects.length) return 'eager'
  return 'lazy'
}

/** Split the comma-separated `tech` field into a clean chip list. */
function techChips(tech: string): string[] {
  return tech
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

/**
 * Generate a one-line role description from the project's tech stack so the
 * (i) popover has meaningful body content without hand-authored blurbs. We
 * lean on recognizable technology names and the live-URL presence.
 */
function describeProject(project: (typeof projects)[number]): string {
  const tech = techChips(project.tech).map((t) => t.toLowerCase())
  const lines: string[] = []

  // Front-end / web
  if (tech.some((t) => t === 'react' || t.startsWith('next.js'))) {
    lines.push('Component-driven UI with server-rendered routes where applicable.')
  } else if (tech.includes('html') && tech.includes('css')) {
    lines.push('Hand-built static site with custom CSS and vanilla JS.')
  }

  // Backend / API
  if (tech.includes('firebase') || tech.includes('firestore')) {
    lines.push('Realtime data layer backed by Firestore rules and Cloud Functions.')
  } else if (tech.includes('python') || tech.includes('flask') || tech.includes('fastapi')) {
    lines.push('Python API surface; thin client talks to it over HTTPS.')
  } else if (tech.includes('node.js') || tech.includes('express')) {
    lines.push('Node + Express backend with a small JSON / SSR footprint.')
  } else if (tech.includes('hono')) {
    lines.push('Hono API at the edge - fast cold starts and minimal middleware.')
  }

  // Data / persistence
  if (tech.includes('postgres') || tech.includes('prisma') || tech.includes('sqlmodel')) {
    lines.push('Persistent Postgres data store via Prisma / SQLModel.')
  }

  // AI / ML
  if (tech.some((t) => t.includes('ai') || t.includes('gemini') || t.includes('langgraph') || t.includes('openai'))) {
    lines.push('AI-assisted flows - generation, classification, or agentic steps.')
  }

  // 3D / graphics
  if (tech.includes('three.js') || tech.includes('webgl') || tech.includes('canvas')) {
    lines.push('Real-time 3D or canvas rendering in the browser.')
  }

  // PWA / mobile
  if (tech.includes('pwa')) {
    lines.push('Installable PWA with offline-capable service worker.')
  }

  // Live demo / source
  if (project.liveUrl) {
    lines.push('Live demo deployed; full source on GitHub.')
  } else {
    lines.push('Source-only release on GitHub.')
  }

  return lines.join(' ')
}

interface ProjectCardProps {
  project: (typeof projects)[number]
  imagePriority: ImagePriority
}

function ProjectCard({ project, imagePriority }: ProjectCardProps) {
  const wrapperRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverId = useId()
  const triggerId = `${popoverId}-trigger`
  const [open, setOpen] = useState(false)
  const chips = techChips(project.tech)
  const summary = describeProject(project)

  useEffect(() => {
    if (!open) return
    const popover = document.getElementById(popoverId) as
      | (HTMLElement & { showPopover?: () => void; hidePopover?: () => void })
      | null
    const trigger = triggerRef.current
    if (!popover || !trigger) return

    if (typeof popover.showPopover === 'function') popover.showPopover()
    positionCalloutPopover(popover, trigger)

    const onScrollOrResize = () => {
      if (popover.matches?.(':popover-open')) positionCalloutPopover(popover, trigger)
    }

    const onOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
        if (typeof popover.hidePopover === 'function') popover.hidePopover()
      }
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        if (typeof popover.hidePopover === 'function') popover.hidePopover()
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
      if (popover.matches?.(':popover-open') && typeof popover.hidePopover === 'function') {
        popover.hidePopover()
      }
    }
  }, [open, popoverId])

  const onToggle = () => setOpen((value) => !value)

  return (
    <article ref={wrapperRef} className={`${portfolioCardClass} flex h-full w-full flex-col`}>
      <div className="relative h-[12.5rem] overflow-hidden border-b border-border-default">
        <picture>
          <source
            type="image/avif"
            srcSet={pictureSrcSet(project.imageUrl, CARD_WIDTHS, 'avif')}
            sizes={CARD_SIZES}
          />
          <source
            type="image/webp"
            srcSet={pictureSrcSet(project.imageUrl, CARD_WIDTHS, 'webp')}
            sizes={CARD_SIZES}
          />
          <img
            src={withBase(project.imageUrl)}
            srcSet={pictureSrcSet(project.imageUrl, CARD_WIDTHS, 'original')}
            sizes={CARD_SIZES}
            alt={project.title}
            width={project.imageWidth}
            height={project.imageHeight}
            loading={imagePriority === 'lazy' ? 'lazy' : 'eager'}
            decoding="async"
            {...(imagePriority === 'high' ? { fetchPriority: 'high' as const } : {})}
            className={imgCardThumbClass}
          />
        </picture>
      </div>
      <div className="flex grow flex-col gap-2 p-4">
        <div className="flex items-start gap-2">
          <p className="m-0 grow shrink basis-0 text-copyright uppercase tracking-wide text-text-subtle">
            {project.tech}
          </p>
          {/* (i) trigger - matches the Skills pattern: tiny clean circle
              pinned to the corner of the card, fully contained. */}
          <button
            ref={triggerRef}
            type="button"
            id={triggerId}
            aria-expanded={open}
            aria-controls={popoverId}
            aria-label={`About ${project.title} — show summary and tech stack`}
            onClick={onToggle}
            className="skill-info-btn -mt-0.5 -mr-1 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-50 text-copyright font-medium leading-none text-text-muted transition-colors duration-150 ease-in-out hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            i
          </button>
        </div>
        <h3 className="m-0 text-fluid-3 font-bold leading-snug text-text-default">
          {project.title}
        </h3>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              className="inline-flex min-h-11 items-center gap-1 text-fluid-1 font-medium text-text-default underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="external-link-alt" className="text-fluid-1" aria-hidden />
              Live demo
            </a>
          ) : null}
          <a
            href={project.githubUrl}
            className="inline-flex min-h-11 items-center gap-1 text-fluid-1 font-medium text-text-muted underline-offset-4 hover:text-text-default hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source on GitHub`}
          >
            <Icon name="github-alt" className="text-fluid-1" aria-hidden />
            Source
          </a>
        </div>
      </div>
      {/* Popover - shares the same callout positioning strategy + CSS arrow
          as the skill popovers. Body is auto-generated from the tech stack
          + live-URL presence. */}
      <div
        id={popoverId}
        popover="manual"
        className="skill-popover rounded-md border border-border-default bg-surface-0 p-4 text-text-default shadow-[0_1rem_2.5rem_rgb(0_0_0_/0.18)]"
        role="dialog"
        aria-label={`${project.title} — details`}
      >
        <h4 className="m-0 mb-2 text-fluid-3 font-bold leading-snug">{project.title}</h4>
        <p className="m-0 mb-3 text-fluid-1 leading-relaxed text-text-default">
          {summary}
        </p>
        <p className="m-0 mb-1 text-copyright font-medium uppercase tracking-wide text-text-subtle">
          Built with
        </p>
        <ul className="m-0 flex flex-wrap gap-1.5 p-0">
          {chips.map((chip) => (
            <li
              key={chip}
              className="inline-flex items-center rounded-sm border border-border-default bg-surface-50 px-2 py-0.5 text-copyright text-text-default"
            >
              {chip}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="skill-popover__close mt-3 inline-flex min-h-9 cursor-pointer items-center rounded-sm border border-border-default bg-surface-50 px-3 py-1 text-copyright font-medium text-text-default transition-colors duration-150 ease-in-out hover:border-text-muted"
          onClick={() => {
            setOpen(false)
            const popover = document.getElementById(popoverId)
            if (popover && 'hidePopover' in popover) {
              ;(popover as HTMLElement & { hidePopover: () => void }).hidePopover()
            }
          }}
        >
          Close
        </button>
      </div>
    </article>
  )
}

export function Projects() {
  const [showAll, setShowAll] = useState(false)
  const visibleProjects = showAll ? projects : featuredProjects
  const hiddenCount = projects.length - featuredProjects.length

  return (
    <Section id="projects" title="Projects" variant="project">
      <div className="grid grid-cols-1 gap-3 @[36rem]:grid-cols-2 @[60rem]:grid-cols-3">
        {visibleProjects.map((project, index) => (
          <div key={project.id} className="flex">
            <ProjectCard
              project={project}
              imagePriority={imagePriorityForIndex(index)}
            />
          </div>
        ))}
      </div>

      {hiddenCount > 0 ? (
        <div className="mt-5 text-center">
          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-border-default bg-transparent px-4 py-2 text-btn font-medium text-text-default transition-colors duration-150 ease-in-out hover:border-text-muted hover:bg-surface-0"
            onClick={() => setShowAll((open) => !open)}
            aria-expanded={showAll}
          >
            {showAll ? 'Show fewer projects' : `View all projects (${hiddenCount} more)`}
          </button>
        </div>
      ) : null}
    </Section>
  )
}