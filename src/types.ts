export type DemoStatus = 'live' | 'maintenance' | 'coming-soon'

export interface Demo {
  id: string
  name: string
  tagline: string
  description: string
  previewImage: string
  techStack: string[]
  demoUrl: string
  status: DemoStatus
  featured?: boolean
  order: number
}

export interface DemosData {
  demos: Demo[]
  metadata: {
    lastUpdated: string
    version: string
  }
}
