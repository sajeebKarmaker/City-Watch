import styles from '../../App.module.css'

type ReportModalActionsProps = {
  cancelLabel?: string
  submitLabel?: string
  onCancel: () => void
  onSubmit: () => void
}

export function ReportModalActions({
  cancelLabel = 'Cancel',
  submitLabel = 'Submit Report',
  onCancel,
  onSubmit,
}: ReportModalActionsProps) {
  return (
    <div className={styles.modalActions}>
      <button type="button" onClick={onCancel}>
        {cancelLabel}
      </button>
      <button type="button" onClick={onSubmit}>
        {submitLabel}
      </button>
    </div>
  )
}
