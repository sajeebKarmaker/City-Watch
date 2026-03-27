import type { ReactNode } from 'react'
import styles from '../../App.module.css'

type ActivityItemProps = {
  icon: ReactNode
  title: string
  time: string
  desc: string
}

export function ActivityItem({ icon, title, time, desc }: ActivityItemProps) {
  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon}>{icon}</div>
      <div className={styles.activityContent}>
        <div className={styles.activityHeader}>
          <h5>{title}</h5>
          <span>{time}</span>
        </div>
        <p>{desc}</p>
      </div>
    </div>
  )
}
