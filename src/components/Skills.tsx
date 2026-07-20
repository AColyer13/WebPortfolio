import { useId, useRef, useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { skillBlocks, type Skill, type SkillBlock } from '../data/portfolio'
import {
  containerClass,
  sectionBlockClass,
} from '../utils/layoutClasses'
import { positionCalloutPopover } from './calloutPopover'
import { Icon, isRegisteredIcon } from './Icons'

/** Per-skill visual: SVG (mask), registered icon, or text-only fallback. */
function SkillIcon({ icon }: { icon: string }) {
  if (isRegisteredIcon(icon)) {
    return (
      <Icon
        name={icon}
        className="skill-card__logo shrink-0 text-[1.125rem] leading-none text-text-muted"
      />
    )
  }
  if (/\.(?:svg|png|jpe?g|webp)$/i.test(icon)) {
    const maskUrl = icon.startsWith('/') ? icon : `/${icon}`
    return (
      <span
        className="skill-card__logo"
        style={{
          maskImage: `url("${maskUrl}")`,
          WebkitMaskImage: `url("${maskUrl}")`,
        }}
        aria-hidden
      />
    )
  }
  return (
    <i className="shrink-0 text-[1rem] not-italic text-text-muted" aria-hidden>
      {icon}
    </i>
  )
}

/**
 * Skills section: a tech-spec sheet, each discipline a collapsible
 * `<details>` row. The terminal aesthetic is layered onto the original
 * details/summary shell so the existing `:focus-visible` chain keeps
 * working and the existing markup remains a fair host for the new
 * `.hm-` class chrome.
 *
 * 8-state discipline:
 *   - default:    collapsed (`<details>` open attr absent)
 *   - hover:      summary underline / chevron weight
 *   - focus:      summary outline visible (handled by UA focus styles)
 *   - active:     chevron tilts (CSS rule on `[open] > summary`)
 *   - expanded:   chevron rotates 180°, grid reveals
 *   - revealed-empty: still uses `skill-card__body` for spacing
 */
export function Skills() {
  return (
    <section id="skills" className={sectionBlockClass}>
      <div className={containerClass}>
        <header className="hm-section-head">
          <span className="hm-section-head__prompt">
            skills --list --detail
          </span>
          <h2 className="hm-section-head__title"># stack</h2>
        </header>
        <div className="skills-blocks gap-3">
          {skillBlocks.map((block) => (
            <SkillBlockSection key={block.title} block={block} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface SkillBlockSectionProps {
  block: SkillBlock
}

function SkillBlockSection({ block }: SkillBlockSectionProps) {
  return (
    <details className="skills-details hm-discipline" id={`skill-${slug(block.title)}`}>
      <summary className="skills-details__summary hm-discipline__head">
        <h3 className="hm-discipline__title">{block.title}</h3>
        <span className="hm-discipline__summary">{block.summary}</span>
        <ChevronDown
          className="skills-details__chevron"
          aria-hidden
          strokeWidth={2}
        />
      </summary>
      <div className="hm-skill-grid">
        {block.skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </details>
  )
}

/** Simple kebab-case helper for fragmenting the block title into an id. */
function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface SkillPopoverProps {
  skill: Skill
  popoverId: string
}

function SkillPopover({ skill, popoverId }: SkillPopoverProps) {
  return (
    <div
      id={popoverId}
      popover="manual"
      className="hm-skill-popover"
      role="dialog"
      aria-label={`${skill.name} details`}
    >
      <h4 className="hm-skill-popover__name">
        $ man {skill.name.toLowerCase().replace(/\s+/g, '-')}
      </h4>
      <p className="hm-skill-popover__desc">{skill.description}</p>
      <p className="hm-skill-popover__app">
        <strong>// in practice:</strong> {skill.application}
      </p>
    </div>
  )
}

interface SkillCardProps {
  skill: Skill
}

function SkillCard({ skill }: SkillCardProps) {
  const popoverId = useId()
  const triggerId = `${popoverId}-trigger`
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

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
      positionPopover()
    }

    const closePopover = () => {
      if (typeof popover.hidePopover === 'function') popover.hidePopover()
    }

    openPopover()

    const onScrollOrResize = () => {
      if (popover.matches?.(':popover-open')) positionPopover()
    }

    const onOutside = (event: MouseEvent) => {
      const wrapper = wrapperRef.current
      if (!wrapper?.contains(event.target as Node)) {
        setOpen(false)
        closePopover()
      }
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        closePopover()
      }
    }

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
    <div ref={wrapperRef} className="hm-skill relative">
      <div className="skill-card hm-skill__card">
        <div className="skill-card__body hm-skill__body">
          <SkillIcon icon={skill.icon} />
          <h4 className="hm-skill__name">{skill.name}</h4>
          <p className="hm-skill__desc">{skill.description}</p>
        </div>
      </div>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label={`About ${skill.name}. Show description and how I use it`}
        className="skill-info-btn right-2 bottom-2 size-4 hm-skill__trigger"
        onClick={onToggle}
      >
        <span aria-hidden>[i]</span>
      </button>
      <SkillPopover
        skill={skill}
        popoverId={popoverId}
      />
    </div>
  )
}
