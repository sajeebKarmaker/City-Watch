import { useMemo } from 'react'
import './App.css'
import { GoogleMap } from './components/GoogleMap'

function App() {
  const apiKey = useMemo(
    () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    [],
  )

  return <GoogleMap apiKey={apiKey} />
}

export default App
