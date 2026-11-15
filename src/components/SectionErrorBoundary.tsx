import { Component, type ReactNode } from 'react'
import {
  containerClass,
  primaryBtnClass,
  sectionBlockClass,
  sectionContainerClass,
} from '../utils/layoutClasses'

interface Props {
  id: 'projects' | 'contact'
  title: string
  children: ReactNode
}

/** Keep a failed lazy section from removing the rest of the portfolio. */
export class SectionErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children

    const { id, title } = this.props
    return (
      <section id={id} className={sectionBlockClass} aria-labelledby={`${id}-error-heading`}>
        <div className={`${containerClass} ${sectionContainerClass}`}>
          <h2 id={`${id}-error-heading`}>{title}</h2>
          <p role="alert" className="my-4">
            This section couldn’t load. You can still browse the rest of the portfolio.
          </p>
          {id === 'contact' && (
            <p className="mb-4">
              Email me directly at <a href="mailto:adamcolyer@gmail.com">adamcolyer@gmail.com</a>.
            </p>
          )}
          <p className="mb-4">Reloading the page will clear any unsent form entries.</p>
          <button type="button" className={primaryBtnClass} onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      </section>
    )
  }
}
