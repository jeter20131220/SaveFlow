<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Moon,
  Plane,
  RefreshCw,
  Sparkles,
  Sun,
} from 'lucide-vue-next'

import { createClient } from '@supabase/supabase-js'

// ======================================================
// Supabase
// ======================================================

const SUPABASE_URL =
  'https://rrukbblbbizycawbvprr.supabase.co'

// 只能放 anon / publishable key。
// 不可以放 service_role key。
const SUPABASE_ANON_KEY =
  'sb_publishable_r4au429bqxD2XwaiQAvwcw_ytAlHh4m'

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
)

// ======================================================
// 基本設定
// ======================================================

const PRIMARY_PRICE = 8000
const SECONDARY_PRICE = 9000

const flights = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const theme = ref(
  localStorage.getItem('flight_theme') ||
  'dark',
)

// 目前只開放 7 天與 16 天
const stayDayOptions = [
  {
    value: 7,
    label: '7 天',
  },
  {
    value: 16,
    label: '16 天',
  },
]

const selectedStayDays = ref(16)

const monthOptions = [
  {
    value: '2026-09',
    label: '9 月',
    fullLabel: '2026 年 9 月',
  },
]

const getInitialMonth = () => {
  const params = new URLSearchParams(
    window.location.search,
  )

  const month = params.get('month')

  const exists = monthOptions.some(
    (item) => item.value === month,
  )

  return exists
    ? month
    : '2026-09'
}

const selectedMonth = ref(
  getInitialMonth(),
)

// ======================================================
// Computed
// ======================================================

const currentMonthOption = computed(() => {
  return (
    monthOptions.find(
      (item) =>
        item.value ===
        selectedMonth.value,
    ) || monthOptions[0]
  )
})

// 目前先顯示所有符合條件的航班。
// 不依照日期組合去重。
const sortedFlights = computed(() => {
  return [...flights.value].sort(
    (a, b) =>
      Number(a.price) -
      Number(b.price),
  )
})

const bestFlight = computed(() => {
  return sortedFlights.value[0] || null
})

const priceValues = computed(() => {
  return sortedFlights.value
    .map((flight) =>
      Number(flight.price),
    )
    .filter(Number.isFinite)
})

const lowestPrice = computed(() => {
  if (!priceValues.value.length) {
    return null
  }

  return Math.min(
    ...priceValues.value,
  )
})

const highestPrice = computed(() => {
  if (!priceValues.value.length) {
    return null
  }

  return Math.max(
    ...priceValues.value,
  )
})

const latestCapturedAt = computed(() => {
  const values = flights.value
    .map(
      (flight) =>
        flight.captured_at,
    )
    .filter(Boolean)
    .sort()

  return values.at(-1) || null
})

// ======================================================
// Theme
// ======================================================

const applyTheme = () => {
  document.documentElement.dataset.theme =
    theme.value
}

const toggleTheme = () => {
  theme.value =
    theme.value === 'dark'
      ? 'light'
      : 'dark'

  localStorage.setItem(
    'flight_theme',
    theme.value,
  )

  applyTheme()
}

// ======================================================
// 日期與格式
// ======================================================

const getMonthRange = (
  monthValue,
) => {
  const [year, month] = monthValue
    .split('-')
    .map(Number)

  const start = new Date(
    Date.UTC(
      year,
      month - 1,
      1,
    ),
  )

  const end = new Date(
    Date.UTC(
      year,
      month,
      1,
    ),
  )

  return {
    start: start
      .toISOString()
      .slice(0, 10),

    end: end
      .toISOString()
      .slice(0, 10),
  }
}

const formatPrice = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return '價格待確認'
  }

  return `NT$${Number(
    value,
  ).toLocaleString('zh-TW')}`
}

const formatDate = (value) => {
  if (!value) {
    return '日期待確認'
  }

  const date = new Date(
    `${value}T00:00:00+08:00`,
  )

  return new Intl.DateTimeFormat(
    'zh-TW',
    {
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
    },
  ).format(date)
}

const formatDateTime = (value) => {
  if (!value) {
    return '更新時間待確認'
  }

  return new Intl.DateTimeFormat(
    'zh-TW',
    {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(value))
}

const calculateStayDays = (
  departureDate,
  returnDate,
) => {
  if (
    !departureDate ||
    !returnDate
  ) {
    return null
  }

  const departure = new Date(
    `${departureDate}T00:00:00Z`,
  )

  const returning = new Date(
    `${returnDate}T00:00:00Z`,
  )

  return Math.round(
    (
      returning.getTime() -
      departure.getTime()
    ) / 86400000,
  )
}

const getAirportName = (
  airport,
) => {
  const airportNames = {
    TPE: '桃園機場',
    TSA: '松山機場',
    NRT: '成田機場',
    HND: '羽田機場',
    TYO: '東京',
  }

  return (
    airportNames[airport] ||
    airport
  )
}

const getPriceLevel = (
  price,
) => {
  const value = Number(price)

  if (value <= PRIMARY_PRICE) {
    return {
      className: 'primary',
      text: '超值得',
      icon: '🔥',
    }
  }

  if (value <= SECONDARY_PRICE) {
    return {
      className: 'secondary',
      text: '值得注意',
      icon: '✨',
    }
  }

  return {
    className: '',
    text: '目前候選',
    icon: '',
  }
}

const normalizeFlightSummary = (
  summary,
) => {
  return (
    summary ||
    '沒有提供詳細航班內容。'
  )
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ======================================================
// Trip.com 聯盟網址
// ======================================================

const TRIP_AFFILIATE = {
  Allianceid: '9296239',
  SID: '324469629',
  trip_sub1: '',
  trip_sub3: 'D18700075',
}

const getAffiliateUrl = (
  flight,
) => {
  if (!flight?.search_url) {
    return '#'
  }

  const url = new URL(
    flight.search_url,
  )

  Object.entries(
    TRIP_AFFILIATE,
  ).forEach(([key, value]) => {
    // 空值不加入網址
    if (!value) {
      return
    }

    url.searchParams.set(
      key,
      value,
    )
  })

  return url.toString()
}

// ======================================================
// Supabase
// ======================================================

const fetchFlights = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const {
      start,
      end,
    } = getMonthRange(
      selectedMonth.value,
    )

    const {
      data,
      error,
    } = await supabase
      .from('flight_prices')
      .select(`
        id,
        collection_run_id,
        platform,
        origin,
        destination_city,
        destination,
        departure_date,
        return_date,
        stay_days,
        adults,
        currency,
        price,
        airline,
        direct,
        baggage,
        flight_summary,
        search_url,
        status,
        captured_at
      `)
      .eq('status', 'success')
      .not('price', 'is', null)
      .eq(
        'stay_days',
        selectedStayDays.value,
      )
      .gte(
        'departure_date',
        start,
      )
      .lt(
        'departure_date',
        end,
      )
      .order('price', {
        ascending: true,
      })

    if (error) {
      throw error
    }

    flights.value = data || []

    console.log(
      `目前選擇：${selectedStayDays.value} 天`,
    )

    console.log(
      `Supabase 回傳：${flights.value.length} 筆`,
    )

    console.table(
      flights.value.map(
        (flight) => ({
          id: flight.id,
          stay_days:
            flight.stay_days,
          departure:
            flight.departure_date,
          return:
            flight.return_date,
          airline:
            flight.airline,
          price:
            flight.price,
        }),
      ),
    )
  } catch (error) {
    console.error(error)

    errorMessage.value =
      error?.message ||
      '航班資料讀取失敗'

    flights.value = []
  } finally {
    isLoading.value = false
  }
}

// ======================================================
// 操作
// ======================================================

const changeMonth = async (
  month,
) => {
  if (
    selectedMonth.value === month
  ) {
    return
  }

  selectedMonth.value = month

  const url = new URL(
    window.location.href,
  )

  url.searchParams.set(
    'month',
    month,
  )

  window.history.replaceState(
    {},
    '',
    url,
  )

  await fetchFlights()
}

const changeStayDays = async (
  stayDays,
) => {
  if (
    selectedStayDays.value ===
    stayDays
  ) {
    return
  }

  selectedStayDays.value =
    stayDays

  await fetchFlights()
}

// ======================================================
// Lifecycle
// ======================================================

onMounted(() => {
  applyTheme()
  fetchFlights()
})

</script>

<template>
  <main class="page">
    <nav class="nav">
      <a class="brand" href="#top">
        <span class="brand-icon">
          <Plane :size="21" />
        </span>

        <div>
          <strong>SaveFlow</strong>
          <p>東京便宜機票月曆</p>
        </div>
      </a>

      <div class="nav-actions">
        <div class="month-nav">
          <button v-for="month in monthOptions" :key="month.value" type="button" :class="{
            active:
              selectedMonth ===
              month.value,
          }" @click="
            changeMonth(month.value)
            ">
            {{ month.label }}
          </button>
        </div>

        <button type="button" class="icon-button" :title="theme === 'dark'
          ? '切換淺色模式'
          : '切換深色模式'
          " @click="toggleTheme">
          <Sun v-if="theme === 'dark'" :size="18" />

          <Moon v-else :size="18" />
        </button>

        <button type="button" class="refresh-button" :disabled="isLoading" @click="fetchFlights">
          <RefreshCw :size="16" :class="{
            spinning: isLoading,
          }" />

          {{
            isLoading
              ? '更新中'
              : '重新整理'
          }}
        </button>
      </div>
    </nav>

    <section id="top" class="hero">
      <div class="panel hero-main">
        <div class="eyebrow">
          <CalendarDays :size="14" />

          {{
            currentMonthOption.fullLabel
          }}

          FLIGHT WATCH
        </div>

        <h1>
          不用一直換日期，<br />
          直接看哪一段最便宜。
        </h1>

        <p class="hero-description">
          SaveFlow 自動比較不同出發日期與停留天數，
          整理桃園飛東京目前值得注意的來回機票。
          點擊航班即可前往 Trip.com 查看最新價格。
        </p>

        <div class="hero-tags">
          <span>桃園 TPE 出發</span>
          <span>成田 NRT／羽田 HND</span>
          <span>約 14～18 天</span>
          <span>直飛優先</span>
        </div>
      </div>

      <aside class="panel best-panel">
        <template v-if="bestFlight">
          <div>
            <span class="best-label">
              <Sparkles :size="15" />
              目前最划算
            </span>

            <strong class="best-price">
              {{
                formatPrice(
                  bestFlight.price,
                )
              }}
            </strong>

            <div class="best-airline">
              {{
                bestFlight.airline ||
                '航空公司待確認'
              }}
            </div>

            <p class="best-route">
              {{
                formatDate(
                  bestFlight.departure_date,
                )
              }}
              →
              {{
                formatDate(
                  bestFlight.return_date,
                )
              }}
            </p>

            <div class="best-meta">
              <span class="best-stay-days">
                <CalendarDays :size="14" />

                停留
                {{
                  bestFlight.stay_days ??
                  calculateStayDays(
                    bestFlight.departure_date,
                    bestFlight.return_date,
                )
                }}
                天
              </span>

              <span v-if="
                bestFlight.direct !== null &&
                bestFlight.direct !== undefined
              " class="best-direct">
                {{
                  bestFlight.direct
                    ? '直飛'
                    : '轉機'
                }}
              </span>
            </div>

            <p class="best-airports">
              {{
                bestFlight.origin ||
                'TPE'
              }}
              →
              {{
                bestFlight.destination ||
                'TYO'
              }}
            </p>
          </div>

          <a class="best-button" :href="getAffiliateUrl(
            bestFlight,
          )
            " target="_blank" rel="noopener noreferrer sponsored">
            查看目前價格
            <ExternalLink :size="16" />
          </a>
        </template>

        <div v-else-if="isLoading" class="best-empty">
          正在尋找最低價格……
        </div>

        <div v-else class="best-empty">
          這個月份目前還沒有資料。
        </div>
      </aside>
    </section>

    <section class="content-section">
      <div class="section-head">
        <div>
          <span class="section-eyebrow">
            MONTHLY DEALS
          </span>

          <h2>
            {{
              currentMonthOption.fullLabel
            }}
            便宜機票
          </h2>

          <p>
            依目前抓到的來回價格由低到高排列。
          </p>
        </div>

        <span class="last-updated">
          最後更新：
          {{
            formatDateTime(
              latestCapturedAt,
            )
          }}
        </span>
      </div>
      <div class="stay-filter-section">
        <div class="stay-filter-label">
          <CalendarDays :size="16" />
          <span>停留時間</span>
        </div>

        <div class="stay-filter">
          <button v-for="option in stayDayOptions" :key="option.value" type="button" class="stay-filter-button" :class="{
            active:
              selectedStayDays === option.value,
          }" @click="
            changeStayDays(
              option.value,
            )
            ">
            {{ option.label }}
          </button>
        </div>
      </div>
      <div class="summary-grid">
        <article class="summary-card">
          <span>候選航班</span>

          <strong>
            {{ sortedFlights.length }}
            <small>筆</small>
          </strong>
        </article>

        <article class="summary-card">
          <span>最低價格</span>

          <strong>
            {{
              formatPrice(
                lowestPrice,
              )
            }}
          </strong>
        </article>

        <article class="summary-card">
          <span>價格區間</span>

          <strong class="range-value">
            {{
              lowestPrice !== null
                ? `${formatPrice(
                  lowestPrice,
                )}～${formatPrice(
                  highestPrice,
                )}`
                : '—'
            }}
          </strong>
        </article>
      </div>

      <div v-if="isLoading" class="panel state-card">
        <RefreshCw :size="28" class="spinning" />

        <strong>
          正在讀取航班資料
        </strong>

        <p>
          正在從 SaveFlow 資料庫取得最新結果。
        </p>
      </div>

      <div v-else-if="errorMessage" class="panel state-card error-state">
        <strong>
          航班資料讀取失敗
        </strong>

        <p>
          {{ errorMessage }}
        </p>
      </div>

      <div v-else-if="
        !sortedFlights.length
      " class="panel state-card">
        <Plane :size="29" />

        <strong>
          這個月份還沒有資料
        </strong>

        <p>
          Collector 更新後，
          這裡就會顯示最新航班結果。
        </p>
      </div>

      <div v-else class="flight-grid">
        <article v-for="(
flight,
  index
          ) in sortedFlights" :key="flight.id" class="flight-card" :class="{
            best: index === 0,
          }">
          <span class="rank">
            {{
              index === 0
                ? 'BEST'
                : `#${index + 1}`
            }}
          </span>

          <div class="flight-card-main">
            <div class="airline-info">
              <div class="flight-badges">
                <span class="badge" :class="getPriceLevel(
                  flight.price,
                ).className
                  ">
                  {{
                    getPriceLevel(
                      flight.price,
                    ).icon
                  }}

                  {{
                    getPriceLevel(
                      flight.price,
                    ).text
                  }}
                </span>

                {{
                  flight.direct
                    ? '直飛'
                    : '轉機'
                }}

                <span class="badge">
                  {{
                    calculateStayDays(
                      flight.departure_date,
                      flight.return_date,
                    )
                  }}
                  天
                </span>
              </div>

              <h3>
                {{
                  flight.airline ||
                  '航空公司待確認'
                }}
              </h3>

              <p>
                {{
                  formatDate(
                    flight.departure_date,
                  )
                }}
                →
                {{
                  formatDate(
                    flight.return_date,
                  )
                }}
              </p>
            </div>

            <div class="route">
              <div class="airport">
                <strong>
                  {{
                    flight.origin ||
                    'TPE'
                  }}
                </strong>

                <span>
                  {{
                    getAirportName(
                      flight.origin ||
                      'TPE',
                    )
                  }}
                </span>
              </div>

              <div class="route-line">
                <Plane :size="18" />
              </div>

              <div class="airport">
                <strong>
                  {{
                    flight.destination ||
                    'TYO'
                  }}
                </strong>

                <span>
                  {{
                    getAirportName(
                      flight.destination ||
                      'TYO',
                    )
                  }}
                </span>
              </div>
            </div>

            <div class="price-box">
              <small>來回價格</small>

              <strong>
                {{
                  formatPrice(
                    flight.price,
                  )
                }}
              </strong>

              <a :href="getAffiliateUrl(
                flight,
              )
                " target="_blank" rel="noopener noreferrer sponsored">
                Trip.com 查看
                <ExternalLink :size="14" />
              </a>
            </div>
          </div>
          <div class="flight-summary-wrapper">
            <div class="flight-summary-title">
              航班資訊
            </div>

            <p class="flight-summary">
              {{
                normalizeFlightSummary(
                  flight.flight_summary,
                )
              }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <section class="affiliate-note">
      <CheckCircle2 :size="18" />

      <p>
        本頁部分連結為聯盟連結。透過連結完成預訂時，
        SaveFlow 可能獲得佣金，但不會增加你的付款金額。
        航班價格、行李與付款條件請以 Trip.com
        最終頁面為準。
      </p>
    </section>

    <footer class="footer">
      <div>
        <strong>SaveFlow</strong>
        <span>
          不用一直換日期，
          直接找到目前最划算的旅行方式。
        </span>
      </div>

      <p>
        Flight prices may change at any time.
      </p>
    </footer>
  </main>
</template>

<style scss>
:root {
  color-scheme: dark;

  --bg: #070b14;
  --bg-2: #0f172a;
  --panel: rgba(19, 28, 47, 0.82);
  --panel-solid: #121b2e;
  --panel-soft: rgba(255, 255, 255, 0.055);

  --text: #f8fafc;
  --muted: #94a3b8;

  --line: rgba(255, 255, 255, 0.11);
  --grid: rgba(255, 255, 255, 0.028);

  --primary: #ff8a00;
  --primary-2: #ffb000;
  --primary-soft: rgba(255, 138, 0, 0.14);

  --blue: #4ea1ff;
  --blue-soft: rgba(78, 161, 255, 0.14);

  --green: #5eead4;
  --green-soft: rgba(94, 234, 212, 0.13);

  --yellow: #facc15;
  --yellow-soft: rgba(250, 204, 21, 0.13);

  --danger: #fb7185;

  --shadow:
    0 28px 90px rgba(0, 0, 0, 0.38);
}

[data-theme='light'] {
  color-scheme: light;

  --bg: #eef4ff;
  --bg-2: #ffffff;
  --panel: rgba(255, 255, 255, 0.8);
  --panel-solid: #ffffff;
  --panel-soft: rgba(15, 23, 42, 0.045);

  --text: #101828;
  --muted: #667085;

  --line: rgba(15, 23, 42, 0.12);
  --grid: rgba(15, 23, 42, 0.04);

  --primary: #ff8300;
  --primary-2: #ffb000;
  --primary-soft: rgba(255, 131, 0, 0.12);

  --blue: #1677ff;
  --blue-soft: rgba(22, 119, 255, 0.1);

  --green: #078f83;
  --green-soft: rgba(7, 143, 131, 0.11);

  --yellow: #b77900;
  --yellow-soft: rgba(183, 121, 0, 0.1);

  --danger: #d92d20;

  --shadow:
    0 24px 70px rgba(36, 76, 140, 0.16);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;

  color: var(--text);

  font-family:
    ui-rounded,
    'SF Pro Rounded',
    'Noto Sans TC',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  background:
    radial-gradient(circle at 15% 10%,
      color-mix(in srgb,
        var(--blue) 22%,
        transparent),
      transparent 30%),
    radial-gradient(circle at 85% 8%,
      color-mix(in srgb,
        var(--primary) 18%,
        transparent),
      transparent 28%),
    linear-gradient(135deg,
      var(--bg),
      var(--bg-2));

  transition:
    color 0.25s ease,
    background 0.25s ease;
}

body::before {
  position: fixed;
  inset: 0;
  z-index: -1;

  content: '';

  background-image:
    linear-gradient(var(--grid) 1px,
      transparent 1px),
    linear-gradient(90deg,
      var(--grid) 1px,
      transparent 1px);

  background-size: 44px 44px;

  mask-image:
    linear-gradient(to bottom,
      rgba(0, 0, 0, 0.9),
      transparent 90%);

  pointer-events: none;
}

button,
a {
  font: inherit;
}

button {
  color: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

.page {
  width: min(1180px,
      calc(100% - 32px));

  margin: 0 auto;
  padding-bottom: 60px;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 24px 0;
}

.brand {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
}

.brand p {
  margin-bottom: 0;
  margin-top: 1px;
  font-size: 13px;
}

.brand-icon {
  /* display: grid; */
  width: 44px;
  height: 44px;
  /* place-items: center;
   */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid color-mix(in srgb,
      var(--primary) 38%,
      transparent);

  border-radius: 15px;

  color: #111827;

  background:
    linear-gradient(135deg,
      var(--primary),
      var(--primary-2));

  box-shadow:
    0 12px 34px color-mix(in srgb,
      var(--primary) 20%,
      transparent);
}

.best-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.best-stay-days,
.best-direct {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--surface-secondary);
}

.brand strong,
.brand span {
  /* display: block; */
}

.brand strong {
  font-size: 18px;
}

.brand span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
}

.nav-actions {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;
}

.month-nav {
  display: flex;
  overflow-x: auto;
  gap: 5px;

  padding: 4px;

  border: 1px solid var(--line);
  border-radius: 999px;

  background: var(--panel-soft);

  scrollbar-width: none;
}

.month-nav::-webkit-scrollbar {
  display: none;
}

.month-nav button {
  flex-shrink: 0;
  padding: 8px 11px;

  border: 0;
  border-radius: 999px;

  color: var(--muted);
  background: transparent;

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;
}

.month-nav button:hover {
  color: var(--text);
}

.month-nav button.active {
  color: #111827;

  background:
    linear-gradient(135deg,
      var(--primary),
      var(--primary-2));
}

.icon-button,
.refresh-button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 7px;

  min-height: 42px;
  padding: 9px 12px;

  border: 1px solid var(--line);
  border-radius: 999px;

  color: var(--text);
  background: var(--panel-soft);

  cursor: pointer;
}

.icon-button {
  width: 42px;
  padding: 0;
}

.icon-button:hover,
.refresh-button:hover {
  border-color:
    color-mix(in srgb,
      var(--blue) 42%,
      var(--line));

  background: var(--blue-soft);
}

.refresh-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.hero {
  display: grid;
  grid-template-columns:
    minmax(0, 1.3fr) minmax(290px, 0.7fr);

  gap: 20px;

  margin-top: 22px;
}

.panel {
  border: 1px solid var(--line);
  border-radius: 28px;

  background:
    linear-gradient(180deg,
      var(--panel),
      var(--panel-soft));

  box-shadow: var(--shadow);

  backdrop-filter: blur(18px);
}

.hero-main {
  position: relative;
  overflow: hidden;
  padding: 40px;
}

.hero-main::after {
  position: absolute;
  right: 22px;
  bottom: 6px;

  content: 'TPE → TYO';

  color:
    color-mix(in srgb,
      var(--text) 5%,
      transparent);

  font-size:
    clamp(46px, 7vw, 92px);

  font-weight: 1000;
  letter-spacing: -0.08em;
  white-space: nowrap;
}

.eyebrow,
.section-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  color: var(--blue);

  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.eyebrow {
  padding: 8px 12px;

  border: 1px solid color-mix(in srgb,
      var(--blue) 30%,
      transparent);

  border-radius: 999px;

  background: var(--blue-soft);
}

.hero h1 {
  position: relative;
  z-index: 1;

  max-width: 760px;
  margin: 22px 0 16px;

  font-size:
    clamp(38px, 5.5vw, 60px);

  line-height: 1.3;
  letter-spacing: -0.065em;
}

.hero-description {
  position: relative;
  z-index: 1;

  max-width: 680px;
  margin: 0;

  color: var(--muted);
  font-size: 16px;
  line-height: 1.9;
}

.hero-tags {
  position: relative;
  z-index: 1;

  display: flex;
  flex-wrap: wrap;
  gap: 9px;

  margin-top: 24px;
}

.hero-tags span {
  padding: 8px 11px;

  border: 1px solid var(--line);
  border-radius: 999px;

  color: var(--muted);
  background: var(--panel-soft);

  font-size: 13px;
}

.best-panel {
  display: flex;
  min-height: 330px;
  padding: 28px;
  flex-direction: column;
  justify-content: space-between;
}

.best-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  color: var(--muted);
  font-size: 13px;
  font-weight: 850;
}

.best-price {
  display: block;
  margin: 18px 0 14px;

  color: var(--green);

  font-size: clamp(42px, 5vw, 62px);
  font-weight: 1000;
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.best-airline {
  margin-top: 6px;

  font-size: 19px;
  font-weight: 900;
  line-height: 1.4;
}

.best-route {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;

  margin: 14px 0 0;

  color: var(--muted);
  line-height: 1.7;
  font-weight: 850;
}

.best-route span {
  /* margin-left: 0; */
  /* color: var(--blue); */
  font-weight: 850;
}

.best-airports {
  margin: 10px 0 0;
  color: var(--muted);
  line-height: 1.7;
}

/* .best-route span {
  margin-left: 7px;

  color: var(--blue);
  font-weight: 850;
} */

.best-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 22px;
  padding: 13px 16px;

  border: 1px solid color-mix(in srgb,
      var(--primary) 42%,
      transparent);

  border-radius: 16px;

  color: #111827;

  background:
    linear-gradient(135deg,
      var(--primary),
      var(--primary-2));

  font-weight: 950;
}

.best-button:hover {
  filter: brightness(1.06);
}

.best-empty {
  display: grid;
  min-height: 100%;
  place-items: center;

  color: var(--muted);
  text-align: center;
}

.content-section {
  margin-top: 42px;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 17px;
}

.section-head h2 {
  margin: 7px 0 0;

  font-size: 30px;
  letter-spacing: -0.045em;
}

.section-head p {
  margin: 7px 0 0;
  color: var(--muted);
}

.last-updated {
  color: var(--muted);
  font-size: 13px;
  white-space: nowrap;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  margin-bottom: 18px;
}

.summary-card {
  padding: 18px;

  border: 1px solid var(--line);
  border-radius: 21px;

  background: var(--panel-soft);
}

.summary-card span {
  color: var(--muted);
  font-size: 12px;
}

.summary-card strong {
  display: block;
  margin-top: 8px;

  font-size: 25px;
  letter-spacing: -0.04em;
}

.summary-card small {
  color: var(--muted);
  font-size: 13px;
}

.summary-card .range-value {
  font-size: 20px;
}

.flight-grid {
  display: grid;
  gap: 15px;
}

.flight-card {
  position: relative;
  overflow: hidden;

  padding: 22px;

  border: 1px solid var(--line);
  border-radius: 25px;

  background:
    linear-gradient(145deg,
      var(--panel-soft),
      color-mix(in srgb,
        var(--panel-soft) 48%,
        transparent));

  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.flight-card:hover {
  transform: translateY(-3px);

  border-color:
    color-mix(in srgb,
      var(--blue) 40%,
      var(--line));

  background: var(--blue-soft);
}

.flight-card.best {
  border-color:
    color-mix(in srgb,
      var(--green) 42%,
      var(--line));

  background:
    linear-gradient(145deg,
      var(--green-soft),
      var(--panel-soft));
}

.rank {
  position: absolute;
  top: 0;
  left: 0;

  display: grid;
  min-width: 48px;
  height: 34px;
  place-items: center;

  border-radius: 0 0 14px 0;

  color: var(--muted);
  background: var(--panel-soft);

  font-size: 11px;
  font-weight: 950;
}

.flight-card.best .rank {
  color: #052e2b;
  background: var(--green);
}

.flight-card-main {
  display: grid;
  grid-template-columns:
    minmax(0, 1.1fr) minmax(250px, 1.4fr) auto;

  gap: 24px;
  align-items: center;

  padding-left: 26px;
}

.airline-info {
  min-width: 0;
}

.flight-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  margin-bottom: 10px;
}

.badge {
  display: inline-flex;
  align-items: center;

  padding: 5px 8px;

  border: 1px solid var(--line);
  border-radius: 999px;

  color: var(--muted);
  background: var(--panel-soft);

  font-size: 11px;
  font-weight: 850;
}

.badge.primary {
  border-color:
    color-mix(in srgb,
      var(--green) 38%,
      transparent);

  color: var(--green);
  background: var(--green-soft);
}

.badge.secondary {
  border-color:
    color-mix(in srgb,
      var(--yellow) 38%,
      transparent);

  color: var(--yellow);
  background: var(--yellow-soft);
}

.airline-info h3 {
  overflow: hidden;
  margin: 0;

  font-size: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.airline-info p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.route {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 15px;
  align-items: center;
}

.airport {
  text-align: center;
}

.airport strong,
.airport span {
  display: block;
}

.airport strong {
  font-size: 24px;
}

.airport span {
  margin-top: 5px;
  color: var(--muted);
  font-size: 12px;
}

.route-line {
  display: flex;
  min-width: 110px;
  align-items: center;
  gap: 8px;

  color: var(--blue);
}

.route-line::before,
.route-line::after {
  height: 1px;
  flex: 1;

  content: '';
  background: var(--line);
}

.price-box {
  min-width: 155px;
  text-align: right;
}

.price-box small {
  display: block;
  color: var(--muted);
}

.price-box strong {
  display: block;
  margin-top: 5px;

  color: var(--green);
  font-size: 28px;
  letter-spacing: -0.04em;
}

.price-box a {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  margin-top: 10px;
  padding: 8px 11px;

  border: 1px solid var(--line);
  border-radius: 11px;

  background: var(--panel-soft);

  font-size: 12px;
  font-weight: 850;
}

.price-box a:hover {
  border-color:
    color-mix(in srgb,
      var(--primary) 42%,
      var(--line));

  background: var(--primary-soft);
}

.summary-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  margin-top: 18px;
  padding: 15px 0 0;

  border: 0;
  border-top: 1px solid var(--line);

  color: var(--muted);
  background: transparent;

  font-size: 13px;
  font-weight: 850;

  cursor: pointer;
}

.summary-toggle svg {
  transition: transform 0.2s ease;
}

.summary-toggle svg.rotated {
  transform: rotate(180deg);
}

.flight-summary {
  overflow-x: auto;
  margin-top: 14px;
  padding: 15px;

  border: 1px solid var(--line);
  border-radius: 16px;

  color: var(--muted);
  background:
    color-mix(in srgb,
      var(--bg) 30%,
      transparent);

  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;

  font-size: 12px;
  line-height: 1.7;

  /* white-space: nowrap; */
}

.state-card {
  display: grid;
  min-height: 260px;
  padding: 40px;
  place-items: center;

  color: var(--muted);
  text-align: center;
}

.state-card strong {
  color: var(--text);
  font-size: 21px;
}

.state-card p {
  margin: 0;
}

.error-state strong {
  color: var(--danger);
}

.affiliate-note {
  display: flex;
  align-items: flex-start;
  gap: 11px;

  margin-top: 26px;
  padding: 18px;

  border: 1px solid var(--line);
  border-radius: 20px;

  color: var(--muted);
  background: var(--panel-soft);

  font-size: 13px;
  line-height: 1.75;
}

.affiliate-note svg {
  flex-shrink: 0;
  margin-top: 3px;
  color: var(--green);
}

.affiliate-note p {
  margin: 0;
}

.footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;

  padding: 46px 0 0;

  color: var(--muted);
  font-size: 12px;
}

.footer strong,
.footer span {
  display: block;
}

.footer strong {
  color: var(--text);
  font-size: 16px;
}

.footer span {
  margin-top: 5px;
}

.footer p {
  margin: 0;
}

.spinning {
  animation: spin 0.8s linear infinite;
}

.stay-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 22px 0;
}

.stay-filter-button {
  padding: 10px 18px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--panel);
  color: var(--text-secondary);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.stay-filter-button:hover {
  transform: translateY(-1px);
}

.stay-filter-button.active {
  background:
    linear-gradient(135deg,
      var(--primary),
      var(--primary-2));
  border-color: var(--text-primary);
  color: var(--background);
}

.stay-filter-section {
  margin: 24px 0;
}

.stay-filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-secondary);
}

.stay-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1000px) {
  .nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-actions {
    width: 100%;
  }

  .month-nav {
    flex: 1;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .flight-card-main {
    grid-template-columns:
      minmax(0, 1fr) minmax(230px, 1fr);
  }

  .price-box {
    grid-column: 1 / -1;
    text-align: left;
  }
}

@media (max-width: 720px) {
  .price-box strong{
    display: inline;
    /* margin-left: auto; */
  }
    .price-box a{
      margin-left: 30px;
    }
  .page {
    width: min(100% - 20px,
        1180px);
  }

  .nav-actions {
    align-items: stretch;
    flex-wrap: wrap;
  }

  .month-nav {
    width: 100%;
    order: 3;
  }

  .refresh-button {
    flex: 1;
  }

  .hero-main,
  .best-panel {
    padding: 25px;
    /* text-align: left; */
  }

  .hero h1 {
    font-size:
      clamp(37px, 12vw, 52px);
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .flight-card {
    padding: 21px 16px;
  }

  .flight-card-main {
    grid-template-columns: 1fr;
    padding-left: 17px;
  }

  .route {
    max-width: 440px;
  }

  .price-box {
    grid-column: auto;
  }

  .footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>