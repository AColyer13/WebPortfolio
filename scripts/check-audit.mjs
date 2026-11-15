import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const levels = ['info', 'low', 'moderate', 'high', 'critical']

// Match package locations and advisory identities, not counts: a new issue must
// never disappear behind an unrelated issue that was fixed in the same update.
export function regressions(current, baseline) {
  for (const report of [current, baseline]) {
    if (report?.auditReportVersion !== 2 || report.error ||
        !report.vulnerabilities || !report.metadata?.vulnerabilities ||
        !Number.isInteger(report.metadata.vulnerabilities.total) ||
        report.metadata.vulnerabilities.total !== Object.keys(report.vulnerabilities).length) {
      throw new Error('Invalid npm audit report; refusing to treat it as clean')
    }
  }
  const issues = []
  for (const [name, finding] of Object.entries(current.vulnerabilities)) {
    const prior = baseline.vulnerabilities[name]
    if (!levels.includes(finding.severity) || !Array.isArray(finding.nodes) || !Array.isArray(finding.via)) {
      throw new Error(`Invalid audit finding: ${name}`)
    }
    if (!prior) { issues.push(`New affected package: ${name}`); continue }
    if (levels.indexOf(finding.severity) > levels.indexOf(prior.severity)) issues.push(`Severity increased: ${name}`)
    for (const node of finding.nodes) {
      if (!prior.nodes.includes(node)) issues.push(`New affected location: ${node}`)
    }
    for (const cause of finding.via) {
      if (typeof cause !== 'string') {
        const old = prior.via.find((item) => typeof item === 'object' && item.url === cause.url)
        if (!old || !cause.url) issues.push(`New advisory: ${name} ${cause.url || '(missing URL)'}`)
        else if (!levels.includes(cause.severity) || levels.indexOf(cause.severity) > levels.indexOf(old.severity)) {
          issues.push(`Advisory severity increased: ${cause.url}`)
        }
      }
    }
  }
  return issues
}

export function main() {
  const baseline = JSON.parse(readFileSync(new URL('../docs/security/audit-baseline.json', import.meta.url), 'utf8'))
  mkdirSync('audit-results', { recursive: true })
  const result = spawnSync('npm', ['audit', '--json'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
  writeFileSync('audit-results/full.json', result.stdout || '')
  if (result.error || ![0, 1].includes(result.status)) throw new Error(`npm audit failed: ${result.error || result.stderr}`)
  const current = JSON.parse(result.stdout)
  const issues = regressions(current, baseline)
  const total = current.metadata.vulnerabilities.total
  console.log(`Full dependency audit: ${total} affected entries. See audit-results/full.json.`)
  if (total) console.warn('Known development-tool findings remain. See docs/security/dev-tool-triage.md; this is not a clean full audit.')
  if (issues.length) throw new Error(`Dependency audit regression:\n${issues.join('\n')}`)
  console.log('No new affected packages, locations, advisory identities, or severity increases versus the reviewed baseline.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main() } catch (error) { console.error(error.message); process.exitCode = 1 }
}
