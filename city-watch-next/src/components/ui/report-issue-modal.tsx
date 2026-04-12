'use client'

import styles from '../../App.module.css'
import { createIssue } from '../../lib/api/issues'
import type { CategoryDto } from '../../lib/api/issues'
import { ReportIssueForm } from './report-issue-form'
import { ReportModalHeader } from './report-modal-header'
import { ReportModalShell } from './report-modal-shell'

type ReportIssueModalProps = {
  open: boolean
  onClose: () => void
  categories: CategoryDto[]
  categoriesError?: string | null
  location: { lat: number; lng: number } | null
  onLocationChange: (next: { lat: number; lng: number }) => void
  onReported: () => void | Promise<void>
}

export function ReportIssueModal({
  open,
  onClose,
  categories,
  categoriesError = null,
  location,
  onLocationChange,
  onReported,
}: ReportIssueModalProps) {
  return (
    <ReportModalShell open={open} onBackdropClick={onClose}>
      <ReportModalHeader title="Report an Issue" onClose={onClose} />
      {location && categoriesError ? (
        <div className={styles.modalBody}>
          <p>Could not load categories: {categoriesError}</p>
        </div>
      ) : location && categories.length > 0 ? (
        <ReportIssueForm
          categories={categories}
          location={location}
          onLocationChange={onLocationChange}
          onCancel={onClose}
          onSubmit={async (payload) => {
            await createIssue(payload)
            await onReported()
            onClose()
          }}
        />
      ) : (
        <div className={styles.modalBody}>
          <p>
            {categories.length === 0
              ? 'Loading categories…'
              : 'Select a location on the map first.'}
          </p>
        </div>
      )}
    </ReportModalShell>
  )
}
