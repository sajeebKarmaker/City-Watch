import styles from '../../App.module.css'

type ReportModalActionsProps = {
  cancelLabel?: string
  submitLabel?: string
  onCancel: () => void
  disabled?: boolean
}

export function ReportModalActions({
  cancelLabel = 'Cancel',
  submitLabel = 'Submit Report',
  onCancel,
  disabled = false,
}: ReportModalActionsProps) {
  return (
    <div className={styles.modalActions}>
      <button type="button" onClick={onCancel} disabled={disabled}>
        {cancelLabel}
      </button>
      <button type="submit" disabled={disabled}>
        {submitLabel}
      </button>
    </div>
  )
}
