const EMAILJS_PUBLIC_KEY = 'S590pep4moIqEJb8m'
const EMAILJS_SERVICE_ID = 'default_service'
const EMAILJS_TEMPLATE_ID = 'template_6dk6wl5'

let initialized = false

export async function sendContactForm(form: HTMLFormElement): Promise<void> {
  const mod = await import('@emailjs/browser')
  const emailjs = mod.default
  if (!initialized) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
    initialized = true
  }
  await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
}

