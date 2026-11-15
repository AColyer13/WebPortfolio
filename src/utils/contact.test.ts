import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendContactForm } from './contact'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('EmailJS SDK integration', () => {
  it('serializes the contact form using the real SDK without sending an email', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const form = document.createElement('form')
    form.innerHTML = '<input name="from_name" value="SDK test"><textarea name="message">Test message</textarea>'

    await sendContactForm(form)

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.emailjs.com/api/v1.0/email/send-form')
    expect(options.method).toBe('POST')
    expect(options.body).toBeInstanceOf(FormData)
    expect(options.body.get('from_name')).toBe('SDK test')
    expect(options.body.get('message')).toBe('Test message')
    expect(options.body.get('service_id')).toBe('default_service')
    expect(options.body.get('template_id')).toBe('template_6dk6wl5')
    expect(options.body.get('user_id')).toBeTruthy()
  })

  it('propagates SDK request failures to the contact form', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Unavailable', { status: 503 })))
    await expect(sendContactForm(document.createElement('form'))).rejects.toMatchObject({
      status: 503,
      text: 'Unavailable',
    })
  })
})
