import { getApiBaseUrl } from '../env'
import { formatRelativeTime } from '../format-relative-time'
import type { Issue } from '../../types/issue'

export type CategoryDto = {
  id: number
  name: string
}

type IssueResponseJson = {
  id: number
  category: string
  title: string
  description: string
  status: string
  location: { lat: number; lng: number }
  image: string | null
  timestamp: string
  reports: number
}

function normalizeIssue(raw: IssueResponseJson): Issue {
  return {
    id: raw.id,
    category: raw.category,
    title: raw.title,
    description: raw.description ?? '',
    status: raw.status,
    location: raw.location,
    image: raw.image ?? '',
    timestamp: formatRelativeTime(raw.timestamp),
    reports: raw.reports,
  }
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  const res = await fetch(`${getApiBaseUrl()}/api/categories`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to load categories (${res.status})`)
  }
  return res.json()
}

export async function fetchIssues(params: {
  category?: string
  search?: string
}): Promise<Issue[]> {
  const u = new URL(`${getApiBaseUrl()}/api/issues`)
  if (params.category && params.category !== 'All') {
    u.searchParams.set('category', params.category)
  }
  if (params.search?.trim()) {
    u.searchParams.set('search', params.search.trim())
  }
  const res = await fetch(u.toString(), { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to load issues (${res.status})`)
  }
  const data: IssueResponseJson[] = await res.json()
  return data.map(normalizeIssue)
}

export async function fetchIssueById(id: number): Promise<Issue | null> {
  const res = await fetch(`${getApiBaseUrl()}/api/issues/${id}`, {
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`Failed to load issue (${res.status})`)
  }
  const raw: IssueResponseJson = await res.json()
  return normalizeIssue(raw)
}

export type CreateIssuePayload = {
  categoryId: number
  title: string
  description: string
  status?: string
  latitude: number
  longitude: number
  locationDetails: string | null
  image: string | null
}

export async function createIssue(payload: CreateIssuePayload): Promise<Issue> {
  const res = await fetch(`${getApiBaseUrl()}/api/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      categoryId: payload.categoryId,
      title: payload.title,
      description: payload.description ?? '',
      status: payload.status ?? 'Pending',
      latitude: payload.latitude,
      longitude: payload.longitude,
      locationDetails: payload.locationDetails,
      image: payload.image,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Create failed (${res.status})`)
  }
  const raw: IssueResponseJson = await res.json()
  return normalizeIssue(raw)
}

export async function postMeToo(issueId: number): Promise<Issue> {
  const res = await fetch(`${getApiBaseUrl()}/api/issues/${issueId}/me-too`, {
    method: 'POST',
  })
  if (res.status === 404) {
    throw new Error('Issue not found')
  }
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  const raw: IssueResponseJson = await res.json()
  return normalizeIssue(raw)
}
