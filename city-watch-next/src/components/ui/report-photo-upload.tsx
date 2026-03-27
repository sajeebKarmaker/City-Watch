import { Camera } from 'lucide-react'
import styles from '../../App.module.css'

export function ReportPhotoUpload() {
  return (
    <div className={styles.uploadArea}>
      <div className={styles.uploadIcon}>
        <Camera />
      </div>
      <p className={styles.uploadText}>Click to upload or drag & drop</p>
      <p className={styles.uploadSubtext}>PNG, JPG up to 10MB</p>
    </div>
  )
}
