import { useJsApiLoader } from '@react-google-maps/api'

export function useGoogleMapsReady() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'citywatch-google-map',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  })

  return {
    isReady: isLoaded,
    loadError: loadError ?? null,
  }
}
