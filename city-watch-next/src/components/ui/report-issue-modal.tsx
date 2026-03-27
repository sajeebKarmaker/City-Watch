'use client'

import { ReportIssueForm } from './report-issue-form'
import { ReportModalHeader } from './report-modal-header'
import { ReportModalShell } from './report-modal-shell'

type ReportIssueModalProps = {
  open: boolean
  onClose: () => void
  categories: readonly string[]
}

export function ReportIssueModal({
  open,
  onClose,
  categories,
}: ReportIssueModalProps) {
  const reportCategories = categories.filter((c) => c !== 'All')

  const handleSubmit = () => {
    onClose()
  }

  return (
    <ReportModalShell open={open} onBackdropClick={onClose}>
      <ReportModalHeader title="Report an Issue" onClose={onClose} />
      <ReportIssueForm
        categories={reportCategories}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </ReportModalShell>
  )
}
