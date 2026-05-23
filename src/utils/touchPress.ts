import type { PointerEvent } from 'react'

/** Brief pressed state for touch/coarse pointers — iOS often skips :has(:active) on cards. */
export const touchPressHandlers = {
  onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse') return
    event.currentTarget.classList.add('touch-pressed')
  },
  onPointerUp(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse') return
    event.currentTarget.classList.remove('touch-pressed')
  },
  onPointerLeave(event: PointerEvent<HTMLElement>) {
    event.currentTarget.classList.remove('touch-pressed')
  },
  onPointerCancel(event: PointerEvent<HTMLElement>) {
    event.currentTarget.classList.remove('touch-pressed')
  },
}
