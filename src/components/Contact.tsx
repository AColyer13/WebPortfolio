import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'
import { primaryBtnSubmitClass } from '../utils/layoutClasses'
import { sendContactForm } from '../utils/contact'
import { Icon } from './Icons'
import { Section } from './Section'

type FieldName = 'name' | 'email' | 'message'

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'success' | 'error'; message: string }

const inputClass =
  'contact-form-input w-full rounded-md border border-border-default bg-surface-0 px-3.5 py-2.5 text-base text-text-default transition-colors duration-150 placeholder:text-text-muted focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 aria-invalid:border-danger-600'

const socialLinkClass =
  'social-link inline-flex h-11 w-11 items-center justify-center rounded-md border border-border-default bg-transparent text-text-default no-underline transition-colors duration-150 ease-out hover:border-text-muted hover:bg-surface-50'

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
  const nameInputRef = useRef<HTMLInputElement | null>(null)
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

  const focusFirstInvalid = (nextErrors: Partial<Record<FieldName, string>>) => {
    const order: FieldName[] = ['name', 'email', 'message']
    const first = order.find((key) => nextErrors[key])
    if (!first) return
    const el =
      first === 'name'
        ? nameInputRef.current
        : first === 'email'
          ? emailInputRef.current
          : messageInputRef.current
    el?.focus()
    if (typeof el?.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
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
    const eEmail = emailInputRef.current
      ? validateEmailField(emailInputRef.current)
      : 'Email is required.'
    const eMessage = requiredField(formData.message, 'Message')
    const nextErrors = {
      name: eName,
      email: eEmail,
      message: eMessage,
    }
    setErrors(nextErrors)
    if (eName || eEmail || eMessage) {
      setStatus({ kind: 'idle' })
      focusFirstInvalid(nextErrors)
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
        message: 'Message sent! Thanks for reaching out. I will get back to you soon.',
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
    <Section id="contact" title="Get in Touch" variant="contact">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <div>
            <h3 className="mb-2 text-fluid-3 font-bold text-text-default">
              Contact Details
            </h3>
            <p className="m-0 text-fluid-1 leading-relaxed text-text-muted">
              Available for full-stack engineering roles, consulting, and contract work. Send a
              message about an open role or a project you're working on.
            </p>
          </div>

          <dl className="m-0 flex flex-col gap-5">
            <div>
              <dt className="m-0 text-copyright font-medium uppercase tracking-wider text-text-subtle">
                Location
              </dt>
              <dd className="m-0 mt-1 text-fluid-1 font-semibold text-text-default">
                Edina, MN
              </dd>
            </div>
            <div>
              <dt className="m-0 text-copyright font-medium uppercase tracking-wider text-text-subtle">
                Phone
              </dt>
              <dd className="m-0 mt-1">
                <a
                  href="tel:6127107700"
                  className="text-fluid-1 font-semibold text-text-default underline-offset-4 hover:underline"
                >
                  612.710.7700
                </a>
              </dd>
            </div>
            <div>
              <dt className="m-0 text-copyright font-medium uppercase tracking-wider text-text-subtle">
                Email
              </dt>
              <dd className="m-0 mt-1">
                <a
                  href="mailto:adamcolyer@gmail.com"
                  className="text-fluid-1 font-semibold text-text-default underline-offset-4 hover:underline"
                >
                  adamcolyer@gmail.com
                </a>
              </dd>
            </div>
          </dl>

          <div className="border-t border-border-default pt-6">
            <p className="mb-3 text-copyright font-semibold uppercase tracking-wider text-text-subtle">
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
                  <Icon
                    name="linkedin"
                    className="block text-2xl leading-none"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-7">
          <h3 className="mb-2 text-fluid-3 font-bold text-text-default">Send a Message</h3>
          <p className="m-0 mb-6 text-fluid-1 leading-relaxed text-text-muted">
            Have a project or opportunity? Send a message and I will reply promptly.
          </p>

          {status.kind !== 'idle' ? (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={`mb-6 rounded-md p-4 text-fluid-1 font-medium ${
                status.kind === 'success'
                  ? 'border border-border-default bg-surface-50 text-text-default'
                  : 'bg-danger-bg text-danger-700'
              }`}
            >
              {status.message}
            </div>
          ) : null}

          <form id="form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-fluid-1 font-medium text-text-default"
                  >
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
                    ref={nameInputRef}
                    required
                    autoComplete="name"
                    aria-invalid={touched.name && !!errors.name}
                    aria-describedby={
                      touched.name && errors.name ? 'contact-name-error' : undefined
                    }
                  />
                  {touched.name && errors.name ? (
                    <p
                      id="contact-name-error"
                      className="field-error m-0 text-copyright font-medium text-danger-700"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-fluid-1 font-medium text-text-default"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className={inputClass}
                    name="email"
                    placeholder="name@example.com"
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
                    <p
                      id="contact-email-error"
                      className="field-error m-0 text-copyright font-medium text-danger-700"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-fluid-1 font-medium text-text-default"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  className={`${inputClass} min-h-[8rem] resize-y`}
                  placeholder="How can I help you?"
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
                {touched.message && errors.message ? (
                  <p
                    id="contact-message-error"
                    className="field-error m-0 text-copyright font-medium text-danger-700"
                    role="alert"
                  >
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <input type="hidden" name="reply_to" value={formData.email} />
              <input type="hidden" name="time" ref={timestampRef} />

              <div className="pt-2">
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
    </Section>
  )
}
