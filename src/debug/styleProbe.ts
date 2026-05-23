/** Runtime diagnostics for missing CSS on GitHub Pages / preview. */
export function runStyleProbe(): void {
  const navEntry = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  const navType = navEntry?.type ?? 'unknown'

  const linkEls = [
    ...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  ]
  const linkMeta = linkEls.map((el) => ({
    href: el.href,
    crossOrigin: el.crossOrigin,
    sheetLoaded: Boolean(el.sheet),
  }))

  const sheetMeta = [...document.styleSheets].map((sheet, i) => {
    let ruleCount: number | null = null
    try {
      ruleCount = sheet.cssRules?.length ?? 0
    } catch {
      ruleCount = null
    }
    return { index: i, href: sheet.href, ruleCount }
  })

  const cssBroken =
    linkEls.length === 0 ||
    linkMeta.some((l) => !l.sheetLoaded) ||
    sheetMeta.every((s) => s.ruleCount === 0 || s.ruleCount === null)

  const runId = import.meta.env.PROD ? 'post-fix' : 'pre-fix'

  const payload = {
    sessionId: '8e317f',
    runId,
    location: 'styleProbe.ts:runStyleProbe',
    message: 'style probe snapshot',
    data: {
      navType,
      baseUrl: import.meta.env.BASE_URL,
      pathname: window.location.pathname,
      linkMeta,
      sheetMeta,
      stylesheetCount: document.styleSheets.length,
      cssBroken,
    },
    timestamp: Date.now(),
  }

  // #region agent log
  fetch('http://127.0.0.1:7278/ingest/acc5e3c0-d9e1-4dcf-bf75-5e1ba8f61522', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '8e317f',
    },
    body: JSON.stringify({ ...payload, hypothesisId: 'B,C,E' }),
  }).catch(() => {})
  // #endregion

  void Promise.all(
    linkEls.map(async (el) => {
      let status: number | null = null
      let ok = false
      try {
        const res = await fetch(el.href, { method: 'HEAD', cache: 'no-store' })
        status = res.status
        ok = res.ok
      } catch {
        status = null
      }
      // #region agent log
      fetch('http://127.0.0.1:7278/ingest/acc5e3c0-d9e1-4dcf-bf75-5e1ba8f61522', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '8e317f',
        },
        body: JSON.stringify({
          sessionId: '8e317f',
          runId,
          hypothesisId: 'A,D',
          location: 'styleProbe.ts:headCheck',
          message: 'stylesheet HEAD check',
          data: { href: el.href, status, ok, crossOrigin: el.crossOrigin, navType },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
    }),
  )
}
