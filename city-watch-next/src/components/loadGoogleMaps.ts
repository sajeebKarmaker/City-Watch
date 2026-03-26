let googleMapsScriptPromise: Promise<void> | null = null
const googleMapsLoadedLibraries = new Set<string>()

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const anyExisting = document.querySelector<HTMLScriptElement>(
      'script[src^="https://maps.googleapis.com/maps/api/js"]',
    )
    if (anyExisting) {
      const alreadyLoaded =
        anyExisting.dataset.loaded === 'true' || Boolean((window as unknown as { google?: { maps?: unknown } }).google?.maps)
      if (alreadyLoaded) resolve()
      else anyExisting.addEventListener('load', () => resolve(), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolve()
      },
      { once: true },
    )
    script.addEventListener('error', () => reject(new Error('Failed to load script')), {
      once: true,
    })
    document.head.appendChild(script)
  })
}

export function loadGoogleMaps(
  apiKey: string,
  options?: { libraries?: string[] },
) {
  if (!apiKey) {
    return Promise.reject(
      new Error(
        'Missing Google Maps API key. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in a .env file.',
      ),
    )
  }

  const requestedLibs = (options?.libraries ?? [])
    .filter(Boolean)
    .map((l) => l.trim())
    .filter(Boolean)

  const w = window as unknown as { google?: { maps?: { places?: unknown } } }
  if (w.google?.maps) {
    const missing = requestedLibs.filter((l) => !googleMapsLoadedLibraries.has(l))
    if (missing.includes('places') && !w.google.maps.places) {
      return Promise.reject(
        new Error(
          'Google Maps loaded without the Places library. Do a hard refresh (Ctrl+Shift+R) to reload with Places enabled.',
        ),
      )
    }
    missing.forEach((l) => googleMapsLoadedLibraries.add(l))
    return Promise.resolve()
  }

  if (googleMapsScriptPromise) return googleMapsScriptPromise

  const params = new URLSearchParams({
    key: apiKey,
    v: 'weekly',
  })

  const libs = Array.from(new Set(requestedLibs)).sort()
  if (libs.length > 0) params.set('libraries', libs.join(','))

  googleMapsScriptPromise = loadScript(
    `https://maps.googleapis.com/maps/api/js?${params.toString()}`,
  )
    .then(() => {
      libs.forEach((l) => googleMapsLoadedLibraries.add(l))
    })
  return googleMapsScriptPromise
}
