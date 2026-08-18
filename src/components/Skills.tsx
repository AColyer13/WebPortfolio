import { skillBlocks } from '../data/portfolio'
import { Section } from './Section'

export function Skills() {
  return (
    <Section
      id="skills"
      title="Skills"
      variant="skills"
      headingClassName="flow-root mb-6 mx-auto max-w-[52ch] text-center"
    >
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
        {skillBlocks.map((block) => (
          <div
            key={block.title}
            className="rounded-lg border border-border-default bg-surface-0 p-5 shadow-xs transition-colors"
          >
            <h3 className="mb-3 text-fluid-3 font-bold text-text-default">
              {block.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {block.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md border border-border-default bg-surface-50 px-2.5 py-1 text-fluid-1 font-medium text-text-default transition-colors hover:bg-surface-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}