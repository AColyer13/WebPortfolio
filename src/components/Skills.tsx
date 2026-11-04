import { skillBlocks, type SkillBlock } from '../data/portfolio'
import { Section } from './Section'

const midpoint = Math.ceil(skillBlocks.length / 2)
const columns = [skillBlocks.slice(0, midpoint), skillBlocks.slice(midpoint)]

function SkillColumn({ blocks }: { blocks: SkillBlock[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-(--space-8)">
      {blocks.map((block) => (
        <div key={block.title}>
          <h3 className="m-0 mb-(--space-3)">{block.title}</h3>
          <ul className="m-0 flex list-none flex-col gap-(--space-2) p-0">
            {block.skills.map((skill) => (
              <li key={skill} className="text-body text-text-muted">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function Skills() {
  return (
    <Section id="skills" title="Skills" variant="skills">
      <div className="grid grid-cols-1 gap-x-(--space-12) gap-y-(--space-8) md:grid-cols-2">
        {columns.map((blocks, i) => (
          <SkillColumn key={i} blocks={blocks} />
        ))}
      </div>
    </Section>
  )
}
