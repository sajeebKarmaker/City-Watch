import type { Issue } from '../types/issue'

export const MOCK_ISSUES: Issue[] = [
  {
    id: 1,
    category: 'Roads',
    title: 'Large Pothole on Main St',
    description:
      "A deep pothole is causing cars to swerve. It's about 2 feet wide.",
    status: 'Pending',
    location: { lat: 23.7842, lng: 90.3928 },
    image: 'https://images.unsplash.com/photo-1709934730506-fba12664d4e4',
    timestamp: '2 hours ago',
    reports: 12,
  },
  {
    id: 2,
    category: 'Lighting',
    title: 'Broken Street Light',
    description:
      'The street light at the corner of 5th and Oak is completely out.',
    status: 'In Progress',
    location: { lat: 23.7714, lng: 90.4071 },
    image: 'https://images.unsplash.com/photo-1687812693663-c322b9af62a5',
    timestamp: '5 hours ago',
    reports: 4,
  },
  {
    id: 3,
    category: 'Sanitation',
    title: 'Overflowing Trash Bins',
    description:
      "Public bins haven't been emptied in a week. Trash is spilling onto the sidewalk.",
    status: 'Resolved',
    location: { lat: 23.7889, lng: 90.4053 },
    image: 'https://images.unsplash.com/photo-1762187547870-83fbeef1afcf',
    timestamp: '1 day ago',
    reports: 8,
  },
  {
    id: 4,
    category: 'Vandalism',
    title: 'Graffiti on Library Wall',
    description: 'New graffiti appeared overnight on the historic brick wall.',
    status: 'Pending',
    location: { lat: 23.7681, lng: 90.3935 },
    image: 'https://images.unsplash.com/photo-1612706175704-43f68784522e',
    timestamp: '3 hours ago',
    reports: 2,
  },
]

export const CATEGORIES = [
  'All',
  'Roads',
  'Lighting',
  'Sanitation',
  'Vandalism',
  'Parks',
  'Other',
] as const
