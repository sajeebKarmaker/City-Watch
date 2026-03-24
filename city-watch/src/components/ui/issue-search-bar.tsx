import { Search } from 'lucide-react'
import styles from '../../App.module.css'

type IssueSearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function IssueSearchBar({
  value,
  onChange,
  placeholder = 'Search issues...',
}: IssueSearchBarProps) {
  return (
    <div className={styles.searchContainer}>
      <Search />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
