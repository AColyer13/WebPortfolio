import { withBase } from '../utils/baseUrl'
import { pictureSrcSet } from '../utils/pictureSources'
import {
  containerClass,
  imgHeroClass,
  primaryBtnClass,
  secondaryBtnClass,
  sectionContainerClass,
} from '../utils/layoutClasses'

const base = import.meta.env.BASE_URL
const RESUME_PATH = 'files/AdamColyerResume2026v2.pdf'
const RESUME_FILENAME = 'AdamColyerResume2026v2.pdf'
const resumeUrl = withBase(RESUME_PATH)

export function About() {
  return (
    <section
      id="about"
      className="pt-(--section-hero-padding-top) pb-(--section-padding-y) [contain:layout]"
    >
      <div className={`${containerClass} ${sectionContainerClass} @container/about`}>
        <div className="grid grid-cols-1 items-center gap-6 @[48rem]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="pe-0 @[48rem]:pe-4">
            <small className="mb-2 block text-fluid-1 font-bold text-primary-600">
              Welcome to{' '}
              <span className="inline @max-[47.98rem]:block">my portfolio!</span>
            </small>
            <h1>
              Hello everyone, I&apos;m{' '}
              <span className="text-h1 text-primary-600">Adam Colyer</span>
            </h1>

            <p>
              Former sales professional with hands-on experience managing $2M+ pipelines. Now
              developing full-stack applications and combining my business insight with technical
              problem solving to build solutions that align with any future development needs.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={resumeUrl}
                className={primaryBtnClass}
                download={RESUME_FILENAME}
              >
                <span className="fa-solid fa-file-alt" aria-hidden />
                Download Resume
              </a>
              <a href={`${base}#contact`} className={secondaryBtnClass}>
                Get in Touch
              </a>
            </div>
          </div>

          <div>
            <picture>
              <source
                type="image/avif"
                srcSet={pictureSrcSet('images/IMG_4874.JPEG', [960, 2048])}
                sizes="(min-width: 48rem) 45vw, 92vw"
              />
              <source
                type="image/webp"
                srcSet={pictureSrcSet('images/IMG_4874.JPEG', [960, 2048])}
                sizes="(min-width: 48rem) 45vw, 92vw"
              />
              <img
                src={withBase('images/IMG_4874.JPEG')}
                srcSet={`${withBase('images/IMG_4874-960.JPEG')} 960w, ${withBase('images/IMG_4874.JPEG')} 2048w`}
                sizes="(min-width: 48rem) 45vw, 92vw"
                className={imgHeroClass}
                alt="Desk setup photo"
                width={2048}
                height={1536}
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
