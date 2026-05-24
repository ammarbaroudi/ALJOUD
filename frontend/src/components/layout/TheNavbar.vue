<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/properties', label: 'العقارات' },
  { to: '/#about', label: 'من نحن' },
  { to: '/#contact', label: 'تواصل معنا' },
]
</script>

<template>
  <header
    v-motion
    :initial="{ opacity: 0, y: -20 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
    class="navbar"
  >
    <div class="navbar-inner">
      <!-- Logo -->
      <RouterLink to="/" class="logo">
        <span class="logo-main">ALJOUD</span>
        <span class="logo-sub">REAL ESTATE</span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="desktop-nav">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          active-class="nav-link--active"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Hamburger -->
      <button class="hamburger" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        <span class="hamburger-line" :class="{ open: menuOpen }" />
        <span class="hamburger-line" :class="{ open: menuOpen }" />
        <span class="hamburger-line" :class="{ open: menuOpen }" />
      </button>
    </div>

    <!-- Mobile drawer -->
    <div
      v-if="menuOpen"
      v-motion
      :initial="{ opacity: 0, y: -16 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 250 } }"
      class="mobile-drawer"
    >
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="mobile-link"
        active-class="mobile-link--active"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 100;
  background-color: #F5EDD8;
  border-bottom: 1px solid #d6c9aa;
  font-family: 'Cairo', sans-serif;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  text-decoration: none;
}
.logo-main {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #3D1C0E;
}
.logo-sub {
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  color: #6B3A2A;
}

.desktop-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: #3D1C0E;
  text-decoration: none;
  position: relative;
  padding-bottom: 2px;
  transition: color 0.2s;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 0;
  left: 0;
  height: 2px;
  background-color: #3D1C0E;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.25s ease;
}
.nav-link:hover::after,
.nav-link--active::after {
  transform: scaleX(1);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #3D1C0E;
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}
.hamburger-line:nth-child(1).open {
  transform: translateY(7px) rotate(45deg);
}
.hamburger-line:nth-child(2).open {
  opacity: 0;
}
.hamburger-line:nth-child(3).open {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile drawer */
.mobile-drawer {
  display: flex;
  flex-direction: column;
  background-color: #F5EDD8;
  border-top: 1px solid #d6c9aa;
  padding: 0.75rem 1.5rem 1rem;
  gap: 0.25rem;
}
.mobile-link {
  font-size: 1rem;
  font-weight: 600;
  color: #3D1C0E;
  text-decoration: none;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e8dfc4;
}
.mobile-link:last-child {
  border-bottom: none;
}
.mobile-link--active {
  color: #6B3A2A;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  .hamburger {
    display: flex;
  }
}
</style>
