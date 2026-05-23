import { skillBlocks } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'

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
          maskImage: `url(${logoUrl})`,
          WebkitMaskImage: `url(${logoUrl})`,
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
    <section className="skills section-block" id="skills">
      <div className="container">
        <div className="section-heading section-heading--center">
          <h2>Skills</h2>
        </div>
        <div className="skills-blocks">
          {skillBlocks.map((block) => (
            <div key={block.title} className="skills-block">
              <div className="skills-block__heading section-heading--center">
                <h3>{block.title}</h3>
              </div>
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
      </div>
    </section>
  )
}
