<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
import { usePropertiesStore } from '../../stores/properties.store'
import type { Property } from '../../types/property'

const router = useRouter()
const auth = useAuthStore()
const store = usePropertiesStore()

onMounted(() => store.fetchAll())

/* ── Delete confirmation ── */
const deleteTarget = ref<Property | null>(null)
const deleting = ref(false)

function askDelete(p: Property) {
  deleteTarget.value = p
}
function cancelDelete() {
  deleteTarget.value = null
}
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

/* ── Featured toggle ── */
const togglingId = ref<string | null>(null)
async function toggleFeatured(p: Property) {
  togglingId.value = p.id
  try {
    await store.update(p.id, { isFeatured: !p.isFeatured })
  } finally {
    togglingId.value = null
  }
}

const statusLabel: Record<string, string> = {
  'للبيع': 'badge--sale',
  'للإيجار': 'badge--rent',
  'مباع': 'badge--sold',
}
</script>

<template>
  <div class="db-layout">

    <!-- Top bar -->
    <header class="db-topbar">
      <h1 class="db-brand">لوحة التحكم</h1>
      <div class="db-actions">
        <button class="btn btn--primary" @click="router.push('/dashboard/add')">
          + إضافة عقار
        </button>
        <button class="btn btn--ghost" @click="auth.logout()">
          تسجيل الخروج
        </button>
      </div>
    </header>

    <!-- Main content -->
    <main class="db-main">

      <!-- Loading -->
      <div v-if="store.loading" class="center-spinner">
        <span class="spinner" />
      </div>

      <!-- Empty -->
      <div v-else-if="!store.properties.length" class="empty">
        <p class="empty-text">لا توجد عقارات بعد.</p>
        <button class="btn btn--primary" @click="router.push('/dashboard/add')">
          إضافة أول عقار
        </button>
      </div>

      <!-- Table -->
      <div v-else class="table-wrap">
        <table class="prop-table">
          <thead>
            <tr>
              <th>الصورة</th>
              <th>العنوان</th>
              <th>الحالة</th>
              <th>مميز؟</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in store.properties" :key="p.id">
              <!-- Thumbnail -->
              <td class="td-thumb">
                <img
                  v-if="p.images[0]"
                  :src="p.images[0].url"
                  :alt="p.title"
                  class="thumb"
                />
                <div v-else class="thumb thumb--empty" />
              </td>

              <!-- Title -->
              <td class="td-title">{{ p.title }}</td>

              <!-- Status -->
              <td>
                <span class="badge" :class="statusLabel[p.status]">{{ p.status }}</span>
              </td>

              <!-- Featured toggle -->
              <td class="td-center">
                <button
                  class="toggle"
                  :class="{ 'toggle--on': p.isFeatured }"
                  :disabled="togglingId === p.id"
                  :title="p.isFeatured ? 'إلغاء التمييز' : 'تمييز'"
                  @click="toggleFeatured(p)"
                >
                  <span class="toggle-knob" />
                </button>
              </td>

              <!-- Actions -->
              <td class="td-actions">
                <button
                  class="action-btn action-btn--edit"
                  @click="router.push(`/dashboard/edit/${p.id}`)"
                >
                  تعديل
                </button>
                <button class="action-btn action-btn--del" @click="askDelete(p)">
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Delete confirmation dialog -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="dialog-backdrop" @click.self="cancelDelete">
        <div class="dialog">
          <h3 class="dialog-title">تأكيد الحذف</h3>
          <p class="dialog-body">
            هل أنت متأكد من حذف العقار
            <strong>{{ deleteTarget.title }}</strong>؟
            لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div class="dialog-actions">
            <button class="btn btn--ghost" :disabled="deleting" @click="cancelDelete">
              إلغاء
            </button>
            <button class="btn btn--danger" :disabled="deleting" @click="confirmDelete">
              <span v-if="deleting" class="spinner spinner--sm" />
              <span v-else>حذف</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
/* ── Layout ── */
.db-layout {
  min-height: 100vh;
  background: #FAF6EE;
  font-family: 'Cairo', sans-serif;
  display: flex;
  flex-direction: column;
}

.db-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.9rem 1.75rem;
  background: #F5EDD8;
  border-bottom: 1.5px solid #d6c9aa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.db-brand {
  font-size: 1.2rem;
  font-weight: 800;
  color: #3D1C0E;
  margin: 0;
}

.db-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.db-main {
  padding: 2rem 1.75rem;
  flex: 1;
  overflow-x: auto;
}

/* ── Buttons ── */
.btn {
  padding: 0.5rem 1.1rem;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: background 0.2s, color 0.2s;
}
.btn--primary {
  background: #3D1C0E;
  color: #F5EDD8;
}
.btn--primary:hover { background: #6B3A2A; }
.btn--ghost {
  background: transparent;
  color: #6B3A2A;
  border: 1.5px solid #c9b99a;
}
.btn--ghost:hover { background: #F5EDD8; }
.btn--danger {
  background: #dc2626;
  color: #fff;
  min-width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn--danger:hover:not(:disabled) { background: #b91c1c; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Spinner ── */
.center-spinner {
  display: flex;
  justify-content: center;
  padding: 5rem 0;
}
.spinner {
  display: inline-block;
  width: 36px;
  height: 36px;
  border: 4px solid #e0d5be;
  border-top-color: #3D1C0E;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.spinner--sm {
  width: 18px;
  height: 18px;
  border-width: 3px;
  border-top-color: #fff;
  border-color: rgba(255,255,255,0.35);
  border-top-color: #fff;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Empty ── */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 1rem;
  text-align: center;
}
.empty-text { color: #9a8a72; font-size: 1rem; margin: 0; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }

.prop-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 620px;
  font-size: 0.9rem;
}
.prop-table th,
.prop-table td {
  padding: 0.75rem 1rem;
  text-align: right;
  border-bottom: 1px solid #e0d5be;
}
.prop-table thead tr {
  background: #F5EDD8;
}
.prop-table th {
  font-size: 0.8rem;
  font-weight: 700;
  color: #6B3A2A;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.prop-table tbody tr:hover {
  background: #faf0e0;
}

/* Thumbnail */
.td-thumb { width: 72px; }
.thumb {
  width: 60px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #c9b99a;
  display: block;
}
.thumb--empty {
  background: #e8dfc4;
}

/* Title cell */
.td-title {
  font-weight: 600;
  color: #3D1C0E;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status badge */
.badge {
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}
.badge--sale { background: #3D1C0E; color: #F5EDD8; }
.badge--rent { background: #6B3A2A; color: #F5EDD8; }
.badge--sold { background: #9a8a72; color: #FAF6EE; }

/* Featured toggle switch */
.td-center { text-align: center; }
.toggle {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: #c9b99a;
  transition: background 0.22s;
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
  transition: transform 0.22s;
}
.toggle--on .toggle-knob {
  transform: translateX(-18px);
}

/* Action buttons */
.td-actions {
  white-space: nowrap;
  display: flex;
  gap: 0.4rem;
  align-items: center;
  padding-top: 0.9rem;
}
.action-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: background 0.18s, color 0.18s;
}
.action-btn--edit {
  background: transparent;
  border-color: #c9b99a;
  color: #3D1C0E;
}
.action-btn--edit:hover { background: #F5EDD8; }
.action-btn--del {
  background: transparent;
  border-color: #fca5a5;
  color: #b91c1c;
}
.action-btn--del:hover { background: #fef2f2; }

/* ── Delete dialog ── */
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 8, 3, 0.55);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.dialog {
  background: #FAF6EE;
  border: 1.5px solid #c9b99a;
  border-radius: 14px;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0,0,0,0.25);
}
.dialog-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #3D1C0E;
  margin: 0 0 0.75rem;
}
.dialog-body {
  font-size: 0.92rem;
  color: #4a2515;
  line-height: 1.7;
  margin: 0 0 1.5rem;
}
.dialog-actions {
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
}
</style>
