import { projects } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { imgCardThumbClass, portfolioCardClass } from '../utils/layoutClasses'
import { Section } from './Section'

export function Projects() {
  return (
    <Section id="projects" title="My Projects" variant="project">
      <div className="grid grid-cols-1 gap-3 text-center @[36rem]:grid-cols-2 @[60rem]:grid-cols-3">
        {projects.map((project) => {
          const overlayHref = project.liveUrl ?? project.githubUrl
          const overlayIcon = project.liveUrl
            ? 'fas fa-external-link-alt'
            : 'fab fa-github-alt'
          return (
            <div key={project.id}>
              <div className={portfolioCardClass}>
                <div className="relative h-[12.5rem] overflow-hidden">
                  <img
                    src={withBase(project.imageUrl)}
                    alt={project.title}
                    width={project.imageWidth}
                    height={project.imageHeight}
                    loading="lazy"
                    decoding="async"
                    className={imgCardThumbClass}
                  />
                  <a
                    href={overlayHref}
                    className="portfolio-zoom-link absolute top-1/2 left-1/2 z-2 flex h-[3.75rem] w-[3.75rem] min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-0"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} (external)`}
                  >
                    <i className={`${overlayIcon} text-fluid-3 text-surface-0`} aria-hidden />
                  </a>
                </div>
                <div className="p-3 text-center">
                  <div>
                    <p className="tech m-0 mb-1 text-copyright uppercase tracking-wide text-primary-600">
                      {project.tech}
                    </p>
                    <h3 className="m-0 mb-2 text-fluid-3 font-bold text-text-default">
                      {project.title}
                    </h3>
                  </div>
                  <a
                    href={project.githubUrl}
                    className="portfolio-link mt-2 inline-flex min-h-11 min-w-11 items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} on GitHub`}
                  >
                    <i className="fab fa-github-alt text-fluid-3 text-primary-600 transition-colors duration-200 ease-in-out hover:text-primary-700" aria-hidden />
                  </a>
                  <p className="m-0 mt-1 text-copyright text-text-subtle">Github</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
