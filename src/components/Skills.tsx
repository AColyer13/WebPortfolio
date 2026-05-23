import { skillBlocks } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { Section, SubsectionHeading } from './Section'

function SkillIcon({ icon }: { icon: string }) {
  if (icon.includes('fa')) {
    return <i className={icon} aria-hidden />
  }
  if (/\.(?:svg|png|jpe?g|webp)$/i.test(icon)) {
    const logoUrl = withBase(icon)
    return (
      <span
        className="skill-card__logo"
        style={{
          maskImage: `url("${logoUrl}")`,
          WebkitMaskImage: `url("${logoUrl}")`,
        }}
        aria-hidden
      />
    )
  }
  return (
    <i className="skill-card__emoji" aria-hidden>
      {icon}
    </i>
  )
}

export function Skills() {
  return (
    <Section id="skills" title="Skills" variant="skills">
      <div className="skills-blocks">
        {skillBlocks.map((block) => (
          <div key={block.title} className="skills-block">
            <SubsectionHeading title={block.title} />
            <div className="skills-grid">
              {block.skills.map((skill) => (
                <div key={skill.name} className="services-item">
                  <div className="skill-card">
                    <h4>{skill.name}</h4>
                    <SkillIcon icon={skill.icon} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
