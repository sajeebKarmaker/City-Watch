'use client'

import { useState } from 'react'
import styles from './App.module.css'
import { AppHeader } from './components/ui/app-header'
import { IssuesSidebar } from './components/ui/issues-sidebar'
import { CATEGORIES, MOCK_ISSUES } from './data/mockIssues'
import type { Issue } from './types/issue'

export default function CityWatchApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [_isReporting, setIsReporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

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
          selectedIssue={selectedIssue}
          onSelectIssue={setSelectedIssue}
        />
      </div>
    </div>
  )
}
