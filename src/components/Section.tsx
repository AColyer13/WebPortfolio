import type { ReactNode } from 'react'

const variantClass = {
  skills: 'skills',
  resume: 'resume',
  project: 'project',
} as const

export type SectionVariant = keyof typeof variantClass

interface SectionProps {
  id: string
  title: string
  variant: SectionVariant
  children: ReactNode
  /** Optional wrapper around children (e.g. `resume__inner` for max-width) */
  contentClassName?: string
}

/** Shared band layout: section padding, container, centered h2, even title spacing. */
export function Section({ id, title, variant, children, contentClassName }: SectionProps) {
  const body = contentClassName ? <div className={contentClassName}>{children}</div> : children

  return (
    <section className={`${variantClass[variant]} section-block`} id={id}>
      <div className="container">
        <div className="section-heading section-heading--center">
          <h2>{title}</h2>
        </div>
        {body}
      </div>
    </section>
  )
}

interface SubsectionHeadingProps {
  title: string
}

/** Category titles inside a section (e.g. Skills groups) — same centering as section h2. */
export function SubsectionHeading({ title }: SubsectionHeadingProps) {
  return (
    <div className="subsection-heading section-heading--center">
      <h3>{title}</h3>
    </div>
  )
}
