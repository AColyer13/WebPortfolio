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

/** Below-the-fold sections — defer layout/paint until near viewport */
export const sectionDeferredClass =
  '[content-visibility:auto] [contain-intrinsic-size:auto_50rem]'

export const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap rounded-md border-none bg-btn-bg px-4 py-2 text-btn font-medium text-btn-fg transition-colors duration-150 ease-out hover:bg-btn-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

/** Secondary (outline) CTA — for hero pairing, keeps one clear primary action. */
export const secondaryBtnClass =
  'inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-border-default bg-transparent px-4 py-2 text-btn font-medium text-text-default transition-colors duration-150 ease-out hover:border-text-muted hover:bg-surface-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

/** Timeline / list rows — hairline, not card chrome */
export const cardClass =
  'border-b border-border-default bg-transparent contain-[layout_style] transition-colors duration-150 ease-out'

/** Above-the-fold LCP (hero) — chrome-free; sizing owned by `.hero-media` */
export const imgHeroClass = 'block h-auto w-full max-w-full'

export const portfolioCardClass =
  'portfolio-item-inner flex w-full min-w-0 flex-col self-start border-b border-border-default bg-transparent contain-[layout_style] transition-colors duration-150 ease-out pointer-fine:hover:border-text-muted'

/** Contact submit — primary button with full-width */
export const primaryBtnSubmitClass = `${primaryBtnClass} w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`

/** Below-the-fold card thumbs — fixed crop box in Projects */
export const imgCardThumbClass =
  'mx-auto block h-full w-full max-w-full object-cover'
