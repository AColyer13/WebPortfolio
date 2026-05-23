const CARD_SELECTOR = '.skill-card, .portfolio-item-inner'
const MOVE_THRESHOLD_PX = 10

function isTouchLikeDevice(): boolean {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

function findCardAt(x: number, y: number): HTMLElement | null {
  const target = document.elementFromPoint(x, y)
  return target?.closest<HTMLElement>(CARD_SELECTOR) ?? null
}

/**
 * Document-level touch feedback for cards. Uses capture-phase listeners and
 * elementFromPoint so a finger down still highlights the card while momentum
 * scroll is running (iOS often skips pointer events on the card itself).
 */
export function initTouchPressFeedback(): () => void {
  if (!isTouchLikeDevice()) return () => {}

  let pressedEl: HTMLElement | null = null
  let startX = 0
  let startY = 0

  const clear = () => {
    pressedEl?.classList.remove('touch-pressed')
    pressedEl = null
  }

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      clear()
      return
    }
    const touch = event.touches[0]!
    startX = touch.clientX
    startY = touch.clientY
    const card = findCardAt(touch.clientX, touch.clientY)
    clear()
    if (card) {
      pressedEl = card
      card.classList.add('touch-pressed')
    }
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!pressedEl || event.touches.length !== 1) return
    const touch = event.touches[0]!
    const dx = touch.clientX - startX
    const dy = touch.clientY - startY
    if (dx * dx + dy * dy > MOVE_THRESHOLD_PX * MOVE_THRESHOLD_PX) {
      clear()
    }
  }

  const onTouchEnd = () => {
    clear()
  }

  const onHide = () => {
    clear()
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') onHide()
  }

  const opts: AddEventListenerOptions = { passive: true, capture: true }
  document.addEventListener('touchstart', onTouchStart, opts)
  document.addEventListener('touchmove', onTouchMove, opts)
  document.addEventListener('touchend', onTouchEnd, opts)
  document.addEventListener('touchcancel', onTouchEnd, opts)
  window.addEventListener('pagehide', onHide)
  document.addEventListener('visibilitychange', onVisibilityChange)

  return () => {
    onHide()
    document.removeEventListener('touchstart', onTouchStart, opts)
    document.removeEventListener('touchmove', onTouchMove, opts)
    document.removeEventListener('touchend', onTouchEnd, opts)
    document.removeEventListener('touchcancel', onTouchEnd, opts)
    window.removeEventListener('pagehide', onHide)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
}
