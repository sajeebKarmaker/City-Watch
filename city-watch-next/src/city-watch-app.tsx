'use client'

import { useState } from 'react'
import styles from './App.module.css'
import { AppHeader } from './components/ui/app-header'
import { IssuesSidebar } from './components/ui/issues-sidebar'
import { ReportIssueModal } from './components/ui/report-issue-modal'
import { CATEGORIES, MOCK_ISSUES } from './data/mockIssues'

export default function CityWatchApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredIssues = MOCK_ISSUES.filter((issue) => {
    const matchesFilter = filter === 'All' || issue.category === filter
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className={styles.container}>
      <AppHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        onReportClick={() => setIsReporting(true)}
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

        <ReportIssueModal
          open={isReporting}
          onClose={() => setIsReporting(false)}
          categories={CATEGORIES}
        />
      </div>
    </div>
  )
}
