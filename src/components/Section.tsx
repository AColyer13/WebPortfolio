import type { ReactNode } from 'react'
import {
  containerClass,
  sectionBlockClass,
  sectionContainerClass,
  sectionDeferredClass,
  sectionHeadingClass,
  subsectionHeadingClass,
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
}

export function Section({
  id,
  title,
  variant,
  children,
  contentClassName,
  headingClassName = sectionHeadingClass,
}: SectionProps) {
  const body = contentClassName ? (
    <div className={contentClassName}>{children}</div>
  ) : (
    children
  )

  return (
    <section className={`${variantClass[variant]} ${sectionBlockClass}`} id={id}>
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <div className={headingClassName}>
          <h2 className="m-0 text-h2 font-bold leading-tight text-text-default">{title}</h2>
        </div>
        {body}
      </div>
    </section>
  )
}

interface SubsectionHeadingProps {
  title: string
}

export function SubsectionHeading({ title }: SubsectionHeadingProps) {
  return (
    <div className={subsectionHeadingClass}>
      <h3 className="m-0 text-fluid-3 font-medium leading-snug tracking-wide text-primary-500">
        {title}
      </h3>
    </div>
  )
}
