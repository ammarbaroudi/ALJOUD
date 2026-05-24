<script setup lang="ts">
import { ref, reactive, Suspense } from 'vue'
import { useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'
import { Icon } from '@iconify/vue'
import SectionTitle from '../components/ui/SectionTitle.vue'
import FeaturedProperties from '../components/home/FeaturedProperties.vue'

const router = useRouter()

/* ── Smooth scroll to contact ── */
function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

/* ── About section scroll-in ── */
const aboutSection = ref<HTMLElement | null>(null)
useMotion(aboutSection, {
  initial: { opacity: 0, y: 40 },
  visibleOnce: { opacity: 1, y: 0, transition: { duration: 600 } },
})

/* ── Contact info cards: slide from right (RTL: visual left) ── */
const contactCards = ref<HTMLElement | null>(null)
useMotion(contactCards, {
  initial: { opacity: 0, x: 50 },
  visibleOnce: { opacity: 1, x: 0, transition: { duration: 550, delay: 100 } },
})

/* ── Contact form: slide from left (RTL: visual right) ── */
const contactForm = ref<HTMLElement | null>(null)
useMotion(contactForm, {
  initial: { opacity: 0, x: -50 },
  visibleOnce: { opacity: 1, x: 0, transition: { duration: 550, delay: 200 } },
})

/* ── Contact form state ── */
const form = reactive({ name: '', phone: '', message: '' })
function submitForm() {
  console.log('Contact form submitted:', { ...form })
  form.name = ''
  form.phone = ''
  form.message = ''
}
</script>

<template>
  <div class="home">

    <!-- ═══════════════════════════ HERO ═══════════════════════════ -->
    <section class="hero">
      <!-- Floating decorative circles -->
      <span class="hero-blob hero-blob--1" aria-hidden="true" />
      <span class="hero-blob hero-blob--2" aria-hidden="true" />

      <div class="hero-content">
        <h1
          v-motion
          :initial="{ opacity: 0, x: -40 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 650 } }"
          class="hero-title"
        >
          الجـود للعقارات
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, x: -40 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 650, delay: 200 } }"
          class="hero-sub"
        >
          نجد لك البيت الذي تحلم به في قلب حمص
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 550, delay: 400 } }"
          class="hero-actions"
        >
          <button class="btn btn--primary" @click="router.push('/properties')">
            تصفح العقارات
          </button>
          <button class="btn btn--outline" @click="scrollToContact">
            تواصل معنا
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ FEATURED ═══════════════════════ -->
    <section class="section section--light">
      <div class="container">
        <SectionTitle
          title="أبرز العقارات"
          subtitle="اختيارات مميزة من أفضل العقارات المتاحة لدينا"
        />

        <Suspense>
          <FeaturedProperties />

          <template #fallback>
            <div class="skeleton-grid">
              <div v-for="n in 3" :key="n" class="skeleton-card" />
            </div>
          </template>
        </Suspense>

        <div class="section-footer">
          <button class="btn btn--primary" @click="router.push('/properties')">
            عرض الكل
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ ABOUT ════════════════════════════ -->
    <section class="section section--cream">
      <div class="container">
        <div ref="aboutSection" class="about-grid">
          <!-- Text side -->
          <div class="about-text">
            <h2 class="about-title">من نحن</h2>
            <div class="about-divider" />
            <p class="about-body">
              شركة الجود للعقارات — متخصصون في بيع وتأجير العقارات في حمص.
              نسعى لتقديم أفضل الخيارات لعملائنا بخبرة وأمانة.
            </p>

            <!-- Stats -->
            <div class="stats-row">
              <div class="stat">
                <span class="stat-number">+50</span>
                <span class="stat-label">عقارات متاحة</span>
              </div>
              <div class="stat">
                <span class="stat-number">+5</span>
                <span class="stat-label">سنوات خبرة</span>
              </div>
              <div class="stat">
                <span class="stat-number">+100</span>
                <span class="stat-label">عملاء سعداء</span>
              </div>
            </div>
          </div>

          <!-- Decorative side -->
          <div class="about-deco" aria-hidden="true">
            <div class="deco-frame">
              <div class="deco-inner">
                <span class="deco-logo-main">ALJOUD</span>
                <span class="deco-logo-sub">REAL ESTATE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ CONTACT ══════════════════════════ -->
    <section id="contact" class="section section--dark">
      <div class="container">
        <SectionTitle
          title="تواصل معنا"
          subtitle="نحن هنا للإجابة على جميع استفساراتك"
        />

        <div class="contact-grid">
          <!-- Info cards -->
          <div ref="contactCards" class="contact-info">
            <div class="info-card">
              <Icon icon="mdi:phone" class="info-icon" />
              <div>
                <p class="info-label">هاتف</p>
                <a href="tel:0949039780" class="info-value">0949039780</a>
              </div>
            </div>
            <div class="info-card">
              <Icon icon="mdi:phone" class="info-icon" />
              <div>
                <p class="info-label">هاتف</p>
                <a href="tel:0981689250" class="info-value">0981689250</a>
              </div>
            </div>
            <div class="info-card">
              <Icon icon="mdi:map-marker" class="info-icon" />
              <div>
                <p class="info-label">الموقع</p>
                <p class="info-value">الخالدية - حمص - سوريا</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form ref="contactForm" class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label class="form-label">الاسم</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="أدخل اسمك" required />
            </div>
            <div class="form-group">
              <label class="form-label">رقم الهاتف</label>
              <input v-model="form.phone" type="tel" class="form-input" placeholder="أدخل رقم هاتفك" required />
            </div>
            <div class="form-group">
              <label class="form-label">الرسالة</label>
              <textarea
                v-model="form.message"
                class="form-input form-textarea"
                placeholder="اكتب رسالتك هنا..."
                rows="4"
                required
              />
            </div>
            <button type="submit" class="btn btn--cream">
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ─── Shared ─── */
.home {
  padding-top: 70px; /* navbar height */
  font-family: 'Cairo', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section {
  padding: 5rem 0;
}
.section--light { background: #FAF6EE; }
.section--cream { background: #F5EDD8; }
.section--dark  { background: #3D1C0E; }

.section-footer {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

/* ─── Buttons ─── */
.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  border: 2px solid transparent;
  transition: background 0.22s, color 0.22s, transform 0.18s;
}
.btn:hover { transform: translateY(-2px); }
.btn--primary {
  background: #3D1C0E;
  color: #F5EDD8;
  border-color: #3D1C0E;
}
.btn--primary:hover { background: #6B3A2A; border-color: #6B3A2A; }
.btn--outline {
  background: transparent;
  color: #3D1C0E;
  border-color: #3D1C0E;
}
.btn--outline:hover { background: #3D1C0E; color: #F5EDD8; }
.btn--cream {
  background: #F5EDD8;
  color: #3D1C0E;
  border-color: #F5EDD8;
  width: 100%;
}
.btn--cream:hover { background: #FAF6EE; }

/* ─── Hero ─── */
.hero {
  position: relative;
  min-height: calc(100vh - 70px);
  background-color: #F5EDD8;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(107,58,42,0.07) 0%, transparent 60%),
    radial-gradient(circle at 80% 30%, rgba(61,28,14,0.05) 0%, transparent 55%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Floating background blobs */
.hero-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(107, 58, 42, 0.08);
  pointer-events: none;
}
.hero-blob--1 {
  width: 420px;
  height: 420px;
  top: -100px;
  left: -120px;
  animation: float1 9s ease-in-out infinite;
}
.hero-blob--2 {
  width: 260px;
  height: 260px;
  bottom: 60px;
  right: 80px;
  background: rgba(61, 28, 14, 0.06);
  animation: float2 12s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(20px, 30px) scale(1.04); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50%       { transform: translate(-15px, -20px) rotate(8deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem 1.5rem;
  max-width: 700px;
}

.hero-title {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 800;
  color: #3D1C0E;
  margin: 0 0 1rem;
  line-height: 1.2;
}

.hero-sub {
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  color: #6B3A2A;
  margin: 0 0 2rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── Skeleton ─── */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
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
@media (max-width: 900px) { .skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .skeleton-grid { grid-template-columns: 1fr; } }

/* ─── About ─── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #3D1C0E;
  margin: 0 0 0.5rem;
}
.about-divider {
  width: 50px;
  height: 4px;
  background: #6B3A2A;
  border-radius: 2px;
  margin-bottom: 1.25rem;
}
.about-body {
  font-size: 1rem;
  color: #4a2515;
  line-height: 1.9;
  margin: 0 0 2rem;
}

.stats-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #3D1C0E;
  line-height: 1;
}
.stat-label {
  font-size: 0.85rem;
  color: #6B3A2A;
  font-weight: 600;
}

/* Decorative frame */
.about-deco {
  display: flex;
  align-items: center;
  justify-content: center;
}
.deco-frame {
  width: 260px;
  height: 260px;
  border: 3px solid #3D1C0E;
  border-radius: 4px;
  transform: rotate(3deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.deco-frame::before {
  content: '';
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(61,28,14,0.3);
  border-radius: 2px;
}
.deco-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: rotate(-3deg);
}
.deco-logo-main {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #3D1C0E;
}
.deco-logo-sub {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #6B3A2A;
}

/* ─── Contact ─── */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Override SectionTitle colors for dark bg */
.section--dark :deep(.title) { color: #F5EDD8; }
.section--dark :deep(.underline) { background-color: #c9b99a; }
.section--dark :deep(.subtitle) { color: #d6c9aa; }

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #FAF6EE;
  border-radius: 10px;
  padding: 1rem 1.25rem;
}
.info-icon {
  font-size: 1.5rem;
  color: #3D1C0E;
  flex-shrink: 0;
}
.info-label {
  font-size: 0.75rem;
  color: #9a8a72;
  margin: 0 0 0.15rem;
  font-weight: 600;
}
.info-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #3D1C0E;
  text-decoration: none;
  margin: 0;
}
a.info-value:hover { color: #6B3A2A; }

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.form-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #F5EDD8;
}
.form-input {
  padding: 0.65rem 0.9rem;
  border: 1px solid rgba(245,237,216,0.3);
  border-radius: 8px;
  background: rgba(245,237,216,0.1);
  color: #F5EDD8;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-input::placeholder { color: rgba(245,237,216,0.45); }
.form-input:focus { border-color: rgba(245,237,216,0.7); }
.form-textarea { resize: vertical; min-height: 110px; }

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .about-grid,
  .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
  .about-deco { display: none; }
}
</style>
