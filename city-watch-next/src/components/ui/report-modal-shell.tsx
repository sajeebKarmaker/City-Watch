import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import styles from '../../App.module.css'

type ReportModalShellProps = {
  open: boolean
  onBackdropClick: () => void
  children: ReactNode
}

export function ReportModalShell({
  open,
  onBackdropClick,
  children,
}: ReportModalShellProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className={styles.modalOverlay}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onBackdropClick}
            className={styles.modalBackdrop}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={styles.modalContent}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
