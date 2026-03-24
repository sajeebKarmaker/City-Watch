import { Info } from 'lucide-react'
import styles from '../../App.module.css'

type EmptyIssuesStateProps = {
  message?: string
}

export function EmptyIssuesState({
  message = 'No reports found matching your criteria.',
}: EmptyIssuesStateProps) {
  return (
    <div className={styles.emptyState}>
      <Info />
      <p>{message}</p>
    </div>
  )
}
