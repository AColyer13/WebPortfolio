const COMMIT_REF = import.meta.env['VITE_COMMIT_REF'] ?? 'local-build'
const BUILD_TS = import.meta.env['VITE_BUILD_TS']
  ?? new Date().toISOString().slice(0, 16).replace('T', ' ')

export function Footer() {
  return (
    <footer className="hm-colophon bg-bg border-t border-border-default">
      <hr className="hm-colophon__rule" />
      <div className="hm-colophon__row">
        <div className="hm-colophon__cell">
          <strong>Adam Colyer</strong> · full-stack developer · Edina, MN ·
          copyright {new Date().getFullYear()}
        </div>
        <nav className="hm-colophon__cell" aria-label="Footer navigation">
          <ul className="hm-colophon__anchor-list">
            <li>
              <a href="#about">about</a>
            </li>
            <li>
              <a href="#skills">skills</a>
            </li>
            <li>
              <a href="#projects">projects</a>
            </li>
            <li>
              <a href="#contact">contact</a>
            </li>
          </ul>
        </nav>
        <div className="hm-colophon__cell" style={{ textAlign: 'end' }}>
          build · <strong>{String(COMMIT_REF).slice(0, 7)}</strong>
          {' · '}
          {BUILD_TS}
        </div>
      </div>
    </footer>
  )
}