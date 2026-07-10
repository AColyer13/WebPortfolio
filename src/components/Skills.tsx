import { skillBlocks } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { skillCardClass } from '../utils/layoutClasses'
import { Icon, isRegisteredIcon } from './Icons'
import { Section } from './Section'

function SkillIcon({ icon }: { icon: string }) {
  if (isRegisteredIcon(icon)) {
    return <Icon name={icon} className="shrink-0 text-[2.5rem] leading-none text-primary-600" />
  }
  if (/\.(?:svg|png|jpe?g|webp)$/i.test(icon)) {
    const logoUrl = withBase(icon)
    return (
      <span
        className="skill-card__logo"
        // URL is data-driven per icon; the static mask geometry lives in
        // `.skill-card__logo` in index.css. Setting `mask-image` inline (not
        // via a CSS variable) is deliberate: a `url()` value resolved inside
        // an external stylesheet would be relative to that stylesheet
        // (`./assets/...`) instead of the document (`./...`).
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
          <details key={block.title} className="skills-details w-full" open>
            <summary className="skills-details__summary mx-auto mb-(--section-subheading-gap) flex max-w-[50ch] cursor-pointer list-none items-center justify-center gap-2 [&::-webkit-details-marker]:hidden">
              <svg
                className="skills-chevron size-4 text-primary-500 transition-transform duration-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
              <span className="text-fluid-3 font-medium leading-snug tracking-wide text-primary-500">
                {block.title}
              </span>
            </summary>
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
          </details>
        ))}
      </div>
    </Section>
  )
}
