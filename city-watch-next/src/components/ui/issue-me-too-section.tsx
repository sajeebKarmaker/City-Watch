'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import styles from '@/src/App.module.css'
import { postMeToo } from '@/src/lib/api/issues'

type IssueMeTooSectionProps = {
  issueId: number
  initialReports: number
}

export function IssueMeTooSection({
  issueId,
  initialReports,
}: IssueMeTooSectionProps) {
  const [reports, setReports] = useState(initialReports)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMeToo = async () => {
    setError(null)
    setBusy(true)
    try {
      const updated = await postMeToo(issueId)
      setReports(updated.reports)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={styles.communitySection}>
      <div className={styles.communitySectionHeader}>
        <h4>Community Support</h4>
        <span>{reports} Reports</span>
      </div>
      <p className={styles.communityDescription}>
        More reports help prioritize this issue for city maintenance.
      </p>
      <button
        type="button"
        className={styles.meTooButton}
        onClick={() => void handleMeToo()}
        disabled={busy}
      >
        <AlertCircle />
        {busy ? 'Sending…' : 'Me Too'}
      </button>
      {error && (
        <p style={{ color: '#b91c1c', fontSize: '0.85rem', marginTop: 8 }}>{error}</p>
      )}
    </section>
  )
}
