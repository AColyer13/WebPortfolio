import { skillBlocks } from '../data/portfolio'
import { Section } from './Section'

export function Skills() {
  return (
    <Section id="skills" title="Skills" variant="skills">
      <div className="columns-1 gap-x-10 md:columns-2">
        {skillBlocks.map((block) => (
          <div
            key={block.title}
            className="mb-8 min-w-0 break-inside-avoid border-b border-border-default pb-6 last:mb-0"
          >
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
