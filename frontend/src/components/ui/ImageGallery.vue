<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { PropertyImage } from '../../types/property'

const props = defineProps<{ images: PropertyImage[] }>()

const lightboxIndex = ref<number | null>(null)
const isOpen = computed(() => lightboxIndex.value !== null)
const current = computed(() =>
  lightboxIndex.value !== null ? props.images[lightboxIndex.value] : null,
)

function open(index: number) {
  lightboxIndex.value = index
}
function close() {
  lightboxIndex.value = null
}
function prev() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value =
    (lightboxIndex.value - 1 + props.images.length) % props.images.length
}
function next() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % props.images.length
}

function onKey(e: KeyboardEvent) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') next()
  else if (e.key === 'ArrowRight') prev()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <!-- Thumbnail grid -->
  <div v-if="images.length" class="gallery-grid">
    <button
      v-for="(image, i) in images"
      :key="image.id"
      class="thumb-btn"
      @click="open(i)"
    >
      <img :src="image.url" :alt="`صورة ${i + 1}`" class="thumb-img" />
    </button>
  </div>
  <p v-else class="no-images">لا توجد صور لهذا العقار</p>

  <!-- Lightbox -->
  <Teleport to="body">
    <div v-if="isOpen && current" class="lightbox" @click.self="close">
      <button class="lb-close" aria-label="إغلاق" @click="close">✕</button>

      <button
        v-if="images.length > 1"
        class="lb-arrow lb-arrow--prev"
        aria-label="السابق"
        @click="prev"
      >
        &#8250;
      </button>

      <img :src="current.url" :alt="`صورة ${lightboxIndex! + 1}`" class="lb-img" />

      <button
        v-if="images.length > 1"
        class="lb-arrow lb-arrow--next"
        aria-label="التالي"
        @click="next"
      >
        &#8249;
      </button>

      <span class="lb-counter">{{ lightboxIndex! + 1 }} / {{ images.length }}</span>
    </div>
  </Teleport>
</template>

<style scoped>
/* Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

.thumb-btn {
  padding: 0;
  border: 2px solid #c9b99a;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #e8dfc4;
  aspect-ratio: 4 / 3;
  transition: border-color 0.2s, transform 0.2s;
}
.thumb-btn:hover {
  border-color: #3D1C0E;
  transform: scale(1.02);
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.no-images {
  text-align: center;
  color: #9a8a72;
  font-family: 'Cairo', sans-serif;
  padding: 2rem 0;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(20, 8, 3, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}

.lb-close {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: none;
  border: none;
  color: #F5EDD8;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.lb-close:hover { opacity: 1; }

.lb-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(245, 237, 216, 0.12);
  border: none;
  color: #F5EDD8;
  font-size: 2.5rem;
  line-height: 1;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.lb-arrow:hover { background: rgba(245, 237, 216, 0.25); }
/* RTL-aware: "prev" (earlier index) is on the right side */
.lb-arrow--prev { right: 1.25rem; }
.lb-arrow--next { left: 1.25rem; }

.lb-counter {
  position: absolute;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  color: #d6c9aa;
  font-size: 0.85rem;
  font-family: 'Cairo', sans-serif;
}
</style>
