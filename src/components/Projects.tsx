import { useState } from 'react'
import { featuredProjects, projects, type Project } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { imgCardThumbClass, portfolioCardClass } from '../utils/layoutClasses'
import { Section } from './Section'
import { Icon } from './Icons'

function ProjectCard({ project, isPriority }: { project: Project; isPriority: boolean }) {
  return (
    <article className={`${portfolioCardClass} flex h-full w-full flex-col`}>
      <div className="relative h-[12.5rem] overflow-hidden border-b border-border-default">
        <img
          src={withBase(project.imageUrl)}
          alt={project.title}
          loading={isPriority ? 'eager' : 'lazy'}
          decoding="async"
          className={imgCardThumbClass}
        />
      </div>
      <div className="flex grow flex-col gap-2 p-4">
        <p className="m-0 text-copyright uppercase tracking-wide text-text-subtle">
          {project.tech}
        </p>
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
    </article>
  )
}

export function Projects() {
  const [showAll, setShowAll] = useState(false)
  const visibleProjects = showAll ? projects : featuredProjects
  const hiddenCount = projects.length - featuredProjects.length

  return (
    <Section
      id="projects"
      title="Projects"
      variant="project"
      className="pb-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project, index) => (
          <div key={project.id} className="flex">
            <ProjectCard
              project={project}
              isPriority={index < 3}
            />
          </div>
        ))}
      </div>

      {hiddenCount > 0 ? (
        <div className="mt-6 text-center">
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