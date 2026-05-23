/** Shared layout primitives used across sections. */
export const containerClass =
  'mx-auto w-full max-w-(--container-max) px-(--container-inline)'

export const sectionBlockClass = 'py-(--section-padding-y) [contain:layout]'

export const sectionContainerClass =
  'ps-[max(var(--container-inline),env(safe-area-inset-left,0px))] pe-[max(var(--container-inline),env(safe-area-inset-right,0px))]'

export const sectionHeadingClass =
  'flow-root mb-(--section-padding-y) mx-auto max-w-[50ch] text-center'

export const subsectionHeadingClass =
  'flow-root mb-(--section-subheading-gap) mx-auto max-w-[50ch] text-center'

/** Below-the-fold sections — defer layout/paint until near viewport */
export const sectionDeferredClass =
  '[content-visibility:auto] [contain-intrinsic-size:auto_50rem]'

export const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center gap-1 rounded-pill border-none bg-primary-600 px-4 py-2 text-btn font-bold text-surface-0 transition-[background-color,color,transform,box-shadow] duration-200 ease-in-out hover:-translate-y-[0.1875rem] hover:bg-primary-700 hover:text-surface-0 hover:shadow-btn'

export const cardClass =
  'rounded-lg border border-border-default bg-surface-0 contain-[layout_style] transition-[transform,box-shadow,border-color] duration-200 ease-in-out'

/** Decorative lift on fine pointers only — skill cards are not tappable (see index.css). */
export const cardLiftClass =
  'pointer-fine:hover:-translate-y-[0.3125rem] pointer-fine:hover:border-primary-600 pointer-fine:hover:shadow-card'

export const skillCardClass = `${cardClass} ${cardLiftClass} flex h-[9.375rem] min-h-[9.375rem] max-h-[9.375rem] w-full flex-1 items-center justify-center px-3 py-4 text-center`

export const portfolioCardClass = `${cardClass} portfolio-item-inner group mx-auto min-h-[23rem] max-w-full overflow-hidden pointer-fine:hover:-translate-y-[0.3125rem] pointer-fine:hover:border-primary-600 pointer-fine:hover:shadow-card-hover`

/** Contact submit — primary button with full-width / square corners */
export const primaryBtnSubmitClass = `${primaryBtnClass} w-full cursor-pointer rounded-sm text-text-on-primary disabled:cursor-not-allowed disabled:opacity-60`

/** Responsive images — intrinsic width/height attrs pair with these for CLS */
export const imgResponsiveClass = 'mx-auto block h-auto max-w-full'

/** Above-the-fold LCP (hero) */
export const imgHeroClass = `${imgResponsiveClass} rounded-lg shadow-image`

/** Below-the-fold card thumbs — fixed crop box in Projects */
export const imgCardThumbClass =
  'mx-auto block h-full w-full max-w-full object-cover transition-transform duration-200 ease-in-out pointer-fine:group-hover:scale-105'
