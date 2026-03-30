import { AlertCircle } from 'lucide-react'
import styles from '../../App.module.css'

type MapLoadingStateProps = {
  loadError: unknown
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err ?? '')
}

export function MapLoadingState({ loadError }: MapLoadingStateProps) {
  const message = errorMessage(loadError)

  return (
    <div className={styles.loadingContainer}>
      {loadError ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <AlertCircle />
          </div>
          <h3 className={styles.errorTitle}>Map Loading Error</h3>
          <p className={styles.errorMessage}>
            {message.includes('BillingNotEnabledMapError')
              ? 'The Google Maps API key provided requires billing to be enabled in the Google Cloud Console. Please check your account settings.'
              : message ||
                'There was an issue connecting to Google Maps. Please verify your API key and connection.'}
          </p>
          <a
            href="https://console.cloud.google.com/project/_/billing/enable"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.errorButton}
          >
            Check Billing Settings
          </a>
        </div>
      ) : (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading City Map...</p>
        </div>
      )}
    </div>
  )
}
