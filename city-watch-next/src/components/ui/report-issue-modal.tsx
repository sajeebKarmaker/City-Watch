'use client'

import styles from '../../App.module.css'
import { ReportIssueForm } from './report-issue-form'
import { ReportModalHeader } from './report-modal-header'
import { ReportModalShell } from './report-modal-shell'

type ReportIssueModalProps = {
  open: boolean
  onClose: () => void
  categories: readonly string[]
  location: { lat: number; lng: number } | null
  onLocationChange: (next: { lat: number; lng: number }) => void
}

export function ReportIssueModal({
  open,
  onClose,
  categories,
  location,
  onLocationChange,
}: ReportIssueModalProps) {
  const reportCategories = categories.filter((c) => c !== 'All')

  const handleSubmit = () => {
    onClose()
  }

  return (
    <ReportModalShell open={open} onBackdropClick={onClose}>
      <ReportModalHeader title="Report an Issue" onClose={onClose} />
      {location ? (
        <ReportIssueForm
          categories={reportCategories}
          location={location}
          onLocationChange={onLocationChange}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className={styles.modalBody}>
          <p>Select a location on the map first.</p>
        </div>
      )}
    </ReportModalShell>
  )
}
