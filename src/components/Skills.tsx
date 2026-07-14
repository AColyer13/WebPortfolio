import { useEffect, useId, useRef, useState } from 'react'
import { skillBlocks, type Skill, type SkillBlock } from '../data/portfolio'
import { withBase } from '../utils/baseUrl'
import { skillCardClass } from '../utils/layoutClasses'
import { positionCalloutPopover } from './calloutPopover'
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
 * Detailed view of a skill, rendered inside a native `popover="manual"` element.
 * We disable the UA's auto-placement so we can anchor the popover directly on
 * top of the originating skill card. Inline `top`/`left`/`width` are written
 * from JS at open-time (and on resize/scroll) so the popover overlays the
 * skill rather than centering in the viewport.
 */
function SkillPopover({ skill, popoverId, onClose }: SkillPopoverProps) {
  return (
    <div
      id={popoverId}
      popover="manual"
      className="skill-popover rounded-md border border-border-default bg-surface-0 p-4 text-text-default shadow-[0_1rem_2.5rem_rgb(0_0_0_/0.18)]"
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
 * One skill tile: name on top, the logo centered below, and a tiny (i) trigger
 * in the bottom-right corner. The (i) opens a `popover="manual"` element that
 * is positioned in JS to overlay this specific card — so it never floats to
 * viewport center. Light-dismiss (clicking outside) still closes it because
 * the popover stays in the top layer.
 */
function SkillCard({ skill }: SkillCardProps) {
  const popoverId = useId()
  const triggerId = `${popoverId}-trigger`
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  // Position the popover as a small callout anchored to the (i) trigger.
  // The popover's bottom-right corner sits flush with the (i), with a
  // small offset so the arrow can point at it. JS writes right/bottom
  // (not top/left) so the popover extends up-and-to-the-left of the chip,
  // reading as "info coming out of (i)".
  useEffect(() => {
    if (!open) return

    const popover = document.getElementById(popoverId) as
      | (HTMLElement & { showPopover?: () => void; hidePopover?: () => void })
      | null
    const trigger = triggerRef.current
    if (!popover || !trigger) return

    const positionPopover = () => positionCalloutPopover(popover, trigger)

    const openPopover = () => {
      if (typeof popover.showPopover === 'function') popover.showPopover()
      // Position *after* showPopover so the popover has been laid out and
      // we can measure its real height for the top calculation.
      positionPopover()
    }

    const closePopover = () => {
      if (typeof popover.hidePopover === 'function') popover.hidePopover()
    }

    // Open immediately so the user sees the overlay.
    openPopover()

    const onScrollOrResize = () => {
      if (popover.matches?.(':popover-open')) positionPopover()
    }

    // Light-dismiss: any pointerdown outside the wrapper hides the popover.
    const onOutside = (event: MouseEvent) => {
      const wrapper = wrapperRef.current
      if (!wrapper?.contains(event.target as Node)) {
        setOpen(false)
        closePopover()
      }
    }

    // Esc closes too.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        closePopover()
      }
    }

    // Defer the outside-click listener so the click that opened us
    // doesn't immediately close us.
    const outsideHandle = window.setTimeout(() => {
      window.addEventListener('pointerdown', onOutside)
    }, 0)

    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(outsideHandle)
      window.removeEventListener('pointerdown', onOutside)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('keydown', onKey)
      if (popover.matches?.(':popover-open')) closePopover()
    }
  }, [open, popoverId])

  const onToggle = () => setOpen((value) => !value)

  return (
    <div ref={wrapperRef} className="relative flex w-full min-w-0 self-stretch">
      <div className={`${skillCardClass} flex w-full`}>
        <div className="skill-card__body flex max-h-full w-full min-w-0 flex-col items-center justify-center gap-2">
          <h4 className="m-0 overflow-wrap-anywhere text-center text-fluid-3 font-medium leading-snug text-text-default">
            {skill.name}
          </h4>
          <SkillIcon icon={skill.icon} />
        </div>
      </div>
      {/* (i) sits as a tiny clean circle tucked into the bottom-right corner of
          the card. Fully contained inside the card surface - no negative
          translate that would let it spill past the card border. */}
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label={`About ${skill.name} — show description and how I use it`}
        className="skill-info-btn right-2 bottom-2 inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-50 text-copyright font-medium leading-none text-text-muted transition-colors duration-150 ease-in-out hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        onClick={onToggle}
      >
        i
      </button>
      <SkillPopover
        skill={skill}
        popoverId={popoverId}
        onClose={() => setOpen(false)}
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
        className="grid w-full grid-cols-2 items-stretch justify-items-stretch gap-x-(--container-inline) gap-y-4 pb-3 @[56rem]:grid-cols-4 @[56rem]:gap-x-4"
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
      <div className="skills-blocks flex w-full flex-col gap-3">
        {skillBlocks.map((block) => (
          <SkillBlockSection key={block.title} block={block} />
        ))}
      </div>
    </Section>
  )
}