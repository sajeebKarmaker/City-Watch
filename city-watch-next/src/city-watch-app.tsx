'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './App.module.css'
import { AppHeader } from './components/ui/app-header'
import { IssuesMapView } from './components/ui/issues-map-view'
import { IssuesSidebar } from './components/ui/issues-sidebar'
import { ReportIssueModal } from './components/ui/report-issue-modal'
import { CATEGORIES, MOCK_ISSUES } from './data/mockIssues'

export default function CityWatchApp() {
  const router = useRouter()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [pinnedLocation, setPinnedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const handleIssueNavigate = (issueId: number) => {
    router.push(`/issues/${issueId}`)
  }

  const filteredIssues = MOCK_ISSUES.filter((issue) => {
    const matchesFilter = filter === 'All' || issue.category === filter
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const canReport = pinnedLocation !== null

  return (
    <div className={styles.container}>
      <AppHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        onReportClick={() => {
          if (pinnedLocation) setIsReporting(true)
        }}
        reportDisabled={!canReport}
      />

      <div className={styles.mainContent}>
        <IssuesSidebar
          open={isSidebarOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={CATEGORIES}
          activeCategory={filter}
          onCategoryChange={setFilter}
          issues={filteredIssues}
        />

        <IssuesMapView
          issues={filteredIssues}
          pinnedLocation={pinnedLocation}
          onPinLocationSet={(lat, lng) => setPinnedLocation({ lat, lng })}
          onIssueNavigate={handleIssueNavigate}
        />

        <ReportIssueModal
          open={isReporting}
          onClose={() => setIsReporting(false)}
          categories={CATEGORIES}
          location={pinnedLocation}
          onLocationChange={setPinnedLocation}
        />
      </div>
    </div>
  )
}
