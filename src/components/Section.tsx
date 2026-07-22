import type { ReactNode } from 'react'
import {
  containerClass,
  sectionBlockClass,
  sectionContainerClass,
  sectionDeferredClass,
  sectionHeadingClass,
} from '../utils/layoutClasses'

const variantClass = {
  skills: `${sectionDeferredClass} bg-surface-50 @container/skills`,
  resume: `${sectionDeferredClass} bg-surface-0 @container/resume`,
  // No content-visibility here — it can leave project links unclickable after tab/BFCache restore.
  project: 'bg-surface-50 @container/portfolio',
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
