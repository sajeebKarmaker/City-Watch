import type { Issue } from '../../types/issue'
import styles from '../../App.module.css'
import { EmptyIssuesState } from './empty-issues-state'
import { IssueCard } from './issue-card'

type IssuesListProps = {
  issues: Issue[]
  selectedIssue: Issue | null
  onSelectIssue: (issue: Issue) => void
}

export function IssuesList({
  issues,
  selectedIssue,
  onSelectIssue,
}: IssuesListProps) {
  return (
    <div className={styles.issuesList}>
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          selected={selectedIssue?.id === issue.id}
          onSelect={onSelectIssue}
        />
      ))}
      {issues.length === 0 && <EmptyIssuesState />}
    </div>
  )
}
