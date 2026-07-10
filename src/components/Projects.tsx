import { projects } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { pictureSrcSet } from '../utils/pictureSources'
import { imgCardThumbClass, portfolioCardClass } from '../utils/layoutClasses'
import { Section } from './Section'
import { Icon, type IconKey } from './Icons'

export function Projects() {
  return (
    <Section id="projects" title="My Projects" variant="project">
      <div className="grid grid-cols-1 gap-3 text-center @[36rem]:grid-cols-2 @[60rem]:grid-cols-3">
        {projects.map((project) => {
          const overlayHref = project.liveUrl ?? project.githubUrl
          const overlayIcon: IconKey = project.liveUrl
            ? 'external-link-alt'
            : 'github-alt'
          return (
            <div key={project.id} className="flex">
              <div className={`${portfolioCardClass} flex h-full w-full flex-col`}>
                <div className="relative h-[12.5rem] overflow-hidden">
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={pictureSrcSet(project.imageUrl, [640, 1280])}
                      sizes="(min-width: 60rem) 33vw, (min-width: 36rem) 50vw, 100vw"
                    />
                    <source
                      type="image/webp"
                      srcSet={pictureSrcSet(project.imageUrl, [640, 1280])}
                      sizes="(min-width: 60rem) 33vw, (min-width: 36rem) 50vw, 100vw"
                    />
                    <img
                      src={withBase(project.imageUrl)}
                      srcSet={`${withBase(project.imageUrl.replace(/\.(png|jpe?g|webp)$/i, '-640.$1'))} 640w, ${withBase(project.imageUrl)} ${project.imageWidth}w`}
                      sizes="(min-width: 60rem) 33vw, (min-width: 36rem) 50vw, 100vw"
                      alt={project.title}
                      width={project.imageWidth}
                      height={project.imageHeight}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      className={imgCardThumbClass}
                    />
                  </picture>
                  <a
                    href={overlayHref}
                    className="portfolio-zoom-link absolute top-1/2 left-1/2 z-2 flex h-[3.75rem] w-[3.75rem] min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 opacity-100 pointer-fine:pointer-events-none pointer-fine:opacity-0 pointer-fine:group-hover:pointer-events-auto pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-0"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} (external)`}
                  >
                    <Icon name={overlayIcon} className="text-fluid-3 text-surface-0" aria-hidden />
                  </a>
                </div>
                <div className="flex grow flex-col p-3 text-center">
                  <p className="tech m-0 mb-1 text-copyright uppercase tracking-wide text-primary-600">
                    {project.tech}
                  </p>
                  <h3 className="m-0 mb-2 text-fluid-3 font-bold text-text-default">
                    {project.title}
                  </h3>
                  <a
                    href={project.githubUrl}
                    className="portfolio-link mt-auto inline-flex min-h-11 min-w-11 items-center justify-center pt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} on GitHub`}
                  >
                    <Icon name="github-alt" className="text-fluid-3 text-primary-600 transition-colors duration-200 ease-in-out hover:text-primary-700" aria-hidden />
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
