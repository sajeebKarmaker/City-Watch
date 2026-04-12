import Link from 'next/link'
import { CheckCircle2, ChevronLeft, MapPin, Plus } from 'lucide-react'
import styles from '@/src/App.module.css'
import { ActivityItem } from '@/src/components/ui/activity-item'
import { ImageWithFallback } from '@/src/components/ui/ImageWithFallBack'
import { IssueMeTooSection } from '@/src/components/ui/issue-me-too-section'
import { StatusBadge } from '@/src/components/ui/status-badge'
import { fetchIssueById } from '@/src/lib/api/issues'

type IssueDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function IssueDetailsPage({ params }: IssueDetailsPageProps) {
  const { id } = await params
  const numId = Number(id)
  if (Number.isNaN(numId)) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Issue not found</h2>
          <Link href="/" className={styles.errorButton}>
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  let issue
  try {
    issue = await fetchIssueById(numId)
  } catch {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Could not load issue</h2>
          <p>Is the API running at the configured URL?</p>
          <Link href="/" className={styles.errorButton}>
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Issue not found</h2>
          <Link href="/" className={styles.errorButton}>
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.menuButton} title="Back to Map">
            <ChevronLeft />
          </Link>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <MapPin />
            </div>
            <h1 className={styles.logoText}>CityWatch</h1>
          </div>
        </div>
      </header>

      <div className={styles.issueDetailsPage}>
        <div className={styles.issueDetailsContainer}>
          <div className={styles.detailsImage}>
            <ImageWithFallback src={issue.image} alt={issue.title} />
            <div className={styles.detailsCategory}>
              <span>{issue.category}</span>
            </div>
          </div>

          <div className={styles.detailsContent}>
            <div className={styles.detailsHeader}>
              <div className={styles.detailsHeaderText}>
                <h2>{issue.title}</h2>
                <div className={styles.detailsLocation}>
                  <MapPin />
                  <span>
                    {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>
              <StatusBadge status={issue.status} size="lg" />
            </div>

            <div className={styles.detailsSections}>
              <section className={styles.detailsSection}>
                <h4>Description</h4>
                <p>{issue.description}</p>
              </section>

              <IssueMeTooSection issueId={issue.id} initialReports={issue.reports} />

              <section className={styles.detailsSection}>
                <h4>Activity Log</h4>
                <div className={styles.activityLog}>
                  <ActivityItem
                    icon={<CheckCircle2 style={{ color: '#22c55e' }} />}
                    title="Issue Verified"
                    time="1 hour ago"
                    desc="City inspectors have confirmed the report."
                  />
                  <ActivityItem
                    icon={<Plus style={{ color: '#3b82f6' }} />}
                    title="Report Created"
                    time={issue.timestamp}
                    desc="Issue was added to CityWatch by a resident."
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
