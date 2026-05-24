<script setup lang="ts">
import { ref } from 'vue'
import { useMotion } from '@vueuse/motion'

defineProps<{ title: string; subtitle?: string }>()

const el = ref<HTMLElement | null>(null)

useMotion(el, {
  initial: { opacity: 0, y: 24 },
  visibleOnce: { opacity: 1, y: 0, transition: { duration: 550, delay: 80 } },
})
</script>

<template>
  <div ref="el" class="section-title">
    <h2 class="title">{{ title }}</h2>
    <div class="underline" />
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.section-title {
  text-align: center;
  margin-bottom: 2.5rem;
  font-family: 'Cairo', sans-serif;
}

.title {
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 800;
  color: #3D1C0E;
  margin: 0 0 0.5rem;
}

.underline {
  width: 56px;
  height: 4px;
  background-color: #6B3A2A;
  border-radius: 2px;
  margin: 0 auto 0.9rem;
}

.subtitle {
  font-size: 1rem;
  color: #6B3A2A;
  margin: 0;
  max-width: 480px;
  margin-inline: auto;
  line-height: 1.7;
}
</style>
