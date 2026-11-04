/** Shared layout primitives used across sections. */
export const containerClass =
  'mx-auto w-full max-w-(--container-max) px-(--container-inline)'

export const sectionBlockClass = 'py-(--section-padding-y) [contain:layout]'

export const sectionContainerClass =
  'ps-[max(var(--container-inline),env(safe-area-inset-left,0px))] pe-[max(var(--container-inline),env(safe-area-inset-right,0px))]'

export const sectionHeadingClass =
  'flow-root mb-(--section-padding-y) max-w-[40rem] text-start'

/** Centered variant — for sections whose body content is itself centered
 * (mx-auto grid), so the heading lines up with it instead of pinning left. */
export const sectionHeadingCenterClass =
  'flow-root mx-auto mb-(--section-padding-y) max-w-[40rem] text-center'

export const primaryBtnClass = 'btn btn-primary'

/** Secondary control — hairline surface, one accent primary per view. */
export const secondaryBtnClass = 'btn'

/** Timeline rows — separated by whitespace, not rules. */
export const cardClass = 'contain-[layout_style]'

/** Above-the-fold LCP (hero) — chrome-free; sizing owned by `.hero-media` */
export const imgHeroClass = 'block h-auto w-full max-w-full'

export const portfolioCardClass =
  'card portfolio-item-inner flex w-full min-w-0 flex-col self-start contain-[layout_style]'

/** Contact submit — primary button with full-width */
export const primaryBtnSubmitClass = `${primaryBtnClass} submit-btn w-full`

/** Below-the-fold card thumbs — fixed crop box in Projects */
export const imgCardThumbClass =
  'mx-auto block h-full w-full max-w-full object-cover'
