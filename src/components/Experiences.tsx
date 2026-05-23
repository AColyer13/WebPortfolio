import { timeline } from '../data/portfolio'
import { cardClass } from '../utils/layoutClasses'
import { Section } from './Section'

export function Experiences() {
  return (
    <Section
      id="experience"
      title="Experiences"
      variant="resume"
      contentClassName="mx-auto max-w-[min(52rem,100%)]"
    >
      <div className="flex flex-col gap-3">
        {timeline.map((item) => (
          <div
            key={`${item.year}-${item.title}`}
            className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3 @max-[40rem]:grid-cols-[3.5rem_minmax(0,1fr)] @max-[40rem]:gap-2"
          >
            <div className="flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center self-center rounded-pill bg-primary-600 text-center @max-[40rem]:h-14 @max-[40rem]:w-14">
              <span className="text-fluid-1 font-bold leading-tight text-surface-0">
                {item.year}
              </span>
            </div>
            <div
              className={`${cardClass} flex min-w-0 flex-col gap-2 p-4 @max-[40rem]:px-2 @max-[40rem]:py-3`}
            >
              <h3 className="m-0 text-pretty text-fluid-3 font-bold leading-snug text-text-default">
                {item.title}
              </h3>
              <p className="m-0 text-fluid-1 font-medium leading-snug text-primary-600">
                {item.company}
              </p>
              <p className="m-0 text-body font-normal leading-relaxed text-text-muted">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
