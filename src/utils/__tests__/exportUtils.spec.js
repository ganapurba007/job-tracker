import { describe, it, expect, vi } from 'vitest'
import { exportToCSV, printReport } from '@/utils/exportUtils'

describe('exportUtils', () => {
  it('returns false for empty data in exportToCSV', () => {
    expect(exportToCSV([])).toBe(false)
    expect(exportToCSV(null)).toBe(false)
  })

  it('triggers CSV export cleanly with valid application list', () => {
    const mockData = [
      {
        id: 1,
        company_name: 'TechCorp',
        position: 'Frontend Developer',
        status: { name: 'Telah Dilamar' },
        platform: { label: 'LinkedIn' },
        applied_date: '2026-08-01',
        notes: 'Submitted via company site',
      },
    ]

    const result = exportToCSV(mockData, 'test.csv')
    expect(result).toBe(true)
  })

  it('returns false for empty data in printReport', () => {
    expect(printReport([])).toBe(false)
    expect(printReport(null)).toBe(false)
  })
})
