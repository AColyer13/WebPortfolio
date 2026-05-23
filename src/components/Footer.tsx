import { containerClass, footerSectionClass, sectionContainerClass } from '../utils/layoutClasses'

export function Footer() {
  return (
    <footer className={`bg-surface-50 border-t border-border-default ${footerSectionClass}`}>
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <p className="m-0 text-center text-copyright text-text-subtle">
          &copy; {new Date().getFullYear()} Adam Colyer. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
