<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'
import { Icon } from '@iconify/vue'
import { usePropertiesStore } from '../stores/properties.store'
import ImageGallery from '../components/ui/ImageGallery.vue'

const route = useRoute()
const router = useRouter()
const store = usePropertiesStore()

const loading = ref(true)
const notFound = ref(false)

const property = computed(() => store.currentProperty)

const statusClass = computed(() => {
  if (!property.value) return ''
  if (property.value.status === 'للإيجار') return 'badge--rent'
  if (property.value.status === 'مباع')    return 'badge--sold'
  return 'badge--sale'
})

const formattedPrice = computed(() => {
  if (!property.value?.price) return null
  return new Intl.NumberFormat('ar-SY').format(property.value.price) + ' ل.س'
})

const whatsappLink = computed(() => {
  if (!property.value) return '#'
  const msg = encodeURIComponent(`مرحباً، أود الاستفسار عن العقار: ${property.value.title}`)
  return `https://wa.me/963949039780?text=${msg}`
})

async function load(id: string) {
  loading.value = true
  notFound.value = false
  try {
    await store.fetchOne(id)
    if (property.value) {
      document.title = `${property.value.title} | الجود للعقارات`
    }
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => load(route.params.id as string))
watch(() => route.params.id, (id) => id && load(id as string))

/* ── Section motion refs ── */
const galleryRef  = ref<HTMLElement | null>(null)
const detailsRef  = ref<HTMLElement | null>(null)
const contactRef  = ref<HTMLElement | null>(null)

useMotion(galleryRef, {
  initial:     { opacity: 0, y: -24 },
  visibleOnce: { opacity: 1, y: 0, transition: { duration: 500 } },
})
useMotion(detailsRef, {
  initial:     { opacity: 0, x: 40 },
  visibleOnce: { opacity: 1, x: 0, transition: { duration: 550, delay: 100 } },
})
useMotion(contactRef, {
  initial:     { opacity: 0, x: 40 },
  visibleOnce: { opacity: 1, x: 0, transition: { duration: 550, delay: 220 } },
})
</script>

<template>
  <div class="detail-page">
    <div class="container">

      <!-- Back button -->
      <button class="back-btn" @click="router.push('/properties')">
        <Icon icon="mdi:arrow-left" class="back-icon" />
        العودة للعقارات
      </button>

      <!-- ── Loading spinner ── -->
      <div v-if="loading" class="spinner-wrap">
        <span class="spinner" />
      </div>

      <!-- ── Not found ── -->
      <div v-else-if="notFound || !property" class="not-found">
        <svg class="nf-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="28" stroke="#6B3A2A" stroke-width="2.5" fill="rgba(107,58,42,0.07)" />
          <path d="M21 21l22 22M43 21L21 43" stroke="#6B3A2A" stroke-width="3" stroke-linecap="round" />
        </svg>
        <p class="nf-title">العقار غير موجود</p>
        <p class="nf-sub">لم يتم العثور على هذا العقار أو ربما تم حذفه</p>
        <button class="btn btn--primary" @click="router.push('/properties')">
          تصفح العقارات
        </button>
      </div>

      <!-- ── Property content ── -->
      <template v-else>

        <!-- Images -->
        <div ref="galleryRef" class="gallery-wrap">
          <ImageGallery :images="property.images" />
        </div>

        <!-- Two-column layout -->
        <div class="detail-grid">

          <!-- Left: details -->
          <div ref="detailsRef" class="details-col">
            <div class="title-row">
              <h1 class="prop-title">{{ property.title }}</h1>
              <span class="badge" :class="statusClass">{{ property.status }}</span>
            </div>

            <p v-if="formattedPrice" class="prop-price">{{ formattedPrice }}</p>

            <div class="prop-location">
              <Icon icon="mdi:map-marker" class="location-icon" />
              <span>{{ property.location }}</span>
            </div>

            <div v-if="property.description" class="prop-desc">
              <h3 class="desc-title">وصف العقار</h3>
              <p class="desc-body">{{ property.description }}</p>
            </div>
          </div>

          <!-- Right: contact card -->
          <aside ref="contactRef" class="contact-col">
            <div class="contact-card">
              <p class="contact-heading">للاستفسار عن هذا العقار</p>

              <a href="tel:0949039780" class="contact-btn contact-btn--phone">
                <Icon icon="mdi:phone" />
                <span>0949039780</span>
              </a>

              <a href="tel:0981689250" class="contact-btn contact-btn--phone">
                <Icon icon="mdi:phone" />
                <span>0981689250</span>
              </a>

              <a
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-btn contact-btn--whatsapp"
              >
                <Icon icon="mdi:whatsapp" />
                <span>تواصل واتساب</span>
              </a>
            </div>
          </aside>

        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
.detail-page {
  padding-top: 70px;
  padding-bottom: 5rem;
  min-height: 100vh;
  background: #FAF6EE;
  font-family: 'Cairo', sans-serif;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── Back button ── */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 1.75rem 0 1.5rem;
  background: none;
  border: none;
  color: #6B3A2A;
  font-family: 'Cairo', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.back-btn:hover { color: #3D1C0E; }
.back-icon { font-size: 1.1rem; }

/* ── Spinner ── */
.spinner-wrap {
  display: flex;
  justify-content: center;
  padding: 8rem 0;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0d5be;
  border-top-color: #3D1C0E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Not found ── */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 6rem 1rem;
  text-align: center;
}
.nf-icon {
  width: 72px;
  height: 72px;
  margin-bottom: 0.5rem;
}
.nf-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #3D1C0E;
  margin: 0;
}
.nf-sub {
  font-size: 0.9rem;
  color: #9a8a72;
  margin: 0 0 0.5rem;
}

/* ── Gallery ── */
.gallery-wrap {
  margin-bottom: 2.5rem;
}

/* ── Two-column layout ── */
.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

/* ── Details col ── */
.title-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}
.prop-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  color: #3D1C0E;
  margin: 0;
  flex: 1;
  min-width: 0;
}

.badge {
  flex-shrink: 0;
  margin-top: 0.35rem;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}
.badge--sale  { background: #3D1C0E; color: #F5EDD8; }
.badge--rent  { background: #6B3A2A; color: #F5EDD8; }
.badge--sold  { background: #9a8a72; color: #FAF6EE; }

.prop-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #3D1C0E;
  margin: 0 0 1rem;
}

.prop-location {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #6B3A2A;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.75rem;
}
.location-icon { font-size: 1rem; flex-shrink: 0; }

.desc-title {
  font-size: 1rem;
  font-weight: 700;
  color: #3D1C0E;
  margin: 0 0 0.5rem;
}
.desc-body {
  font-size: 0.95rem;
  color: #4a2515;
  line-height: 1.9;
  margin: 0;
  white-space: pre-line;
}

/* ── Contact card ── */
.contact-card {
  background: #F5EDD8;
  border: 1.5px solid #c9b99a;
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: sticky;
  top: 90px;
}
.contact-heading {
  font-size: 0.95rem;
  font-weight: 700;
  color: #3D1C0E;
  text-align: center;
  margin: 0 0 0.25rem;
  border-bottom: 1px solid #d6c9aa;
  padding-bottom: 0.75rem;
}

.contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: filter 0.2s, transform 0.18s;
}
.contact-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

.contact-btn--phone {
  background: #3D1C0E;
  color: #F5EDD8;
}
.contact-btn--whatsapp {
  background: #25D366;
  color: #fff;
}

/* ── Button (not found) ── */
.btn {
  padding: 0.7rem 1.75rem;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background 0.2s, transform 0.18s;
}
.btn:hover { transform: translateY(-2px); }
.btn--primary { background: #3D1C0E; color: #F5EDD8; }
.btn--primary:hover { background: #6B3A2A; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .contact-card { position: static; }
}
</style>
