import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'
import emailjs from '@emailjs/browser'

type FieldName = 'name' | 'email' | 'message'

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'success' | 'error'; message: string }

function requiredField(value: string, label: string): string {
  if (!value.trim()) return `${label} is required.`
  return ''
}

function validateEmail(value: string): string {
  if (!value.trim()) return 'Email is required.'
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  if (!ok) return 'Enter a valid email address.'
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
  const timestampRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  const runFieldValidation = (name: FieldName, value: string) => {
    let msg = ''
    if (name === 'name') msg = requiredField(value, 'Name')
    else if (name === 'email') msg = validateEmail(value)
    else msg = requiredField(value, 'Message')
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
    const eEmail = validateEmail(formData.email)
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
      await emailjs.sendForm('default_service', 'template_6dk6wl5', form)
      setStatus({
        kind: 'success',
        message: 'Message sent. Thanks — I will get back to you soon.',
      })
      setFormData({ name: '', message: '', email: '' })
      setErrors({})
      setTouched({ name: false, email: false, message: false })
      form.reset()
    } catch (error) {
      setStatus({
        kind: 'error',
        message: 'Something went wrong. Please try again or email directly.',
      })
      console.error('Error sending email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact section-block" id="contact">
      <div className="container">
        <div className="contact__layout">
          <div className="contact__map-card">
            <div className="google-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90444.17968810473!2d-93.44258962458554!3d44.89525237382178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f6213ace55a039%3A0xcdaf9c3796fa2779!2sEdina%2C%20MN!5e0!3m2!1sen!2sus!4v1764804107343!5m2!1sen!2sus"
                width="100%"
                height={400}
                allowFullScreen
                loading="lazy"
                title="Map of Edina, MN"
              />
            </div>
            <div className="contact-info">
              <div className="contact-info-item">
                <h3>Say hello</h3>
                <p className="footer-text">612.710.7700</p>
                <p>
                  <a href="mailto:adamcolyer@gmail.com">adamcolyer@gmail.com</a>
                </p>
              </div>

              <ul className="social-links">
                <li>
                  <a
                    href="https://github.com/acolyer13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="GitHub profile"
                  >
                    <i className="fab fa-github" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/colyeradam/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label="LinkedIn profile"
                  >
                    <i className="fab fa-linkedin" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="contact-form">
            <h2>
              Want to know more? <br /> Let&apos;s talk
            </h2>

            {status.kind !== 'idle' ? (
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="form-status"
                data-variant={status.kind}
              >
                {status.message}
              </div>
            ) : null}

            <form id="form" ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="contact-form__fields">
                <div className="form-row-two">
                  <div className="form-field">
                    <label htmlFor="contact-name" className="form-field__label">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                    />
                    {touched.name && errors.name ? (
                      <p id="contact-name-error" className="field-error" role="alert">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email" className="form-field__label">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={
                        touched.email && errors.email ? 'contact-email-error' : undefined
                      }
                    />
                    {touched.email && errors.email ? (
                      <p id="contact-email-error" className="field-error" role="alert">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="form-field__label">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={8}
                    className="form-control"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.message && !!errors.message}
                    aria-describedby={
                      touched.message && errors.message ? 'contact-message-error' : undefined
                    }
                  />
                  {touched.message && errors.message ? (
                    <p id="contact-message-error" className="field-error" role="alert">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <input type="hidden" name="reply_to" value={formData.email} />
                <input type="hidden" name="time" ref={timestampRef} />

                <div className="contact-form__submit">
                  <input
                    type="submit"
                    className="form-control submit-btn"
                    value={isSubmitting ? 'Sending...' : 'Send'}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
