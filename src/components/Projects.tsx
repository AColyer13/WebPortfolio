import { useCallback, useEffect, useState } from 'react'
import { featuredProjects, projects, type Project } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { projectPictureBase } from '../utils/images'
import { imgCardThumbClass, portfolioCardClass } from '../utils/layoutClasses'
import { intentHandlers, prefetchDemo } from '../utils/prefetch'
import { DemoDialog } from './DemoDialog'
import { Section } from './Section'
import { Icon } from './Icons'

const PROJECTS_PARAM = 'projects'

function readShowAllFromUrl(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get(PROJECTS_PARAM) === 'all'
}

function writeShowAllToUrl(showAll: boolean) {
  const url = new URL(window.location.href)
  if (showAll) url.searchParams.set(PROJECTS_PARAM, 'all')
  else url.searchParams.delete(PROJECTS_PARAM)
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
}

/** Cards that sit in the first viewport load eagerly so no gray box shows. */
const EAGER_IMAGE_COUNT = 3

function ProjectCard({
  project,
  index,
  onOpenDemo,
}: {
  project: Project
  index: number
  onOpenDemo?: () => void
}) {
  const eager = index < EAGER_IMAGE_COUNT
  const [infoOpen, setInfoOpen] = useState(false)
  const base = projectPictureBase(project.imageUrl)
  const sizes = '(min-width: 1024px) 33vw, 100vw'
  const descriptionId = `project-${project.id}-about`
  const techItems = project.tech.split(', ')

  return (
    <article className={portfolioCardClass}>
      <div className="card-media relative aspect-16/10">
        <picture>
          <source
            type="image/avif"
            srcSet={`${withBase(`${base}-640.avif`)} 640w, ${withBase(`${base}-1280.avif`)} 1280w`}
            sizes={sizes}
          />
          <source
            type="image/webp"
            srcSet={`${withBase(`${base}-640.webp`)} 640w, ${withBase(`${base}-1280.webp`)} 1280w`}
            sizes={sizes}
          />
          <img
            src={withBase(project.imageUrl)}
            alt={project.title}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            decoding="async"
            className={imgCardThumbClass}
            width={1280}
            height={800}
          />
        </picture>
      </div>
      <div className="card-body grow">
        {/* Every item carries a leading "·" inside a negative inline margin; the
            wrapper clips it, so a separator that starts a wrapped line is hidden. */}
        <div className="overflow-hidden sm:min-h-[2.75em]">
          <ul
            className="m-0 -ms-[1.5em] flex list-none flex-wrap p-0 text-copyright uppercase tracking-[0.04em] text-text-subtle"
            aria-label="Built with"
          >
            {techItems.map((tech) => (
              <li key={tech} className="whitespace-nowrap">
                <span className="inline-block w-[1.5em] text-center" aria-hidden>
                  ·
                </span>
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-start justify-between gap-(--space-2)">
          <h3 className="m-0">{project.title}</h3>
          <button
            type="button"
            className={`btn btn-quiet project-info-btn${infoOpen ? ' is-signal' : ''}`}
            aria-expanded={infoOpen}
            aria-controls={descriptionId}
            aria-label={`About ${project.title}`}
            title={`About ${project.title}`}
            onClick={() => setInfoOpen((open) => !open)}
          >
            <span className="text-copyright font-medium" aria-hidden>
              {infoOpen ? 'Less' : 'More'}
            </span>
            <Icon name="info" aria-hidden />
          </button>
        </div>
        <p
          id={descriptionId}
          data-expanded={infoOpen}
          className={`project-info text-fluid-1 text-text-muted ${infoOpen ? '' : 'line-clamp-4'}`}
        >
          {project.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-(--space-3) pt-(--space-2)">
          {project.demo ? (
            <button
              type="button"
              className="btn"
              aria-haspopup="dialog"
              {...intentHandlers(prefetchDemo)}
              onClick={onOpenDemo}
            >
              Live demo
            </button>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="external-link-alt" className="text-fluid-1" aria-hidden />
              Live demo
            </a>
          ) : null}
          {project.liveUrl && project.demoNote ? (
            <span className="text-copyright text-text-subtle">{project.demoNote}</span>
          ) : null}
          {!project.liveUrl && !project.githubUrl && !project.demo ? (
            <span className="hit-target text-copyright text-text-subtle">
              {project.demoNote ?? 'Not publicly hosted. Demo on request.'}
            </span>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              className="hit-target text-fluid-1 font-medium text-text-muted underline-offset-4 hover:text-text-default hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source on GitHub`}
            >
              <Icon name="github-alt" className="text-fluid-1" aria-hidden />
              Source
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const [showAll, setShowAll] = useState(readShowAllFromUrl)
  const [demoOpen, setDemoOpen] = useState(false)
  const closeDemo = useCallback(() => setDemoOpen(false), [])
  const visibleProjects = showAll ? projects : featuredProjects
  const hiddenCount = projects.length - featuredProjects.length

  useEffect(() => {
    const onPopState = () => setShowAll(readShowAllFromUrl())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const toggleShowAll = () => {
    setShowAll((open) => {
      const next = !open
      writeShowAllToUrl(next)
      return next
    })
  }

  return (
    <Section id="projects" title="Projects" variant="project">
      {/* At two columns an odd last card would leave a hole, so center it. */}
      {visibleProjects.length === 0 ? (
        <div className="state-empty" role="status">
          <p className="m-0">No projects in this view.</p>
          <button type="button" className="btn btn-primary" onClick={toggleShowAll}>
            View all projects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-(--space-6) sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:[&>article:last-child:nth-child(odd)]:col-span-2 sm:max-lg:[&>article:last-child:nth-child(odd)]:w-[calc(50%-(var(--space-6)/2))] sm:max-lg:[&>article:last-child:nth-child(odd)]:justify-self-center">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenDemo={project.demo ? () => setDemoOpen(true) : undefined}
            />
          ))}
        </div>
      )}
      {demoOpen ? <DemoDialog onClose={closeDemo} /> : null}

      {hiddenCount > 0 ? (
        <div className="mt-(--space-6)">
          <button
            type="button"
            className="btn"
            onClick={toggleShowAll}
            aria-expanded={showAll}
          >
            {showAll ? 'Show fewer projects' : `View all projects (${hiddenCount} more)`}
          </button>
        </div>
      ) : null}
    </Section>
  )
}
