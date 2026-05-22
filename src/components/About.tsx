import { withBase } from '../utils/baseUrl'

const base = import.meta.env.BASE_URL

export function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__grid">
          <div className="about-text">
            <small className="small-text">
              Welcome to <span className="mobile-block">my portfolio!</span>
            </small>
            <h1>
              <span className="about__hey">Hey folks, I&apos;m</span>
              <br />
              <span className="animated-item">Adam Colyer</span>
            </h1>

            <p>
              Former sales professional with hands-on experience managing $2M+ pipelines. Now
              developing full-stack applications and combining my business insight with technical
              problem solving to build solutions that align with any future development needs.
            </p>

            <div className="custom-btn-group">
              <a
                href={withBase('files/AdamColyerResume2026v2.pdf')}
                className="custom-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="fa-solid fa-file-alt" aria-hidden />
                Download Resume
              </a>
              <a href={`${base}#contact`} className="custom-btn custom-btn-bg">
                Get in Touch
              </a>
            </div>
          </div>

          <div className="about-image">
            <img
              src={withBase('images/IMG_4874.JPEG')}
              className="media-fluid"
              alt="desk setup photo"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
