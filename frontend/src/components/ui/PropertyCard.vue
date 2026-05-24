<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { Property } from '../../types/property'

const props = defineProps<{ property: Property }>()
const router = useRouter()

const cover = computed(() => props.property.images[0]?.url ?? null)

const statusConfig = computed(() => {
  if (props.property.status === 'للإيجار') return { label: 'للإيجار', cls: 'badge--rent' }
  if (props.property.status === 'مباع')    return { label: 'مباع',    cls: 'badge--sold' }
  return { label: 'للبيع', cls: 'badge--sale' }
})

const formattedPrice = computed(() => {
  if (props.property.price == null) return null
  return new Intl.NumberFormat('ar-SY').format(props.property.price) + ' ل.س'
})

function navigate() {
  router.push(`/properties/${props.property.id}`)
}
</script>

<template>
  <article class="card" @click="navigate">
    <!-- Cover image -->
    <div class="card-image">
      <img v-if="cover" :src="cover" :alt="property.title" class="card-img" loading="lazy" />
      <div v-else class="card-placeholder">
        <Icon icon="mdi:home-outline" class="placeholder-icon" />
      </div>

      <span class="badge" :class="statusConfig.cls">{{ statusConfig.label }}</span>

      <div v-if="property.isFeatured" class="featured-badge">
        <Icon icon="mdi:star" />
        مميز
      </div>

      <div class="card-overlay" />
    </div>

    <!-- Content -->
    <div class="card-body">
      <h3 class="card-title">{{ property.title }}</h3>

      <p class="card-location">
        <Icon icon="mdi:map-marker" class="loc-icon" />
        {{ property.location }}
      </p>

      <div class="card-footer">
        <p v-if="formattedPrice" class="card-price">{{ formattedPrice }}</p>
        <span v-else class="card-price card-price--na">تواصل للسعر</span>
        <span class="card-cta">
          التفاصيل
          <Icon icon="mdi:arrow-left" class="cta-arrow" />
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #ede4d0;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  font-family: 'Cairo', sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(61, 28, 14, 0.18);
}

/* Image */
.card-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #e8dfc4;
  flex-shrink: 0;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
}
.card:hover .card-img { transform: scale(1.06); }

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9b99a;
}
.placeholder-icon { font-size: 3rem; }

/* Overlay gradient at bottom of image */
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(44,18,8,0.35) 0%, transparent 50%);
  pointer-events: none;
}

/* Status badge */
.badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  backdrop-filter: blur(4px);
  z-index: 1;
}
.badge--sale { background: rgba(61,28,14,0.9);  color: #F5EDD8; }
.badge--rent { background: rgba(107,58,42,0.9); color: #F5EDD8; }
.badge--sold { background: rgba(120,120,120,0.85); color: #fff; }

/* Featured badge */
.featured-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(212, 160, 40, 0.92);
  color: #fff;
  font-size: 0.73rem;
  font-weight: 700;
  padding: 0.22rem 0.7rem;
  border-radius: 999px;
  backdrop-filter: blur(4px);
  z-index: 1;
}

/* Body */
.card-body {
  padding: 1.1rem 1.2rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2C1208;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.card-location {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.83rem;
  color: #8a6a4a;
  margin: 0;
}
.loc-icon { font-size: 1rem; flex-shrink: 0; color: #9a8a72; }

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 1px solid #f0e8d8;
}

.card-price {
  font-size: 0.95rem;
  font-weight: 800;
  color: #3D1C0E;
  margin: 0;
}
.card-price--na { color: #9a8a72; font-weight: 600; font-size: 0.85rem; }

.card-cta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #6B3A2A;
  transition: gap 0.2s;
}
.card:hover .card-cta { gap: 0.5rem; }
.cta-arrow { font-size: 1rem; transition: transform 0.2s; }
.card:hover .cta-arrow { transform: translateX(-3px); }
</style>
