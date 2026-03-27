import type { Issue } from '../../types/issue'
import styles from '../../App.module.css'
import { EmptyIssuesState } from './empty-issues-state'
import { IssueCard } from './issue-card'

type IssuesListProps = {
  issues: Issue[]
}

export function IssuesList({ issues }: IssuesListProps) {
  return (
    <div className={styles.issuesList}>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
      {issues.length === 0 && <EmptyIssuesState />}
    </div>
  )
}
