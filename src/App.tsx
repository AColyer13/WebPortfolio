import { useEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Experiences } from './components/Experiences'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { useSectionNavigation } from './hooks/useSectionNavigation'

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
        <Experiences />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
