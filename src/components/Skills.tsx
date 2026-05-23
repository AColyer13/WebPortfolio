import { skillBlocks } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { skillCardClass } from '../utils/layoutClasses'
import { touchPressHandlers } from '../utils/touchPress'
import { Section, SubsectionHeading } from './Section'

function isFontAwesomeIcon(icon: string) {
  return /^(?:fab|fas|far|fal|fat|fad|fass|fasr|fasl|fast)\s+fa-/.test(icon)
}

function SkillIcon({ icon }: { icon: string }) {
  if (isFontAwesomeIcon(icon)) {
    return <i className={`${icon} shrink-0 text-[2.5rem] leading-none text-primary-600`} aria-hidden />
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
    <i className="skill-card__emoji shrink-0 text-[2rem] not-italic" aria-hidden>
      {icon}
    </i>
  )
}

export function Skills() {
  return (
    <Section
      id="skills"
      title="Skills"
      variant="skills"
      headingClassName="flow-root mb-3 mx-auto max-w-[50ch] text-center"
    >
      <div className="flex w-full flex-col gap-(--section-subheading-gap)">
        {skillBlocks.map((block) => (
          <div key={block.title} className="w-full">
            <SubsectionHeading title={block.title} />
            <div className="grid w-full grid-cols-2 items-stretch justify-items-stretch gap-x-(--container-inline) gap-y-4 @[56rem]:grid-cols-4 @[56rem]:gap-x-4">
              {block.skills.map((skill) => (
                <div key={skill.name} className="flex w-full min-w-0 self-stretch">
                  <div className={skillCardClass} {...touchPressHandlers}>
                    <div className="skill-card__body flex max-h-full w-full min-w-0 flex-col items-center justify-center gap-2">
                      <h4 className="m-0 w-full shrink-0 overflow-wrap-anywhere text-fluid-3 font-medium leading-snug text-text-default">
                        {skill.name}
                      </h4>
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
