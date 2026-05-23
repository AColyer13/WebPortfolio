/** Shared layout primitives used across sections. */
export const containerClass =
  'mx-auto w-full max-w-(--container-max) px-(--container-inline)'

export const sectionBlockClass =
  'py-(--section-padding-y) [contain:layout] scroll-mt-(--header-offset)'

export const contactSectionClass =
  'py-(--contact-block-padding-y) [contain:layout] scroll-mt-(--header-offset)'

export const footerSectionClass =
  'py-(--footer-padding-y) [contain:layout] scroll-mt-(--header-offset)'

export const sectionContainerClass =
  'ps-[max(var(--container-inline),env(safe-area-inset-left,0px))] pe-[max(var(--container-inline),env(safe-area-inset-right,0px))]'

export const sectionHeadingClass =
  'flow-root mb-(--section-padding-y) mx-auto max-w-[50ch] text-center'

export const subsectionHeadingClass =
  'flow-root mb-(--section-subheading-gap) mx-auto max-w-[50ch] text-center'
