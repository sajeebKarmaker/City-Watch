import styles from '../../App.module.css'

type StatusBadgeProps = {
  status: string
  size?: 'sm' | 'lg'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const statusKey =
    status === 'Pending'
      ? 'pending'
      : status === 'In Progress'
        ? 'inProgress'
        : status === 'Resolved'
          ? 'resolved'
          : 'pending'

  const variantClass =
    statusKey === 'pending'
      ? styles.pending
      : statusKey === 'inProgress'
        ? styles.inProgress
        : styles.resolved

  return (
    <span
      className={`${styles.statusBadge} ${variantClass} ${size === 'lg' ? styles.large : ''}`}
    >
      {status}
    </span>
  )
}
