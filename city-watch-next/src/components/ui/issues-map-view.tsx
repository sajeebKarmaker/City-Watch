'use client'

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { AlertCircle, LocateFixed, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Issue } from '../../types/issue'
import styles from '../../App.module.css'
import { MapIssueMarkers } from './map-issue-markers'

const MAP_CENTER = { lat: 40.7831, lng: -73.9712 }

const MAP_STYLES = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#7c93a3' }, { lightness: '-10' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry',
    stylers: [{ visibility: 'on' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{ color: '#f2f2f2' }],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [{ saturation: -100 }, { lightness: 45 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [{ visibility: 'simplified' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [{ color: '#c8d7d4' }, { visibility: 'on' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b1c8e1' }],
  },
]

function mapLoadErrorText(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err ?? '')
}

type IssuesMapViewProps = {
  issues: Issue[]
  pinnedLocation: { lat: number; lng: number } | null
  onPinLocationSet: (lat: number, lng: number) => void
  onIssueNavigate: (issueId: number) => void
}

export function IssuesMapView({
  issues,
  pinnedLocation,
  onPinLocationSet,
  onIssueNavigate,
}: IssuesMapViewProps) {
  const { isLoaded: isReady, loadError } = useJsApiLoader({
    id: 'citywatch-google-map',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [zoom, setZoom] = useState(14)
  const onPinRef = useRef(onPinLocationSet)
  onPinRef.current = onPinLocationSet

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }, [])

  const onMapUnmount = useCallback(() => setMap(null), [])

  useEffect(() => {
    if (!map) return
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onPinRef.current(e.latLng.lat(), e.latLng.lng())
    })
    return () => listener.remove()
  }, [map])

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Error: Your browser doesn't support geolocation.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map?.panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        map?.setZoom(16)
      },
      () => alert('Error: The Geolocation service failed.'),
    )
  }

  const errMsg = loadError ? mapLoadErrorText(loadError) : ''

  return (
    <main className={styles.mapContainer}>
      {isReady ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={MAP_CENTER}
          zoom={zoom}
          onLoad={(instance) => {
            onMapLoad(instance)
            setZoom(instance.getZoom() || 14)
          }}
          onUnmount={onMapUnmount}
          onZoomChanged={() => map && setZoom(map.getZoom() || 14)}
          options={{
            styles: MAP_STYLES,
            disableDefaultUI: true,
            zoomControl: false,
            clickableIcons: false,
          }}
        >
          <MapIssueMarkers
            issues={issues}
            zoom={zoom}
            onIssueNavigate={onIssueNavigate}
          />
          {pinnedLocation && (
            <Marker
              position={pinnedLocation}
              zIndex={9999}
              options={{ clickable: false }}
            />
          )}
        </GoogleMap>
      ) : (
        <div className={styles.loadingContainer}>
          {loadError ? (
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>
                <AlertCircle />
              </div>
              <h3 className={styles.errorTitle}>Map Loading Error</h3>
              <p className={styles.errorMessage}>
                {errMsg.includes('BillingNotEnabledMapError')
                  ? 'The Google Maps API key provided requires billing to be enabled in the Google Cloud Console. Please check your account settings.'
                  : errMsg ||
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
      )}

      <div className={styles.mapControls}>
        <div className={styles.actionButtons}>
          <button
            type="button"
            onClick={handleLocate}
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

      <div className={styles.liveIndicator}>
        <div className={styles.liveIndicatorContent}>
          <div>
            <div className={styles.liveDot} />
            <span className={styles.liveText}>LIVE UPDATES</span>
          </div>
        </div>
      </div>
    </main>
  )
}
