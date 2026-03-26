import styles from '../../App.module.css'

type CategoryFilterTabsProps = {
  categories: readonly string[]
  active: string
  onSelect: (category: string) => void
}

export function CategoryFilterTabs({
  categories,
  active,
  onSelect,
}: CategoryFilterTabsProps) {
  return (
    <div className={styles.filterTabs}>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`${styles.filterTab} ${active === cat ? styles.active : ''}`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
