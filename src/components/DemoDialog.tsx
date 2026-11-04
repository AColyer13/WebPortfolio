import { lazy, Suspense, useEffect, useRef } from 'react'
import { secondaryBtnClass } from '../utils/layoutClasses'
import { loadFlyBrain, loadSatBench } from '../utils/prefetch'

const FlyBrain = lazy(() => loadFlyBrain().then((m) => ({ default: m.FlyBrain })))
const SatBench = lazy(() => loadSatBench().then((m) => ({ default: m.SatBench })))

function closeDialog(dialog: HTMLDialogElement | null) {
  if (!dialog) return
  if (typeof dialog.close === 'function') {
    dialog.close()
    return
  }
  dialog.removeAttribute('open')
  dialog.dispatchEvent(new Event('close'))
}

export function DemoDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    document.documentElement.classList.add('menu-scroll-lock')
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    const handleClose = () => onClose()
    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('close', handleClose)
      document.documentElement.classList.remove('menu-scroll-lock')
    }
  }, [onClose])

  return (
    <dialog
      ref={ref}
      className="demo-dialog"
      aria-label="Live demo"
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      <div className="demo-dialog-bar">
        <p className="m-0 text-fluid-1 text-text-muted">Live demo</p>
        <button type="button" className={`${secondaryBtnClass} cursor-pointer`} onClick={() => closeDialog(ref.current)}>
          Close
        </button>
      </div>
      <Suspense
        fallback={
          <div className="state-loading px-(--space-4)" role="status">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-panel" />
            <p className="m-0">Loading the demo…</p>
          </div>
        }
      >
        <FlyBrain />
        <SatBench />
      </Suspense>
    </dialog>
  )
}
