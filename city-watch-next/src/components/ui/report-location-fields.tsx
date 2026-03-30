import styles from '../../App.module.css'
import { ReportFormGroup } from './report-form-group'

type ReportLocationFieldsProps = {
  lat: number
  lng: number
  onLocationChange: (next: { lat: number; lng: number }) => void
}

export function ReportLocationFields({
  lat,
  lng,
  onLocationChange,
}: ReportLocationFieldsProps) {
  return (
    <div className={styles.reportLocationBox}>
      <p className={styles.reportLocationHint}>
        Issue location (latitude & longitude). Adjust if needed.
      </p>
      <div className={styles.reportLocationGrid}>
        <ReportFormGroup label="Latitude" htmlFor="report-lat">
          <input
            id="report-lat"
            name="latitude"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              if (!Number.isNaN(v)) onLocationChange({ lat: v, lng })
            }}
          />
        </ReportFormGroup>
        <ReportFormGroup label="Longitude" htmlFor="report-lng">
          <input
            id="report-lng"
            name="longitude"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              if (!Number.isNaN(v)) onLocationChange({ lat, lng: v })
            }}
          />
        </ReportFormGroup>
      </div>
    </div>
  )
}
