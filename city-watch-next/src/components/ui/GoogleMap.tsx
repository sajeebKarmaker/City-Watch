'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadGoogleMaps } from '../loadGoogleMaps'

declare global {
  interface Window {
    google?: any
  }
}

type MapType = 'roadmap' | 'satellite'

function playSnapSound() {
  try {
    const AudioContextCtor =
      window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextCtor) return

    const ctx: AudioContext =
      (playSnapSound as any)._ctx ?? new AudioContextCtor()
    ;(playSnapSound as any)._ctx = ctx

    if (ctx.state === 'suspended') void ctx.resume()

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(1600, now)
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.02)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.035)
  } catch {
    // ignore
  }
}

export function GoogleMap({ apiKey }: { apiKey: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const autocompleteRef = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const [loadError, setLoadError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [mapType, setMapType] = useState<MapType>('roadmap')
  const [searchError, setSearchError] = useState<string | null>(null)

  const center = useMemo(() => ({ lat: 40.7128, lng: -74.006 }), [])

  useEffect(() => {
    let cancelled = false

    loadGoogleMaps(apiKey, { libraries: ['places'] })
      .then(() => {
        if (cancelled) return
        setIsReady(true)
        setSearchError(null)

        if (!containerRef.current) return
        if (mapRef.current) return

        const google = window.google
        if (!google?.maps?.Map) {
          throw new Error('Google Maps did not initialize correctly.')
        }

        mapRef.current = new google.maps.Map(containerRef.current, {
          center,
          zoom: 12,
          mapTypeId: mapType,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          clickableIcons: false,
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setLoadError(err instanceof Error ? err.message : String(err))
      })

    return () => {
      cancelled = true
    }
  }, [apiKey, center, mapType])

  useEffect(() => {
    const google = window.google
    if (!google?.maps || !mapRef.current) return
    mapRef.current.setMapTypeId(mapType)
  }, [mapType])

  useEffect(() => {
    const google = window.google
    if (!isReady) return
    if (!searchInputRef.current) return
    if (autocompleteRef.current) return
    if (!google?.maps?.places?.Autocomplete) return

    const ac = new google.maps.places.Autocomplete(searchInputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
    })

    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      const loc = place?.geometry?.location
      if (!loc || !mapRef.current) return

      mapRef.current.panTo(loc)
      mapRef.current.setZoom(15)
      searchInputRef.current?.blur()
    })

    autocompleteRef.current = ac
  }, [isReady])

  const toggleSatellite = useCallback(() => {
    setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'))
    playSnapSound()
  }, [])

  const geocodeQuery = useCallback(async () => {
    const google = window.google
    const query = searchInputRef.current?.value?.trim()
    if (!google?.maps?.Geocoder || !query || !mapRef.current) return
    setSearchError(null)

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: query }, (results: any, status: string) => {
      if (status !== 'OK' || !results?.[0]) {
        setSearchError(
          status === 'ZERO_RESULTS'
            ? 'No results found.'
            : `Search failed: ${status}`,
        )
        return
      }
      const { geometry } = results[0]
      if (!geometry) return

      if (geometry.viewport) mapRef.current.fitBounds(geometry.viewport)
      else if (geometry.location) {
        mapRef.current.panTo(geometry.location)
        mapRef.current.setZoom(15)
      }
      searchInputRef.current?.blur()
    })
  }, [])

  if (loadError) {
    return (
      <div className="mapFallback" role="alert">
        <div className="mapFallbackTitle">Map failed to load</div>
        <div className="mapFallbackText">{loadError}</div>
      </div>
    )
  }

  return (
    <div className="mapShell" aria-busy={!isReady}>
      <div ref={containerRef} className="mapCanvas" />
      {!isReady && <div className="mapLoading">Loading map…</div>}

      <div className="mapUi" aria-hidden={!isReady}>
        <div className="mapUiLeft">
          <div className="mapSearch">
            <div className="mapSearchField">
              <input
                ref={searchInputRef}
                className="mapSearchInput"
                type="search"
                placeholder="Search a place or address"
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void geocodeQuery()
                }}
              />
              {searchError && (
                <div className="mapSearchError" role="status">
                  {searchError}
                </div>
              )}
            </div>
            <button
              type="button"
              className="mapSearchButton"
              onClick={() => void geocodeQuery()}
            >
              Search
            </button>
          </div>
        </div>

        <div className="mapUiRight">
          <button
            type="button"
            className={`mapChip ${mapType === 'satellite' ? 'isOn' : 'isOff'}`}
            onClick={toggleSatellite}
          >
            Satellite
          </button>
        </div>
      </div>
    </div>
  )
}
