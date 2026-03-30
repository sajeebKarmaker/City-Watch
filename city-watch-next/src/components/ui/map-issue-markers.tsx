import { motion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { OverlayView } from '@react-google-maps/api'
import { AlertCircle } from 'lucide-react'
import type { Issue } from '../../types/issue'
import styles from '../../App.module.css'
import { ImageWithFallback } from './ImageWithFallBack'
import { StatusBadge } from './status-badge'

type MapIssueMarkersProps = {
  issues: Issue[]
  zoom: number
  onIssueNavigate: (issueId: number) => void
}

export function MapIssueMarkers({
  issues,
  zoom,
  onIssueNavigate,
}: MapIssueMarkersProps) {
  return (
    <>
      {issues.map((issue) => {
        const isFarZoom = zoom < 14
        const markerScale = Math.max(0.4, Math.min(1.2, zoom / 14))

        return (
          <OverlayView
            key={issue.id}
            position={issue.location}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              className={styles.markerOverlay}
              style={{
                transform: `translate(-50%, -50%) scale(${markerScale})`,
              }}
            >
              <motion.div
                whileHover="hover"
                initial="initial"
                className={styles.markerContainer}
                onClick={(e: MouseEvent) => {
                  e.stopPropagation()
                  onIssueNavigate(issue.id)
                }}
              >
                <motion.div
                  variants={{
                    initial: {
                      width: isFarZoom ? 16 : 44,
                      height: isFarZoom ? 16 : 44,
                      borderRadius: '999px',
                      padding: '0px',
                      borderWidth: isFarZoom ? '2px' : '2px',
                    },
                    hover: {
                      width: 280,
                      height: 'auto',
                      borderRadius: '24px',
                      padding: '12px',
                      scale: 1 / markerScale,
                    },
                  }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  style={{ transformOrigin: 'center center' }}
                  className={`${styles.markerCircle} ${isFarZoom ? styles.farZoom : ''}`}
                >
                  <motion.div
                    variants={{
                      initial: { opacity: 1 },
                      hover: { opacity: 0, pointerEvents: 'none' },
                    }}
                    className={styles.markerMini}
                  >
                    {isFarZoom ? (
                      <div
                        className={`${styles.markerDot} ${issue.status === 'Resolved' ? styles.resolved : ''}`}
                      />
                    ) : (
                      <>
                        <div className={styles.markerThumbnail}>
                          <ImageWithFallback src={issue.image} alt={issue.title} />
                        </div>
                        <div
                          className={`${styles.markerStatusDot} ${issue.status === 'Resolved' ? styles.resolved : ''}`}
                        />
                      </>
                    )}
                  </motion.div>

                  <motion.div
                    variants={{
                      initial: { opacity: 0, scale: 0.9 },
                      hover: { opacity: 1, scale: 1 },
                    }}
                    className={styles.markerExpanded}
                  >
                    <div className={styles.markerExpandedContent}>
                      <div className={styles.markerExpandedImage}>
                        <ImageWithFallback src={issue.image} alt={issue.title} />
                      </div>
                      <div className={styles.markerExpandedDetails}>
                        <div className={styles.markerExpandedHeader}>
                          <span className={styles.markerExpandedCategory}>
                            {issue.category}
                          </span>
                        </div>
                        <h4 className={styles.markerExpandedTitle}>{issue.title}</h4>
                      </div>
                    </div>

                    <div className={styles.markerExpandedFooter}>
                      <StatusBadge status={issue.status} />
                      <div className={styles.markerReports}>
                        <AlertCircle />
                        {issue.reports} reports
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.markerViewButton}
                      onClick={(e) => {
                        e.stopPropagation()
                        onIssueNavigate(issue.id)
                      }}
                    >
                      View Full Details
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </OverlayView>
        )
      })}
    </>
  )
}
