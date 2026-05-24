import axios from './axios'
import { mockProperties } from './mock-properties'
import type {
  Property,
  PropertyFilters,
  CreatePropertyPayload,
  UpdatePropertyPayload,
  PropertyImage,
} from '../types/property'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ── Mock helpers ──────────────────────────────────────────────────────────────

let _mockStore: Property[] = structuredClone(mockProperties)

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function applyFilters(list: Property[], filters?: PropertyFilters): Property[] {
  return list.filter((p) => {
    if (filters?.status !== undefined && p.status !== filters.status) return false
    if (filters?.featured !== undefined && p.isFeatured !== filters.featured) return false
    return true
  })
}

const mockApi = {
  getAll(filters?: PropertyFilters): Promise<Property[]> {
    const result = applyFilters(_mockStore, filters)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return delay([...result])
  },

  getOne(id: string): Promise<Property> {
    const found = _mockStore.find((p) => p.id === id)
    if (!found) return Promise.reject(new Error('Not found'))
    return delay({ ...found })
  },

  create(payload: CreatePropertyPayload): Promise<Property> {
    const newProp: Property = {
      id: String(Date.now()),
      title: payload.title,
      description: payload.description ?? null,
      price: payload.price ?? null,
      location: payload.location ?? 'الخالدية - حمص',
      status: payload.status ?? 'للبيع',
      isFeatured: payload.isFeatured ?? false,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    _mockStore.unshift(newProp)
    return delay({ ...newProp })
  },

  update(id: string, payload: UpdatePropertyPayload): Promise<Property> {
    const i = _mockStore.findIndex((p) => p.id === id)
    if (i === -1) return Promise.reject(new Error('Not found'))
    _mockStore[i] = { ..._mockStore[i], ...payload, updatedAt: new Date().toISOString() }
    return delay({ ..._mockStore[i] })
  },

  remove(id: string): Promise<void> {
    _mockStore = _mockStore.filter((p) => p.id !== id)
    return delay(undefined)
  },

  addImages(id: string, formData: FormData): Promise<PropertyImage[]> {
    const prop = _mockStore.find((p) => p.id === id)
    if (!prop) return Promise.reject(new Error('Not found'))
    const files = formData.getAll('images') as File[]
    const newImages: PropertyImage[] = files.map((_, i) => ({
      id: `img-${Date.now()}-${i}`,
      url: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80`,
      publicId: `mock/new-${Date.now()}-${i}`,
    }))
    prop.images.push(...newImages)
    return delay([...newImages])
  },

  removeImage(imageId: string): Promise<void> {
    _mockStore.forEach((p) => {
      p.images = p.images.filter((img) => img.id !== imageId)
    })
    return delay(undefined)
  },
}

// ── Real API ──────────────────────────────────────────────────────────────────

const realApi = {
  getAll(filters?: PropertyFilters): Promise<Property[]> {
    const params: Record<string, string> = {}
    if (filters?.status !== undefined) params.status = filters.status
    if (filters?.featured !== undefined) params.featured = String(filters.featured)
    return axios.get<Property[]>('/properties', { params }).then((r) => r.data)
  },

  getOne(id: string): Promise<Property> {
    return axios.get<Property>(`/properties/${id}`).then((r) => r.data)
  },

  create(payload: CreatePropertyPayload): Promise<Property> {
    return axios.post<Property>('/properties', payload).then((r) => r.data)
  },

  update(id: string, payload: UpdatePropertyPayload): Promise<Property> {
    return axios.patch<Property>(`/properties/${id}`, payload).then((r) => r.data)
  },

  remove(id: string): Promise<void> {
    return axios.delete(`/properties/${id}`).then(() => undefined)
  },

  addImages(id: string, formData: FormData): Promise<PropertyImage[]> {
    return axios
      .post<PropertyImage[]>(`/properties/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  removeImage(imageId: string): Promise<void> {
    return axios.delete(`/properties/images/${imageId}`).then(() => undefined)
  },
}

export const propertiesApi = USE_MOCK ? mockApi : realApi
