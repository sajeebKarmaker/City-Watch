import styles from '../../App.module.css'

export function MapLiveIndicator() {
  return (
    <div className={styles.liveIndicator}>
      <div className={styles.liveIndicatorContent}>
        <div>
          <div className={styles.liveDot} />
          <span className={styles.liveText}>LIVE UPDATES</span>
        </div>
      </div>
    </div>
  )
}
