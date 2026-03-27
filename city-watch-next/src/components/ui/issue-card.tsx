'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Issue } from '../../types/issue'
import styles from '../../App.module.css'
import { ImageWithFallback } from './ImageWithFallBack'
import { StatusBadge } from './status-badge'

type IssueCardProps = {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link
      href={`/issues/${issue.id}`}
      className={styles.issueCardLink}
      aria-label={`View details for ${issue.title}`}
    >
      <motion.div
        layout
        className={styles.issueCard}
      >
        <div className={styles.issueCardContent}>
          <div className={styles.issueImage}>
            <ImageWithFallback src={issue.image} alt={issue.title} />
          </div>
          <div className={styles.issueDetails}>
            <div className={styles.issueHeader}>
              <span className={styles.issueCategory}>{issue.category}</span>
              <span className={styles.issueTimestamp}>{issue.timestamp}</span>
            </div>
            <h3 className={styles.issueTitle}>{issue.title}</h3>
            <div className={styles.issueStatus}>
              <StatusBadge status={issue.status} />
            </div>
            <div className={styles.issueReports}>
              <div className={styles.avatarGroup}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className={styles.avatar}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className={styles.reportCount}>
                +{issue.reports} others reported this
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
