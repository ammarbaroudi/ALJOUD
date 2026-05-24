<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/properties', label: 'العقارات' },
  { to: '/#about', label: 'من نحن' },
  { to: '/#contact', label: 'تواصل معنا' },
]
</script>

<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar-inner">
      <!-- Logo -->
      <RouterLink to="/" class="logo">
        <img src="/logo.png" alt="الجود للعقارات" class="logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
        <div class="logo-fallback">
          <span class="logo-main">ALJOUD</span>
          <span class="logo-sub">REAL ESTATE</span>
        </div>
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
    <Transition name="drawer">
      <div v-if="menuOpen" class="mobile-drawer">
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
    </Transition>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 100;
  background-color: rgba(251, 248, 241, 0.85);
  backdrop-filter: blur(14px) saturate(140%);
  border-bottom: 1px solid transparent;
  font-family: 'Cairo', sans-serif;
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.navbar--scrolled {
  background-color: rgba(251, 248, 241, 0.96);
  border-bottom-color: rgba(201, 162, 75, 0.35);
  box-shadow: 0 6px 28px rgba(44, 18, 8, 0.07);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 50px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}
.logo:hover .logo-img { transform: scale(1.04); }

.logo-fallback {
  display: none;
  flex-direction: column;
  line-height: 1.1;
}

.logo-main {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #3D1C0E;
}

.logo-sub {
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  color: #6B3A2A;
}

.desktop-nav {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a2515;
  text-decoration: none;
  position: relative;
  padding-bottom: 3px;
  transition: color 0.2s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 0;
  left: 0;
  height: 2.5px;
  background: linear-gradient(90deg, #DDBB6E, #A6802F);
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.28s ease;
}

.nav-link:hover { color: #3D1C0E; }
.nav-link:hover::after,
.nav-link--active::after {
  transform: scaleX(1);
}
.nav-link--active { color: #3D1C0E; font-weight: 700; }

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}
.hamburger:hover { background: rgba(61, 28, 14, 0.07); }

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #3D1C0E;
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.25s;
}
.hamburger-line:nth-child(1).open { transform: translateY(7px) rotate(45deg); }
.hamburger-line:nth-child(2).open { opacity: 0; }
.hamburger-line:nth-child(3).open { transform: translateY(-7px) rotate(-45deg); }

/* Mobile drawer */
.mobile-drawer {
  display: flex;
  flex-direction: column;
  background: rgba(250, 246, 238, 0.98);
  backdrop-filter: blur(12px);
  border-top: 1px solid #e0d5be;
  padding: 0.5rem 1.5rem 1rem;
  gap: 0.1rem;
}

.mobile-link {
  font-size: 1rem;
  font-weight: 600;
  color: #3D1C0E;
  text-decoration: none;
  padding: 0.65rem 0;
  border-bottom: 1px solid #ede4d0;
  transition: color 0.2s, padding-right 0.2s;
}
.mobile-link:last-child { border-bottom: none; }
.mobile-link:hover { padding-right: 0.4rem; color: #6B3A2A; }
.mobile-link--active { color: #6B3A2A; font-weight: 700; }

/* Drawer transition */
.drawer-enter-active,
.drawer-leave-active { transition: opacity 0.2s, transform 0.2s; }
.drawer-enter-from,
.drawer-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .hamburger { display: flex; }
}
</style>
