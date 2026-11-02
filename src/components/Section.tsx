import type { ReactNode } from 'react'
import {
  containerClass,
  sectionBlockClass,
  sectionContainerClass,
  sectionHeadingClass,
} from '../utils/layoutClasses'

const variantClass = {
  // No content-visibility on any section: estimated heights shifted the page after load,
  // so nav jumps landed short and project links could go unclickable after BFCache restore.
  skills: 'bg-bg @container/skills',
  resume: 'bg-bg @container/resume',
  project: 'bg-bg @container/portfolio',
  brain: 'bg-bg @container/brain',
  bench: 'bg-bg @container/bench',
  contact: 'bg-bg @container/contact',
} as const

export type SectionVariant = keyof typeof variantClass

interface SectionProps {
  id: string
  title: string
  variant: SectionVariant
  children: ReactNode
  contentClassName?: string
  headingClassName?: string
  /** Extra classes merged onto the `<section>` element — use to override the
   * shared section padding (e.g. `pb-(--spacing-4)`) when a section ends with
   * a CTA and the next section's top padding already provides enough breathing
   * room. */
  className?: string
}

export function Section({
  id,
  title,
  variant,
  children,
  contentClassName,
  headingClassName = sectionHeadingClass,
  className,
}: SectionProps) {
  const body = contentClassName ? (
    <div className={contentClassName}>{children}</div>
  ) : (
    children
  )

  return (
    <section
      className={`${variantClass[variant]} ${sectionBlockClass}${className ? ` ${className}` : ''}`}
      id={id}
    >
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <div className={headingClassName}>
          <h2 className="m-0 text-h2 font-bold leading-tight text-text-default">{title}</h2>
        </div>
        {body}
      </div>
    </section>
  )
}
