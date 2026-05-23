import { skillBlocks } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { Section, SubsectionHeading } from './Section'

function SkillIcon({ icon }: { icon: string }) {
  if (icon.includes('fa')) {
    return <i className={icon} aria-hidden />
  }
  if (icon === 'images/fastapi.svg') {
    return (
      <svg className="skill-card__inline-logo" viewBox="0 0 6.35 6.35" aria-hidden>
        <path d="M 3.175 0.53433431 A 2.6405416 2.6320024 0 0 0 0.53433431 3.166215 A 2.6405416 2.6320024 0 0 0 3.175 5.7986125 A 2.6405416 2.6320024 0 0 0 5.8156657 3.166215 A 2.6405416 2.6320024 0 0 0 3.175 0.53433431 z M 2.9925822 1.7259928 L 4.6539795 1.7259928 L 2.9858643 2.8985311 L 4.1263631 2.8985311 L 1.6960205 4.6064372 L 2.2236369 3.4344157 L 2.4649658 2.8985311 L 2.9925822 1.7259928 z" />
      </svg>
    )
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
                      <div className="skill-card__body">
                        <h4>{skill.name}</h4>
                        <SkillIcon icon={skill.icon} />
                      </div>
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
