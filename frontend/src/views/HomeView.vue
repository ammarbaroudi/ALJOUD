<script setup lang="ts">
import { ref, reactive, Suspense } from 'vue'
import { useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'
import { Icon } from '@iconify/vue'
import SectionTitle from '../components/ui/SectionTitle.vue'
import FeaturedProperties from '../components/home/FeaturedProperties.vue'

const router = useRouter()

function scrollToContact() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

const aboutSection = ref<HTMLElement | null>(null)
useMotion(aboutSection, {
  initial: { opacity: 0, y: 50 },
  visibleOnce: { opacity: 1, y: 0, transition: { duration: 700 } },
})

const contactCards = ref<HTMLElement | null>(null)
useMotion(contactCards, {
  initial: { opacity: 0, x: 50 },
  visibleOnce: { opacity: 1, x: 0, transition: { duration: 600, delay: 100 } },
})

const contactForm = ref<HTMLElement | null>(null)
useMotion(contactForm, {
  initial: { opacity: 0, x: -50 },
  visibleOnce: { opacity: 1, x: 0, transition: { duration: 600, delay: 200 } },
})

const form = reactive({ name: '', phone: '', message: '' })
function submitForm() {
  form.name = ''
  form.phone = ''
  form.message = ''
}
</script>

<template>
  <div class="home">

    <!-- ══════════════════ HERO ══════════════════ -->
    <section class="hero">
      <div class="hero-bg-pattern" aria-hidden="true" />

      <div class="hero-content">
        <!-- Logo mark -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.8 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
          class="hero-logo-wrap"
        >
          <img src="/logo.png" alt="الجود" class="hero-logo" onerror="this.style.display='none'" />
        </div>

        <h1
          v-motion
          :initial="{ opacity: 0, y: -30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 150 } }"
          class="hero-title"
        >
          الجـود للعقارات
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 300 } }"
          class="hero-sub"
        >
          نجد لك البيت الذي تحلم به في قلب حمص
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 480 } }"
          class="hero-actions"
        >
          <button class="btn btn--primary" @click="router.push('/properties')">
            <Icon icon="mdi:home-search" class="btn-icon" />
            تصفح العقارات
          </button>
          <button class="btn btn--outline" @click="scrollToContact">
            <Icon icon="mdi:phone-outline" class="btn-icon" />
            تواصل معنا
          </button>
        </div>

        <!-- Stats strip -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 650 } }"
          class="hero-stats"
        >
          <div class="hstat">
            <span class="hstat-num">+50</span>
            <span class="hstat-lbl">عقار متاح</span>
          </div>
          <div class="hstat-divider" />
          <div class="hstat">
            <span class="hstat-num">+5</span>
            <span class="hstat-lbl">سنوات خبرة</span>
          </div>
          <div class="hstat-divider" />
          <div class="hstat">
            <span class="hstat-num">+100</span>
            <span class="hstat-lbl">عميل سعيد</span>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-hint" aria-hidden="true">
        <span class="scroll-dot" />
      </div>
    </section>

    <!-- ══════════════════ FEATURED ══════════════════ -->
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
            عرض جميع العقارات
            <Icon icon="mdi:arrow-left" class="btn-icon btn-icon--end" />
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════ ABOUT ══════════════════ -->
    <section id="about" class="section section--cream">
      <div class="container">
        <div ref="aboutSection" class="about-grid">
          <div class="about-text">
            <div class="about-tag">من نحن</div>
            <h2 class="about-title">شركة الجود للعقارات</h2>
            <div class="about-divider" />
            <p class="about-body">
              متخصصون في بيع وتأجير العقارات في حمص منذ أكثر من 5 سنوات.
              نسعى لتقديم أفضل الخيارات لعملائنا بخبرة عالية وأمانة تامة،
              لأن بيتك يستحق الأفضل.
            </p>

            <div class="about-features">
              <div class="feat-item">
                <Icon icon="mdi:shield-check" class="feat-icon" />
                <span>موثوقية وشفافية تامة</span>
              </div>
              <div class="feat-item">
                <Icon icon="mdi:handshake" class="feat-icon" />
                <span>خدمة عملاء متميزة</span>
              </div>
              <div class="feat-item">
                <Icon icon="mdi:map-marker-check" class="feat-icon" />
                <span>أفضل مواقع في حمص</span>
              </div>
            </div>
          </div>

          <div class="about-visual" aria-hidden="true">
            <div class="visual-card visual-card--back" />
            <div class="visual-card visual-card--front">
              <img src="/logo.png" alt="" class="visual-logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="visual-logo-fallback">
                <span class="vl-main">ALJOUD</span>
                <span class="vl-sub">REAL ESTATE</span>
              </div>
              <div class="visual-stats">
                <div class="vstat">
                  <span class="vstat-n">+50</span>
                  <span class="vstat-l">عقار</span>
                </div>
                <div class="vstat">
                  <span class="vstat-n">+5</span>
                  <span class="vstat-l">سنوات</span>
                </div>
                <div class="vstat">
                  <span class="vstat-n">+100</span>
                  <span class="vstat-l">عميل</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════ CONTACT ══════════════════ -->
    <section id="contact" class="section section--dark">
      <div class="container">
        <SectionTitle
          title="تواصل معنا"
          subtitle="نحن هنا للإجابة على جميع استفساراتك"
        />

        <div class="contact-grid">
          <div ref="contactCards" class="contact-info">
            <a href="tel:0949039780" class="info-card">
              <div class="info-icon-wrap">
                <Icon icon="mdi:phone" class="info-icon" />
              </div>
              <div>
                <p class="info-label">اتصل بنا</p>
                <p class="info-value">0949039780</p>
              </div>
              <Icon icon="mdi:arrow-left" class="info-arrow" />
            </a>
            <a href="tel:0981689250" class="info-card">
              <div class="info-icon-wrap">
                <Icon icon="mdi:phone" class="info-icon" />
              </div>
              <div>
                <p class="info-label">اتصل بنا</p>
                <p class="info-value">0981689250</p>
              </div>
              <Icon icon="mdi:arrow-left" class="info-arrow" />
            </a>
            <div class="info-card info-card--loc">
              <div class="info-icon-wrap">
                <Icon icon="mdi:map-marker" class="info-icon" />
              </div>
              <div>
                <p class="info-label">موقعنا</p>
                <p class="info-value">الخالدية - حمص - سوريا</p>
              </div>
            </div>
          </div>

          <form ref="contactForm" class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label class="form-label">الاسم الكامل</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="أدخل اسمك" required />
            </div>
            <div class="form-group">
              <label class="form-label">رقم الهاتف</label>
              <input v-model="form.phone" type="tel" class="form-input" placeholder="أدخل رقم هاتفك" required />
            </div>
            <div class="form-group">
              <label class="form-label">رسالتك</label>
              <textarea
                v-model="form.message"
                class="form-input form-textarea"
                placeholder="كيف يمكننا مساعدتك؟"
                rows="4"
                required
              />
            </div>
            <button type="submit" class="btn-submit">
              <Icon icon="mdi:send" class="btn-icon" />
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home {
  padding-top: 72px;
  font-family: 'Cairo', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section { padding: 5rem 0; }
.section--light { background: #FDFAF4; }
.section--cream { background: #F5EDD8; }
.section--dark  { background: #2C1208; }

.section-footer {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2.2rem;
  border-radius: 12px;
  font-family: 'Cairo', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.25s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn--primary {
  background: #3D1C0E;
  color: #F5EDD8;
  border-color: #3D1C0E;
  box-shadow: 0 4px 16px rgba(61,28,14,0.25);
}
.btn--primary:hover {
  background: #5a2a18;
  border-color: #5a2a18;
  box-shadow: 0 8px 24px rgba(61,28,14,0.35);
}
.btn--outline {
  background: transparent;
  color: #3D1C0E;
  border-color: #3D1C0E;
}
.btn--outline:hover { background: #3D1C0E; color: #F5EDD8; }

.btn-icon { font-size: 1.1rem; }
.btn-icon--end { margin-right: 0.25rem; }

/* ── Hero ── */
.hero {
  position: relative;
  min-height: calc(100vh - 72px);
  background: linear-gradient(145deg, #F5EDD8 0%, #EDE0C4 40%, #E8D5B0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 4rem 1.5rem 6rem;
}

.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 15% 50%, rgba(107,58,42,0.12) 0%, transparent 50%),
    radial-gradient(circle at 85% 20%, rgba(61,28,14,0.08) 0%, transparent 45%),
    radial-gradient(circle at 50% 90%, rgba(107,58,42,0.06) 0%, transparent 40%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 720px;
  width: 100%;
}

.hero-logo-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.hero-logo {
  height: 90px;
  width: auto;
  filter: drop-shadow(0 4px 16px rgba(61,28,14,0.15));
}

.hero-title {
  font-size: clamp(2.6rem, 6vw, 4.2rem);
  font-weight: 800;
  color: #2C1208;
  margin: 0 0 1rem;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(61,28,14,0.1);
}

.hero-sub {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #6B3A2A;
  margin: 0 0 2.5rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(61,28,14,0.12);
  border-radius: 16px;
  padding: 1.25rem 2rem;
  max-width: 420px;
  margin: 0 auto;
}

.hstat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  flex: 1;
}
.hstat-num {
  font-size: 1.6rem;
  font-weight: 800;
  color: #3D1C0E;
  line-height: 1;
}
.hstat-lbl {
  font-size: 0.78rem;
  color: #6B3A2A;
  font-weight: 600;
}
.hstat-divider {
  width: 1px;
  height: 36px;
  background: rgba(61,28,14,0.2);
  flex-shrink: 0;
}

.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.scroll-dot {
  width: 6px;
  height: 6px;
  background: #6B3A2A;
  border-radius: 50%;
  animation: scroll-bounce 1.8s ease-in-out infinite;
}
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(8px); opacity: 0.4; }
}

/* ── Skeleton ── */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.skeleton-card {
  height: 340px;
  border-radius: 16px;
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

/* ── About ── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.about-tag {
  display: inline-block;
  background: rgba(61,28,14,0.1);
  color: #3D1C0E;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 1rem;
  border-radius: 999px;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
}

.about-title {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
  color: #2C1208;
  margin: 0 0 0.6rem;
}
.about-divider {
  width: 50px;
  height: 4px;
  background: linear-gradient(90deg, #3D1C0E, #6B3A2A);
  border-radius: 2px;
  margin-bottom: 1.5rem;
}
.about-body {
  font-size: 1rem;
  color: #4a2515;
  line-height: 2;
  margin: 0 0 2rem;
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.feat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #3D1C0E;
}
.feat-icon {
  font-size: 1.25rem;
  color: #6B3A2A;
  flex-shrink: 0;
}

/* Visual card */
.about-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
}
.visual-card {
  position: absolute;
  border-radius: 20px;
}
.visual-card--back {
  width: 240px;
  height: 280px;
  background: rgba(61,28,14,0.12);
  transform: rotate(6deg) translate(12px, 12px);
}
.visual-card--front {
  width: 240px;
  height: 280px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(61,28,14,0.2);
  transform: rotate(-2deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 1.5rem;
}
.visual-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
}
.visual-logo-fallback {
  display: none;
  flex-direction: column;
  align-items: center;
}
.vl-main { font-size: 1.6rem; font-weight: 800; color: #3D1C0E; letter-spacing: 0.08em; }
.vl-sub  { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.2em; color: #6B3A2A; }

.visual-stats {
  display: flex;
  gap: 1.25rem;
  border-top: 1px solid #e8dfc4;
  padding-top: 1rem;
  width: 100%;
  justify-content: center;
}
.vstat { text-align: center; }
.vstat-n { display: block; font-size: 1.2rem; font-weight: 800; color: #3D1C0E; }
.vstat-l { display: block; font-size: 0.7rem; color: #6B3A2A; font-weight: 600; }

/* ── Contact ── */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 3rem;
  align-items: start;
}

.section--dark :deep(.title) { color: #F5EDD8; }
.section--dark :deep(.underline) { background: linear-gradient(90deg, #c9b99a, #8a6a4a); }
.section--dark :deep(.subtitle) { color: #c9b99a; }

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(245,237,216,0.08);
  border: 1px solid rgba(245,237,216,0.15);
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
a.info-card:hover {
  background: rgba(245,237,216,0.14);
  border-color: rgba(245,237,216,0.3);
  transform: translateX(-4px);
}

.info-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(245,237,216,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.info-icon { font-size: 1.25rem; color: #F5EDD8; }

.info-label {
  font-size: 0.72rem;
  color: #9a8a72;
  margin: 0 0 0.15rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.info-value {
  font-size: 1rem;
  font-weight: 700;
  color: #F5EDD8;
  margin: 0;
}

.info-arrow {
  font-size: 1.1rem;
  color: #9a8a72;
  margin-right: auto;
  transition: transform 0.2s;
}
a.info-card:hover .info-arrow { transform: translateX(-4px); }

/* Contact form */
.contact-form {
  background: rgba(245,237,216,0.06);
  border: 1px solid rgba(245,237,216,0.12);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #d6c9aa;
}
.form-input {
  padding: 0.75rem 1rem;
  border: 1.5px solid rgba(245,237,216,0.2);
  border-radius: 10px;
  background: rgba(245,237,216,0.08);
  color: #F5EDD8;
  font-family: 'Cairo', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.form-input::placeholder { color: rgba(245,237,216,0.35); }
.form-input:focus {
  border-color: rgba(245,237,216,0.5);
  background: rgba(245,237,216,0.12);
}
.form-textarea { resize: vertical; min-height: 120px; }

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #F5EDD8, #e8d5b0);
  color: #2C1208;
  border: none;
  border-radius: 12px;
  font-family: 'Cairo', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .about-visual { display: none; }
  .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
}
@media (max-width: 600px) {
  .hero-stats { padding: 1rem 1.25rem; }
  .hstat-num { font-size: 1.3rem; }
}
</style>
