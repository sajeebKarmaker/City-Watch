'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import type { Issue } from '../../types/issue'
import styles from '../../App.module.css'
import { MAP_CENTER, MAP_STYLES } from './map-constants'
import { MapControls } from './map-controls'
import { MapIssueMarkers } from './map-issue-markers'
import { MapLiveIndicator } from './map-live-indicator'
import { MapLoadingState } from './map-loading-state'
import { useGoogleMapsReady } from './use-google-maps-ready'

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
  const { isReady, loadError } = useGoogleMapsReady()
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [zoom, setZoom] = useState(14)

  const onPinRef = useRef(onPinLocationSet)
  onPinRef.current = onPinLocationSet

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }, [])

  const onMapUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (!map) return

    const listener = map.addListener(
      'click',
      (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          onPinRef.current(e.latLng.lat(), e.latLng.lng())
        }
      },
    )

    return () => {
      listener.remove()
    }
  }, [map])

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map?.panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          map?.setZoom(16)
        },
        () => {
          alert('Error: The Geolocation service failed.')
        },
      )
    } else {
      alert("Error: Your browser doesn't support geolocation.")
    }
  }

  return (
    <main className={styles.mapContainer}>
      {isReady ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={MAP_CENTER}
          zoom={zoom}
          onLoad={(mapInstance) => {
            onMapLoad(mapInstance)
            setZoom(mapInstance.getZoom() || 14)
          }}
          onUnmount={onMapUnmount}
          onZoomChanged={() => {
            if (map) {
              setZoom(map.getZoom() || 14)
            }
          }}
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
        <MapLoadingState loadError={loadError} />
      )}

      <MapControls map={map} onLocate={handleLocate} />
      <MapLiveIndicator />
    </main>
  )
}
