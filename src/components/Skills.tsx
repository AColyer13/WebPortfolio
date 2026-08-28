import { skillBlocks, type SkillBlock } from '../data/portfolio'
import { Section } from './Section'

const midpoint = Math.ceil(skillBlocks.length / 2)
const columns = [skillBlocks.slice(0, midpoint), skillBlocks.slice(midpoint)]

function SkillColumn({ blocks }: { blocks: SkillBlock[] }) {
  return (
    <div className="flex min-w-0 flex-col">
      {blocks.map((block) => (
        <div
          key={block.title}
          className="border-b border-border-default pb-6 [&:not(:last-child)]:mb-8"
        >
          <h3 className="m-0 mb-3 text-fluid-3 font-bold text-text-default">{block.title}</h3>
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
  )
}

export function Skills() {
  return (
    <Section id="skills" title="Skills" variant="skills">
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
        {columns.map((blocks, i) => (
          <SkillColumn key={i} blocks={blocks} />
        ))}
      </div>
    </Section>
  )
}
