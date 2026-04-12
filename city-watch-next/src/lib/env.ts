/**
 * Spring Boot API base URL (no trailing slash).
 * Set `NEXT_PUBLIC_API_URL` in `.env.local` if not using the default.
 */
export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
  return base.replace(/\/$/, '')
}
