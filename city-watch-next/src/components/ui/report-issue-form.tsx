import styles from '../../App.module.css'
import { ReportFormGroup } from './report-form-group'
import { ReportLabeledSelect } from './report-labeled-select'
import { ReportLocationFields } from './report-location-fields'
import { ReportModalActions } from './report-modal-actions'
import { ReportPhotoUpload } from './report-photo-upload'

const URGENCY_OPTIONS = ['Low', 'Medium', 'High', 'Emergency'] as const

type ReportIssueFormProps = {
  categories: readonly string[]
  location: { lat: number; lng: number }
  onLocationChange: (next: { lat: number; lng: number }) => void
  onCancel: () => void
  onSubmit: () => void
}

export function ReportIssueForm({
  categories,
  location,
  onLocationChange,
  onCancel,
  onSubmit,
}: ReportIssueFormProps) {
  return (
    <div className={styles.modalBody}>
      <ReportLocationFields
        lat={location.lat}
        lng={location.lng}
        onLocationChange={onLocationChange}
      />

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

      <ReportFormGroup label="Location Details" htmlFor="report-location-details">
        <input
          id="report-location-details"
          name="locationDetails"
          type="text"
          placeholder="e.g. Main St & 5th Ave, near the park entrance"
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
