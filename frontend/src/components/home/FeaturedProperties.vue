<script setup lang="ts">
import { propertiesApi } from '../../api/properties.api'
import PropertyCard from '../ui/PropertyCard.vue'

const properties = await propertiesApi.getAll({ featured: true })
const featured = properties.slice(0, 3)
</script>

<template>
  <div class="fp-grid">
    <div
      v-for="(property, i) in featured"
      :key="property.id"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :visibleOnce="{
        opacity: 1,
        y: 0,
        transition: { duration: 500, delay: i * 150 },
      }"
    >
      <PropertyCard :property="property" />
    </div>

    <p v-if="!featured.length" class="fp-empty">لا توجد عقارات مميزة حالياً</p>
  </div>
</template>

<style scoped>
.fp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.fp-empty {
  grid-column: 1 / -1;
  text-align: center;
  color: #9a8a72;
  font-family: 'Cairo', sans-serif;
  padding: 2rem 0;
}
@media (max-width: 900px) {
  .fp-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .fp-grid { grid-template-columns: 1fr; }
}
</style>
