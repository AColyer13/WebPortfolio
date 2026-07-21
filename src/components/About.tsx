import { withBase } from '../utils/baseUrl'
import { pictureSrcSet } from '../utils/pictureSources'
import {
  containerClass,
  imgHeroClass,
  primaryBtnClass,
  secondaryBtnClass,
  sectionContainerClass,
} from '../utils/layoutClasses'
import { Icon } from './Icons'

const base = import.meta.env.BASE_URL
const RESUME_PATH = 'files/AdamColyerResume2026.pdf'
const RESUME_FILENAME = 'Adam_Colyer_Resume_2026.pdf'
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
            <h1 className="m-0 mb-3 text-h1 font-bold leading-tight text-text-default">
              Adam Colyer
            </h1>

            <p className="m-0 mb-4 text-fluid-3 font-medium text-text-muted">
              Full-stack developer
            </p>

            <p className="m-0 text-body leading-relaxed text-text-default">
              Former sales professional with hands-on experience managing $2M+ pipelines. Now
              building full-stack applications and combining business insight with technical
              problem solving.
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

          <div>
            <picture>
              <source
                type="image/avif"
                srcSet={pictureSrcSet('images/IMG_4874.JPEG', [960], 'avif')}
                sizes="(min-width: 48rem) 45vw, 92vw"
              />
              <source
                type="image/webp"
                srcSet={pictureSrcSet('images/IMG_4874.JPEG', [960], 'webp')}
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
