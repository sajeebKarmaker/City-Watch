import { X } from 'lucide-react'
import styles from '../../App.module.css'

type ReportModalHeaderProps = {
  title: string
  onClose: () => void
}

export function ReportModalHeader({ title, onClose }: ReportModalHeaderProps) {
  return (
    <div className={styles.modalHeader}>
      <h3>{title}</h3>
      <button type="button" onClick={onClose}>
        <X />
      </button>
    </div>
  )
}
