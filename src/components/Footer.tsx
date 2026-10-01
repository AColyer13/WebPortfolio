import { containerClass, sectionBlockClass, sectionContainerClass } from '../utils/layoutClasses'

const footerLinkClass =
  'inline-flex min-h-11 items-center text-copyright text-text-muted underline-offset-4 hover:text-text-default hover:underline'

const links = [
  { href: 'https://github.com/acolyer13', label: 'GitHub', external: true },
  { href: 'https://www.linkedin.com/in/colyeradam/', label: 'LinkedIn', external: true },
  { href: 'mailto:adamcolyer@gmail.com', label: 'Email', external: false },
  {
    href: 'https://github.com/AColyer13/WebPortfolio',
    label: 'Source for this site',
    external: true,
  },
]

export function Footer() {
  return (
    <footer className={`border-t border-border-default bg-bg ${sectionBlockClass}`}>
      <div
        className={`${containerClass} ${sectionContainerClass} flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between`}
      >
        <p className="m-0 text-copyright text-text-subtle">
          &copy; {new Date().getFullYear()} Adam Colyer
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-x-5 p-0" aria-label="Elsewhere">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={footerLinkClass}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
