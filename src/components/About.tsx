import { withBase } from '../utils/baseUrl'
import { HERO_IMAGE } from '../utils/images'
import {
  containerClass,
  primaryBtnClass,
  secondaryBtnClass,
  sectionContainerClass,
} from '../utils/layoutClasses'
import { Icon } from './Icons'

const base = import.meta.env.BASE_URL
const RESUME_PATH = 'files/Adam_Colyer_Resume.pdf'
const RESUME_FILENAME = 'Adam_Colyer_Resume.pdf'
const resumeUrl = withBase(RESUME_PATH)

export function About() {
  const w960 = HERO_IMAGE.widths[0]
  const w1920 = HERO_IMAGE.widths[1]

  return (
    <section id="about" className="hero-about [contain:layout]">
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="hero-about__copy max-w-[34rem]">
            <h1 className="m-0 mb-3 text-h1 font-bold leading-tight text-text-default">
              Adam Colyer
            </h1>

            <p className="m-0 mb-4 text-fluid-3 font-medium text-text-muted">
              Full-stack developer · Edina, MN
            </p>

            <p className="m-0 text-body leading-relaxed text-text-default">
              Building full-stack web and AI applications with React, Next.js, and Python.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a href={resumeUrl} className={primaryBtnClass} download={RESUME_FILENAME}>
                <Icon name="file-alt" aria-hidden />
                Download resume
              </a>
              <a href={`${base}#contact`} className={secondaryBtnClass}>
                Get in touch
              </a>
            </div>
          </div>

          <div className="hero-media aspect-4/3 w-full">
            <picture>
              <source
                type="image/avif"
                srcSet={`${withBase(w960.avif)} 960w, ${withBase(w1920.avif)} 1920w`}
                sizes="(min-width: 64rem) 40vw, 100vw"
              />
              <source
                type="image/webp"
                srcSet={`${withBase(w960.webp)} 960w, ${withBase(w1920.webp)} 1920w`}
                sizes="(min-width: 64rem) 40vw, 100vw"
              />
              <source
                type="image/jpeg"
                srcSet={`${withBase(w960.jpeg)} 960w, ${withBase(w1920.jpeg)} 1920w`}
                sizes="(min-width: 64rem) 40vw, 100vw"
              />
              <img
                src={withBase(HERO_IMAGE.fallback)}
                className="block h-full w-full object-cover"
                alt="Desk setup photo"
                width={2048}
                height={1536}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  )
}
