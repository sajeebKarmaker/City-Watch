import { LocateFixed, Plus } from 'lucide-react'
import styles from '../../App.module.css'

type MapControlsProps = {
  map: google.maps.Map | null
  onLocate: () => void
}

export function MapControls({ map, onLocate }: MapControlsProps) {
  return (
    <div className={styles.mapControls}>
      <div className={styles.actionButtons}>
        <button
          type="button"
          onClick={onLocate}
          className={styles.mapControlButton}
          title="Locate Me"
        >
          <LocateFixed />
        </button>
      </div>

      <div className={styles.zoomControls}>
        <button
          type="button"
          onClick={() => map?.setZoom((map.getZoom() || 14) + 1)}
        >
          <Plus />
        </button>
        <button
          type="button"
          onClick={() => map?.setZoom((map.getZoom() || 14) - 1)}
        >
          <span>−</span>
        </button>
      </div>
    </div>
  )
}
