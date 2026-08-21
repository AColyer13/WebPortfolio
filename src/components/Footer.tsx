import { containerClass, sectionBlockClass, sectionContainerClass } from '../utils/layoutClasses'

export function Footer() {
  return (
    <footer className={`border-t border-border-default bg-bg ${sectionBlockClass}`}>
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <p className="m-0 text-start text-copyright text-text-subtle">
          &copy; {new Date().getFullYear()} Adam Colyer. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
