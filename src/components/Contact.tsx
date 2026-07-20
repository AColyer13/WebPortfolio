import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'
import { containerClass, sectionBlockClass } from '../utils/layoutClasses'
import { sendContactForm } from '../utils/contact'
import { Icon } from './Icons'

type FieldName = 'name' | 'email' | 'message'

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'success' | 'error'; message: string }

function requiredField(value: string, label: string): string {
  if (!value.trim()) return `${label} is required.`
  return ''
}

function validateEmailField(input: HTMLInputElement): string {
  if (!input.value.trim()) return 'Email is required.'
  if (!input.checkValidity()) return 'Enter a valid email address.'
  return ''
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    email: '',
  })
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    name: false,
    email: false,
    message: false,
  })
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle' })
  const [mapLoaded, setMapLoaded] = useState(false)
  const timestampRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null)

  const runFieldValidation = (name: FieldName, value: string) => {
    let msg = ''
    if (name === 'name') msg = requiredField(value, 'Name')
    else if (name === 'email') {
      const el = emailInputRef.current
      msg = el ? validateEmailField(el) : requiredField(value, 'Email')
    } else msg = requiredField(value, 'Message')
    setErrors((prev) => ({ ...prev, [name]: msg }))
    return msg
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const field = name as FieldName
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      runFieldValidation(field, value)
    }
    if (status.kind !== 'idle') {
      setStatus({ kind: 'idle' })
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName
    setTouched((prev) => ({ ...prev, [name]: true }))
    runFieldValidation(name, e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    setTouched({ name: true, email: true, message: true })
    const eName = requiredField(formData.name, 'Name')
    const eEmail = emailInputRef.current ? validateEmailField(emailInputRef.current) : 'Email is required.'
    const eMessage = requiredField(formData.message, 'Message')
    setErrors({
      name: eName,
      email: eEmail,
      message: eMessage,
    })
    if (eName || eEmail || eMessage) {
      setStatus({ kind: 'idle' })
      return
    }

    setIsSubmitting(true)
    setStatus({ kind: 'idle' })
    try {
      if (timestampRef.current) {
        timestampRef.current.value = new Date().toISOString()
      }
      await sendContactForm(form)
      setStatus({
        kind: 'success',
        message: 'message sent — i will reply within 48h.',
      })
      setFormData({ name: '', message: '', email: '' })
      setErrors({})
      setTouched({ name: false, email: false, message: false })
      form.reset()
    } catch (error) {
      setStatus({
        kind: 'error',
        message: 'send failed. try again or email adamcolyer@gmail.com directly.',
      })
      console.error('Error sending email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className={`contact ${sectionBlockClass}`}>
      <div className={containerClass}>
        <header className="hm-section-head">
          <span className="hm-section-head__prompt">ssh adam@edina --port 22</span>
          <h2 className="hm-section-head__title"># contact</h2>
        </header>
        <div className="hm-session">
          <div className="hm-session__log">
            <p>
              <span className="hm-prompt">$</span> whois adamcolyer
            </p>
            <p>
              <span className="hm-out">name:</span> Adam Colyer
              <br />
              <span className="hm-out">location:</span> Edina, MN (UTC-6)
              <br />
              <span className="hm-out">phone:</span> 612.710.7700
              <br />
              <span className="hm-out">email:</span> adamcolyer@gmail.com
              <br />
              <span className="hm-out">status:</span> open to senior / staff roles · open to contract work
            </p>
            <p>
              <span className="hm-prompt">$</span> cat ~/socials.txt
            </p>
            <p>
              <a
                href="https://github.com/acolyer13"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-default)' }}
              >
                github.com/acolyer13
              </a>
              {' · '}
              <a
                href="https://www.linkedin.com/in/colyeradam/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'var(--color-border-default)' }}
              >
                linkedin.com/in/colyeradam
              </a>
            </p>
            <p>
              <span className="hm-prompt">$</span> ping --map
            </p>
            <p style={{ marginBottom: 0 }}>
              {mapLoaded ? (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90444.17968810473!2d-93.44258962458554!3d44.89525237382178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f6213ace55a039%3A0xcdaf9c3796fa2779!2sEdina%2C%20MN!5e0!3m2!1sen!2sus!4v1764804107343!5m2!1sen!2sus"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '2px' }}
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map of Edina, MN"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setMapLoaded(true)}
                  aria-label="Load interactive map of Edina, MN"
                  style={{
                    background: 'transparent',
                    border: '1px dashed var(--color-border-default)',
                    borderRadius: '2px',
                    color: 'var(--color-text-default)',
                    cursor: 'pointer',
                    padding: '0.75rem 1rem',
                    fontFamily: 'var(--hm-font-mono)',
                    fontSize: '0.875rem',
                    width: '100%',
                    textAlign: 'start',
                  }}
                >
                  [Edina, MN — click to load map]
                </button>
              )}
            </p>
          </div>

          <form
            id="form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="hm-session__form"
          >
            {status.kind !== 'idle' ? (
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={
                  'hm-session__status ' +
                  (status.kind === 'success'
                    ? 'hm-session__status--ok'
                    : 'hm-session__status--err')
                }
              >
                <span style={{ color: 'var(--hm-color-phosphor)' }}>$ </span>
                {status.message}
              </div>
            ) : null}

            <div className="hm-session__field">
              <label htmlFor="contact-name" className="hm-session__label">name</label>
              <input
                id="contact-name"
                type="text"
                className="hm-session__input"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={nameInputRef}
                required
                autoComplete="name"
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
              />
              <p id="contact-name-error" className="hm-session__err" role="alert">
                {touched.name && errors.name ? errors.name : ''}
              </p>
            </div>

            <div className="hm-session__field">
              <label htmlFor="contact-email" className="hm-session__label">email</label>
              <input
                id="contact-email"
                type="email"
                className="hm-session__input"
                name="email"
                placeholder="you@domain.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={emailInputRef}
                required
                autoComplete="email"
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={
                  touched.email && errors.email ? 'contact-email-error' : undefined
                }
              />
              <p id="contact-email-error" className="hm-session__err" role="alert">
                {touched.email && errors.email ? errors.email : ''}
              </p>
            </div>

            <div className="hm-session__field">
              <label htmlFor="contact-message" className="hm-session__label">message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                className="hm-session__textarea"
                placeholder="type your message — 10 chars minimum"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={messageInputRef}
                required
                minLength={10}
                maxLength={2000}
                autoComplete="off"
                aria-invalid={touched.message && !!errors.message}
                aria-describedby={
                  touched.message && errors.message ? 'contact-message-error' : undefined
                }
              />
              <p id="contact-message-error" className="hm-session__err" role="alert">
                {touched.message && errors.message ? errors.message : ''}
              </p>
            </div>

            <input type="hidden" name="reply_to" value={formData.email} />
            <input type="hidden" name="time" ref={timestampRef} />

            <input
              type="submit"
              className="hm-session__submit"
              value={isSubmitting ? 'sending...' : 'send --message'}
              disabled={isSubmitting}
            />
          </form>
        </div>
        <ul className="hm-meta__socials" style={{ marginTop: 'var(--spacing-3)' }}>
          <li>
            <a
              href="https://github.com/acolyer13"
              target="_blank"
              rel="noopener noreferrer"
              className="hm-meta__social"
              aria-label="GitHub profile"
            >
              <Icon name="github" className="block text-2xl leading-none" aria-hidden />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/colyeradam/"
              target="_blank"
              rel="noopener noreferrer"
              className="hm-meta__social"
              aria-label="LinkedIn profile"
            >
              <Icon name="linkedin" className="block text-2xl leading-none" aria-hidden />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}