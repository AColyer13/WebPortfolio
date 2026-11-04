import { lazy, Suspense, useEffect, useState } from 'react'
import { About } from './components/About'
import { Experiences } from './components/Experiences'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Skills } from './components/Skills'
import { useSectionNavigation } from './hooks/useSectionNavigation'
import { containerClass, sectionBlockClass, sectionContainerClass } from './utils/layoutClasses'
import { loadContact, loadProjects } from './utils/prefetch'

const Projects = lazy(() => loadProjects().then((m) => ({ default: m.Projects })))
const Contact = lazy(() => loadContact().then((m) => ({ default: m.Contact })))

/** Preserves section anchors for nav/scroll-spy while async chunks load. */
function SectionPlaceholder({ id }: { id: string }) {
  return (
    <section
      id={id}
      className={`${sectionBlockClass} state-loading`}
      aria-busy="true"
      aria-label="Loading section"
    >
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-copy" />
        <div className="skeleton skeleton-copy" />
        <p className="sr-only" role="status">
          Loading
        </p>
      </div>
    </section>
  )
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { activeSection, headerScrollHidden, navigateToSection } =
    useSectionNavigation({ forceHeaderVisible: mobileMenuOpen })

  useEffect(() => {
    document.documentElement.classList.toggle('menu-scroll-lock', mobileMenuOpen)
    return () => document.documentElement.classList.remove('menu-scroll-lock')
  }, [mobileMenuOpen])

  return (
    <div className={`app-shell${headerScrollHidden ? ' app--header-hidden' : ''}`}>
      <a
        href="#main-content"
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-(--z-toast) focus:rounded-md focus:bg-btn-bg focus:px-3 focus:py-2 focus:text-btn-fg focus:outline-2 focus:outline-offset-2 focus:outline-primary-600"
      >
        Skip to main content
      </a>
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateToSection}
        headerScrollHidden={headerScrollHidden}
        onMenuOpenChange={setMobileMenuOpen}
      />
      <main id="main-content">
        <About />
        <Suspense fallback={<SectionPlaceholder id="projects" />}>
          <Projects />
        </Suspense>
        <Experiences />
        <Skills />
        <Suspense fallback={<SectionPlaceholder id="contact" />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
