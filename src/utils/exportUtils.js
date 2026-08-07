function formatDate(dateVal) {
  if (!dateVal) return '-'
  try {
    const d = new Date(dateVal)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch (e) {
    return dateVal
  }
}

function ucfirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function escapeCSVField(field) {
  if (field === null || field === undefined) return '""'
  const str = String(field).replace(/"/g, '""')
  return `"${str}"`
}

export function exportToCSV(applications, filename = 'daftar-lamaran-kerja.csv') {
  if (!applications || !applications.length) return false

  const headers = [
    'No',
    'Nama Perusahaan',
    'Posisi Pekerjaan',
    'Status',
    'Platform',
    'Tanggal Melamar',
    'Link Lowongan',
    'Catatan',
  ]

  const rows = applications.map((app, index) => [
    index + 1,
    escapeCSVField(app.company_name),
    escapeCSVField(app.position),
    escapeCSVField(ucfirst(app.status?.name || 'Status')),
    escapeCSVField(app.platform?.label || app.platform?.name || 'Platform'),
    escapeCSVField(formatDate(app.applied_date || app.applied_at)),
    escapeCSVField(app.job_link || app.job_url || ''),
    escapeCSVField(app.notes || ''),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(',')),
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return true
}

export function printReport(applications) {
  if (!applications || !applications.length) return false

  const printWindow = window.open('', '_blank')
  if (!printWindow) return false

  const rowsHtml = applications
    .map(
      (app, idx) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${app.company_name || '-'}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${app.position || '-'}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><span style="display: inline-block; padding: 2px 8px; border-radius: 12px; background-color: ${app.status?.color || '#325E6A'}20; color: ${app.status?.color || '#0F172A'}; font-weight: bold; font-size: 11px;">${ucfirst(app.status?.name || 'Status')}</span></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${app.platform?.label || app.platform?.name || '-'}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${formatDate(app.applied_date || app.applied_at)}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${app.notes || '-'}</td>
    </tr>
  `
    )
    .join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Rekapitulasi Lamaran Kerja</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #0f172a; }
          h1 { margin-bottom: 4px; font-size: 22px; }
          p { margin-top: 0; color: #64748b; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th { background-color: #f1f5f9; padding: 10px; border: 1px solid #cbd5e1; text-align: left; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <h1>Laporan Rekapitulasi Lamaran Kerja</h1>
        <p>Dicetak pada: ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'short' }).format(new Date())} | Total: ${applications.length} Lamaran</p>
        <table>
          <thead>
            <tr>
              <th style="text-align: center; width: 40px;">No</th>
              <th>Nama Perusahaan</th>
              <th>Posisi Pekerjaan</th>
              <th>Status</th>
              <th>Platform</th>
              <th>Tanggal Melamar</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)

  return true
}
