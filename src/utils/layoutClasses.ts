/** Shared layout primitives used across sections. */
export const containerClass =
  'mx-auto w-full max-w-(--container-max) px-(--container-inline)'

export const sectionBlockClass = 'py-(--section-padding-y) [contain:layout]'

export const sectionContainerClass =
  'ps-[max(var(--container-inline),env(safe-area-inset-left,0px))] pe-[max(var(--container-inline),env(safe-area-inset-right,0px))]'

export const sectionHeadingClass =
  'flow-root mb-(--section-padding-y) mx-auto max-w-[50ch] text-center'

/** Below-the-fold sections — defer layout/paint until near viewport */
export const sectionDeferredClass =
  '[content-visibility:auto] [contain-intrinsic-size:auto_50rem]'

export const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap rounded-md border-none bg-btn-bg px-4 py-2 text-btn font-medium text-btn-fg transition-colors duration-150 ease-in-out hover:bg-btn-hover'

/** Secondary (outline) CTA — for hero pairing, keeps one clear primary action. */
export const secondaryBtnClass =
  'inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-border-default bg-transparent px-4 py-2 text-btn font-medium text-text-default transition-colors duration-150 ease-in-out hover:border-text-muted hover:bg-surface-50'

export const cardClass =
  'rounded-md border border-border-default bg-surface-0 contain-[layout_style] transition-colors duration-150 ease-in-out'

/** Above-the-fold LCP (hero) */
export const imgHeroClass =
  'mx-auto block h-auto max-w-full rounded-md border border-border-default'

export const portfolioCardClass = `${cardClass} portfolio-item-inner mx-auto min-h-[20rem] max-w-full overflow-hidden pointer-fine:hover:border-text-muted`


/** Contact submit — primary button with full-width / square corners */
export const primaryBtnSubmitClass = `${primaryBtnClass} w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`

/** Below-the-fold card thumbs — fixed crop box in Projects */
export const imgCardThumbClass =
  'mx-auto block h-full w-full max-w-full object-cover'
