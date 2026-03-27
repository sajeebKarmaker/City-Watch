import styles from '../../App.module.css'
import { ReportFormGroup } from './report-form-group'
import { ReportLabeledSelect } from './report-labeled-select'
import { ReportModalActions } from './report-modal-actions'
import { ReportPhotoUpload } from './report-photo-upload'

const URGENCY_OPTIONS = ['Low', 'Medium', 'High', 'Emergency'] as const

type ReportIssueFormProps = {
  categories: readonly string[]
  onCancel: () => void
  onSubmit: () => void
}

export function ReportIssueForm({
  categories,
  onCancel,
  onSubmit,
}: ReportIssueFormProps) {
  return (
    <div className={styles.modalBody}>
      <div className={styles.formGrid}>
        <ReportLabeledSelect
          id="report-category"
          label="Category"
          options={categories}
        />
        <ReportLabeledSelect
          id="report-urgency"
          label="Urgency"
          options={URGENCY_OPTIONS}
        />
      </div>

      <ReportFormGroup label="Title" htmlFor="report-title">
        <input
          id="report-title"
          name="title"
          type="text"
          placeholder="Briefly describe the issue"
        />
      </ReportFormGroup>

      <ReportFormGroup label="Description" htmlFor="report-description">
        <textarea
          id="report-description"
          name="description"
          placeholder="Tell us more about what's happening..."
          rows={3}
        />
      </ReportFormGroup>

      <ReportFormGroup label="Photo">
        <ReportPhotoUpload />
      </ReportFormGroup>

      <ReportModalActions onCancel={onCancel} onSubmit={onSubmit} />
    </div>
  )
}
