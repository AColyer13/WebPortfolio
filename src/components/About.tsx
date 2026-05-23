import { withBase } from '../utils/baseUrl'
import { containerClass, sectionContainerClass } from '../utils/layoutClasses'

const base = import.meta.env.BASE_URL

const primaryBtnClass =
  'inline-flex min-h-11 items-center justify-center gap-1 rounded-pill border-none bg-primary-600 px-4 py-2 text-btn font-bold text-surface-0 transition-[background-color,color,transform,box-shadow] duration-200 ease-in-out hover:-translate-y-[0.1875rem] hover:bg-primary-700 hover:text-surface-0 hover:shadow-btn'

const outlineBtnClass =
  'border-2 border-primary-600 bg-transparent text-primary-600 hover:bg-primary-600 hover:text-text-default'

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-(--header-offset) pt-(--section-hero-padding-top) pb-(--section-padding-y) [contain:layout]"
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
                href={withBase('files/AdamColyerResume2026v2.pdf')}
                className={primaryBtnClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="fa-solid fa-file-alt" aria-hidden />
                Download Resume
              </a>
              <a href={`${base}#contact`} className={`${primaryBtnClass} ${outlineBtnClass}`}>
                Get in Touch
              </a>
            </div>
          </div>

          <div>
            <img
              src={withBase('images/IMG_4874.JPEG')}
              className="mx-auto block h-auto max-w-full rounded-lg shadow-image"
              alt="desk setup photo"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
