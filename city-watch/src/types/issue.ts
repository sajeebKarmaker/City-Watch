export type Issue = {
  id: number
  category: string
  title: string
  description: string
  status: string
  location: { lat: number; lng: number }
  image: string
  timestamp: string
  reports: number
}
