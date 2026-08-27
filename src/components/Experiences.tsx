import { timeline } from '../data/portfolio'
import { Section } from './Section'

export function Experiences() {
  return (
    <Section id="experience" title="Experience" variant="resume">
      <ol className="m-0 flex list-none flex-col p-0">
        {timeline.map((item) => (
          <li
            key={`${item.year}-${item.title}`}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 border-b border-border-default py-5 first:pt-0 last:border-b-0 @max-[40rem]:grid-cols-[4rem_minmax(0,1fr)] @max-[40rem]:gap-x-3"
          >
            <time className="pt-1 text-copyright font-medium leading-snug text-text-subtle">
              {item.year}
            </time>
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
    </Section>
  )
}
