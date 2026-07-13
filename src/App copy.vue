

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Plane,
  Bell,
  Sparkles,
  Mail,
  ShieldCheck,
  Clock3,
  Target,
  ArrowRight,
} from 'lucide-vue-next'

const STORAGE_KEY = 'saveflow_watch_requests'

const form = ref({
  origin: 'TPE',
  destination: 'NRT',
  travelMonth: '2026-10',
  stayDays: 5,
  targetPrice: 9000,
  email: '',
})

const requests = ref([])
const submitted = ref(false)

const airports = [
  { label: '台北 TPE', value: 'TPE' },
  { label: '東京成田 NRT', value: 'NRT' },
  { label: '東京羽田 HND', value: 'HND' },
  { label: '大阪關西 KIX', value: 'KIX' },
  { label: '福岡 FUK', value: 'FUK' },
  { label: '沖繩 OKA', value: 'OKA' },
]

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  requests.value = saved ? JSON.parse(saved) : []
})

const save = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests.value))
}

const createWatch = () => {
  if (!form.value.email) {
    alert('請先輸入 Email。')
    return
  }

  if (form.value.origin === form.value.destination) {
    alert('出發地和目的地不能相同。')
    return
  }

  requests.value.unshift({
    id: crypto.randomUUID(),
    ...form.value,
    stayDays: Number(form.value.stayDays),
    targetPrice: Number(form.value.targetPrice),
    status: 'submitted',
    createdAt: new Date().toISOString(),
  })

  save()
  submitted.value = true
}

const requestCount = computed(() => requests.value.length)

const formatMoney = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(value)
}

const formatMonth = (value) => {
  if (!value) return ''
  const [year, month] = value.split('-')
  return `${year} 年 ${Number(month)} 月`
}
</script>

<template>
  <main class="page">
    <nav class="nav">
      <div class="brand">
        <div class="logo">
          <Plane :size="20" />
        </div>

        <div>
          <strong>SaveFlow</strong>
          <span>機票價格監控</span>
        </div>
      </div>

      <a href="#watch" class="nav-link">開始監控</a>
    </nav>

    <section class="hero">
      <div class="badge">
        <Sparkles :size="14" />
        台灣 → 日本 beta
      </div>

      <h1>
        不用每天手動查機票。
      </h1>

      <p>
        建立一次機票監控，SaveFlow 會在背景幫你追蹤價格，
        當票價低於你的目標價時，再寄 Email 通知你。
      </p>

      <div class="hero-actions">
        <a href="#watch" class="primary-link">
          建立監控
          <ArrowRight :size="16" />
        </a>

        <span>Beta 期間免費使用</span>
      </div>
    </section>

    <section class="trust-row">
      <div>
        <strong>{{ requestCount }}</strong>
        <span>已建立的監控需求</span>
      </div>

      <div>
        <strong>台灣 → 日本</strong>
        <span>第一版專注熱門航線</span>
      </div>

      <div>
        <strong>Email</strong>
        <span>只有達標時才通知</span>
      </div>
    </section>

    <section id="watch" class="watch-section">
      <div class="form-card">
        <div class="card-head">
          <h2>建立機票監控</h2>
          <p>告訴 SaveFlow 什麼價格值得通知你。</p>
        </div>

        <div v-if="!submitted" class="form-grid">
          <label>
            出發地
            <select v-model="form.origin">
              <option v-for="airport in airports" :key="airport.value" :value="airport.value">
                {{ airport.label }}
              </option>
            </select>
          </label>

          <label>
            目的地
            <select v-model="form.destination">
              <option v-for="airport in airports" :key="airport.value" :value="airport.value">
                {{ airport.label }}
              </option>
            </select>
          </label>

          <label>
            出發月份
            <input v-model="form.travelMonth" type="month" />
          </label>

          <label>
            停留天數
            <input v-model="form.stayDays" type="number" min="1" />
          </label>

          <label>
            目標價格
            <input v-model="form.targetPrice" type="number" min="0" />
          </label>

          <label>
            Email
            <input v-model="form.email" type="email" placeholder="you@example.com" />
          </label>

          <button class="primary-btn" @click="createWatch">
            <Bell :size="18" />
            開始監控
          </button>
        </div>

        <div v-else class="success-card">
          <div class="success-icon">
            <ShieldCheck :size="26" />
          </div>

          <h3>已建立監控。</h3>

          <p>
            我們會開始追蹤
            <strong>{{ form.origin }} → {{ form.destination }}</strong>
            在
            <strong>{{ formatMonth(form.travelMonth) }}</strong>
            的機票，當票價低於
            <strong>{{ formatMoney(form.targetPrice) }}</strong>
            時寄 Email 通知你。
          </p>

          <button class="secondary-btn" @click="submitted = false">
            建立另一個監控
          </button>
        </div>
      </div>
    </section>

    <section class="how">
      <div class="how-card">
        <div class="step-icon">
          <Target :size="20" />
        </div>
        <h3>1. 設定目標</h3>
        <p>選擇航線、出發月份、停留天數與你的理想價格。</p>
      </div>

      <div class="how-card">
        <div class="step-icon">
          <Clock3 :size="20" />
        </div>
        <h3>2. 背景監控</h3>
        <p>SaveFlow 會在背景持續追蹤符合條件的機票價格。</p>
      </div>

      <div class="how-card">
        <div class="step-icon">
          <Mail :size="20" />
        </div>
        <h3>3. 達標通知</h3>
        <p>不亂寄信。只有價格低於你的目標價時才通知你。</p>
      </div>
    </section>
  </main>
</template>
<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  padding: 28px;
  color: #0f172a;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 34%),
    radial-gradient(circle at top right, rgba(15, 23, 42, 0.08), transparent 30%),
    linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.nav {
  max-width: 1060px;
  margin: 0 auto 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 15px;
  background: #0f172a;
  color: white;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.22);
}

.brand strong {
  display: block;
  font-size: 17px;
  letter-spacing: -0.04em;
}

.brand span {
  display: block;
  margin-top: 2px;
  color: #64748b;
  font-size: 12px;
}

.nav-link {
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  text-decoration: none;
  font-size: 14px;
  font-weight: 850;
}

.hero {
  max-width: 860px;
  margin: 0 auto 36px;
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  border-radius: 999px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 18px;
}

.hero h1 {
  font-size: clamp(46px, 8vw, 82px);
  line-height: 0.92;
  letter-spacing: -0.08em;
  margin: 0 0 22px;
}

.hero p {
  max-width: 640px;
  margin: 0 auto;
  color: #64748b;
  font-size: 18px;
  line-height: 1.75;
}

.hero-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.primary-link {
  height: 46px;
  padding: 0 20px;
  border-radius: 999px;
  background: #0f172a;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 900;
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.22);
}

.hero-actions span {
  color: #64748b;
  font-size: 14px;
}

.trust-row {
  max-width: 1060px;
  margin: 0 auto 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.trust-row > div,
.form-card,
.how-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(14px);
  border-radius: 28px;
}

.trust-row > div {
  padding: 20px;
}

.trust-row strong {
  display: block;
  font-size: 22px;
  letter-spacing: -0.05em;
}

.trust-row span {
  display: block;
  margin-top: 5px;
  color: #64748b;
  font-size: 13px;
}

.watch-section {
  max-width: 760px;
  margin: 0 auto 20px;
}

.form-card {
  padding: 26px;
}

.card-head {
  margin-bottom: 22px;
  text-align: center;
}

.card-head h2 {
  margin: 0;
  font-size: 30px;
  letter-spacing: -0.055em;
}

.card-head p {
  margin: 8px 0 0;
  color: #64748b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #334155;
  font-size: 13px;
  font-weight: 850;
}

input,
select {
  width: 100%;
  height: 48px;
  border: 1px solid #cbd5e1;
  border-radius: 15px;
  background: white;
  padding: 0 14px;
  outline: none;
  color: #0f172a;
  font-size: 14px;
}

input:focus,
select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.11);
}

.primary-btn {
  grid-column: 1 / -1;
  height: 52px;
  margin-top: 4px;
  border: 0;
  border-radius: 17px;
  background: #2563eb;
  color: white;
  gap: 8px;
  font-weight: 950;
  font-size: 15px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16px 36px rgba(37, 99, 235, 0.25);
}

.success-card {
  text-align: center;
  padding: 20px 10px 8px;
}

.success-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  background: #dcfce7;
  color: #166534;
}

.success-card h3 {
  margin: 0;
  font-size: 30px;
  letter-spacing: -0.055em;
}

.success-card p {
  max-width: 520px;
  margin: 12px auto 20px;
  color: #64748b;
  line-height: 1.8;
}

.success-card strong {
  color: #0f172a;
}

.secondary-btn {
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #0f172a;
  font-weight: 850;
  cursor: pointer;
}

.how {
  max-width: 1060px;
  margin: 20px auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.how-card {
  padding: 24px;
}

.step-icon {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #eff6ff;
  color: #2563eb;
  margin-bottom: 16px;
}

.how-card h3 {
  margin: 0;
  letter-spacing: -0.04em;
}

.how-card p {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.7;
  font-size: 14px;
}

@media (max-width: 860px) {
  .page {
    padding: 18px;
  }

  .nav {
    margin-bottom: 48px;
  }

  .trust-row,
  .how,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 46px;
  }
}
</style>