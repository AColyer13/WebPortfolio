import { useEffect, useState } from 'react'
import { featuredProjects, projects, type Project } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { projectPictureBase } from '../utils/images'
import { imgCardThumbClass, portfolioCardClass } from '../utils/layoutClasses'
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

function ProjectCard({ project }: { project: Project }) {
  const [infoOpen, setInfoOpen] = useState(false)
  const base = projectPictureBase(project.imageUrl)
  const sizes = '(min-width: 1024px) 33vw, 100vw'
  const descriptionId = `project-${project.id}-about`
  const techItems = project.tech.split(', ')

  return (
    <article className={portfolioCardClass}>
      <div className="relative aspect-16/10 overflow-hidden bg-surface-100">
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
            loading="lazy"
            decoding="async"
            className={imgCardThumbClass}
            width={1280}
            height={800}
          />
        </picture>
      </div>
      <div className="flex grow flex-col gap-2 py-4">
        {/* Every item carries a leading "·" inside a negative inline margin; the
            wrapper clips it, so a separator that starts a wrapped line is hidden. */}
        <div className="overflow-hidden">
          <ul
            className="m-0 -ms-[1.5em] flex list-none flex-wrap p-0 font-mono text-copyright uppercase tracking-wide text-text-subtle"
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="m-0 text-fluid-3 font-bold leading-snug text-text-default">
            {project.title}
          </h3>
          <button
            type="button"
            className={`project-info-btn -me-2.5 -mt-1.5 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-0 text-xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary-600 ${
              infoOpen ? 'text-accent' : 'text-text-subtle hover:text-text-default'
            }`}
            aria-expanded={infoOpen}
            aria-controls={descriptionId}
            aria-label={`About ${project.title}`}
            title={`About ${project.title}`}
            onClick={() => setInfoOpen((open) => !open)}
          >
            <Icon name="info" aria-hidden />
          </button>
        </div>
        <p
          id={descriptionId}
          hidden={!infoOpen}
          className="project-info m-0 border-s-2 border-accent ps-3 text-fluid-1 leading-relaxed text-text-muted"
        >
          {project.description}
        </p>
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
    </article>
  )
}

export function Projects() {
  const [showAll, setShowAll] = useState(readShowAllFromUrl)
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
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {hiddenCount > 0 ? (
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border border-border-default bg-transparent px-4 py-2 text-btn font-medium text-text-default transition-colors duration-150 ease-out hover:border-text-muted hover:bg-surface-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
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
