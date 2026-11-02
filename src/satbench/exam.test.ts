import { describe, expect, it } from 'vitest'
import { gradeExam, PASSING_KEYS, quantizeMs } from './exam'

describe('sat bench', () => {
  it('quantizes latency to the 50 ms step', () => {
    expect(quantizeMs(0)).toBe(0)
    expect(quantizeMs(2024)).toBe(2000)
    expect(quantizeMs(2026)).toBe(2050)
  })

  it('grades the same key the same way twice', () => {
    const first = gradeExam('attitude', 'null-rate', 2024)
    const second = gradeExam('attitude', 'null-rate', 2000)
    expect(first).toEqual(second)
  })

  it('passes a fast null-rate and fails a spin-up', () => {
    const pass = gradeExam('attitude', 'null-rate', 2000)
    expect(pass.pass, JSON.stringify({ peak: pass.peak, settled: pass.settled, rateNote: pass.note })).toBe(true)
    expect(pass.latencyPass).toBe(true)

    const fail = gradeExam('attitude', 'spin-up', 500)
    expect(fail.latencyPass).toBe(true)
    expect(fail.peakPass).toBe(false)
    expect(fail.pass).toBe(false)
  })

  it('fails a late command even when the radiator would have held', () => {
    const late = gradeExam('thermal', 'open-radiator', 10000)
    expect(late.latencyPass).toBe(false)
    expect(late.peakPass).toBe(true)
    expect(late.settlePass).toBe(true)
    expect(late.note).toMatch(/missed the deadline/)
    expect(late.pass).toBe(false)

    const hot = gradeExam('thermal', 'heater-up', 500)
    expect(hot.peakPass).toBe(false)
    expect(hot.pass).toBe(false)
  })

  it('restores the link only when attitude is held', () => {
    const held = gradeExam('comms', 'hold-and-point', 1000)
    expect(held.pass, JSON.stringify({ peak: held.peak, settled: held.settled, link: held.link })).toBe(true)

    const coast = gradeExam('comms', 'coast', 500)
    expect(coast.linkPass).toBe(false)
    expect(coast.pass).toBe(false)
  })

  it('passes every published key', () => {
    for (const [examId, key] of Object.entries(PASSING_KEYS)) {
      const grade = gradeExam(examId as keyof typeof PASSING_KEYS, key.commandId, key.latencyMs)
      expect(grade.pass, `${examId} ${JSON.stringify({ peak: grade.peak, settled: grade.settled, link: grade.link })}`).toBe(true)
    }
  })

  it('treats a missed horizon as an uncommanded fault', () => {
    const missed = gradeExam('attitude', 'null-rate', 16000)
    expect(missed.commandLabel).toBe('No command')
    expect(missed.pass).toBe(false)
    expect(missed.note).toMatch(/No command arrived/)
  })
})
