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
          <div className="hero-about__copy mx-auto max-w-[40rem] text-center lg:mx-0 lg:text-start">
            <h1 className="m-0 text-h1 font-bold leading-tight text-text-default">
              Adam Colyer
              <span className="mt-1 block text-fluid-3 font-medium text-text-muted sm:mt-0 sm:inline">
                <span className="hidden sm:inline"> · </span>
                Twin Cities, MN
              </span>
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
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
