<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavbar from './components/layout/TheNavbar.vue'
import TheFooter from './components/layout/TheFooter.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
</script>

<template>
  <TheNavbar />

  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>

  <TheFooter />
  <ToastContainer />
</template>
