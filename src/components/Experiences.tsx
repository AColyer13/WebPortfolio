import { education, timeline } from '../data/portfolio'
import { Section } from './Section'

export function Experiences() {
  return (
    <Section id="experience" title="Experience" variant="resume">
      <ol className="m-0 flex list-none flex-col p-0">
        {timeline.map((item) => (
          <li
            key={`${item.end}-${item.title}`}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 border-b border-border-default py-5 first:pt-0 last:border-b-0 @max-[40rem]:grid-cols-[4.5rem_minmax(0,1fr)] @max-[40rem]:gap-x-3"
          >
            <p className="m-0 pt-1 text-copyright font-medium leading-snug text-text-subtle tabular-nums">
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
              <h3 className="m-0 text-pretty text-fluid-3 font-bold leading-snug text-text-default">
                {item.title}
              </h3>
              <p className="m-0 mt-1 text-fluid-1 font-medium leading-snug text-text-muted">
                {item.company}
              </p>
              <p className="m-0 mt-2 text-body font-normal leading-relaxed text-text-muted">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <h3 className="m-0 mt-8 border-t border-border-default pt-8 text-fluid-3 font-bold leading-snug text-text-default">
        Education
      </h3>
      <ul className="m-0 mt-4 flex list-none flex-col gap-4 p-0">
        {education.map((item) => (
          <li
            key={item.title}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 @max-[40rem]:grid-cols-[4.5rem_minmax(0,1fr)] @max-[40rem]:gap-x-3"
          >
            <p className="m-0 pt-0.5 text-copyright font-medium leading-snug text-text-subtle tabular-nums">
              {item.date}
            </p>
            <div className="min-w-0">
              <p className="m-0 text-fluid-1 font-semibold leading-snug text-text-default">
                {item.title}
              </p>
              <p className="m-0 mt-0.5 text-body leading-snug text-text-muted">
                {item.institution}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
