'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './App.module.css'
import { AppHeader } from './components/ui/app-header'
import { IssuesMapView } from './components/ui/issues-map-view'
import { IssuesSidebar } from './components/ui/issues-sidebar'
import { ReportIssueModal } from './components/ui/report-issue-modal'
import { fetchCategories, fetchIssues, type CategoryDto } from './lib/api/issues'
import type { Issue } from './types/issue'

export default function CityWatchApp() {
  const router = useRouter()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [pinnedLocation, setPinnedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [issuesLoading, setIssuesLoading] = useState(true)
  const [issuesError, setIssuesError] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setCategoriesError(null)
        const cats = await fetchCategories()
        if (!cancelled) setCategories(cats)
      } catch (e) {
        if (!cancelled) {
          setCategoriesError(
            e instanceof Error ? e.message : 'Could not load categories',
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const reloadIssues = useCallback(async () => {
    setIssuesLoading(true)
    setIssuesError(null)
    try {
      const list = await fetchIssues({
        category: filter,
        search: debouncedSearch,
      })
      setIssues(list)
    } catch (e) {
      setIssuesError(e instanceof Error ? e.message : 'Could not load issues')
    } finally {
      setIssuesLoading(false)
    }
  }, [filter, debouncedSearch])

  useEffect(() => {
    void reloadIssues()
  }, [reloadIssues])

  const categoryLabels = useMemo(
    () => ['All', ...categories.map((c) => c.name)],
    [categories],
  )

  const handleIssueNavigate = (issueId: number) => {
    router.push(`/issues/${issueId}`)
  }

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

      {(categoriesError || issuesError) && (
        <div
          role="alert"
          style={{
            margin: '0 1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(220, 38, 38, 0.12)',
            borderRadius: 8,
            fontSize: '0.9rem',
          }}
        >
          {categoriesError && <p>{categoriesError}</p>}
          {issuesError && (
            <p>
              {issuesError}{' '}
              <button type="button" onClick={() => void reloadIssues()}>
                Retry
              </button>
            </p>
          )}
        </div>
      )}

      <div className={styles.mainContent}>
        <IssuesSidebar
          open={isSidebarOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categoryLabels}
          activeCategory={filter}
          onCategoryChange={setFilter}
          issues={issues}
          listLoading={issuesLoading}
        />

        <IssuesMapView
          issues={issues}
          pinnedLocation={pinnedLocation}
          onPinLocationSet={(lat, lng) => setPinnedLocation({ lat, lng })}
          onIssueNavigate={handleIssueNavigate}
        />

        <ReportIssueModal
          open={isReporting}
          onClose={() => setIsReporting(false)}
          categories={categories}
          categoriesError={categoriesError}
          location={pinnedLocation}
          onLocationChange={setPinnedLocation}
          onReported={async () => {
            await reloadIssues()
          }}
        />
      </div>
    </div>
  )
}
