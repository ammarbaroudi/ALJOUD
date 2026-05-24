export type PropertyStatus = 'للبيع' | 'للإيجار' | 'مباع'

export interface PropertyImage {
  id: string
  url: string
  publicId: string
}

export interface Property {
  id: string
  title: string
  description: string | null
  price: number | null
  location: string
  status: PropertyStatus
  isFeatured: boolean
  images: PropertyImage[]
  createdAt: string
  updatedAt: string
}

export interface PropertyFilters {
  status?: PropertyStatus
  featured?: boolean
}

export interface CreatePropertyPayload {
  title: string
  description?: string
  price?: number
  location?: string
  status?: PropertyStatus
  isFeatured?: boolean
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>
