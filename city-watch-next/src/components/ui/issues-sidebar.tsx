'use client'

import { motion } from 'framer-motion'
import type { Issue } from '../../types/issue'
import styles from '../../App.module.css'
import { CategoryFilterTabs } from './category-filter-tabs'
import { IssueSearchBar } from './issue-search-bar'
import { IssuesList } from './issues-list'

type IssuesSidebarProps = {
  open: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  categories: readonly string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  issues: Issue[]
  selectedIssue: Issue | null
  onSelectIssue: (issue: Issue) => void
}

export function IssuesSidebar({
  open,
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  issues,
  selectedIssue,
  onSelectIssue,
}: IssuesSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{
        width: open ? 400 : 0,
        opacity: open ? 1 : 0,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={styles.sidebar}
    >
      <div className={styles.sidebarInner}>
        <div className={styles.sidebarHeader}>
          <IssueSearchBar value={searchQuery} onChange={onSearchChange} />
          <CategoryFilterTabs
            categories={categories}
            active={activeCategory}
            onSelect={onCategoryChange}
          />
        </div>
        <IssuesList
          issues={issues}
          selectedIssue={selectedIssue}
          onSelectIssue={onSelectIssue}
        />
      </div>
    </motion.aside>
  )
}
