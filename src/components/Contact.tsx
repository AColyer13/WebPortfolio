import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'
import {
  containerClass,
  primaryBtnSubmitClass,
  sectionContainerClass,
} from '../utils/layoutClasses'
import { sendContactForm } from '../utils/contact'
import { Icon } from './Icons'

type FieldName = 'name' | 'email' | 'message'

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'success' | 'error'; message: string }

const inputClass =
  'contact-form-input w-full rounded-md border border-border-default bg-surface-0 px-3 py-2 text-base text-text-default transition-all duration-150 placeholder:text-text-muted focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 aria-invalid:border-danger-600'

const socialLinkClass =
  'social-link inline-flex h-11 w-11 items-center justify-center rounded-md border border-border-default bg-surface-0 text-text-default no-underline transition-colors duration-150 ease-in-out hover:border-text-muted hover:bg-surface-50'

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
  const timestampRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const emailInputRef = useRef<HTMLInputElement | null>(null)

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
    <section className="bg-surface-0 py-12" id="contact">
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col gap-6 rounded-lg border border-border-default bg-surface-50 p-6">
            <div>
              <h2 className="mb-2 text-fluid-4 font-bold text-text-default">
                Get in Touch
              </h2>
              <p className="m-0 text-fluid-1 text-text-muted">
                Available for full-stack engineering roles and consulting.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-fluid-1 text-text-default">
              <div className="flex items-center gap-2 text-text-muted">
                <Icon name="map-marker-alt" className="text-fluid-2" aria-hidden />
                <span>Edina, MN</span>
              </div>
              <div>
                <span className="font-medium text-text-muted">Phone: </span>
                <span>612.710.7700</span>
              </div>
              <div>
                <span className="font-medium text-text-muted">Email: </span>
                <a href="mailto:adamcolyer@gmail.com" className="font-medium text-text-default underline">
                  adamcolyer@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-2">
              <p className="mb-3 text-copyright uppercase tracking-wider text-text-subtle font-semibold">
                Social Profiles
              </p>
              <ul className="m-0 flex list-none items-center gap-3 p-0">
                <li>
                  <a
                    href="https://github.com/acolyer13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialLinkClass}
                    aria-label="GitHub profile"
                  >
                    <Icon name="github" className="block text-2xl leading-none" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/colyeradam/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialLinkClass}
                    aria-label="LinkedIn profile"
                  >
                    <Icon name="linkedin" className="block text-2xl leading-none" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full rounded-lg border border-border-default bg-surface-50 p-6">
            <h3 className="mb-4 text-fluid-3 font-bold text-text-default">
              Send a Message
            </h3>

            {status.kind !== 'idle' ? (
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={`mb-4 rounded-md p-3 text-fluid-1 ${
                  status.kind === 'success'
                    ? 'bg-surface-100 text-text-default'
                    : 'bg-danger-bg text-danger-700'
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <form id="form" ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact-name" className="text-fluid-1 font-medium text-text-default">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className={inputClass}
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      autoComplete="name"
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                    />
                    {touched.name && errors.name ? (
                      <p id="contact-name-error" className="field-error m-0 text-copyright text-danger-700" role="alert">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact-email" className="text-fluid-1 font-medium text-text-default">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className={inputClass}
                      name="email"
                      placeholder="Email"
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
                    {touched.email && errors.email ? (
                      <p id="contact-email-error" className="field-error m-0 text-copyright text-danger-700" role="alert">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="contact-message" className="text-fluid-1 font-medium text-text-default">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    className={`${inputClass} min-h-[7rem] resize-y`}
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    minLength={10}
                    maxLength={2000}
                    autoComplete="off"
                    aria-invalid={touched.message && !!errors.message}
                    aria-describedby={
                      touched.message && errors.message ? 'contact-message-error' : undefined
                    }
                  />
                  {touched.message && errors.message ? (
                    <p id="contact-message-error" className="field-error m-0 text-copyright text-danger-700" role="alert">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <input type="hidden" name="reply_to" value={formData.email} />
                <input type="hidden" name="time" ref={timestampRef} />

                <div>
                  <input
                    type="submit"
                    className={`submit-btn ${primaryBtnSubmitClass}`}
                    value={isSubmitting ? 'Sending...' : 'Send Message'}
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

