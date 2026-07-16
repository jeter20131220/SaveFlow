<script setup>
import {
  ArrowRight,
  BarChart3,
  CalendarSearch,
  CheckCircle2,
  Clock3,
  Mail,
  Plane,
  Radar,
  Search,
  Sparkles,
  TrendingDown,
  WalletCards,
} from 'lucide-vue-next'

import AppNavbar from '../components/AppNavbar.vue'


const comparisonSteps = [
  {
    icon: Search,
    title: '大量掃描日期組合',
    description:
      '比較不同出發日期、回程日期與停留天數，不需要你自己反覆修改搜尋條件。',
  },
  {
    icon: Radar,
    title: '先排除不值得看的選項',
    description:
      '從大量搜尋結果中留下低價、直飛與條件較好的候選航班。',
  },
  {
    icon: Sparkles,
    title: '整理 CP 值最高的 Top 10',
    description:
      '不只找最低價格，也會比較停留時間、同價多玩幾天與其他實際旅行條件。',
  },
  {
    icon: TrendingDown,
    title: '持續累積價格歷史',
    description:
      '保存每天的價格快照，未來可以判斷目前價格是否接近近期低點。',
  },
]

const currentFeatures = [
  '比較多組出發日期與停留天數',
  '整理目前最低價候選方案',
  '找出同價可以多停留的組合',
  '提供 Trip.com 即時查價連結',
  '持續累積每日價格資料',
]

const upcomingFeatures = [
  '每日機票價格日報',
  '單一候選航班價格歷史',
  '關注航班與 Email 通知',
  '自訂出發區間與停留天數',
  'AI 購買時機與 CP 值分析',
]
</script>

<template>
  <main class="story-page">
       <AppNavbar
  :theme="theme"
  :show-month-nav="false"
  @toggle-theme="toggleTheme"
/>

    <section class="story-hero">
      <div class="story-hero-content">
        <span class="story-eyebrow">
          <WalletCards :size="16" />
          乞丐超人的省錢哲學
        </span>

        <h1>
          同一趟旅行，
          <br />
          不應該因為不會比價，
          <br />
          就多花幾千元。
        </h1>

        <p class="story-lead">
          機票價格會隨日期、庫存、航班組合與購買時間不斷變動。
          即使目的地和旅行天數差不多，選擇不同的去回日期，
          最後價格也可能相差數百甚至數千元。
        </p>

        <div class="story-actions">
          <RouterLink
            class="primary-link"
            to="/"
          >
            查看九月精選航班
            <ArrowRight :size="17" />
          </RouterLink>

          <a
            class="secondary-link"
            href="#how-it-works"
          >
            SaveFlow 如何運作
          </a>
        </div>
      </div>

      <aside class="hero-example">
        <div class="example-label">
          <Plane :size="15" />
          相近旅行條件
        </div>

        <div class="example-row muted">
          <div>
            <span>方案 A</span>
            <strong>9/10 → 9/24</strong>
          </div>

          <strong>NT$9,580</strong>
        </div>

        <div class="example-row winner">
          <div>
            <span>SaveFlow 精選</span>
            <strong>9/8 → 9/24</strong>
          </div>

          <strong>NT$7,331</strong>
        </div>

        <div class="saving-result">
          <TrendingDown :size="18" />

          <div>
            <span>示意價差</span>
            <strong>少花 NT$2,249</strong>
          </div>
        </div>

        <p class="example-note">
          此處為產品概念示意，實際價格會隨 Trip.com
          最新頁面與航班庫存變動。
        </p>
      </aside>
    </section>

    <section class="problem-section">
      <div class="section-heading">
        <span>THE PROBLEM</span>

        <h2>
          買貴通常不是因為你不夠努力，
          而是要比較的組合實在太多。
        </h2>

        <p>
          只要更改一天出發、延後一天回程，
          就會產生新的搜尋組合。
          如果再加入 7、10、14、15、16 天等停留時間，
          人工比價很快就會變成大量重複工作。
        </p>
      </div>

      <div class="problem-grid">
        <article>
          <CalendarSearch :size="23" />

          <strong>日期組合太多</strong>

          <p>
            一個月份搭配多種停留天數，
            很快就會產生上百組搜尋條件。
          </p>
        </article>

        <article>
          <Clock3 :size="23" />

          <strong>價格持續變動</strong>

          <p>
            今天的最低價，明天可能上漲；
            原本普通的日期，也可能突然出現低價。
          </p>
        </article>

        <article>
          <BarChart3 :size="23" />

          <strong>最低價不一定最划算</strong>

          <p>
            多住兩天可能完全不用加價，
            或多花少量金額就能換到更好的時間與條件。
          </p>
        </article>
      </div>
    </section>

    <section
      id="how-it-works"
      class="process-section"
    >
      <div class="section-heading">
        <span>HOW SAVEFLOW WORKS</span>

        <h2>
          讓機器完成大量搜尋，
          人只需要看最後的精華。
        </h2>
      </div>

      <div class="process-grid">
        <article
          v-for="(
            step,
            index
          ) in comparisonSteps"
          :key="step.title"
          class="process-card"
        >
          <span class="step-number">
            0{{ index + 1 }}
          </span>

          <component
            :is="step.icon"
            :size="23"
          />

          <h3>
            {{ step.title }}
          </h3>

          <p>
            {{ step.description }}
          </p>
        </article>
      </div>
    </section>

    <section class="identity-section">
      <div class="identity-copy">
        <span class="story-eyebrow">
          <Sparkles :size="15" />
          NEVER OVERPAY
        </span>

        <h2>
          乞丐超人不是什麼都不買，
          而是不花任何一筆冤枉錢。
        </h2>

        <p>
          SaveFlow 希望做的不是叫你永遠等待，
          而是在大量價格資訊中，協助你辨認真正值得買的時機。
        </p>

        <blockquote>
          「不是為了省小錢犧牲體驗，
          而是把錢留給真正值得的旅行。」
        </blockquote>
      </div>

      <div class="feature-columns">
        <article>
          <h3>現在已經可以做到</h3>

          <ul>
            <li
              v-for="feature in currentFeatures"
              :key="feature"
            >
              <CheckCircle2 :size="17" />
              {{ feature }}
            </li>
          </ul>
        </article>

        <article>
          <h3>接下來即將加入</h3>

          <ul>
            <li
              v-for="feature in upcomingFeatures"
              :key="feature"
            >
              <Sparkles :size="17" />
              {{ feature }}
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="future-alert">
      <div>
        <span class="story-eyebrow">
          <Mail :size="15" />
          PRICE WATCH
        </span>

        <h2>
          未來不只幫你找到，
          還會持續替你盯著。
        </h2>

        <p>
          當精選航班出現更低價格，
          或同一旅行需求出現更划算的日期，
          SaveFlow 將可以透過 Email 告訴你。
        </p>
      </div>

      <button
        type="button"
        disabled
      >
        關注航班功能準備中
      </button>
    </section>

    <section class="disclaimer-section">
      <CheckCircle2 :size="18" />

      <p>
        SaveFlow 提供的是價格資訊整理與推薦參考，
        不保證任何價格一定維持，也不代表未來必然上漲或下跌。
        實際航班、價格、行李與付款條件，
        請以訂票平台最終頁面為準。
      </p>
    </section>
  </main>
</template>

<style scoped>
.story-page {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  /* padding: 40px 0 72px; */
}

.story-hero {
  display: grid;
  grid-template-columns:
    minmax(0, 1.45fr)
    minmax(320px, 0.75fr);
  gap: 24px;
  align-items: stretch;
}

.story-hero-content,
.hero-example,
.problem-section,
.process-section,
.identity-section,
.future-alert,
.disclaimer-section {
  border: 1px solid var(--border);
  border-radius: 24px;
  background: var(--panel);
}

.story-hero-content {
  padding: clamp(32px, 6vw, 72px);
}

.story-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.story-hero h1 {
  margin: 24px 0;
  font-size: clamp(42px, 6.4vw, 60px);
  line-height: 1.2;
  letter-spacing: -0.055em;
}

.story-lead {
  max-width: 680px;
  margin: 0;
  color: var(--text-secondary);
  font-size: 17px;
  line-height: 1.9;
}

.story-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.primary-link,
.secondary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 800;
  text-decoration: none;
}

.primary-link {
  background: var(--accent);
  color: var(--accent-contrast);
}

.secondary-link {
  border: 1px solid var(--border);
  color: var(--text);
}

.hero-example {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 26px;
}

.example-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 800;
}

.example-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border);
}

.example-row div {
  display: grid;
  gap: 5px;
}

.example-row span,
.saving-result span {
  color: var(--text-secondary);
  font-size: 12px;
}

.example-row.muted {
  opacity: 0.62;
}

.example-row.winner {
  color: var(--accent);
}

.saving-result {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  border-radius: 16px;
  background: var(--accent-soft);
}

.saving-result div {
  display: grid;
  gap: 4px;
}

.example-note {
  margin: 16px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.problem-section,
.process-section,
.identity-section {
  margin-top: 24px;
  padding: clamp(28px, 5vw, 52px);
}

.section-heading {
  max-width: 760px;
}

.section-heading > span {
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.section-heading h2,
.identity-copy h2,
.future-alert h2 {
  margin: 14px 0;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.16;
  letter-spacing: -0.035em;
}

.section-heading p,
.identity-copy p,
.future-alert p {
  color: var(--text-secondary);
  line-height: 1.85;
}

.problem-grid,
.process-grid {
  display: grid;
  gap: 16px;
  margin-top: 30px;
}

.problem-grid {
  grid-template-columns: repeat(3, 1fr);
}

.process-grid {
  grid-template-columns: repeat(4, 1fr);
}

.problem-grid article,
.process-card,
.feature-columns article {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--surface-secondary);
}

.problem-grid strong {
  display: block;
  margin-top: 18px;
}

.problem-grid p,
.process-card p {
  margin: 8px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.step-number {
  display: block;
  margin-bottom: 22px;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 800;
}

.process-card h3 {
  margin: 16px 0 0;
  font-size: 17px;
}

.identity-section {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 36px;
}

.identity-copy blockquote {
  margin: 26px 0 0;
  padding-left: 18px;
  border-left: 3px solid var(--accent);
  color: var(--text);
  font-size: 18px;
  line-height: 1.8;
}

.feature-columns {
  display: grid;
  gap: 16px;
}

.feature-columns h3 {
  margin: 0 0 16px;
}

.feature-columns ul {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.feature-columns li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.feature-columns li svg {
  flex: 0 0 auto;
  margin-top: 3px;
  color: var(--accent);
}

.future-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-top: 24px;
  padding: clamp(28px, 5vw, 52px);
}

.future-alert > div {
  max-width: 720px;
}

.future-alert button {
  flex: 0 0 auto;
  min-height: 46px;
  padding: 0 18px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-secondary);
  color: var(--text-secondary);
  font: inherit;
  font-weight: 800;
}

.disclaimer-section {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 24px;
  padding: 20px 22px;
}

.disclaimer-section svg {
  flex: 0 0 auto;
  margin-top: 3px;
}

.disclaimer-section p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .story-hero,
  .identity-section {
    grid-template-columns: 1fr;
  }

  .process-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .future-alert {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .story-page {
    width: min(100% - 20px, 1180px);
    padding-top: 20px;
  }

  .story-hero h1 {
    font-size: clamp(38px, 12vw, 55px);
  }

  .problem-grid,
  .process-grid {
    grid-template-columns: 1fr;
  }

  .story-actions {
    flex-direction: column;
  }

  .primary-link,
  .secondary-link {
    width: 100%;
  }
}
</style>