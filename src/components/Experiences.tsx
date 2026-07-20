import { timeline } from '../data/portfolio'
import { containerClass, sectionBlockClass } from '../utils/layoutClasses'

export function Experiences() {
  return (
    <section id="experience" className={sectionBlockClass}>
      <div className={containerClass}>
        <header className="hm-section-head">
          <span className="hm-section-head__prompt">
            history --work --reverse
          </span>
          <h2 className="hm-section-head__title"># experience</h2>
        </header>
        <div className="mx-auto max-w-64rem">
          {timeline.map((item) => (
            <article
              key={`${item.year}-${item.title}`}
              className="hm-xp"
            >
              <span className="hm-xp__when">{item.year}</span>
              <div>
                <h3 className="hm-xp__role">
                  {item.title}
                  <span className="hm-xp__where">
                    <span className="hm-xp__company">{item.company}</span>
                  </span>
                </h3>
                <p className="hm-xp__what">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
