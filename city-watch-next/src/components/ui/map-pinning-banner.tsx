import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, X } from 'lucide-react'
import styles from '../../App.module.css'

type MapPinningBannerProps = {
  visible: boolean
  onDismiss: () => void
}

export function MapPinningBanner({ visible, onDismiss }: MapPinningBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className={styles.pinningBanner}
        >
          <div className={styles.pinningBannerContent}>
            <MapPin />
            <span>Click on the map to pin an issue</span>
            <button type="button" onClick={onDismiss}>
              <X />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
