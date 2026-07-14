/**
 * Anchor a popover="manual" element above-and-aligned with a trigger element.
 *
 * The [popover] UA stylesheet applies `inset: 0` by default, which would
 * otherwise pin the panel to the viewport's top-left corner. This helper
 * resets every inset before applying our own top/left, then clamps to
 * viewport margins so the panel never spills off-screen.
 *
 * Width is fixed at 26rem (or `100vw - 2 * margin` on small screens).
 * Height is capped to whatever fits between the panel's top and the
 * viewport bottom; the vertical scrollbar is only enabled when the
 * panel's natural content actually overflows.
 */
const GAP = 8
const MARGIN = 8
const MAX_WIDTH_REM = 26

export function positionCalloutPopover(
  popover: HTMLElement,
  trigger: HTMLElement,
): void {
  const triggerRect = trigger.getBoundingClientRect()
  const popoverWidth = Math.min(MAX_WIDTH_REM * 16, window.innerWidth - MARGIN * 2)

  // Reset every inset / sizing so the UA default `inset: 0` can't fight us.
  popover.style.position = 'fixed'
  popover.style.inset = 'auto'
  popover.style.right = 'auto'
  popover.style.bottom = 'auto'
  popover.style.top = ''
  popover.style.left = ''
  popover.style.width = ''
  popover.style.maxWidth = ''
  popover.style.maxHeight = 'none'
  popover.style.overflow = 'visible'

  const popoverHeight = popover.getBoundingClientRect().height || 0

  const desiredLeft = triggerRect.right - popoverWidth
  const desiredTop = triggerRect.top - popoverHeight - GAP

  const left = Math.max(
    MARGIN,
    Math.min(desiredLeft, window.innerWidth - popoverWidth - MARGIN),
  )
  const top = Math.max(MARGIN, desiredTop)

  const availableHeight = Math.max(0, window.innerHeight - top - MARGIN)
  const needsScroll = popoverHeight > availableHeight

  popover.style.width = `${Math.round(popoverWidth)}px`
  popover.style.maxWidth = `calc(100vw - ${MARGIN * 2}px)`
  popover.style.top = `${Math.round(top)}px`
  popover.style.left = `${Math.round(left)}px`
  popover.style.maxHeight = `${Math.round(availableHeight)}px`
  popover.style.overflowY = needsScroll ? 'auto' : 'hidden'
  popover.dataset.placement = 'bottom-end'
}