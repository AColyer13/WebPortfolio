import { withBase } from '../utils/baseUrl'
import { pictureSrcSet } from '../utils/pictureSources'
import { containerClass, sectionBlockClass } from '../utils/layoutClasses'
import { Icon } from './Icons'

const RESUME_PATH = 'files/AdamColyerResume2026.pdf'
const RESUME_FILENAME = 'Adam_Colyer_Resume_2026.pdf'
const resumeUrl = withBase(RESUME_PATH)

export function About() {
  return (
    <section
      id="about"
      className={`${sectionBlockClass} pt-(--section-hero-padding-top)`}
    >
      <div className={containerClass}>
        <div className="hm-about">
          <div className="hm-about__col">
            <p className="hm-about__who">— output follows</p>
            <h1 className="hm-about__name">
              Adam Colyer<span className="hm-caret" aria-hidden />
            </h1>
            <p className="hm-about__role">Full-stack developer · Edina, MN</p>
            <p className="hm-about__bio">
              Former sales professional with hands-on experience managing $2M+
              pipelines. Now building full-stack applications and combining
              business insight with technical problem solving — TypeScript on
              the front, FastAPI and Node on the back, Postgres in between.
            </p>
            <div className="hm-about__actions">
              <a href={resumeUrl} className="hm-about__btn" download={RESUME_FILENAME}>
                <Icon name="file-alt" aria-hidden />
                resume.pdf
              </a>
              <a href="#contact" className="hm-about__btn hm-about__btn--ghost">
                contact
              </a>
            </div>
          </div>
          <div className="hm-about__col">
            <picture>
              <source
                type="image/avif"
                srcSet={pictureSrcSet('images/IMG_4874.JPEG', [960], 'avif')}
                sizes="(min-width: 56rem) 40vw, 92vw"
              />
              <source
                type="image/webp"
                srcSet={pictureSrcSet('images/IMG_4874.JPEG', [960], 'webp')}
                sizes="(min-width: 56rem) 40vw, 92vw"
              />
              <img
                src={withBase('images/IMG_4874.JPEG')}
                srcSet={`${withBase('images/IMG_4874-960.JPEG')} 960w, ${withBase('images/IMG_4874.JPEG')} 2048w`}
                sizes="(min-width: 56rem) 40vw, 92vw"
                className="hm-about__photo"
                alt="Desk setup photo"
                width={2048}
                height={1536}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <p className="hm-about__photo-caption">// ~/photos/setup.jpg</p>
          </div>
        </div>
      </div>
    </section>
  )
}