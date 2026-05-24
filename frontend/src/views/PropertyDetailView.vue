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

const statusConfig = computed(() => {
  if (!property.value) return { label: '', cls: '' }
  if (property.value.status === 'للإيجار') return { label: 'للإيجار', cls: 'badge--rent' }
  if (property.value.status === 'مباع')    return { label: 'مباع',    cls: 'badge--sold' }
  return { label: 'للبيع', cls: 'badge--sale' }
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

const galleryRef = ref<HTMLElement | null>(null)
const detailsRef = ref<HTMLElement | null>(null)
const contactRef = ref<HTMLElement | null>(null)

useMotion(galleryRef, {
  initial:     { opacity: 0, y: -20 },
  visibleOnce: { opacity: 1, y: 0, transition: { duration: 500 } },
})
useMotion(detailsRef, {
  initial:     { opacity: 0, x: 30 },
  visibleOnce: { opacity: 1, x: 0, transition: { duration: 550, delay: 100 } },
})
useMotion(contactRef, {
  initial:     { opacity: 0, x: 30 },
  visibleOnce: { opacity: 1, x: 0, transition: { duration: 550, delay: 220 } },
})
</script>

<template>
  <div class="detail-page">

    <!-- Breadcrumb -->
    <div class="breadcrumb-bar">
      <div class="container">
        <button class="back-btn" @click="router.push('/properties')">
          <Icon icon="mdi:arrow-right" class="back-icon" />
          <span>العقارات</span>
        </button>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">{{ property?.title ?? '...' }}</span>
      </div>
    </div>

    <div class="container">

      <!-- Loading -->
      <div v-if="loading" class="spinner-wrap">
        <span class="spinner" />
      </div>

      <!-- Not found -->
      <div v-else-if="notFound || !property" class="not-found">
        <Icon icon="mdi:home-off-outline" class="nf-icon" />
        <p class="nf-title">العقار غير موجود</p>
        <p class="nf-sub">لم يتم العثور على هذا العقار أو ربما تم حذفه</p>
        <button class="btn btn--primary" @click="router.push('/properties')">
          تصفح العقارات
        </button>
      </div>

      <!-- Content -->
      <template v-else>

        <!-- Gallery -->
        <div ref="galleryRef" class="gallery-wrap">
          <ImageGallery :images="property.images" />
        </div>

        <!-- Two columns -->
        <div class="detail-grid">

          <!-- Details -->
          <div ref="detailsRef" class="details-col">
            <div class="prop-header">
              <div class="title-row">
                <h1 class="prop-title">{{ property.title }}</h1>
                <span class="badge" :class="statusConfig.cls">{{ statusConfig.label }}</span>
              </div>

              <div class="prop-meta">
                <div class="meta-item">
                  <Icon icon="mdi:map-marker" class="meta-icon" />
                  <span>{{ property.location }}</span>
                </div>
              </div>

              <div v-if="formattedPrice" class="price-wrap">
                <span class="price-label">السعر</span>
                <span class="prop-price">{{ formattedPrice }}</span>
              </div>
              <div v-else class="price-wrap">
                <span class="prop-price prop-price--na">تواصل معنا للسعر</span>
              </div>
            </div>

            <div v-if="property.description" class="prop-desc">
              <h3 class="desc-title">
                <Icon icon="mdi:text-box-outline" class="desc-icon" />
                وصف العقار
              </h3>
              <p class="desc-body">{{ property.description }}</p>
            </div>

            <!-- Share -->
            <div class="share-row">
              <span class="share-label">مشاركة:</span>
              <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="share-btn share-btn--wa">
                <Icon icon="mdi:whatsapp" />
              </a>
            </div>
          </div>

          <!-- Contact -->
          <aside ref="contactRef" class="contact-col">
            <div class="contact-card">
              <div class="contact-header">
                <div class="contact-avatar">
                  <img src="/logo.png" alt="" class="contact-logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
                  <div class="contact-logo-fallback">
                    <Icon icon="mdi:home" class="clf-icon" />
                  </div>
                </div>
                <div>
                  <p class="contact-name">الجود للعقارات</p>
                  <p class="contact-sub">حمص - سوريا</p>
                </div>
              </div>

              <div class="contact-divider" />

              <p class="contact-heading">للاستفسار عن هذا العقار</p>

              <a href="tel:0949039780" class="contact-btn contact-btn--phone">
                <Icon icon="mdi:phone" class="cbtn-icon" />
                <span>0949039780</span>
              </a>

              <a href="tel:0981689250" class="contact-btn contact-btn--phone">
                <Icon icon="mdi:phone" class="cbtn-icon" />
                <span>0981689250</span>
              </a>

              <a
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-btn contact-btn--whatsapp"
              >
                <Icon icon="mdi:whatsapp" class="cbtn-icon" />
                <span>تواصل عبر واتساب</span>
              </a>

              <p class="contact-note">
                <Icon icon="mdi:clock-outline" />
                متاح طوال أيام الأسبوع
              </p>
            </div>
          </aside>

        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  padding-top: 72px;
  padding-bottom: 5rem;
  min-height: 100vh;
  background: #FDFAF4;
  font-family: 'Cairo', sans-serif;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Breadcrumb */
.breadcrumb-bar {
  background: #fff;
  border-bottom: 1px solid #ede4d0;
  padding: 0.65rem 0;
}
.breadcrumb-bar .container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: none;
  border: none;
  color: #6B3A2A;
  font-family: 'Cairo', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.back-btn:hover { color: #3D1C0E; }
.back-icon { font-size: 1rem; }
.breadcrumb-sep { color: #c9b99a; font-size: 0.85rem; }
.breadcrumb-current {
  font-size: 0.88rem;
  color: #3D1C0E;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

/* Spinner */
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

/* Not found */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 6rem 1rem;
  text-align: center;
}
.nf-icon { font-size: 4rem; color: #d6c9aa; }
.nf-title { font-size: 1.3rem; font-weight: 800; color: #3D1C0E; margin: 0; }
.nf-sub   { font-size: 0.9rem; color: #9a8a72; margin: 0 0 0.5rem; }

/* Gallery */
.gallery-wrap { margin: 2rem 0 2.5rem; }

/* Grid */
.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

/* Details */
.prop-header {
  background: #fff;
  border: 1px solid #ede4d0;
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
}

.title-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}
.prop-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  color: #2C1208;
  margin: 0;
  flex: 1;
  min-width: 0;
  line-height: 1.3;
}

.badge {
  flex-shrink: 0;
  margin-top: 0.35rem;
  padding: 0.28rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}
.badge--sale { background: #dcfce7; color: #166534; }
.badge--rent { background: #dbeafe; color: #1e40af; }
.badge--sold { background: #f3f4f6; color: #6b7280; }

.prop-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #6B3A2A;
  font-weight: 600;
}
.meta-icon { font-size: 1rem; }

.price-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f0e8d8;
}
.price-label {
  font-size: 0.8rem;
  color: #9a8a72;
  font-weight: 600;
  background: #f4efe6;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}
.prop-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2C1208;
}
.prop-price--na { font-size: 1rem; color: #9a8a72; font-weight: 600; }

/* Description */
.prop-desc {
  background: #fff;
  border: 1px solid #ede4d0;
  border-radius: 16px;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
}
.desc-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #2C1208;
  margin: 0 0 0.75rem;
}
.desc-icon { font-size: 1.2rem; color: #6B3A2A; }
.desc-body {
  font-size: 0.95rem;
  color: #4a2515;
  line-height: 2;
  margin: 0;
  white-space: pre-line;
}

/* Share */
.share-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.share-label { font-size: 0.85rem; color: #9a8a72; font-weight: 600; }
.share-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  text-decoration: none;
  transition: transform 0.2s, filter 0.2s;
}
.share-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
.share-btn--wa { background: #25D366; color: #fff; }

/* Contact card */
.contact-card {
  background: #fff;
  border: 1px solid #ede4d0;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: sticky;
  top: 90px;
  box-shadow: 0 8px 32px rgba(61,28,14,0.08);
}

.contact-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.contact-avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #f4efe6;
  border: 1px solid #e0d5be;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.contact-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}
.contact-logo-fallback {
  display: none;
  align-items: center;
  justify-content: center;
}
.clf-icon { font-size: 1.5rem; color: #6B3A2A; }

.contact-name { font-size: 0.95rem; font-weight: 700; color: #2C1208; margin: 0; }
.contact-sub  { font-size: 0.78rem; color: #9a8a72; margin: 0; }

.contact-divider { height: 1px; background: #f0e8d8; }

.contact-heading {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6B3A2A;
  text-align: center;
  margin: 0;
}

.contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s, filter 0.2s;
}
.contact-btn:hover { transform: translateY(-1px); filter: brightness(1.08); }
.cbtn-icon { font-size: 1.1rem; }

.contact-btn--phone {
  background: #3D1C0E;
  color: #F5EDD8;
  box-shadow: 0 4px 12px rgba(61,28,14,0.2);
}
.contact-btn--whatsapp {
  background: #25D366;
  color: #fff;
  box-shadow: 0 4px 12px rgba(37,211,102,0.25);
}

.contact-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  color: #9a8a72;
  margin: 0;
}

/* Button */
.btn {
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.btn:hover { transform: translateY(-2px); }
.btn--primary { background: #3D1C0E; color: #F5EDD8; box-shadow: 0 4px 12px rgba(61,28,14,0.2); }
.btn--primary:hover { background: #5a2a18; }

/* Responsive */
@media (max-width: 768px) {
  .detail-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .contact-card { position: static; }
}
</style>
