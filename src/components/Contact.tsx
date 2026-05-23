import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'
import emailjs from '@emailjs/browser'
import {
  containerClass,
  contactSectionClass,
  sectionContainerClass,
} from '../utils/layoutClasses'

type FieldName = 'name' | 'email' | 'message'

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'success' | 'error'; message: string }

const inputClass =
  'w-full rounded-sm border border-border-default bg-surface-0 px-3 py-2 text-fluid-1 text-text-default transition-[border-color,box-shadow] duration-200 ease-in-out placeholder:text-text-muted placeholder:opacity-100 focus:border-primary-600 focus:outline-none focus:shadow-[0_0_0_3px_var(--color-focus-ring)] aria-invalid:border-danger-600 autofill:[-webkit-text-fill-color:var(--color-text-default)] autofill:shadow-[inset_0_0_0_1000px_var(--color-surface-0)]'

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
    <section className={`contact bg-surface-0 @container/contact ${contactSectionClass}`} id="contact">
      <div className={`${containerClass} ${sectionContainerClass}`}>
        <div className="grid grid-cols-1 items-stretch gap-(--contact-layout-gap) @[62rem]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border-default bg-surface-0 contain-[layout_style]">
            <div className="w-full flex-1 p-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90444.17968810473!2d-93.44258962458554!3d44.89525237382178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f6213ace55a039%3A0xcdaf9c3796fa2779!2sEdina%2C%20MN!5e0!3m2!1sen!2sus!4v1764804107343!5m2!1sen!2sus"
                width="100%"
                allowFullScreen
                loading="lazy"
                title="Map of Edina, MN"
                className="h-(--contact-map-height) w-full rounded-md border-0 grayscale transition-[filter] duration-200 ease-in-out hover:grayscale-0"
              />
            </div>
            <div className="mt-0 flex flex-wrap items-center justify-between gap-3 rounded-b-lg border border-t-0 border-border-default bg-surface-50 px-3 py-3">
              <div>
                <h3 className="mb-2 text-fluid-3 text-text-default">Say hello</h3>
                <p className="m-0 text-fluid-2 text-text-default">612.710.7700</p>
                <p>
                  <a href="mailto:adamcolyer@gmail.com">adamcolyer@gmail.com</a>
                </p>
              </div>

              <ul className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                <li className="flex">
                  <a
                    href="https://github.com/acolyer13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link inline-flex h-11 w-11 items-center justify-center rounded-sm bg-border-default text-primary-600 no-underline transition-[background-color,color,transform] duration-200 ease-in-out hover:-translate-y-[0.1875rem] hover:bg-primary-600 hover:text-text-default"
                    aria-label="GitHub profile"
                  >
                    <i className="fab fa-github block text-2xl leading-none" aria-hidden="true" />
                  </a>
                </li>
                <li className="flex">
                  <a
                    href="https://www.linkedin.com/in/colyeradam/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link inline-flex h-11 w-11 items-center justify-center rounded-sm bg-border-default text-primary-600 no-underline transition-[background-color,color,transform] duration-200 ease-in-out hover:-translate-y-[0.1875rem] hover:bg-primary-600 hover:text-text-default"
                    aria-label="LinkedIn profile"
                  >
                    <i className="fab fa-linkedin block text-2xl leading-none" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="contact-form w-full rounded-lg border border-border-default bg-surface-50 p-4 @[62rem]:p-4">
            <h2 className="mb-3 text-fluid-4 leading-tight text-text-default short-viewport:mb-2">
              Want to know more? <br /> Let&apos;s talk
            </h2>

            {status.kind !== 'idle' ? (
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className={`mb-2 rounded-sm p-2 text-fluid-1 ${
                  status.kind === 'success'
                    ? 'bg-[oklch(from_var(--color-primary-600)_l_c_h/12%)] text-text-default'
                    : 'bg-danger-bg text-danger-700'
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <form id="form" ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 gap-2 @[62rem]:grid-cols-2 @[62rem]:items-start">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact-name" className="text-fluid-1 font-medium text-text-default forced-colors:text-[CanvasText]">
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
                      autoComplete="name"
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                    />
                    {touched.name && errors.name ? (
                      <p id="contact-name-error" className="field-error m-0 text-copyright text-danger-700 forced-colors:text-[Mark]" role="alert">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact-email" className="text-fluid-1 font-medium text-text-default forced-colors:text-[CanvasText]">
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
                      autoComplete="email"
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={
                        touched.email && errors.email ? 'contact-email-error' : undefined
                      }
                    />
                    {touched.email && errors.email ? (
                      <p id="contact-email-error" className="field-error m-0 text-copyright text-danger-700 forced-colors:text-[Mark]" role="alert">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="contact-message" className="text-fluid-1 font-medium text-text-default forced-colors:text-[CanvasText]">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    className={`${inputClass} min-h-(--contact-textarea-min) max-h-[18svh] resize-y`}
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
                    <p id="contact-message-error" className="field-error m-0 text-copyright text-danger-700 forced-colors:text-[Mark]" role="alert">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <input type="hidden" name="reply_to" value={formData.email} />
                <input type="hidden" name="time" ref={timestampRef} />

                <div className="mt-2 @[62rem]:ms-auto @[62rem]:w-full @[62rem]:max-w-56">
                  <input
                    type="submit"
                    className="w-full min-h-11 cursor-pointer rounded-sm border-none bg-primary-600 px-4 py-2 font-bold text-text-on-primary transition-[background-color,transform,box-shadow] duration-200 ease-in-out hover:-translate-y-[0.1875rem] hover:bg-primary-700 hover:shadow-btn disabled:cursor-not-allowed disabled:opacity-60"
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
