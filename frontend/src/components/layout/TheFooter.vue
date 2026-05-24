<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">

        <!-- Brand -->
        <div class="footer-brand">
          <div class="brand-logo">
            <img src="/logo.png" alt="الجود للعقارات" class="brand-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
            <div class="brand-img-fallback">
              <span class="brand-main">ALJOUD</span>
              <span class="brand-sub">REAL ESTATE</span>
            </div>
          </div>
          <p class="brand-desc">
            متخصصون في بيع وتأجير العقارات في حمص — نسعى دائماً لإيجاد أفضل الخيارات لعملائنا.
          </p>
        </div>

        <!-- Links -->
        <div class="footer-col">
          <h4 class="footer-heading">روابط سريعة</h4>
          <ul class="footer-links">
            <li><a href="/" class="footer-link"><Icon icon="mdi:chevron-left" class="link-arrow" />الرئيسية</a></li>
            <li><a href="/properties" class="footer-link"><Icon icon="mdi:chevron-left" class="link-arrow" />العقارات</a></li>
            <li><a href="/#about" class="footer-link"><Icon icon="mdi:chevron-left" class="link-arrow" />من نحن</a></li>
            <li><a href="/#contact" class="footer-link"><Icon icon="mdi:chevron-left" class="link-arrow" />تواصل معنا</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-col">
          <h4 class="footer-heading">تواصل معنا</h4>
          <ul class="footer-contact-list">
            <li class="contact-item">
              <Icon icon="mdi:phone" class="contact-icon" />
              <a href="tel:0949039780" class="footer-link">0949039780</a>
            </li>
            <li class="contact-item">
              <Icon icon="mdi:phone" class="contact-icon" />
              <a href="tel:0981689250" class="footer-link">0981689250</a>
            </li>
            <li class="contact-item">
              <Icon icon="mdi:map-marker" class="contact-icon" />
              <span class="footer-text">الخالدية - حمص - سوريا</span>
            </li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <p class="copyright">© {{ new Date().getFullYear() }} الجود للعقارات — جميع الحقوق محفوظة</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #2C1208;
  font-family: 'Cairo', sans-serif;
  color: #d6c9aa;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(245,237,216,0.1);
}

.footer-brand {}
.brand-logo {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.brand-img {
  height: 52px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1) opacity(0.85);
}
.brand-img-fallback {
  display: none;
  flex-direction: column;
}
.brand-main { font-size: 1.2rem; font-weight: 800; color: #F5EDD8; letter-spacing: 0.08em; }
.brand-sub  { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.2em; color: #9a8a72; }

.brand-desc {
  font-size: 0.88rem;
  color: rgba(214,201,170,0.75);
  line-height: 1.8;
  margin: 0;
  max-width: 300px;
}

.footer-heading {
  font-size: 0.8rem;
  font-weight: 700;
  color: #F5EDD8;
  margin: 0 0 1.1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.footer-links,
.footer-contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.88rem;
  color: rgba(214,201,170,0.75);
  text-decoration: none;
  transition: color 0.2s, gap 0.2s;
}
.footer-link:hover { color: #F5EDD8; gap: 0.5rem; }
.link-arrow { font-size: 0.9rem; flex-shrink: 0; }

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.contact-icon { font-size: 1rem; color: #9a8a72; flex-shrink: 0; }
.footer-text { font-size: 0.88rem; color: rgba(214,201,170,0.75); }

.footer-bottom {
  padding: 1.5rem 0;
  text-align: center;
}
.copyright {
  font-size: 0.8rem;
  color: rgba(214,201,170,0.45);
  margin: 0;
}

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
  .footer-brand { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
