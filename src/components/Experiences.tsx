import { education, timeline } from '../data/portfolio'
import { Section } from './Section'

export function Experiences() {
  return (
    <Section id="experience" title="Experience" variant="resume">
      <ol className="m-0 flex list-none flex-col gap-(--space-6) p-0">
        {timeline.map((item) => (
          <li
            key={`${item.end}-${item.title}`}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-(--space-4) gap-y-(--space-1) @max-[40rem]:grid-cols-[4.5rem_minmax(0,1fr)] @max-[40rem]:gap-x-(--space-3)"
          >
            <p className="metric m-0 text-copyright font-medium text-text-subtle">
              {item.start ? (
                <>
                  <span className="whitespace-nowrap">{item.start} –</span>{' '}
                  <span className="whitespace-nowrap">{item.end}</span>
                </>
              ) : (
                item.end
              )}
            </p>
            <div className="min-w-0">
              <h3 className="m-0 text-pretty">{item.title}</h3>
              <p className="m-0 mt-(--space-1) text-fluid-1 font-medium text-text-muted">
                {item.company}
              </p>
              <p className="m-0 mt-(--space-2) text-body font-normal">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <h3 className="m-0 mt-(--space-8) border-t border-border-default pt-(--space-8)">
        Education
      </h3>
      <ul className="m-0 mt-(--space-4) flex list-none flex-col gap-(--space-4) p-0">
        {education.map((item) => (
          <li
            key={item.title}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-(--space-4) @max-[40rem]:grid-cols-[4.5rem_minmax(0,1fr)] @max-[40rem]:gap-x-(--space-3)"
          >
            <p className="metric m-0 text-copyright font-medium text-text-subtle">
              {item.date}
            </p>
            <div className="min-w-0">
              <p className="m-0 text-fluid-1 font-semibold text-text-default">
                {item.title}
              </p>
              <p className="m-0 mt-(--space-1) text-body">
                {item.institution}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
