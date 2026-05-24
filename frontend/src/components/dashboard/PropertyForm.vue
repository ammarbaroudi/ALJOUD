<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Property, PropertyImage } from '../../types/property'

const props = defineProps<{
  initial?: Partial<Property>
  existingImages?: PropertyImage[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { fields: FormFields; files: File[] }]
  deleteImage: [imageId: string]
}>()

interface FormFields {
  title: string
  description: string
  price: string
  location: string
  status: 'للبيع' | 'للإيجار' | 'مباع'
  isFeatured: boolean
}

const fields = reactive<FormFields>({
  title:       props.initial?.title       ?? '',
  description: props.initial?.description ?? '',
  price:       props.initial?.price != null ? String(props.initial.price) : '',
  location:    props.initial?.location    ?? 'الخالدية - حمص',
  status:      props.initial?.status      ?? 'للبيع',
  isFeatured:  props.initial?.isFeatured  ?? false,
})

watch(() => props.initial, (val) => {
  if (!val) return
  fields.title       = val.title       ?? ''
  fields.description = val.description ?? ''
  fields.price       = val.price != null ? String(val.price) : ''
  fields.location    = val.location    ?? 'الخالدية - حمص'
  fields.status      = val.status      ?? 'للبيع'
  fields.isFeatured  = val.isFeatured  ?? false
}, { deep: true })

/* ── File handling ── */
const pendingFiles = ref<File[]>([])
const pendingPreviews = ref<string[]>([])
const dropActive = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function addFiles(fileList: FileList | null) {
  if (!fileList) return
  Array.from(fileList).forEach((file) => {
    if (!file.type.startsWith('image/')) return
    pendingFiles.value.push(file)
    const reader = new FileReader()
    reader.onload = (e) => pendingPreviews.value.push(e.target?.result as string)
    reader.readAsDataURL(file)
  })
}

function removePreview(i: number) {
  pendingFiles.value.splice(i, 1)
  pendingPreviews.value.splice(i, 1)
}

function onDrop(e: DragEvent) {
  dropActive.value = false
  addFiles(e.dataTransfer?.files ?? null)
}

function onSubmit() {
  emit('submit', { fields: { ...fields }, files: [...pendingFiles.value] })
}
</script>

<template>
  <form class="pform" @submit.prevent="onSubmit">

    <!-- Title -->
    <div class="field">
      <label class="label">العنوان <span class="req">*</span></label>
      <input v-model="fields.title" type="text" class="input" required placeholder="عنوان العقار" />
    </div>

    <!-- Description -->
    <div class="field">
      <label class="label">الوصف</label>
      <textarea v-model="fields.description" class="input textarea" rows="4" placeholder="وصف مختصر للعقار" />
    </div>

    <!-- Price + Location row -->
    <div class="two-col">
      <div class="field">
        <label class="label">السعر</label>
        <input v-model="fields.price" type="number" min="0" step="any" class="input" placeholder="اختياري" />
      </div>
      <div class="field">
        <label class="label">الموقع</label>
        <input v-model="fields.location" type="text" class="input" placeholder="الخالدية - حمص" />
      </div>
    </div>

    <!-- Status + Featured row -->
    <div class="two-col">
      <div class="field">
        <label class="label">الحالة</label>
        <select v-model="fields.status" class="input select">
          <option value="للبيع">للبيع</option>
          <option value="للإيجار">للإيجار</option>
          <option value="مباع">مباع</option>
        </select>
      </div>
      <div class="field field--check">
        <label class="check-label">
          <input v-model="fields.isFeatured" type="checkbox" class="checkbox" />
          <span>عقار مميز</span>
        </label>
      </div>
    </div>

    <!-- Existing images (edit mode) -->
    <div v-if="existingImages?.length" class="field">
      <label class="label">الصور الحالية</label>
      <div class="existing-grid">
        <div v-for="img in existingImages" :key="img.id" class="existing-img-wrap">
          <img :src="img.url" :alt="img.publicId" class="existing-img" />
          <button
            type="button"
            class="del-img-btn"
            title="حذف الصورة"
            @click="emit('deleteImage', img.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- New image upload -->
    <div class="field">
      <label class="label">إضافة صور</label>
      <div
        class="dropzone"
        :class="{ 'dropzone--active': dropActive }"
        @dragover.prevent="dropActive = true"
        @dragleave="dropActive = false"
        @drop.prevent="onDrop"
        @click="fileInput?.click()"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          hidden
          @change="addFiles(($event.target as HTMLInputElement).files)"
        />
        <span class="dropzone-text">
          اسحب الصور هنا أو <u>انقر للاختيار</u>
        </span>
      </div>

      <!-- Previews -->
      <div v-if="pendingPreviews.length" class="preview-grid">
        <div v-for="(src, i) in pendingPreviews" :key="i" class="preview-wrap">
          <img :src="src" alt="preview" class="preview-img" />
          <button type="button" class="del-img-btn" @click="removePreview(i)">✕</button>
        </div>
      </div>
    </div>

    <button type="submit" class="submit-btn" :disabled="submitting">
      <span v-if="submitting" class="spinner" />
      <span v-else>{{ initial?.id ? 'حفظ التعديلات' : 'إضافة العقار' }}</span>
    </button>

  </form>
</template>

<style scoped>
.pform {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: 'Cairo', sans-serif;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.field--check {
  justify-content: flex-end;
  padding-bottom: 0.1rem;
}

.label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #3D1C0E;
}
.req { color: #b91c1c; }

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 560px) { .two-col { grid-template-columns: 1fr; } }

.input {
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #c9b99a;
  border-radius: 8px;
  background: #fff;
  color: #3D1C0E;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.input:focus { border-color: #C9A24B; box-shadow: 0 0 0 3px rgba(201,162,75,0.14); }
.textarea { resize: vertical; min-height: 100px; }
.select { cursor: pointer; }

.check-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #3D1C0E;
  cursor: pointer;
  padding: 0.6rem 0;
}
.checkbox {
  width: 18px;
  height: 18px;
  accent-color: #A6802F;
  cursor: pointer;
}

/* Existing images */
.existing-grid,
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.6rem;
  margin-top: 0.4rem;
}
.existing-img-wrap,
.preview-wrap {
  position: relative;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #c9b99a;
}
.existing-img,
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.del-img-btn {
  position: absolute;
  top: 3px;
  left: 3px;
  background: rgba(220, 38, 38, 0.85);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: background 0.15s;
}
.del-img-btn:hover { background: #b91c1c; }

/* Dropzone */
.dropzone {
  border: 2px dashed #c9b99a;
  border-radius: 10px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  background: #faf6ee;
  transition: border-color 0.2s, background 0.2s;
}
.dropzone--active {
  border-color: #C9A24B;
  background: #FBF3DF;
}
.dropzone-text {
  font-size: 0.9rem;
  color: #6B3A2A;
  pointer-events: none;
}

/* Submit */
.submit-btn {
  padding: 0.8rem;
  background: #16243F;
  color: #ECD4A0;
  border: 1.5px solid transparent;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  transition: border-color 0.2s, background 0.2s;
  margin-top: 0.5rem;
}
.submit-btn:hover:not(:disabled) { background: #1E3357; border-color: #C9A24B; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(245,237,216,0.4);
  border-top-color: #F5EDD8;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
