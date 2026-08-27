import { skillBlocks } from '../data/portfolio'
import { sectionHeadingCenterClass } from '../utils/layoutClasses'
import { Section } from './Section'

export function Skills() {
  return (
    <Section
      id="skills"
      title="Skills"
      variant="skills"
      headingClassName={sectionHeadingCenterClass}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
        {skillBlocks.map((block) => (
          <div key={block.title} className="min-w-0 border-b border-border-default pb-6">
            <h3 className="m-0 mb-3 text-fluid-3 font-bold text-text-default">
              {block.title}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {block.skills.map((skill) => (
                <li key={skill} className="text-body leading-snug text-text-muted">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
