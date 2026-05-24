<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth.store'
import { usePropertiesStore } from '../../stores/properties.store'
import type { Property } from '../../types/property'

const router = useRouter()
const auth = useAuthStore()
const store = usePropertiesStore()

onMounted(() => store.fetchAll())

const deleteTarget = ref<Property | null>(null)
const deleting = ref(false)

function askDelete(p: Property) { deleteTarget.value = p }
function cancelDelete() { deleteTarget.value = null }

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await store.remove(deleteTarget.value.id)
  } finally {
    deleting.value = false
    deleteTarget.value = null
  }
}

const togglingId = ref<string | null>(null)
async function toggleFeatured(p: Property) {
  togglingId.value = p.id
  try {
    await store.update(p.id, { isFeatured: !p.isFeatured })
  } finally {
    togglingId.value = null
  }
}

const statusConfig: Record<string, { cls: string; icon: string }> = {
  'للبيع':   { cls: 'badge--sale', icon: 'mdi:tag' },
  'للإيجار': { cls: 'badge--rent', icon: 'mdi:key' },
  'مباع':    { cls: 'badge--sold', icon: 'mdi:check-circle' },
}
</script>

<template>
  <div class="db-layout">

    <!-- Sidebar -->
    <aside class="db-sidebar">
      <div class="sidebar-logo">
        <img src="/logo.png" alt="الجود" class="sidebar-logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
        <div class="sidebar-logo-fallback">
          <span class="sl-main">ALJOUD</span>
          <span class="sl-sub">REAL ESTATE</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-item sidebar-item--active">
          <Icon icon="mdi:view-grid" class="sidebar-icon" />
          <span>العقارات</span>
        </div>
        <button class="sidebar-item sidebar-item--logout" @click="router.push('/')">
          <Icon icon="mdi:home-outline" class="sidebar-icon" />
          <span>الموقع</span>
        </button>
      </nav>

      <button class="sidebar-logout" @click="auth.logout()">
        <Icon icon="mdi:logout" class="sidebar-icon" />
        <span>تسجيل الخروج</span>
      </button>
    </aside>

    <!-- Main -->
    <div class="db-main">

      <!-- Top bar -->
      <header class="db-topbar">
        <div class="topbar-right">
          <h1 class="db-heading">لوحة التحكم</h1>
          <p class="db-subheading">إدارة عقارات الجود</p>
        </div>
        <button class="btn-add" @click="router.push('/dashboard/add')">
          <Icon icon="mdi:plus" class="btn-add-icon" />
          إضافة عقار
        </button>
      </header>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-wrap--total">
            <Icon icon="mdi:home-city" />
          </div>
          <div>
            <p class="stat-val">{{ store.properties.length }}</p>
            <p class="stat-lbl">إجمالي العقارات</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-wrap--sale">
            <Icon icon="mdi:tag" />
          </div>
          <div>
            <p class="stat-val">{{ store.properties.filter(p => p.status === 'للبيع').length }}</p>
            <p class="stat-lbl">للبيع</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-wrap--rent">
            <Icon icon="mdi:key" />
          </div>
          <div>
            <p class="stat-val">{{ store.properties.filter(p => p.status === 'للإيجار').length }}</p>
            <p class="stat-lbl">للإيجار</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-wrap--featured">
            <Icon icon="mdi:star" />
          </div>
          <div>
            <p class="stat-val">{{ store.properties.filter(p => p.isFeatured).length }}</p>
            <p class="stat-lbl">مميزة</p>
          </div>
        </div>
      </div>

      <!-- Content area -->
      <div class="content-card">
        <div class="content-header">
          <h2 class="content-title">قائمة العقارات</h2>
          <span class="content-count">{{ store.properties.length }} عقار</span>
        </div>

        <!-- Loading -->
        <div v-if="store.loading" class="center-spinner">
          <span class="spinner" />
        </div>

        <!-- Empty -->
        <div v-else-if="!store.properties.length" class="empty">
          <Icon icon="mdi:home-plus-outline" class="empty-icon" />
          <p class="empty-title">لا توجد عقارات بعد</p>
          <p class="empty-sub">ابدأ بإضافة أول عقار</p>
          <button class="btn-add" @click="router.push('/dashboard/add')">
            <Icon icon="mdi:plus" class="btn-add-icon" />
            إضافة عقار
          </button>
        </div>

        <!-- Table -->
        <div v-else class="table-wrap">
          <table class="prop-table">
            <thead>
              <tr>
                <th>العقار</th>
                <th>الحالة</th>
                <th>السعر</th>
                <th class="th-center">مميز</th>
                <th class="th-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in store.properties" :key="p.id" class="table-row">
                <!-- Property info -->
                <td class="td-property">
                  <div class="prop-info">
                    <img
                      v-if="p.images[0]"
                      :src="p.images[0].url"
                      :alt="p.title"
                      class="thumb"
                    />
                    <div v-else class="thumb thumb--empty">
                      <Icon icon="mdi:home-outline" />
                    </div>
                    <div class="prop-text">
                      <p class="prop-title">{{ p.title }}</p>
                      <p class="prop-loc">
                        <Icon icon="mdi:map-marker" />
                        {{ p.location }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td>
                  <span class="badge" :class="statusConfig[p.status]?.cls">
                    <Icon :icon="statusConfig[p.status]?.icon || 'mdi:tag'" class="badge-icon" />
                    {{ p.status }}
                  </span>
                </td>

                <!-- Price -->
                <td class="td-price">
                  {{ p.price ? new Intl.NumberFormat('ar-SY').format(p.price) + ' ل.س' : '—' }}
                </td>

                <!-- Featured toggle -->
                <td class="td-center">
                  <button
                    class="toggle"
                    :class="{ 'toggle--on': p.isFeatured }"
                    :disabled="togglingId === p.id"
                    @click="toggleFeatured(p)"
                  >
                    <span class="toggle-knob" />
                  </button>
                </td>

                <!-- Actions -->
                <td class="td-center">
                  <div class="action-btns">
                    <button
                      class="action-btn action-btn--edit"
                      title="تعديل"
                      @click="router.push(`/dashboard/edit/${p.id}`)"
                    >
                      <Icon icon="mdi:pencil" />
                    </button>
                    <button
                      class="action-btn action-btn--del"
                      title="حذف"
                      @click="askDelete(p)"
                    >
                      <Icon icon="mdi:trash-can-outline" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete dialog -->
    <Teleport to="body">
      <Transition name="dialog">
        <div v-if="deleteTarget" class="dialog-backdrop" @click.self="cancelDelete">
          <div class="dialog">
            <div class="dialog-icon-wrap">
              <Icon icon="mdi:alert-circle" class="dialog-icon" />
            </div>
            <h3 class="dialog-title">تأكيد الحذف</h3>
            <p class="dialog-body">
              هل أنت متأكد من حذف العقار
              <strong>« {{ deleteTarget.title }} »</strong>؟
              لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div class="dialog-actions">
              <button class="dlg-btn dlg-btn--cancel" :disabled="deleting" @click="cancelDelete">
                إلغاء
              </button>
              <button class="dlg-btn dlg-btn--del" :disabled="deleting" @click="confirmDelete">
                <span v-if="deleting" class="spinner spinner--sm" />
                <span v-else>
                  <Icon icon="mdi:trash-can-outline" />
                  حذف
                </span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
/* ── Layout ── */
.db-layout {
  min-height: 100vh;
  background: #F4EFE6;
  font-family: 'Cairo', sans-serif;
  display: flex;
  direction: rtl;
}

/* ── Sidebar ── */
.db-sidebar {
  width: 220px;
  min-height: 100vh;
  background: #2C1208;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(245,237,216,0.1);
  margin-bottom: 1.25rem;
}
.sidebar-logo-img {
  height: 52px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1) opacity(0.9);
}
.sidebar-logo-fallback {
  display: none;
  flex-direction: column;
  align-items: center;
}
.sl-main { font-size: 1.1rem; font-weight: 800; color: #F5EDD8; letter-spacing: 0.08em; }
.sl-sub  { font-size: 0.52rem; font-weight: 600; letter-spacing: 0.2em; color: #9a8a72; }

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.75rem;
  flex: 1;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(245,237,216,0.65);
  cursor: pointer;
  border: none;
  background: transparent;
  font-family: 'Cairo', sans-serif;
  text-align: right;
  width: 100%;
  transition: background 0.2s, color 0.2s;
}
.sidebar-item:hover { background: rgba(245,237,216,0.08); color: #F5EDD8; }
.sidebar-item--active {
  background: rgba(245,237,216,0.12);
  color: #F5EDD8;
}
.sidebar-icon { font-size: 1.15rem; }

.sidebar-logout {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(245,237,216,0.5);
  cursor: pointer;
  border: none;
  background: transparent;
  font-family: 'Cairo', sans-serif;
  transition: color 0.2s;
  border-top: 1px solid rgba(245,237,216,0.08);
  margin-top: auto;
}
.sidebar-logout:hover { color: #fca5a5; }

/* ── Main ── */
.db-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  min-width: 0;
}

.db-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: #fff;
  border-bottom: 1px solid #e8dfc4;
}

.db-heading {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2C1208;
  margin: 0;
  line-height: 1.2;
}
.db-subheading {
  font-size: 0.82rem;
  color: #9a8a72;
  margin: 0;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.4rem;
  background: #3D1C0E;
  color: #F5EDD8;
  border: none;
  border-radius: 10px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 4px 12px rgba(61,28,14,0.25);
}
.btn-add:hover { background: #5a2a18; transform: translateY(-1px); }
.btn-add-icon { font-size: 1.1rem; }

/* ── Stats ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.5rem 2rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #ede4d0;
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.stat-icon-wrap--total    { background: rgba(61,28,14,0.1);  color: #3D1C0E; }
.stat-icon-wrap--sale     { background: rgba(16,185,129,0.1); color: #059669; }
.stat-icon-wrap--rent     { background: rgba(59,130,246,0.1); color: #2563eb; }
.stat-icon-wrap--featured { background: rgba(212,160,40,0.12); color: #b7820e; }

.stat-val {
  font-size: 1.6rem;
  font-weight: 800;
  color: #2C1208;
  margin: 0;
  line-height: 1;
}
.stat-lbl {
  font-size: 0.78rem;
  color: #9a8a72;
  margin: 0.1rem 0 0;
  font-weight: 600;
}

/* ── Content card ── */
.content-card {
  margin: 0 2rem 2rem;
  background: #fff;
  border: 1px solid #ede4d0;
  border-radius: 16px;
  overflow: hidden;
  flex: 1;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0e8d8;
}
.content-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2C1208;
  margin: 0;
}
.content-count {
  font-size: 0.8rem;
  color: #9a8a72;
  background: #f4efe6;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-weight: 600;
}

/* Spinner */
.center-spinner {
  display: flex;
  justify-content: center;
  padding: 5rem;
}
.spinner {
  display: inline-block;
  width: 36px;
  height: 36px;
  border: 3px solid #e0d5be;
  border-top-color: #3D1C0E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.spinner--sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
  border-color: rgba(255,255,255,0.3);
  border-top-color: #fff;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Empty */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 5rem 1rem;
  text-align: center;
}
.empty-icon { font-size: 3.5rem; color: #d6c9aa; }
.empty-title { font-size: 1.1rem; font-weight: 700; color: #3D1C0E; margin: 0; }
.empty-sub   { font-size: 0.88rem; color: #9a8a72; margin: 0; }

/* Table */
.table-wrap { overflow-x: auto; }
.prop-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;
  font-size: 0.88rem;
}
.prop-table th,
.prop-table td {
  padding: 0.85rem 1.25rem;
  text-align: right;
  border-bottom: 1px solid #f0e8d8;
}
.prop-table thead tr { background: #fdfaf4; }
.prop-table th {
  font-size: 0.76rem;
  font-weight: 700;
  color: #9a8a72;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.th-center { text-align: center; }
.table-row:last-child td { border-bottom: none; }
.table-row:hover { background: #fdfaf4; }

/* Property info cell */
.td-property { min-width: 260px; }
.prop-info { display: flex; align-items: center; gap: 0.85rem; }
.thumb {
  width: 52px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e0d5be;
  flex-shrink: 0;
  display: block;
}
.thumb--empty {
  background: #f0e8d8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9b99a;
  font-size: 1.2rem;
}
.prop-title { font-size: 0.9rem; font-weight: 700; color: #2C1208; margin: 0 0 0.2rem; }
.prop-loc {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.76rem;
  color: #9a8a72;
  margin: 0;
}

/* Status badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}
.badge-icon { font-size: 0.85rem; }
.badge--sale { background: #dcfce7; color: #166534; }
.badge--rent { background: #dbeafe; color: #1e40af; }
.badge--sold { background: #f3f4f6; color: #6b7280; }

/* Price cell */
.td-price { font-weight: 700; color: #3D1C0E; white-space: nowrap; }

/* Toggle */
.td-center { text-align: center; }
.toggle {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: #d1d5db;
  transition: background 0.25s;
  padding: 0;
}
.toggle--on { background: #3D1C0E; }
.toggle:disabled { opacity: 0.5; cursor: not-allowed; }
.toggle-knob {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.25s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.toggle--on .toggle-knob { transform: translateX(-18px); }

/* Action buttons */
.action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}
.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1.5px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.18s;
}
.action-btn--edit {
  background: transparent;
  border-color: #c9b99a;
  color: #6B3A2A;
}
.action-btn--edit:hover { background: #fdf4e0; border-color: #6B3A2A; }
.action-btn--del {
  background: transparent;
  border-color: #fca5a5;
  color: #b91c1c;
}
.action-btn--del:hover { background: #fef2f2; border-color: #b91c1c; }

/* ── Dialog ── */
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10,4,2,0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.dialog {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 24px 60px rgba(0,0,0,0.3);
  text-align: center;
}
.dialog-icon-wrap {
  width: 56px;
  height: 56px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}
.dialog-icon { font-size: 1.75rem; color: #dc2626; }
.dialog-title { font-size: 1.1rem; font-weight: 800; color: #2C1208; margin: 0 0 0.75rem; }
.dialog-body { font-size: 0.9rem; color: #6B3A2A; line-height: 1.7; margin: 0 0 1.75rem; }
.dialog-actions { display: flex; gap: 0.75rem; }
.dlg-btn {
  flex: 1;
  padding: 0.7rem;
  border-radius: 10px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}
.dlg-btn--cancel { background: #f4efe6; color: #3D1C0E; border-color: #e0d5be; }
.dlg-btn--cancel:hover { background: #ede4d0; }
.dlg-btn--del { background: #dc2626; color: #fff; }
.dlg-btn--del:hover:not(:disabled) { background: #b91c1c; }
.dlg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Dialog transition */
.dialog-enter-active, .dialog-leave-active { transition: opacity 0.2s, transform 0.2s; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; transform: scale(0.95); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .db-sidebar { display: none; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .db-topbar { padding: 1rem 1.25rem; }
  .content-card { margin: 0 1.25rem 1.25rem; }
}
@media (max-width: 600px) {
  .stats-row { padding: 1rem 1.25rem; gap: 0.75rem; }
}
</style>
