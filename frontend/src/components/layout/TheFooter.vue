<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <!-- Brand -->
      <div class="footer-brand">
        <p class="footer-name">ALJOUD REAL ESTATE</p>
        <p class="footer-tagline">بيتك المثالي يبدأ هنا</p>
      </div>

      <!-- Contact -->
      <div class="footer-contact">
        <p class="footer-section-title">تواصل معنا</p>
        <a href="tel:0949039780" class="footer-link">0949039780</a>
        <a href="tel:0981689250" class="footer-link">0981689250</a>
      </div>

      <!-- Location -->
      <div class="footer-location">
        <p class="footer-section-title">موقعنا</p>
        <p class="footer-text">الخالدية - حمص - سوريا</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {{ year }} الجود للعقارات. جميع الحقوق محفوظة.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #3D1C0E;
  color: #F5EDD8;
  font-family: 'Cairo', sans-serif;
  margin-top: auto;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
}

.footer-name {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  margin: 0 0 0.35rem;
}
.footer-tagline {
  font-size: 0.9rem;
  color: #d6c9aa;
  margin: 0;
}

.footer-section-title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #d6c9aa;
  margin: 0 0 0.6rem;
  text-transform: uppercase;
}

.footer-link {
  display: block;
  color: #F5EDD8;
  text-decoration: none;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  transition: color 0.2s;
}
.footer-link:hover {
  color: #fff;
}

.footer-text {
  font-size: 0.95rem;
  margin: 0;
}

.footer-bottom {
  border-top: 1px solid rgba(245, 237, 216, 0.15);
  text-align: center;
  padding: 1rem 1.5rem;
  font-size: 0.82rem;
  color: #b8a98a;
}
</style>
