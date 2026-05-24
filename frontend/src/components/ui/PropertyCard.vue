<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Property } from '../../types/property'

const props = defineProps<{ property: Property }>()
const router = useRouter()

const cover = computed(() => props.property.images[0]?.url ?? null)

const statusLabel = computed(() => props.property.status)
const statusClass = computed(() => {
  if (props.property.status === 'للإيجار') return 'badge--rent'
  if (props.property.status === 'مباع') return 'badge--sold'
  return 'badge--sale'
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
      <img v-if="cover" :src="cover" :alt="property.title" class="card-img" />
      <div v-else class="card-placeholder">
        <span>لا توجد صورة</span>
      </div>
      <span class="badge" :class="statusClass">{{ statusLabel }}</span>
    </div>

    <!-- Content -->
    <div class="card-body">
      <h3 class="card-title">{{ property.title }}</h3>
      <p class="card-location">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        {{ property.location }}
      </p>
      <p v-if="formattedPrice" class="card-price">{{ formattedPrice }}</p>
    </div>
  </article>
</template>

<style scoped>
.card {
  background-color: #F5EDD8;
  border: 1px solid #c9b99a;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  font-family: 'Cairo', sans-serif;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(61, 28, 14, 0.15);
}

.card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background-color: #e8dfc4;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}
.card:hover .card-img {
  transform: scale(1.04);
}
.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9a8a72;
  font-size: 0.9rem;
}

/* Status badge */
.badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}
.badge--sale  { background: #3D1C0E; color: #F5EDD8; }
.badge--rent  { background: #6B3A2A; color: #F5EDD8; }
.badge--sold  { background: #9a8a72; color: #FAF6EE; }

/* Body */
.card-body {
  padding: 1rem 1.1rem 1.2rem;
}
.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #3D1C0E;
  margin: 0 0 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-location {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: #6B3A2A;
  margin: 0 0 0.5rem;
}
.icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.card-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: #3D1C0E;
  margin: 0;
}
</style>
