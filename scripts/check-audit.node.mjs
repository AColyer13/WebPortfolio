import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { regressions } from './check-audit.mjs'
const baseline = JSON.parse(readFileSync(new URL('../docs/security/audit-baseline.json', import.meta.url)))
const copy = () => structuredClone(baseline)
test('accepts documented findings', () => assert.deepEqual(regressions(copy(), baseline), []))
test('accepts fixes', () => {
  const audit = copy(); audit.vulnerabilities = {}; audit.metadata.vulnerabilities.total = 0
  assert.deepEqual(regressions(audit, baseline), [])
})
test('rejects a new package even when total counts match', () => {
  const audit = copy(); audit.vulnerabilities.new = audit.vulnerabilities['basic-ftp']; delete audit.vulnerabilities['basic-ftp']
  assert.match(regressions(audit, baseline).join(), /New affected package/)
})
test('rejects new advisory identity', () => {
  const audit = copy(); audit.vulnerabilities['basic-ftp'].via[0].url = 'https://example.com/new'
  assert.match(regressions(audit, baseline).join(), /New advisory/)
})
test('rejects severity increases', () => {
  const audit = copy(); audit.vulnerabilities['basic-ftp'].severity = 'critical'
  assert.match(regressions(audit, baseline).join(), /Severity increased/)
})
test('rejects advisory severity increases', () => {
  const audit = copy(); audit.vulnerabilities['basic-ftp'].via[1].severity = 'high'
  assert.match(regressions(audit, baseline).join(), /Advisory severity increased/)
})
test('rejects new affected locations', () => {
  const audit = copy(); audit.vulnerabilities['basic-ftp'].nodes.push('node_modules/new/node_modules/basic-ftp')
  assert.match(regressions(audit, baseline).join(), /New affected location/)
})
test('rejects unavailable or invalid audit data', () => {
  for (const report of [{}, { error: 'registry unavailable' }, { ...copy(), auditReportVersion: 3 }, { ...copy(), vulnerabilities: {} }]) {
    assert.throws(() => regressions(report, baseline), /Invalid npm audit report/)
  }
})
