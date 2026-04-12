import type { Issue } from '../../types/issue'
import styles from '../../App.module.css'
import { EmptyIssuesState } from './empty-issues-state'
import { IssueCard } from './issue-card'

type IssuesListProps = {
  issues: Issue[]
  loading?: boolean
}

export function IssuesList({ issues, loading = false }: IssuesListProps) {
  if (loading) {
    return (
      <div className={styles.issuesList}>
        <p style={{ opacity: 0.7, padding: '0.5rem 0' }}>Loading issues…</p>
      </div>
    )
  }

  return (
    <div className={styles.issuesList}>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
      {issues.length === 0 && <EmptyIssuesState />}
    </div>
  )
}
