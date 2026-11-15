/** Production-browser accessibility regression suite. Run after npm run build. */
import assert from 'node:assert/strict'
import { stripVTControlCharacters } from 'node:util'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// Resolve the browser tools from the installed axe CLI, which owns these dependencies.
const require = createRequire(import.meta.url)
const axeRequire = createRequire(require.resolve('@axe-core/cli/package.json'))
const { Builder, By, Key } = axeRequire('selenium-webdriver')
const chrome = axeRequire('selenium-webdriver/chrome')
const { AxeBuilder } = axeRequire('@axe-core/webdriverjs')
const chromedriver = axeRequire('chromedriver')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = Number(process.env.A11Y_PORT || 4187)
const url = `http://127.0.0.1:${port}/`
const reports = path.resolve(root, process.env.A11Y_REPORT_DIR || 'a11y-results')
const results = []
let driver
let previewError
let previewListening = false
let previewOutput = ''
const preview = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'),
  'preview', '--port', String(port), '--strictPort', '--host', '127.0.0.1'],
{ cwd: root, stdio: ['ignore', 'pipe', 'inherit'] })
preview.stdout.on('data', (chunk) => {
  process.stdout.write(chunk)
  previewOutput += stripVTControlCharacters(chunk.toString())
  if (previewOutput.includes(url)) previewListening = true
})
preview.on('error', (error) => { previewError = error })

async function waitFor(check, message, timeout = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await check()) return
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(message)
}

async function ready() {
  await driver.wait(async () => (await driver.findElements(By.css('#projects article'))).length > 0 &&
    (await driver.findElements(By.css('#contact form'))).length > 0, 15000)
  await driver.executeAsyncScript('document.fonts.ready.then(() => arguments[0]())')
}

async function audit(name) {
  const report = await new AxeBuilder(driver)
    .withTags('wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice').analyze()
  await writeFile(path.join(reports, `${name}.json`), JSON.stringify(report, null, 2))
  results.push({ name, violations: report.violations.length, manualReview: report.incomplete.length })
  if (report.violations.length) {
    console.error(name, report.violations.map((v) => ({ rule: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, reason: n.failureSummary })) })))
  }
  // Finish the matrix before failing so one contrast issue does not hide other states.
  console.log(`${name}: ${report.violations.length} violations; ${report.incomplete.length} manual-review items`)
}

async function layout(name) {
  const dimensions = await driver.executeScript(`return {
    width: innerWidth, scroll: document.documentElement.scrollWidth,
    positiveTabindex: [...document.querySelectorAll('[tabindex]')].filter((element) => element.tabIndex > 0).length
  }`)
  assert.ok(dimensions.scroll <= dimensions.width + 1, `${name}: horizontal page overflow`)
  assert.equal(dimensions.positiveTabindex, 0, `${name}: positive tabindex changes reading order`)
}

// Reach controls through real Tab input; never simulate keyboard access with element.focus().
async function tabTo(selector, max = 150) {
  for (let i = 0; i < max; i++) {
    if (await driver.executeScript('return document.activeElement.matches(arguments[0])', selector)) {
      const visible = await driver.executeScript(`
        const e = document.activeElement, s = getComputedStyle(e), r = e.getBoundingClientRect();
        return e.matches(':focus-visible') && r.width > 0 && r.height > 0 &&
          r.bottom > 0 && r.top < innerHeight && r.left >= -1 && r.right <= innerWidth + 1 &&
          ((s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none');`)
      assert.ok(visible, `No visible keyboard focus indicator on ${selector}`)
      return await driver.switchTo().activeElement()
    }
    await driver.actions().sendKeys(Key.TAB).perform()
  }
  throw new Error(`Keyboard cannot reach ${selector} within ${max} Tab presses`)
}

async function press(key) { await driver.actions().sendKeys(key).perform() }

async function projects(name) {
  const count = (await driver.findElements(By.css('#projects article'))).length
  const toggleSelector = '#projects > div > div:last-child > button'
  const toggle = await tabTo(toggleSelector)
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false')
  await press(Key.ENTER)
  await driver.wait(async () => (await driver.findElements(By.css('#projects article'))).length > count, 5000)
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true')
  assert.equal(new URL(await driver.getCurrentUrl()).searchParams.get('projects'), 'all')
  assert.ok(await driver.executeScript('return document.activeElement === arguments[0]', toggle), 'Expansion loses focus')
  const cards = await driver.findElements(By.css('#projects article'))
  for (let i = 0; i < cards.length; i++) {
    const selector = `#projects article:nth-child(${i + 1}) button[aria-controls]`
    const control = await tabTo(selector)
    await press(Key.SPACE)
    assert.equal(await control.getAttribute('aria-expanded'), 'true')
    const description = await driver.findElement(By.id(await control.getAttribute('aria-controls')))
    assert.equal(await description.getAttribute('data-expanded'), 'true')
    assert.ok(await description.isDisplayed())
  }
  await layout(`${name}-expanded`)
  await audit(`${name}-expanded`)
  await tabTo(toggleSelector)
  await press(Key.SPACE)
  await driver.wait(async () => (await driver.findElements(By.css('#projects article'))).length === count, 5000)
  assert.equal(new URL(await driver.getCurrentUrl()).searchParams.has('projects'), false)
  assert.ok(await driver.executeScript('return document.activeElement === arguments[0]', toggle), 'Collapse loses focus')
  // The URL-backed expanded view must also work on a fresh navigation/reload.
  await driver.get(`${url}?projects=all#projects`)
  await ready()
  assert.equal((await driver.findElements(By.css('#projects article'))).length, cards.length)
  assert.equal(await (await driver.findElement(By.css(toggleSelector))).getAttribute('aria-expanded'), 'true')
}

async function mobileMenu(name) {
  const toggle = await tabTo('button[popovertarget="site-nav-menu"]')
  await press(Key.ENTER)
  await driver.wait(() => driver.executeScript("return document.querySelector('#site-nav-menu').matches(':popover-open')"), 5000)
  await layout(`${name}-menu`)
  await audit(`${name}-menu`)
  await tabTo('#site-nav-menu a')
  await press(Key.ESCAPE)
  await driver.wait(() => driver.executeScript("return !document.querySelector('#site-nav-menu').matches(':popover-open')"), 5000)
  assert.ok(await driver.executeScript('return document.activeElement === arguments[0]', toggle), 'Escape must restore menu trigger focus')
  await press(Key.SPACE)
  await tabTo('#site-nav-menu a[href$="#projects"]')
  await press(Key.ENTER)
  await driver.wait(() => driver.executeScript("return !document.querySelector('#site-nav-menu').matches(':popover-open')"), 5000)
  assert.equal(new URL(await driver.getCurrentUrl()).hash, '#projects')
  await driver.wait(() => driver.executeScript("return !document.documentElement.classList.contains('menu-scroll-lock')"), 5000)
}

try {
  await mkdir(reports, { recursive: true })
  await waitFor(async () => {
    if (previewError) throw previewError
    if (preview.exitCode !== null) throw new Error(`Preview exited: ${preview.exitCode}`)
    if (!previewListening) return false
    try { return (await fetch(url)).ok } catch { return false }
  }, 'Preview did not become ready')
  const options = new chrome.Options().addArguments('--headless=new', '--disable-dev-shm-usage')
  const chromePath = process.env.CHROME_PATH || process.env.CHROME_TEST_PATH
  if (chromePath) options.setChromeBinaryPath(chromePath)
  if (process.env.A11Y_NO_SANDBOX === '1') options.addArguments('--no-sandbox')
  const service = new chrome.ServiceBuilder(process.env.CHROMEDRIVER_PATH || process.env.CHROMEDRIVER_TEST_PATH || chromedriver.path).setHostname('127.0.0.1')
    .enableVerboseLogging().loggingTo(path.join(reports, 'chromedriver.log'))
  driver = await new Builder().forBrowser('chrome').setChromeService(service).setChromeOptions(options).build()
  await driver.manage().setTimeouts({ script: 60000, pageLoad: 30000 })
  for (const width of [1280, 390, 320]) {
    for (const theme of ['light', 'dark']) {
      const name = `${width}-${theme}`
      await driver.sendDevToolsCommand('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 })
      await driver.sendDevToolsCommand('Emulation.setEmulatedMedia', { features: [
        { name: 'prefers-color-scheme', value: theme },
        { name: 'prefers-reduced-motion', value: 'reduce' },
      ] })
      await driver.get(url)
      await ready()
      assert.ok(await driver.executeScript('return matchMedia(arguments[0]).matches', `(prefers-color-scheme: ${theme})`))
      await layout(name)
      await audit(`${name}-featured`)
      await press(Key.TAB)
      assert.equal(await driver.executeScript('return document.activeElement.classList.contains("skip-link")'), true, 'Skip link must be first Tab stop')
      await tabTo('.skip-link')
      await press(Key.ENTER)
      // Scroll-spy intentionally clears the top-of-page hash; verify actual focus.
      await driver.wait(() => driver.executeScript("return document.activeElement.id === 'main-content'"), 5000)
      await press(Key.TAB)
      assert.ok(await driver.executeScript("return document.querySelector('main').contains(document.activeElement)"), 'Skip link must bypass navigation')
      if (width < 768) await mobileMenu(name)
      await projects(name)
    }
  }
  assert.equal(results.length, 16, 'Accessibility scenario matrix did not finish')
  assert.equal(results.reduce((total, r) => total + r.violations, 0), 0, 'Accessibility violations found; inspect a11y-results/*.json')
} catch (error) {
  console.error(error)
  if (driver) await writeFile(path.join(reports, 'failure.png'), await driver.takeScreenshot(), 'base64').catch(console.error)
  if (!driver) console.error(await readFile(path.join(reports, 'chromedriver.log'), 'utf8').catch(() => 'No ChromeDriver log available'))
  process.exitCode = 1
} finally {
  await writeFile(path.join(reports, 'summary.json'), JSON.stringify(results, null, 2)).catch(console.error)
  if (driver) await driver.quit().catch(console.error)
  preview.kill('SIGTERM')
}
