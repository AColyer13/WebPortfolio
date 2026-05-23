import { skillBlocks } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { Section, SubsectionHeading } from './Section'

const FASTAPI_ICON_PATH =
  'M 3.175 0.53433431 A 2.6405416 2.6320024 0 0 0 0.53433431 3.166215 A 2.6405416 2.6320024 0 0 0 3.175 5.7986125 A 2.6405416 2.6320024 0 0 0 5.8156657 3.166215 A 2.6405416 2.6320024 0 0 0 3.175 0.53433431 z M 2.9925822 1.7259928 L 4.6539795 1.7259928 L 2.9858643 2.8985311 L 4.1263631 2.8985311 L 1.6960205 4.6064372 L 2.2236369 3.4344157 L 2.4649658 2.8985311 L 2.9925822 1.7259928 z'

const skillCardClass =
  'skill-card flex h-[9.375rem] min-h-[9.375rem] max-h-[9.375rem] w-full flex-1 items-center justify-center rounded-lg border border-border-default bg-surface-0 px-3 py-4 text-center transition-[transform,border-color,box-shadow] duration-200 ease-in-out hover:-translate-y-[0.3125rem] hover:border-primary-600 hover:shadow-card'

function isFontAwesomeIcon(icon: string) {
  return /^(?:fab|fas|far|fal|fat|fad|fass|fasr|fasl|fast)\s+fa-/.test(icon)
}

function FastApiIcon() {
  return (
    <svg className="skill-card__icon block h-10 w-10 shrink-0 text-primary-600" viewBox="0 0 6.35 6.35" aria-hidden>
      <path fill="currentColor" d={FASTAPI_ICON_PATH} />
    </svg>
  )
}

function SkillIcon({ icon }: { icon: string }) {
  if (isFontAwesomeIcon(icon)) {
    return <i className={`${icon} shrink-0 text-[2.5rem] leading-none text-primary-600`} aria-hidden />
  }
  if (icon === 'images/fastapi.svg') {
    return <FastApiIcon />
  }
  if (/\.(?:svg|png|jpe?g|webp)$/i.test(icon)) {
    const logoUrl = withBase(icon)
    return (
      <span
        className="block h-10 w-10 shrink-0 bg-primary-600 [mask-mode:alpha] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-mode:alpha] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
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
                  <div className={skillCardClass}>
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
