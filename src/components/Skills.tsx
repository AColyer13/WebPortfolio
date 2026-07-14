import { useId } from 'react'
import { skillBlocks, type Skill, type SkillBlock } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { skillCardClass } from '../utils/layoutClasses'
import { Icon, isRegisteredIcon } from './Icons'
import { Section } from './Section'

function SkillIcon({ icon }: { icon: string }) {
  if (isRegisteredIcon(icon)) {
    return <Icon name={icon} className="shrink-0 text-[2.25rem] leading-none text-text-muted" />
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
    <i className="skill-card__emoji shrink-0 text-[1.875rem] not-italic" aria-hidden>
      {icon}
    </i>
  )
}

interface SkillPopoverProps {
  skill: Skill
  /** Unique id pairing the trigger button to the popover region. */
  popoverId: string
  onClose: () => void
}

/**
 * Detailed view of a skill, rendered inside a native `popover` element so the
 * browser handles light-dismiss, focus management, and stacking automatically.
 */
function SkillPopover({ skill, popoverId, onClose }: SkillPopoverProps) {
  return (
    <div
      id={popoverId}
      popover="auto"
      className="skill-popover w-[min(22rem,calc(100vw-2rem))] rounded-md border border-border-default bg-surface-0 p-4 text-text-default shadow-[0_1rem_2.5rem_rgb(0_0_0_/0.18)]"
      role="dialog"
      aria-label={`${skill.name} — details`}
    >
      <div className="mb-2 flex items-center gap-2">
        <SkillIcon icon={skill.icon} />
        <h4 className="m-0 text-fluid-3 font-bold leading-snug">{skill.name}</h4>
      </div>
      <p className="m-0 mb-2 text-fluid-1 leading-relaxed text-text-default">
        {skill.description}
      </p>
      <p className="m-0 text-fluid-1 leading-relaxed text-text-muted">
        <span className="font-medium text-text-default">In practice:</span>{' '}
        {skill.application}
      </p>
      <button
        type="button"
        className="skill-popover__close mt-3 inline-flex min-h-9 cursor-pointer items-center rounded-sm border border-border-default bg-surface-50 px-3 py-1 text-copyright font-medium text-text-default transition-colors duration-150 ease-in-out hover:border-text-muted"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  )
}

interface SkillCardProps {
  skill: Skill
}

/**
 * One skill tile: logo, name, and an (i) trigger in the bottom-right corner
 * that opens a popover with the description and a one-line professional
 * application.
 */
function SkillCard({ skill }: SkillCardProps) {
  const popoverId = useId()
  const triggerId = `${popoverId}-trigger`

  return (
    <div className="flex w-full min-w-0 self-stretch">
      <div className={`${skillCardClass} skill-card--with-info`}>
        <div className="skill-card__body relative flex max-h-full w-full min-w-0 flex-col items-center justify-center gap-2">
          <h4 className="m-0 overflow-wrap-anywhere text-center text-fluid-3 font-medium leading-snug text-text-default">
            {skill.name}
          </h4>
          <SkillIcon icon={skill.icon} />
          <button
            type="button"
            id={triggerId}
            className="skill-info-btn absolute right-1.5 bottom-1.5 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-default bg-surface-50 text-copyright font-medium leading-none text-text-muted transition-colors duration-150 ease-in-out hover:border-text-default hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            aria-label={`About ${skill.name} — show description and how I use it`}
            aria-describedby={popoverId}
            popoverTarget={popoverId}
            data-tooltip={`What ${skill.name} is and how I use it`}
          >
            i
          </button>
        </div>
      </div>
      <SkillPopover
        skill={skill}
        popoverId={popoverId}
        onClose={() => {
          const popover = document.getElementById(popoverId)
          if (popover && 'hidePopover' in popover) {
            ;(popover as HTMLElement & { hidePopover: () => void }).hidePopover()
          }
        }}
      />
    </div>
  )
}

interface SkillBlockSectionProps {
  block: SkillBlock
}

/**
 * One top-level discipline block. Starts collapsed; clicking the heading
 * expands the row. The heading itself stays minimal — just like the original
 * always-open style. Only the chevron animates (rotates 90 deg on expand).
 */
function SkillBlockSection({ block }: SkillBlockSectionProps) {
  const summaryId = useId()
  return (
    <details className="skills-details w-full">
      <summary className="skills-details__summary mx-auto mb-(--section-subheading-gap) flex max-w-[52ch] cursor-pointer list-none items-center justify-center gap-2 text-center [&::-webkit-details-marker]:hidden">
        <h3 className="m-0 text-fluid-4 font-bold leading-tight tracking-tight text-text-default">
          {block.title}
        </h3>
        <span className="skills-details__chevron inline-flex shrink-0 text-text-muted transition-transform duration-200 ease-out" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </summary>
      <p
        id={summaryId}
        className="mx-auto mb-(--section-subheading-gap) max-w-[52ch] text-center text-fluid-1 leading-relaxed text-text-muted"
      >
        {block.summary}
      </p>
      <div
        className="grid w-full grid-cols-2 items-stretch justify-items-stretch gap-x-(--container-inline) gap-y-4 @[56rem]:grid-cols-4 @[56rem]:gap-x-4"
        aria-describedby={summaryId}
      >
        {block.skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </details>
  )
}

export function Skills() {
  return (
    <Section
      id="skills"
      title="Skills"
      variant="skills"
      headingClassName="flow-root mb-3 mx-auto max-w-[52ch] text-center"
    >
      <div className="flex w-full flex-col gap-(--spacing-8)">
        {skillBlocks.map((block) => (
          <SkillBlockSection key={block.title} block={block} />
        ))}
      </div>
    </Section>
  )
}
