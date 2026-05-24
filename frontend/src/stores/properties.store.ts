import { ref } from 'vue'
import { defineStore } from 'pinia'
import { propertiesApi } from '../api/properties.api'
import type {
  Property,
  PropertyFilters,
  CreatePropertyPayload,
  UpdatePropertyPayload,
} from '../types/property'

export const usePropertiesStore = defineStore('properties', () => {
  const properties = ref<Property[]>([])
  const currentProperty = ref<Property | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(filters?: PropertyFilters) {
    loading.value = true
    error.value = null
    try {
      properties.value = await propertiesApi.getAll(filters)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string) {
    loading.value = true
    error.value = null
    try {
      currentProperty.value = await propertiesApi.getOne(id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(data: CreatePropertyPayload) {
    loading.value = true
    error.value = null
    try {
      const created = await propertiesApi.create(data)
      properties.value.unshift(created)
      return created
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: UpdatePropertyPayload) {
    loading.value = true
    error.value = null
    try {
      const updated = await propertiesApi.update(id, data)
      const idx = properties.value.findIndex((p) => p.id === id)
      if (idx !== -1) properties.value[idx] = updated
      if (currentProperty.value?.id === id) currentProperty.value = updated
      return updated
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    loading.value = true
    error.value = null
    try {
      await propertiesApi.remove(id)
      properties.value = properties.value.filter((p) => p.id !== id)
      if (currentProperty.value?.id === id) currentProperty.value = null
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function addImages(id: string, formData: FormData) {
    loading.value = true
    error.value = null
    try {
      const newImages = await propertiesApi.addImages(id, formData)
      const target = properties.value.find((p) => p.id === id) ?? currentProperty.value
      if (target) target.images.push(...newImages)
      return newImages
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function removeImage(imageId: string) {
    loading.value = true
    error.value = null
    try {
      await propertiesApi.removeImage(imageId)
      const strip = (p: Property | null) => {
        if (p) p.images = p.images.filter((img) => img.id !== imageId)
      }
      properties.value.forEach(strip)
      strip(currentProperty.value)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    properties,
    currentProperty,
    loading,
    error,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    addImages,
    removeImage,
  }
})
