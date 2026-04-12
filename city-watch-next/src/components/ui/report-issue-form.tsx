import { useEffect, useState } from 'react'
import styles from '../../App.module.css'
import type { CategoryDto, CreateIssuePayload } from '../../lib/api/issues'
import { ReportFormGroup } from './report-form-group'
import { ReportLabeledSelect } from './report-labeled-select'
import { ReportLocationFields } from './report-location-fields'
import { ReportModalActions } from './report-modal-actions'
import { ReportPhotoUpload } from './report-photo-upload'

const URGENCY_OPTIONS = ['Low', 'Medium', 'High', 'Emergency'] as const

type ReportIssueFormProps = {
  categories: CategoryDto[]
  location: { lat: number; lng: number }
  onLocationChange: (next: { lat: number; lng: number }) => void
  onCancel: () => void
  onSubmit: (payload: CreateIssuePayload) => Promise<void>
}

export function ReportIssueForm({
  categories,
  location,
  onLocationChange,
  onCancel,
  onSubmit,
}: ReportIssueFormProps) {
  const nameOptions = categories.map((c) => c.name)
  const [categoryName, setCategoryName] = useState(nameOptions[0] ?? '')
  const [urgency, setUrgency] = useState<string>(URGENCY_OPTIONS[0])

  useEffect(() => {
    if (nameOptions.length > 0 && !nameOptions.includes(categoryName)) {
      setCategoryName(nameOptions[0])
    }
  }, [nameOptions, categoryName])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationDetails, setLocationDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const cat = categories.find((c) => c.name === categoryName)
    if (!cat) {
      setError('Select a category.')
      return
    }
    if (!title.trim()) {
      setError('Enter a title.')
      return
    }
    setSubmitting(true)
    try {
      const descParts = [description.trim()]
      if (urgency !== 'Low') {
        descParts.push(`Urgency: ${urgency}`)
      }
      const fullDescription = descParts.filter(Boolean).join('\n\n')

      await onSubmit({
        categoryId: cat.id,
        title: title.trim(),
        description: fullDescription,
        status: 'Pending',
        latitude: location.lat,
        longitude: location.lng,
        locationDetails: locationDetails.trim() || null,
        image: null,
      })
      setTitle('')
      setDescription('')
      setLocationDetails('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)}>
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
            options={nameOptions}
            value={categoryName}
            onChange={setCategoryName}
          />
          <ReportLabeledSelect
            id="report-urgency"
            label="Urgency"
            options={URGENCY_OPTIONS}
            value={urgency}
            onChange={setUrgency}
          />
        </div>

        <ReportFormGroup label="Title" htmlFor="report-title">
          <input
            id="report-title"
            name="title"
            type="text"
            placeholder="Briefly describe the issue"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
          />
        </ReportFormGroup>

        <ReportFormGroup label="Location Details" htmlFor="report-location-details">
          <input
            id="report-location-details"
            name="locationDetails"
            type="text"
            placeholder="e.g. Main St & 5th Ave, near the park entrance"
            value={locationDetails}
            onChange={(ev) => setLocationDetails(ev.target.value)}
          />
        </ReportFormGroup>

        <ReportFormGroup label="Description" htmlFor="report-description">
          <textarea
            id="report-description"
            name="description"
            placeholder="Tell us more about what's happening..."
            rows={3}
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
        </ReportFormGroup>

        <ReportFormGroup label="Photo">
          <ReportPhotoUpload />
        </ReportFormGroup>

        {error && (
          <p style={{ color: '#b91c1c', fontSize: '0.9rem', marginTop: 8 }}>{error}</p>
        )}

        <ReportModalActions onCancel={onCancel} disabled={submitting} />
      </div>
    </form>
  )
}
