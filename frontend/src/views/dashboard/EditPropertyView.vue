<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from '../../stores/properties.store'
import PropertyForm from '../../components/dashboard/PropertyForm.vue'

const route = useRoute()
const router = useRouter()
const store = usePropertiesStore()

const loading = ref(true)
const submitting = ref(false)
const error = ref<string | null>(null)

const property = computed(() => store.currentProperty)

onMounted(async () => {
  try {
    await store.fetchOne(route.params.id as string)
  } catch {
    error.value = 'تعذّر تحميل بيانات العقار'
  } finally {
    loading.value = false
  }
})

async function handleSubmit({ fields, files }: {
  fields: { title: string; description: string; price: string; location: string; status: 'للبيع' | 'للإيجار' | 'مباع'; isFeatured: boolean }
  files: File[]
}) {
  if (!property.value) return
  submitting.value = true
  error.value = null
  try {
    await store.update(property.value.id, {
      title:       fields.title,
      description: fields.description || undefined,
      price:       fields.price ? Number(fields.price) : undefined,
      location:    fields.location || undefined,
      status:      fields.status,
      isFeatured:  fields.isFeatured,
    })

    if (files.length) {
      const formData = new FormData()
      files.forEach((f) => formData.append('images', f))
      await store.addImages(property.value.id, formData)
    }

    router.push('/dashboard')
  } catch {
    error.value = 'حدث خطأ أثناء حفظ التعديلات'
  } finally {
    submitting.value = false
  }
}

async function handleDeleteImage(imageId: string) {
  await store.removeImage(imageId)
}
</script>

<template>
  <div class="dash-page">
    <div class="dash-header">
      <button class="back-btn" @click="router.push('/dashboard')">← العودة</button>
      <h1 class="dash-title">تعديل العقار</h1>
    </div>

    <div class="form-card">
      <!-- Loading -->
      <div v-if="loading" class="center-spinner">
        <span class="spinner" />
      </div>

      <!-- Error loading -->
      <p v-else-if="error && !property" class="error-msg">{{ error }}</p>

      <!-- Form -->
      <template v-else-if="property">
        <p v-if="error" class="error-msg">{{ error }}</p>
        <PropertyForm
          :initial="property"
          :existing-images="property.images"
          :submitting="submitting"
          @submit="handleSubmit"
          @delete-image="handleDeleteImage"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.dash-page {
  padding: 2rem 1.5rem;
  max-width: 760px;
  margin: 0 auto;
  font-family: 'Cairo', sans-serif;
}
.dash-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.back-btn {
  background: none;
  border: 1.5px solid #c9b99a;
  border-radius: 8px;
  padding: 0.35rem 0.85rem;
  font-family: 'Cairo', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6B3A2A;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.back-btn:hover { background: #F5EDD8; }
.dash-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #3D1C0E;
  margin: 0;
}
.form-card {
  background: #FAF6EE;
  border: 1.5px solid #c9b99a;
  border-radius: 12px;
  padding: 2rem;
}
.center-spinner {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e0d5be;
  border-top-color: #3D1C0E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error-msg {
  font-size: 0.88rem;
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
}
</style>
