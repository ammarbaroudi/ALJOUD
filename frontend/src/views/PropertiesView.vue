<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePropertiesStore } from '../stores/properties.store'
import PropertyCard from '../components/ui/PropertyCard.vue'
import type { PropertyStatus } from '../types/property'

const store = usePropertiesStore()

/* ── Filter state ── */
type Filter = 'الكل' | PropertyStatus
const activeFilter = ref<Filter>('الكل')

const filters: { label: string; value: Filter }[] = [
  { label: 'الكل',    value: 'الكل' },
  { label: 'للبيع',  value: 'للبيع' },
  { label: 'للإيجار', value: 'للإيجار' },
  { label: 'مباع',   value: 'مباع' },
]

/* ── Fetch on mount and whenever filter changes ── */
async function load() {
  if (activeFilter.value === 'الكل') {
    await store.fetchAll()
  } else {
    await store.fetchAll({ status: activeFilter.value as PropertyStatus })
  }
}

onMounted(load)
watch(activeFilter, load)

/* ── Derived list ── */
const displayedProperties = computed(() => store.properties)

/* ── Disable TransitionGroup move animation during loading to prevent flicker ── */
const transitionName = computed(() => (store.loading ? '' : 'card-list'))
</script>

<template>
  <div class="props-page">

    <!-- ── Page header ── -->
    <div class="page-header">
      <div class="container">
        <h1
          v-motion
          :initial="{ opacity: 0, y: 24 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="page-title"
        >
          جميع العقارات
        </h1>
        <p
          v-motion
          :initial="{ opacity: 0, y: 16 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 150 } }"
          class="page-sub"
        >
          اكتشف أفضل العقارات في حمص
        </p>
      </div>
    </div>

    <!-- ── Sticky filter bar ── -->
    <div class="filter-bar-wrapper">
      <div class="container">
        <div class="filter-bar" role="group" aria-label="تصفية العقارات">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-btn"
            :class="{ 'filter-btn--active': activeFilter === f.value }"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
            <span v-if="activeFilter === f.value" class="filter-underline" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── Main grid area ── -->
    <div class="container grid-container">

      <!-- Loading skeletons -->
      <div v-if="store.loading" class="props-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card" />
      </div>

      <!-- Empty state -->
      <div v-else-if="!displayedProperties.length" class="empty-state">
        <svg
          class="empty-icon"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 28L32 8l24 20v26a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V28Z"
            stroke="#6B3A2A"
            stroke-width="2.5"
            stroke-linejoin="round"
            fill="rgba(107,58,42,0.08)"
          />
          <rect x="22" y="36" width="10" height="18" rx="1.5" stroke="#6B3A2A" stroke-width="2" fill="rgba(107,58,42,0.06)" />
          <rect x="36" y="30" width="10" height="12" rx="1.5" stroke="#6B3A2A" stroke-width="2" fill="rgba(107,58,42,0.06)" />
          <path d="M32 8V4" stroke="#6B3A2A" stroke-width="2" stroke-linecap="round" />
          <path d="M38 12l4-4" stroke="#6B3A2A" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <p class="empty-title">لا توجد عقارات</p>
        <p class="empty-sub">لم يتم العثور على عقارات بهذا التصنيف حالياً</p>
      </div>

      <!-- Property cards with transition -->
      <TransitionGroup
        v-else
        :name="transitionName"
        tag="div"
        class="props-grid"
      >
        <div v-for="property in displayedProperties" :key="property.id">
          <PropertyCard :property="property" />
        </div>
      </TransitionGroup>

    </div>
  </div>
</template>

<style scoped>
.props-page {
  padding-top: 70px;
  min-height: 100vh;
  background: #FBF8F1;
  font-family: 'Cairo', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── Header ── */
.page-header {
  background: var(--grad-cream);
  border-bottom: 1px solid rgba(201,162,75,0.28);
  padding: 3.25rem 0 2.75rem;
  text-align: center;
}

.page-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #3D1C0E;
  margin: 0 0 0.5rem;
}

.page-sub {
  font-size: 1rem;
  color: #6B3A2A;
  margin: 0;
}

/* ── Filter bar ── */
.filter-bar-wrapper {
  position: sticky;
  top: 70px;
  z-index: 50;
  background: rgba(251, 248, 241, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(201,162,75,0.2);
  padding: 0.85rem 0;
}

.filter-bar {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 2px;
}
.filter-bar::-webkit-scrollbar { display: none; }

.filter-btn {
  position: relative;
  flex-shrink: 0;
  padding: 0.5rem 1.35rem;
  border-radius: 999px;
  border: 1.5px solid rgba(201,162,75,0.4);
  background: transparent;
  color: #6B3A2A;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  white-space: nowrap;
}
.filter-btn:hover { border-color: #A6802F; color: #A6802F; }

.filter-btn--active,
.filter-btn--active:hover {
  background: #16243F;
  color: #ECD4A0;
  border-color: #16243F;
}

.filter-underline {
  position: absolute;
  bottom: -11px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #A6802F;
  border-radius: 50%;
  animation: dot-in 0.2s ease;
}

@keyframes dot-in {
  from { opacity: 0; transform: translateX(-50%) scale(0); }
  to   { opacity: 1; transform: translateX(-50%) scale(1); }
}

/* ── Grid ── */
.grid-container {
  padding-top: 2.5rem;
  padding-bottom: 4rem;
}

.props-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .props-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .props-grid { grid-template-columns: 1fr; }
}

/* ── Skeleton ── */
.skeleton-card {
  height: 320px;
  border-radius: 12px;
  background: linear-gradient(90deg, #e8dfc4 25%, #f0e8d0 50%, #e8dfc4 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Empty state ── */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
  text-align: center;
  gap: 0.75rem;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3D1C0E;
  margin: 0;
}

.empty-sub {
  font-size: 0.9rem;
  color: #9a8a72;
  margin: 0;
}

/* ── Card-list TransitionGroup ── */
.card-list-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.card-list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  position: absolute;
}
.card-list-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.card-list-move {
  transition: transform 0.3s ease;
}
</style>
