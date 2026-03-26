import { MapPin, Menu, Plus } from 'lucide-react'
import styles from '../../App.module.css'

type AppHeaderProps = {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  onReportClick: () => void
}

export function AppHeader({
  isSidebarOpen,
  onToggleSidebar,
  onReportClick,
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className={styles.menuButton}
          title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          <Menu />
        </button>

        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <MapPin />
          </div>
          <h1 className={styles.logoText}>CityWatch</h1>
        </div>
      </div>

      <div className={styles.headerRight}>
        <button
          type="button"
          onClick={onReportClick}
          className={styles.reportButton}
        >
          <Plus />
          <span>Report Issue</span>
        </button>
      </div>
    </header>
  )
}
