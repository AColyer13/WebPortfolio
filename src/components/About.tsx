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
/** Equal-width stacked CTAs on phones; natural width side by side from sm up. */
const ctaWidthClass = 'w-full max-w-xs sm:w-auto sm:max-w-none'
const HERO_LINE = 'Full-stack engineer building AI-powered web apps, after five years selling software.'

export function About() {
  const w960 = HERO_IMAGE.widths[0]
  const w1920 = HERO_IMAGE.widths[1]

  return (
    <section id="about" className="hero-about [contain:layout]">
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <div className="grid grid-cols-1 items-center gap-(--space-8) lg:grid-cols-2 lg:gap-(--space-12)">
          <div className="hero-about__copy mx-auto max-w-[40rem] text-center lg:mx-0 lg:text-start">
            <h1 className="m-0 lg:inline-flex lg:flex-col lg:items-start lg:gap-(--space-1)">
              <span className="block whitespace-nowrap sm:inline lg:block">Adam Colyer</span><span className="mt-(--space-1) block text-fluid-2 font-medium text-text-muted sm:ms-(--space-2) sm:mt-0 sm:inline lg:ms-0 lg:mt-0 lg:block"><span className="sr-only"> </span>Twin Cities, MN</span>
            </h1>

            <p className="m-0 mt-(--space-4) text-pretty text-fluid-2">
              {HERO_LINE}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <a href={resumeUrl} className={`${primaryBtnClass} ${ctaWidthClass}`} download={RESUME_FILENAME}>
                <Icon name="file-alt" aria-hidden />
                Download resume
              </a>
              <a href={`${base}#contact`} className={`${secondaryBtnClass} ${ctaWidthClass}`}>
                Get in touch
              </a>
            </div>
          </div>

          <div className="hero-media hidden aspect-4/3 w-full lg:block">
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
