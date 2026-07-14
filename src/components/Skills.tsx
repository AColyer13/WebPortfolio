import { useEffect, useId, useRef, useState } from 'react'
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

interface SkillCardProps {
  skill: Skill
}

/**
 * One skill tile. Renders the compact face (name + logo) by default.
 * Clicking the (i) trigger flips the tile in place — the card surface
 * itself transforms into a detail view that overlays the compact face,
 * with the logo / name up top and the description + application below.
 * Nothing leaves the tile; no floating popover, no mid-screen dialog.
 */
function SkillCard({ skill }: SkillCardProps) {
  // Per-card open state. A card flip is animated, kept inside its own
  // grid cell, and dismissed by clicking the (i) again or via Esc.
  const [open, setOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const buttonId = useId()

  // Close on Escape (matches native popover/dialog behaviour).
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Close when the user clicks anywhere outside the open card.
  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) setOpen(false)
    }
    // Defer so the original click that opened the card doesn't immediately close it.
    const handle = window.setTimeout(() => {
      window.addEventListener('pointerdown', onPointer)
    }, 0)
    return () => {
      window.clearTimeout(handle)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <div className="relative flex w-full min-w-0 self-stretch">
      <div
        ref={cardRef}
        className={`${skillCardClass} skill-card--${open ? 'open' : 'closed'} flex w-full overflow-hidden`}
      >
        {/* Compact face (default). */}
        {!open ? (
          <div className="skill-card__body skill-card__face skill-card__face--compact flex max-h-full w-full min-w-0 flex-col items-center justify-center gap-2">
            <h4 className="m-0 overflow-wrap-anywhere text-center text-fluid-3 font-medium leading-snug text-text-default">
              {skill.name}
            </h4>
            <SkillIcon icon={skill.icon} />
          </div>
        ) : null}

        {/* Expanded face - overlays the compact face in place.
            The skill-card surface grows just enough to fit both the title
            row and the description/application copy. */}
        {open ? (
          <div
            className="skill-card__body skill-card__face skill-card__face--expanded flex w-full min-w-0 flex-col items-start gap-2 overflow-y-auto p-3 text-left"
            role="dialog"
            aria-modal="false"
            aria-label={`${skill.name} — details`}
          >
            <div className="flex w-full items-start gap-2">
              <SkillIcon icon={skill.icon} />
              <h4 className="m-0 grow shrink basis-0 overflow-wrap-anywhere text-fluid-3 font-bold leading-snug text-text-default">
                {skill.name}
              </h4>
            </div>
            <p className="m-0 text-fluid-1 leading-relaxed text-text-default">
              {skill.description}
            </p>
            <p className="m-0 text-fluid-1 leading-relaxed text-text-muted">
              <span className="font-medium text-text-default">In practice:</span>{' '}
              {skill.application}
            </p>
            <p className="m-0 mt-auto text-copyright text-text-subtle">
              Click anywhere outside or press Esc to close.
            </p>
          </div>
        ) : null}

        {/* (i) toggle button - top-right when closed (so it never overlaps
            the expanded content when open). */}
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={`${buttonId}-panel`}
          aria-label={open ? `Close ${skill.name} details` : `About ${skill.name} — show description and how I use it`}
          onClick={() => setOpen((value) => !value)}
          className="skill-info-btn absolute right-2 top-2 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-default bg-surface-0 text-copyright font-bold leading-none text-text-muted transition-colors duration-150 ease-in-out hover:border-text-default hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" className="size-3.5" aria-hidden>
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            'i'
          )}
        </button>
      </div>
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
