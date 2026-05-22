import { skillBlocks } from '../data/portfolio'

function SkillIcon({ icon }: { icon: string }) {
  if (icon.includes('fa')) {
    return <i className={icon} aria-hidden />
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
          {skillBlocks.map((block, blockIndex) => (
            <div
              key={blockIndex}
              className="skills-block"
              aria-label={`Skills group ${blockIndex + 1}`}
            >
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
