<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Plane,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  Trophy,
} from 'lucide-vue-next'

import {
  createClient,
} from '@supabase/supabase-js'

import AppNavbar from '../components/AppNavbar.vue'

// ======================================================
// Supabase
// ======================================================

const SUPABASE_URL =
  'https://rrukbblbbizycawbvprr.supabase.co'

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

const CANDIDATE_REASON =
  '2026-09-full'

const theme = ref(
  localStorage.getItem('flight_theme') ||
  'dark',
)

const flights = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

// ======================================================
// 日報固定資料
// ======================================================

const report = {
  date: '2026-07-16',
  displayDate: '2026 年 7 月 16 日',
  route: '桃園 TPE → 東京 NRT／HND',

  searchedCombinations: 150,

  lowerHalfLowestPrice: 7736,

  departureRange:
    '9 月 1 日至 30 日',

  stayDayOptions:
    '7、10、14、15、16 天',
}

// ======================================================
// Computed
// ======================================================

const sortedFlights = computed(() => {
  return [...flights.value].sort(
    (a, b) =>
      Number(a.candidate_rank) -
      Number(b.candidate_rank),
  )
})

const bestFlight = computed(() => {
  return sortedFlights.value[0] || null
})

const lowestPrice = computed(() => {
  if (!bestFlight.value) {
    return null
  }

  return Number(
    bestFlight.value.price,
  )
})

const highestSelectedPrice = computed(() => {
  if (!sortedFlights.value.length) {
    return null
  }

  return Math.max(
    ...sortedFlights.value.map(
      (flight) =>
        Number(flight.price),
    ),
  )
})

const selectedPriceDifference =
  computed(() => {
    if (
      lowestPrice.value === null ||
      highestSelectedPrice.value === null
    ) {
      return null
    }

    return (
      highestSelectedPrice.value -
      lowestPrice.value
    )
  })

const lowerHalfDifference =
  computed(() => {
    if (lowestPrice.value === null) {
      return null
    }

    return (
      report.lowerHalfLowestPrice -
      lowestPrice.value
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
// 格式化
// ======================================================

const formatPrice = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return '—'
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

const formatShortDate = (value) => {
  if (!value) {
    return '—'
  }

  const [
    ,
    month,
    day,
  ] = value.split('-')

  return `${
    Number(month)
  }/${
    Number(day)
  }`
}

const formatDateTime = (value) => {
  if (!value) {
    return report.displayDate
  }

  return new Intl.DateTimeFormat(
    'zh-TW',
    {
      timeZone: 'Asia/Taipei',
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

const getStayDays = (flight) => {
  return (
    flight?.stay_days ??
    calculateStayDays(
      flight?.departure_date,
      flight?.return_date,
    )
  )
}

const getAirportName = (airport) => {
  const airportNames = {
    TPE: '桃園機場',
    TSA: '松山機場',
    NRT: '成田機場',
    HND: '羽田機場',
    TYO: '東京',
  }

  return (
    airportNames[airport] ||
    airport ||
    '機場待確認'
  )
}

const getPriceLevel = (price) => {
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
    text: '今日候選',
    icon: '',
  }
}



// ======================================================
// Trip.com 聯盟網址
// ======================================================

const TRIP_AFFILIATE = {
  Allianceid: '9296239',
  SID: '324535324',
  trip_sub1: '',
  trip_sub3: 'D18704191',
}

const getAffiliateUrl = (flight) => {
  if (!flight?.search_url) {
    return '#'
  }

  try {
    const url = new URL(
      flight.search_url,
    )

    Object.entries(
      TRIP_AFFILIATE,
    ).forEach(([key, value]) => {
      if (!value) {
        return
      }

      url.searchParams.set(
        key,
        value,
      )
    })

    return url.toString()
  } catch (error) {
    console.error(
      'Affiliate URL 解析失敗：',
      error,
    )

    return flight.search_url
  }
}

// ======================================================
// Supabase：取得本日三組重點航班
// ======================================================

const fetchReportFlights = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    /*
      日報挑三種代表性方案：

      1. 全月最低價
      2. 最佳停留彈性
      3. 下半月最低價

      前兩筆先從九月 Top 10 取得。
    */
    const {
      data: candidates,
      error: candidatesError,
    } = await supabase
      .from('flight_candidates')
      .select(`
        id,
        flight_price_id,
        rank,
        score,
        reason,
        created_at
      `)
      .eq(
        'reason',
        CANDIDATE_REASON,
      )
      .order('rank', {
        ascending: true,
      })
      .limit(2)

    if (candidatesError) {
      throw candidatesError
    }

    if (!candidates?.length) {
      flights.value = []
      return
    }

    /*
      再從 flight_prices 找下半月最低價。
    */
    const {
      data: lowerHalfRows,
      error: lowerHalfError,
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
      .gte(
        'departure_date',
        '2026-09-16',
      )
      .lt(
        'departure_date',
        '2026-10-01',
      )
      .order('price', {
        ascending: true,
      })
      .limit(1)

    if (lowerHalfError) {
      throw lowerHalfError
    }

    const candidateFlightIds =
      candidates
        .map(
          (candidate) =>
            candidate.flight_price_id,
        )
        .filter(Boolean)

    const {
      data: candidateFlights,
      error: candidateFlightsError,
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
      .in(
        'id',
        candidateFlightIds,
      )

    if (candidateFlightsError) {
      throw candidateFlightsError
    }

    const flightMap = new Map(
      (candidateFlights || []).map(
        (flight) => [
          flight.id,
          flight,
        ],
      ),
    )

    const selectedCandidates =
      candidates
        .map((candidate) => {
          const flight = flightMap.get(
            candidate.flight_price_id,
          )

          if (!flight) {
            return null
          }

          return {
            ...flight,

            candidate_id:
              candidate.id,

            candidate_rank:
              candidate.rank,

            candidate_score:
              candidate.score,

            report_reason:
              candidate.rank === 1
                ? '目前完整九月最低價。'
                : '9/8 出發的 14、15、16 天方案同價；選擇 16 天可以比 14 天多停留兩天。',
          }
        })
        .filter(Boolean)

    const lowerHalfFlight =
      lowerHalfRows?.[0]
        ? {
            ...lowerHalfRows[0],

            candidate_id:
              `lower-half-${
                lowerHalfRows[0].id
              }`,

            candidate_rank: 3,

            report_reason:
              '目前九月下半月最低價，適合只能在 9/16 之後出發的旅客。',
          }
        : null

    flights.value = [
      ...selectedCandidates,
      ...(lowerHalfFlight
        ? [lowerHalfFlight]
        : []),
    ]
  } catch (error) {
    console.error(error)

    errorMessage.value =
      error?.message ||
      '日報航班讀取失敗'

    flights.value = []
  } finally {
    isLoading.value = false
  }
}

// ======================================================
// Lifecycle
// ======================================================

onMounted(() => {
  applyTheme()
  fetchReportFlights()
})

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
</script>

<template>
  <main class="report-page">
    <AppNavbar
      :theme="theme"
      :show-month-nav="false"
      @toggle-theme="toggleTheme"
    />

    <div class="report-breadcrumb">
      <RouterLink to="/">
        <ArrowLeft :size="15" />
        返回九月精選機票
      </RouterLink>

      <span>每日機票日報</span>
    </div>

    <!-- ==================================================
         Hero
    =================================================== -->

    <section class="report-hero">
      <div class="report-hero-main">
        <div class="report-eyebrow">
          <CalendarDays :size="15" />

          {{ report.displayDate }}
          FLIGHT DAILY
        </div>

        <h1>
          東京機票日報：
          <br />
          九月最低價仍集中在上半月。
        </h1>

        <p class="report-lead">
          SaveFlow 今日完成桃園飛東京的完整九月掃描，
          比較 9 月 1 日至 30 日出發，以及
          7、10、14、15、16 天等 150 組旅行條件，
          從大量航班中整理出目前最值得注意的方案。
        </p>

        <div class="report-meta">
          <span>
            <Plane :size="14" />
            {{ report.route }}
          </span>

          <span>
            <Target :size="14" />
            {{ report.searchedCombinations }}
            組日期條件
          </span>

          <span>
            <Clock3 :size="14" />
            價格快照：
            {{
              formatDateTime(
                latestCapturedAt,
              )
            }}
          </span>
        </div>
      </div>

      <aside class="daily-winner">
        <template v-if="bestFlight">
          <span class="winner-label">
            <Trophy :size="16" />
            今日九月最低價
          </span>

          <strong class="winner-price">
            {{
              formatPrice(
                bestFlight.price,
              )
            }}
          </strong>

          <p class="winner-airline">
            {{
              bestFlight.airline ||
              '航空公司待確認'
            }}
          </p>

          <p class="winner-route">
            {{
              formatShortDate(
                bestFlight.departure_date,
              )
            }}
            →
            {{
              formatShortDate(
                bestFlight.return_date,
              )
            }}
          </p>

          <div class="winner-tags">
            <span>
              停留
              {{
                getStayDays(
                  bestFlight,
                )
              }}
              天
            </span>

            <span>
              {{
                bestFlight.origin ||
                'TPE'
              }}
              →
              {{
                bestFlight.destination ||
                'TYO'
              }}
            </span>

            <span>
              {{
                bestFlight.direct
                  ? '直飛候選'
                  : '轉機候選'
              }}
            </span>
          </div>

          <a
            :href="
              getAffiliateUrl(
                bestFlight,
              )
            "
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            查看 Trip.com 即時價格
            <ExternalLink :size="15" />
          </a>
        </template>

        <div
          v-else-if="isLoading"
          class="winner-state"
        >
          <RefreshCw
            :size="25"
            class="spinning"
          />

          正在讀取今日最低價……
        </div>

        <div
          v-else
          class="winner-state"
        >
          {{
            errorMessage ||
            '目前沒有航班資料'
          }}
        </div>
      </aside>
    </section>

    <!-- ==================================================
         數據摘要
    =================================================== -->

    <section class="report-metrics">
      <article>
        <span>掃描條件</span>

        <strong>
          150
          <small>組</small>
        </strong>

        <p>
          30 個出發日 ×
          5 種停留時間
        </p>
      </article>

      <article>
        <span>完整排行榜</span>

        <strong>
          10
          <small>組</small>
        </strong>

        <p>
          從大量航班中整理出的
          九月精選方案
        </p>
      </article>

      <article>
        <span>三組重點價差</span>

        <strong>
          {{
            formatPrice(
              selectedPriceDifference,
            )
          }}
        </strong>

        <p>
          今日三組代表方案的
          最高與最低價差
        </p>
      </article>

      <article>
        <span>下半月最低</span>

        <strong>
          {{
            formatPrice(
              report.lowerHalfLowestPrice,
            )
          }}
        </strong>

        <p>
          比全月最低高
          {{
            lowerHalfDifference ??
            '—'
          }}
          元
        </p>
      </article>
    </section>

    <!-- ==================================================
         今日三個觀察
    =================================================== -->

    <section class="report-section">
      <div class="section-heading">
        <span>DAILY INSIGHTS</span>

        <h2>今日三個重要觀察</h2>

        <p>
          最低價本身不是唯一重點，
          日期之間的價差與停留彈性，
          才是 SaveFlow 想替你整理的資訊。
        </p>
      </div>

      <div class="insight-grid">
        <article class="insight-card">
          <span class="insight-icon">
            <Trophy :size="21" />
          </span>

          <div>
            <strong>
              9/14 出發是目前全月最低
            </strong>

            <p>
              9/14～9/24、停留 10 天的捷星日本方案，
              今日價格快照為
              <b>NT$7,291</b>。
            </p>
          </div>
        </article>

        <article class="insight-card">
          <span class="insight-icon">
            <Sparkles :size="21" />
          </span>

          <div>
            <strong>
              同價最多可以多玩兩天
            </strong>

            <p>
              9/8 出發的 14、15、16 天方案，
              都是 <b>NT$7,331</b>。
              行程允許時，16 天方案的 CP 值更高。
            </p>
          </div>
        </article>

        <article class="insight-card">
          <span class="insight-icon">
            <TrendingDown :size="21" />
          </span>

          <div>
            <strong>
              全月 Top 10 集中在上半月
            </strong>

            <p>
              下半月最低為
              <b>NT$7,736</b>，
              比全月最低高 NT$445，
              因此目前尚未進入完整九月 Top 10。
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- ==================================================
         今日三組重點航班
    =================================================== -->

    <section class="today-picks-section">
      <div class="today-picks-header">
        <div class="recommendation-icon">
          <Sparkles :size="24" />
        </div>

        <div class="recommendation-content">
          <span>TODAY'S PICKS</span>

          <h2>今日三組重點航班</h2>

          <p>
            日報不重複完整排行榜，
            只挑出今天最有代表性的三組方案：
            全月最低、最佳停留彈性，以及下半月最低價。
          </p>

          <RouterLink
            class="full-ranking-link"
            to="/"
          >
            查看完整九月 Top 10
            <ExternalLink :size="15" />
          </RouterLink>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="flight-state"
      >
        <RefreshCw
          :size="27"
          class="spinning"
        />

        正在讀取今日重點航班……
      </div>

      <div
        v-else-if="errorMessage"
        class="flight-state error-state"
      >
        {{ errorMessage }}
      </div>

      <div
        v-else-if="!sortedFlights.length"
        class="flight-state"
      >
        目前沒有重點航班資料。
      </div>

      <div
        v-else
        class="flight-grid"
      >
        <article
          v-for="flight in sortedFlights"
          :key="flight.candidate_id"
          class="flight-card"
          :class="{
            best:
              flight.candidate_rank === 1,
          }"
        >
          <span class="rank">
            {{
              flight.candidate_rank === 1
                ? 'BEST'
                : `#${flight.candidate_rank}`
            }}
          </span>

          <div class="flight-card-main">
            <div class="airline-info">
              <div class="flight-badges">
                <span
                  class="badge"
                  :class="
                    getPriceLevel(
                      flight.price,
                    ).className
                  "
                >
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

                <span class="badge">
                  {{
                    flight.direct
                      ? '直飛'
                      : '轉機'
                  }}
                </span>

                <span class="badge">
                  停留
                  {{
                    getStayDays(
                      flight,
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

              <a
                :href="
                  getAffiliateUrl(
                    flight,
                  )
                "
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
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

          <div class="report-reason">
            <strong>今日入選理由</strong>

            <p>
              {{
                flight.report_reason
              }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- ==================================================
         今日購買觀察
    =================================================== -->

    <section class="recommendation-section">
      <div class="recommendation-icon">
        <Sparkles :size="24" />
      </div>

      <div class="recommendation-content">
        <span>SAVEFLOW VERDICT</span>

        <h2>今日購買觀察</h2>

        <p>
          如果你能在九月上半月出發，
          目前可以優先查看
          <strong>9/8、9/9、9/14</strong>
          附近的航班。
          其中 9/8 的長天數方案具有明顯彈性，
          適合希望延長旅行、但不想提高機票支出的人。
        </p>

        <p>
          SaveFlow 目前累積的長期歷史資料仍有限，
          因此這份日報不預測未來一定會漲價或降價。
          本文呈現的是今日價格快照與日期之間的相對比較。
        </p>
      </div>
    </section>

    <!-- ==================================================
         產生方式
    =================================================== -->

    <section class="report-section">
      <div class="section-heading">
        <span>METHODOLOGY</span>

        <h2>這份日報怎麼產生？</h2>
      </div>

      <div class="method-grid">
        <article>
          <span>01</span>

          <strong>
            建立 150 組搜尋條件
          </strong>

          <p>
            搜尋 9/1～9/30 出發，
            搭配 7、10、14、15、16 天停留。
          </p>
        </article>

        <article>
          <span>02</span>

          <strong>
            掃描大量航班結果
          </strong>

          <p>
            每組條件搜尋桃園出發、
            成田或羽田抵達的候選航班。
          </p>
        </article>

        <article>
          <span>03</span>

          <strong>
            保存每組低價方案
          </strong>

          <p>
            每個日期條件留下價格較低的航班，
            並保存當次價格快照。
          </p>
        </article>

        <article>
          <span>04</span>

          <strong>
            整理全月 Top 10
          </strong>

          <p>
            合併上下半月結果，
            重新排序後選出完整九月精選。
          </p>
        </article>
      </div>
    </section>

    <section class="report-disclaimer">
      <CheckCircle2 :size="18" />

      <p>
        本頁價格為 SaveFlow 在
        {{ report.displayDate }}
        抓取的資料快照，不代表目前仍有相同庫存。
        機票價格、航班時間、行李、艙等與付款條件，
        請以 Trip.com 最終頁面為準。
        本頁部分連結為聯盟連結，
        不會增加你的付款金額。
      </p>
    </section>
  </main>
</template>

<style scoped>
.report-page {
  width: min(
    1180px,
    calc(100% - 32px)
  );
  margin: 0 auto;
  padding-bottom: 64px;
}

.report-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0 20px;
  color: var(--muted);
  font-size: 13px;
}

.report-breadcrumb a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text);
  font-weight: 700;
  text-decoration: none;
}

/* ======================================================
   Hero
====================================================== */

.report-hero {
  display: grid;
  grid-template-columns:
    minmax(0, 1.45fr)
    minmax(300px, 0.55fr);
  gap: 18px;
  align-items: stretch;
}

.report-hero-main,
.daily-winner,
.report-section,
.today-picks-section,
.recommendation-section {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 26px;
  background: var(--panel);
}

.report-hero-main {
  padding: clamp(30px, 5vw, 62px);
}

.report-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.report-hero h1 {
  max-width: 790px;
  margin: 24px 0 20px;
  font-size: clamp(42px, 6vw, 72px);
  line-height: 1.04;
  letter-spacing: -0.055em;
}

.report-lead {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.9;
}

.report-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
}

.report-meta span,
.winner-tags span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  background: var(--panel-soft);
  font-size: 12px;
  font-weight: 700;
}

.daily-winner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px;
}

.winner-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 900;
}

.winner-price {
  display: block;
  margin-top: 22px;
  font-size: clamp(42px, 5vw, 64px);
  line-height: 1;
  letter-spacing: -0.05em;
}

.winner-airline {
  margin: 16px 0 0;
  font-size: 18px;
  font-weight: 800;
}

.winner-route {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 17px;
}

.winner-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 20px;
}

.daily-winner > a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 46px;
  margin-top: 24px;
  padding: 0 16px;
  border-radius: 13px;
  color: #111827;
  background:
    linear-gradient(
      135deg,
      var(--primary),
      var(--primary-2)
    );
  font-weight: 900;
  text-align: center;
  text-decoration: none;
}

.winner-state {
  display: grid;
  place-items: center;
  gap: 12px;
  min-height: 240px;
  color: var(--muted);
}

/* ======================================================
   Metrics
====================================================== */

.report-metrics {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 14px;
  margin-top: 18px;
}

.report-metrics article {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--panel);
}

.report-metrics span {
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.report-metrics strong {
  display: block;
  margin-top: 12px;
  font-size: 27px;
}

.report-metrics small {
  font-size: 13px;
}

.report-metrics p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.65;
}

/* ======================================================
   General Sections
====================================================== */

.report-section {
  margin-top: 18px;
  padding: clamp(28px, 5vw, 50px);
}

.section-heading {
  max-width: 760px;
}

.section-heading > span,
.recommendation-content > span {
  color: var(--primary);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.section-heading h2,
.recommendation-content h2 {
  margin: 13px 0 12px;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.15;
  letter-spacing: -0.035em;
}

.section-heading p,
.recommendation-content p {
  margin: 0;
  color: var(--muted);
  line-height: 1.85;
}

/* ======================================================
   Insights
====================================================== */

.insight-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 14px;
  margin-top: 28px;
}

.insight-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--panel-soft);
}

.insight-icon {
  display: flex;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  color: #111827;
  background:
    linear-gradient(
      135deg,
      var(--primary),
      var(--primary-2)
    );
}

.insight-card strong {
  display: block;
  line-height: 1.45;
}

.insight-card p {
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}

.insight-card b {
  color: var(--text);
}

/* ======================================================
   Today's Picks Header
====================================================== */

.today-picks-section {
  margin-top: 18px;
  padding: clamp(28px, 5vw, 50px);
  border-color:
    color-mix(
      in srgb,
      var(--primary) 40%,
      var(--line)
    );
}

.today-picks-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.recommendation-icon {
  display: flex;
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: #111827;
  background:
    linear-gradient(
      135deg,
      var(--primary),
      var(--primary-2)
    );
}

.recommendation-content {
  flex: 1;
  min-width: 0;
}

.full-ranking-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 42px;
  margin-top: 20px;
  padding: 0 15px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--text);
  background: var(--panel-soft);
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
}

.today-picks-section .flight-grid,
.flight-state {
  margin-top: 30px;
}

.flight-state {
  display: grid;
  min-height: 160px;
  place-items: center;
  gap: 10px;
  color: var(--muted);
}

/* ======================================================
   Flight Cards — 與首頁相同
====================================================== */

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
    linear-gradient(
      145deg,
      var(--panel-soft),
      color-mix(
        in srgb,
        var(--panel-soft) 48%,
        transparent
      )
    );
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.flight-card:hover {
  transform: translateY(-3px);
  border-color:
    color-mix(
      in srgb,
      var(--blue) 40%,
      var(--line)
    );
  background: var(--blue-soft);
}

.flight-card.best {
  border-color:
    color-mix(
      in srgb,
      var(--green) 42%,
      var(--line)
    );
  background:
    linear-gradient(
      145deg,
      var(--green-soft),
      var(--panel-soft)
    );
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
    minmax(0, 1.1fr)
    minmax(250px, 1.4fr)
    auto;
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
    color-mix(
      in srgb,
      var(--green) 38%,
      transparent
    );
  color: var(--green);
  background: var(--green-soft);
}

.badge.secondary {
  border-color:
    color-mix(
      in srgb,
      var(--yellow) 38%,
      transparent
    );
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
  grid-template-columns:
    1fr auto 1fr;
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
  color: var(--text);
  background: var(--panel-soft);
  font-size: 12px;
  font-weight: 850;
  text-decoration: none;
}

.flight-summary-wrapper {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.flight-summary-title {
  color: var(--text);
  font-size: 13px;
  font-weight: 850;
}

.flight-summary {
  overflow-x: auto;
  margin: 10px 0 0;
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 16px;
  color: var(--muted);
  background:
    color-mix(
      in srgb,
      var(--bg) 30%,
      transparent
    );
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  font-size: 12px;
  line-height: 1.75;
  white-space: pre-line;
}

.report-reason {
  margin-top: 12px;
  padding: 14px 15px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel-soft);
}

.report-reason strong {
  font-size: 12px;
}

.report-reason p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}

/* ======================================================
   Verdict
====================================================== */

.recommendation-section {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-top: 18px;
  padding: clamp(28px, 5vw, 50px);
  border-color:
    color-mix(
      in srgb,
      var(--primary) 40%,
      var(--line)
    );
}

.recommendation-content p + p {
  margin-top: 14px;
}

.recommendation-content strong {
  color: var(--text);
}

/* ======================================================
   Method
====================================================== */

.method-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 14px;
  margin-top: 28px;
}

.method-grid article {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel-soft);
}

.method-grid article > span {
  color: var(--primary);
  font-size: 12px;
  font-weight: 900;
}

.method-grid strong {
  display: block;
  margin-top: 16px;
}

.method-grid p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.75;
}

/* ======================================================
   Disclaimer
====================================================== */

.report-disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 18px;
  padding: 20px 22px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel-soft);
}

.report-disclaimer svg {
  flex: 0 0 auto;
  margin-top: 3px;
}

.report-disclaimer p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

.spinning {
  animation: spinning 0.8s linear infinite;
}

@keyframes spinning {
  to {
    transform: rotate(360deg);
  }
}

/* ======================================================
   Tablet
====================================================== */

@media (max-width: 900px) {
  .report-hero {
    grid-template-columns: 1fr;
  }

  .report-metrics {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .insight-grid {
    grid-template-columns: 1fr;
  }

  .method-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .flight-card-main {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(220px, 1fr);
  }

  .price-box {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    text-align: left;
  }

  .price-box a {
    margin-top: 0;
  }
}

/* ======================================================
   Mobile
====================================================== */

@media (max-width: 640px) {
  .report-page {
    width: calc(100% - 20px);
    padding-bottom: 40px;
  }

  .report-breadcrumb {
    align-items: flex-start;
    /* flex-direction: column; */
    gap: 8px;
  }

  .report-hero-main,
  .daily-winner,
  .report-section,
  .today-picks-section,
  .recommendation-section {
    padding: 24px 18px;
    border-radius: 24px;
  }

  .report-hero h1 {
    margin-top: 20px;
    font-size: clamp(
      38px,
      11vw,
      50px
    );
    line-height: 1.1;
    letter-spacing: -0.045em;
    /* word-break: keep-all; */
  }

  .report-lead {
    font-size: 15px;
    line-height: 1.85;
  }

  .report-meta {
    align-items: flex-start;
  }

  .report-meta span {
    max-width: 100%;
    white-space: normal;
  }

  .winner-price {
    font-size: 50px;
  }

  .daily-winner > a {
    width: 100%;
  }

  .report-metrics {
    grid-template-columns: 1fr;
  }

  .today-picks-header,
  .recommendation-section {
    flex-direction: column;
    gap: 14px;
  }

  .full-ranking-link {
    width: 100%;
  }

  .today-picks-section .flight-grid {
    margin-top: 22px;
  }

  .flight-card {
    padding: 20px 16px 16px;
    border-radius: 21px;
  }

  .flight-card-main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    padding-left: 0;
    padding-top: 24px;
  }

  .airline-info h3 {
    font-size: 21px;
  }

  .airline-info p {
    font-size: 14px;
  }

  .route {
    grid-template-columns:
      1fr auto 1fr;
    gap: 10px;
    padding: 16px 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .route-line {
    min-width: 65px;
  }

  .airport strong {
    font-size: 23px;
  }

  .price-box {
    grid-column: auto;
    display: block;
    text-align: left;
  }

  .price-box strong {
    font-size: 32px;
  }

  .price-box a {
    display: flex;
    width: 100%;
    justify-content: center;
    min-height: 44px;
    margin-top: 12px;
  }

  .flight-summary {
    max-height: none;
    overflow-x: hidden;
    padding: 13px;
    font-size: 12px;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  .method-grid {
    grid-template-columns: 1fr;
  }

  .report-disclaimer {
    padding: 17px;
  }
}
</style>