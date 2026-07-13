<script setup>
import { computed, ref } from 'vue'
import {
  WalletCards,
  CalendarDays,
  Clock3,
  ExternalLink,
  History,
  MessageSquarePlus,
  BadgePercent,
  Store,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Info,
  Send,
  Search,
  Sparkles,
  MapPin,
  Copy,
} from 'lucide-vue-next'

const activePage = ref('today')
const selectedCategory = ref('all')
const submitted = ref(false)

const today = new Date()

const formatToday = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(today)

const categories = [
  { id: 'all', label: '全部' },
  { id: 'paypay', label: 'PayPay' },
  { id: 'convenience', label: '便利商店' },
  { id: 'shopping', label: '購物' },
  { id: 'food', label: '餐飲' },
  { id: 'entertainment', label: '娛樂' },
]

/**
 * Demo JSON
 *
 * 正式上線後可改成：
 * axios.get('/api/deals/today')
 */
const todayDeals = ref([
  {
    "id": "paypay-7eleven-20260713-001",
    "platform": "PayPay",
    "category": "convenience",
    "brand": "7-Eleven",
    "merchant": "セブン-イレブン",
    "title": "7-Eleven PayPay 付款最高回饋 10%",
    "summary": "透過 7-Eleven App 使用 PayPay 付款，最高回饋 10%。",
    "rewardType": "percentage",
    "rewardValue": 10,
    "rewardText": "最高 10%",
    "minimumSpend": 0,
    "rewardLimit": 100,
    "usageLimit": 1,
    "startDate": null,
    "endDate": "2026-07-31",
    "deadlineText": "2026-07-31 23:59",
    "location": "日本",
    "mustClaim": true,
    "personalized": true,
    "eligibleForAllUsers": false,
    "sourceType": "PayPay Coupon",
    "sourceUrl": null,
    "verified": true,
    "featured": false,
    "notes": [
      "SoftBank 用戶限定",
      "需綁定 Yahoo! JAPAN ID",
      "需透過 7-Eleven App",
      "菸品不適用"
    ]
  },
  {
    "id": "paypay-jins-20260713-001",
    "platform": "PayPay",
    "category": "fashion",
    "brand": "JINS",
    "merchant": "JINS",
    "title": "JINS 消費最高回饋 10%",
    "summary": "JINS 購物最高回饋 10%。",
    "rewardType": "percentage",
    "rewardValue": 10,
    "rewardText": "最高 10%",
    "minimumSpend": 9900,
    "rewardLimit": 1000,
    "usageLimit": 1,
    "startDate": null,
    "endDate": "2026-07-26",
    "deadlineText": "2026-07-26 23:59",
    "location": "日本",
    "mustClaim": true,
    "personalized": null,
    "eligibleForAllUsers": null,
    "sourceType": "PayPay Coupon",
    "sourceUrl": null,
    "verified": true,
    "featured": false,
    "notes": [
      "需先追蹤並領取優惠券"
    ]
  },
  {
    "id": "paypay-klook-20260713-001",
    "platform": "PayPay",
    "category": "travel",
    "brand": "Klook",
    "merchant": "Klook",
    "title": "Klook 最高贈送 999 點 PayPay Point",
    "summary": "每月 9、19、29 日可使用，符合條件最高獲得 999 點。",
    "rewardType": "points",
    "rewardValue": 999,
    "rewardText": "最高 999 點",
    "minimumSpend": 10000,
    "rewardLimit": 999,
    "usageLimit": 1,
    "startDate": null,
    "endDate": "2026-07-19",
    "deadlineText": "2026-07-19 23:59",
    "location": "線上",
    "mustClaim": true,
    "personalized": null,
    "eligibleForAllUsers": null,
    "sourceType": "PayPay Coupon",
    "sourceUrl": null,
    "verified": true,
    "featured": true,
    "notes": [
      "每月 9、19、29 日可使用",
      "限線上付款"
    ]
  },
  {
    "id": "paypay-cokeon-20260713-001",
    "platform": "PayPay",
    "category": "food",
    "brand": "Coke ON",
    "merchant": "Coke ON",
    "title": "首次使用 PayPay 購買飲料最高回饋 50%",
    "summary": "於支援 Coke ON Pay 的販賣機首次使用 PayPay 購買飲料可享最高 50% 回饋。",
    "rewardType": "percentage",
    "rewardValue": 50,
    "rewardText": "最高 50%",
    "minimumSpend": 0,
    "rewardLimit": 100,
    "usageLimit": 1,
    "startDate": null,
    "endDate": "2026-08-31",
    "deadlineText": "2026-08-31 23:59",
    "location": "日本",
    "mustClaim": true,
    "personalized": null,
    "eligibleForAllUsers": null,
    "sourceType": "PayPay Coupon",
    "sourceUrl": null,
    "verified": true,
    "featured": true,
    "notes": [
      "首次使用 PayPay",
      "限支援 Coke ON Pay 自動販賣機",
      "限線上領取優惠券"
    ]
  },
  {
    "id": "paypay-matsuyafoods-20260713-001",
    "platform": "PayPay",
    "category": "food",
    "brand": "松屋フーズ",
    "merchant": "松屋フーズ",
    "title": "松屋 Food PayPay 付款最高回饋 10%",
    "summary": "SoftBank 用戶限定，使用 PayPay 付款可獲得最高 10% PayPay Point 回饋。",
    "rewardType": "percentage",
    "rewardValue": 10,
    "rewardText": "最高 10%",
    "rewardLabel": "PayPay 點數回饋",
    "minimumSpend": 0,
    "rewardLimit": 100,
    "usageLimit": 1,
    "startDate": null,
    "endDate": "2026-07-31",
    "deadlineText": "2026-07-31 23:59",
    "location": "日本指定門市",
    "mustClaim": true,
    "personalized": false,
    "eligibleForAllUsers": false,
    "sourceType": "PayPay Super Coupon",
    "sourceUrl": null,
    "verified": true,
    "featured": false,
    "notes": [
      "SoftBank 用戶限定",
      "使用優惠券前需將 PayPay 帳號與已完成 Smart Login 設定的 Yahoo! JAPAN ID 綁定",
      "單次回饋上限 100 點",
      "活動期間僅可使用 1 次",
      "總回饋上限 100 點"
    ],
    "capturedAt": "2026-07-13T14:32:00+09:00"
  },
  {
    "id": "paypay-mosburger-20260713-001",
    "platform": "PayPay",
    "category": "food",
    "brand": "モスバーガー",
    "merchant": "モスバーガー",
    "title": "摩斯漢堡 PayPay 付款最高回饋 10%",
    "summary": "SoftBank 用戶限定，使用 PayPay 付款可獲得最高 10% PayPay Point 回饋。",
    "rewardType": "percentage",
    "rewardValue": 10,
    "rewardText": "最高 10%",
    "rewardLabel": "PayPay 點數回饋",
    "minimumSpend": 0,
    "rewardLimit": 100,
    "usageLimit": 1,
    "startDate": null,
    "endDate": "2026-07-31",
    "deadlineText": "2026-07-31 23:59",
    "location": "日本指定門市",
    "mustClaim": true,
    "personalized": false,
    "eligibleForAllUsers": false,
    "sourceType": "PayPay Super Coupon",
    "sourceUrl": null,
    "verified": true,
    "featured": false,
    "notes": [
      "SoftBank 用戶限定",
      "使用優惠券前需將 PayPay 帳號與已完成 Smart Login 設定的 Yahoo! JAPAN ID 綁定",
      "單次回饋上限 100 點",
      "活動期間僅可使用 1 次",
      "總回饋上限 100 點"
    ],
    "capturedAt": "2026-07-13T14:32:00+09:00"
  }

])

const historyDeals = ref([
  {
    id: 101,
    brand: 'PayPay',
    merchant: 'FamilyMart',
    title: '便利商店付款回饋',
    rewardText: '最高 10%',
    period: '2026/07/01－2026/07/07',
    status: 'ended',
    reports: 18,
  },
  {
    id: 102,
    brand: 'PayPay',
    merchant: 'BicCamera',
    title: '指定門市付款活動',
    rewardText: '最高 5%',
    period: '2026/06/15－2026/06/30',
    status: 'ended',
    reports: 9,
  },
  {
    id: 103,
    brand: 'Uniqlo',
    merchant: 'Uniqlo',
    title: '感謝祭期間限定價格',
    rewardText: '指定商品特價',
    period: '2026/05/22－2026/05/28',
    status: 'ended',
    reports: 31,
  },
])

const payPaySources = [
  {
    title: 'PayPay 官方活動頁',
    description: '全國性回饋活動、支付活動、抽獎與期間限定優惠。',
    frequency: '每天檢查',
    icon: BadgePercent,
  },
  {
    title: 'PayPay App 優惠券',
    description: '依照使用者、品牌與地區出現的 Coupon，常需要先領取。',
    frequency: '每天檢查',
    icon: CreditCard,
  },
  {
    title: '合作品牌官方網站',
    description: 'Lawson、7-Eleven、FamilyMart、餐廳與零售品牌公布的聯名活動。',
    frequency: '每 6 小時',
    icon: Store,
  },
  {
    title: '地方政府回饋活動',
    description: '部分市區町村會推出 PayPay 地區消費回饋，通常有指定區域。',
    frequency: '每天檢查',
    icon: MapPin,
  },
  {
    title: '使用者回報',
    description: '補充 App 內限定、門市海報、區域限定或尚未收錄的活動。',
    frequency: '即時收集',
    icon: MessageSquarePlus,
  },
]

const reportForm = ref({
  brand: '',
  merchant: '',
  title: '',
  reward: '',
  period: '',
  sourceUrl: '',
  note: '',
  email: '',
})

const filteredDeals = computed(() => {
  if (selectedCategory.value === 'all') {
    return todayDeals.value
  }

  return todayDeals.value.filter(
    deal => deal.category === selectedCategory.value,
  )
})

const featuredDeal = computed(() =>
  todayDeals.value.find(deal => deal.featured),
)

const submitReport = () => {
  if (
    !reportForm.value.brand ||
    !reportForm.value.title ||
    !reportForm.value.note
  ) {
    alert('請填寫品牌、活動標題與活動內容。')
    return
  }

  console.log('discount report', {
    ...reportForm.value,
    createdAt: new Date().toISOString(),
  })

  submitted.value = true

  reportForm.value = {
    brand: '',
    merchant: '',
    title: '',
    reward: '',
    period: '',
    sourceUrl: '',
    note: '',
    email: '',
  }
}

const changePage = page => {
  activePage.value = page
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const payPayReferralCode = '02-CKFVTZH'
const referralCopied = ref(false)

const copyReferralCode = async () => {
  try {
    await navigator.clipboard.writeText(payPayReferralCode)
    referralCopied.value = true

    window.setTimeout(() => {
      referralCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy referral code:', error)
    alert(`PayPay 好友介紹碼：${payPayReferralCode}`)
  }
}

const getDeadlineText = (deal) => {
  if (!deal.endDate) {
    return deal.deadlineText || '截止日期待確認'
  }

  const now = new Date()
  const end = new Date(`${deal.endDate}T23:59:59+09:00`)

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  )

  const endStart = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
  )

  const diffDays = Math.ceil(
    (endStart.getTime() - todayStart.getTime()) / 86400000,
  )

  if (diffDays < 0) {
    return '活動已結束'
  }

  if (diffDays === 0) {
    return '今天截止'
  }

  if (diffDays === 1) {
    return '明天截止'
  }

  if (diffDays <= 7) {
    return `剩 ${diffDays} 天`
  }

  return `${end.getMonth() + 1}/${end.getDate()} 截止`
}
</script>

<template>
  <main class="page">
    <nav class="nav">
      <a class="brand" href="#top">
        <div class="logo">
          <WalletCards :size="21" />
        </div>

        <div>
          <strong>SaveFlow</strong>
          <span>日本生活省錢助手</span>
        </div>
      </a>

      <div class="nav-actions">
        <a href="#featured">
          今日精選
        </a>

        <a href="#today-deals">
          優惠分類
        </a>

        <a href="#paypay-beginner">
          PayPay 新手
        </a>

        <a class="report-nav-btn" href="#today-deals">
          查看今日優惠
          <ChevronRight :size="16" />
        </a>
      </div>
    </nav>

    <!-- 今日首頁 -->
    <template v-if="activePage === 'today'">
      <section class="hero">
        <div class="date-badge">
          <CalendarDays :size="15" />
          {{ formatToday }}
        </div>

        <h1>
          每天打開一次，<br />
          就知道今天哪裡最值得省錢。
        </h1>

        <p>
          整理 PayPay 回饋、便利商店優惠、Amazon JP 特價，
          以及日本生活中值得注意的期間限定活動。
        </p>

        <div class="hero-actions">
          <a href="#today-deals" class="primary-link">
            查看今日優惠
            <ChevronRight :size="17" />
          </a>

          <!-- <button @click="changePage('report')">
            我發現新的優惠
          </button> -->
        </div>
      </section>

      <section   id="featured" v-if="featuredDeal" class="featured-section">
        <div class="featured-label">
          <Sparkles :size="15" />
          今日最值得注意
        </div>

        <article class="featured-card">
          <div class="featured-content">
            <div class="merchant-line">
              <span class="merchant-avatar">
                {{ featuredDeal.merchant.slice(0, 1) }}
              </span>

              <div>
                <strong>{{ featuredDeal.merchant }}</strong>
                <span>{{ featuredDeal.sourceType }}</span>
              </div>
            </div>

            <h2>{{ featuredDeal.title }}</h2>
            <p>{{ featuredDeal.summary }}</p>

            <div class="featured-meta">
              <span>
                <Clock3 :size="15" />
                {{ featuredDeal.deadline }}
              </span>

              <span>
                <MapPin :size="15" />
                {{ featuredDeal.location }}
              </span>
            </div>
          </div>

          <div class="reward-panel">
            <span>{{ featuredDeal.rewardLabel }}</span>
            <strong>{{ featuredDeal.rewardText }}</strong>

            <!-- <a :href="featuredDeal.sourceUrl">
              查看活動
              <ExternalLink :size="15" />
            </a> -->
          </div>
        </article>
      </section>

      <section  id="today-deals" class="deals-section">
        <div class="section-head">
          <div>
            <span class="eyebrow">TODAY</span>
            <h2>今天可以省什麼？</h2>
          </div>

          <div class="updated-time">
            <Clock3 :size="15" />
            最後更新：今天 09:00
          </div>
        </div>

        <div class="category-tabs">
          <button v-for="category in categories" :key="category.id"
            :class="{ active: selectedCategory === category.id }" @click="selectedCategory = category.id">
            {{ category.label }}
          </button>
        </div>

        <div class="deal-grid">
          <article v-for="deal in filteredDeals" :key="deal.id" class="deal-card">
            <div class="deal-card-head">
              <div class="merchant-avatar">
                {{ deal.merchant.slice(0, 1) }}
              </div>

              <div class="merchant-info">
                <strong>{{ deal.merchant }}</strong>
                <span>{{ deal.sourceType }}</span>
              </div>

              <div v-if="deal.verified" class="verified" title="已確認活動來源">
                <CheckCircle2 :size="16" />
              </div>
            </div>

            <div class="reward">
              <strong>{{ deal.rewardText }}</strong>
              <span>{{ deal.rewardLabel }}</span>
            </div>

            <h3>{{ deal.title }}</h3>
            <p>{{ deal.summary }}</p>

            <div class="deal-bottom">
              <!-- <div> -->
              <small>{{ deal.location || '適用範圍待確認' }}</small>

              <span>{{ getDeadlineText(deal) }}</span>
              <!-- </div> -->
            </div>
          </article>
        </div>

        <div v-if="!filteredDeals.length" class="empty-state">
          今天暫時沒有這個分類的優惠。
        </div>
      </section>

      <section class="daily-note">
        <Info :size="19" />

        <div>
          <strong>首頁只顯示今天仍有效的活動</strong>
          <p>
            已結束的活動會移到「過往活動」，方便確認品牌過去曾推出哪些優惠。
          </p>
        </div>

        <!-- <button @click="changePage('history')">
          查看過往活動
          <ChevronRight :size="16" />
        </button> -->
      </section>
      <section   id="paypay-beginner" class="paypay-referral">
        <div class="referral-main">
          <div class="referral-badge">
            <CreditCard :size="15" />
            PAYPAY BEGINNER
          </div>

          <h2>還沒有 PayPay？</h2>

          <p class="referral-description">
            使用 SaveFlow 提供的 PayPay 好友介紹碼註冊，
            並完成 PayPay 官方指定條件後，
            即可獲得 <strong>300 點 PayPay Points</strong>。
          </p>


          <div class="referral-code-box">
            <div class="referral-code-content">
              <span>SaveFlow 好友介紹碼</span>
              <strong>{{ payPayReferralCode }}</strong>
            </div>

            <button type="button" class="copy-code-btn" @click="copyReferralCode">
              <CheckCircle2 v-if="referralCopied" :size="17" />
              <Copy v-else :size="17" />

              {{ referralCopied ? '已複製' : '複製介紹碼' }}
            </button>
          </div>

          <div class="referral-notice">
            <Info :size="16" />

            <p>
              此為 SaveFlow 的好友介紹碼，SaveFlow 可能因此獲得 PayPay Point。
              實際適用對象、完成條件、回饋點數與活動期間，請以 PayPay App
              顯示及官方公告為準。
            </p>

          </div>

          <div class="referral-notice">
            <Info :size="16" />

            <p> 官方條件：
              註冊後 60 天內輸入介紹碼，並使用 PayPay 累積支付滿 1,000 日圓以上，
              完成後你與推薦人皆可各獲得 300 點 PayPay Points。</p>
          </div>

        </div>

        <div class="referral-side">
          <div class="referral-point">
            <span>目前好友介紹特典</span>
            <strong>每人 300 pt</strong>
            <small>依 PayPay App 目前顯示</small>
          </div>

          <div class="referral-steps">
            <div>
              <span>01</span>
              <p>註冊 PayPay</p>
            </div>

            <div>
              <span>02</span>
              <p>輸入介紹碼</p>
            </div>

            <div>
              <span>03</span>
              <p>完成指定條件</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- 過往活動 -->
    <template v-else-if="activePage === 'history'">
      <section class="inner-hero">
        <div class="page-icon">
          <History :size="22" />
        </div>

        <span class="eyebrow">HISTORY</span>
        <h1>過往優惠紀錄</h1>
        <p>
          查看品牌過去推出過的回饋與折扣，了解活動頻率與常見優惠幅度。
        </p>
      </section>

      <section class="history-section">
        <div class="search-box">
          <Search :size="17" />
          <input placeholder="搜尋品牌或活動名稱" />
        </div>

        <div class="history-list">
          <article v-for="item in historyDeals" :key="item.id" class="history-item">
            <div class="history-brand">
              {{ item.merchant.slice(0, 1) }}
            </div>

            <div class="history-content">
              <div>
                <strong>{{ item.merchant }}</strong>
                <span>活動已結束</span>
              </div>

              <h3>{{ item.title }}</h3>
              <p>{{ item.period }}</p>
            </div>

            <div class="history-reward">
              <strong>{{ item.rewardText }}</strong>
              <span>{{ item.reports }} 人回報</span>
            </div>
          </article>
        </div>
      </section>
    </template>

    <!-- PayPay 資料來源 -->
    <template v-else-if="activePage === 'sources'">
      <section class="inner-hero">
        <div class="page-icon">
          <CreditCard :size="22" />
        </div>

        <span class="eyebrow">PAYPAY SOURCES</span>
        <h1>PayPay 優惠可以從哪裡更新？</h1>
        <p>
          SaveFlow 可以整合官方活動、App 優惠券、合作品牌與使用者回報，
          讓不同來源的優惠集中在同一個地方。
        </p>
      </section>

      <section class="source-grid">
        <article v-for="source in payPaySources" :key="source.title" class="source-card">
          <div class="source-icon">
            <component :is="source.icon" :size="20" />
          </div>

          <h3>{{ source.title }}</h3>
          <p>{{ source.description }}</p>

          <span>
            <Clock3 :size="14" />
            {{ source.frequency }}
          </span>
        </article>
      </section>

      <section class="source-flow">
        <div>
          <span>01</span>
          <strong>收集活動</strong>
          <p>取得官方與品牌活動資訊。</p>
        </div>

        <ChevronRight :size="20" />

        <div>
          <span>02</span>
          <strong>整理條件</strong>
          <p>解析品牌、期間、回饋與適用地區。</p>
        </div>

        <ChevronRight :size="20" />

        <div>
          <span>03</span>
          <strong>今日顯示</strong>
          <p>首頁只顯示今天仍有效的優惠。</p>
        </div>

        <ChevronRight :size="20" />

        <div>
          <span>04</span>
          <strong>個人化通知</strong>
          <p>未來依照收藏品牌推送活動。</p>
        </div>
      </section>
    </template>

    <!-- 使用者回報 -->
    <template v-else>
      <section class="inner-hero">
        <div class="page-icon">
          <MessageSquarePlus :size="22" />
        </div>

        <span class="eyebrow">COMMUNITY REPORT</span>
        <h1>回報你最近看到的優惠</h1>
        <p>
          有些優惠只會出現在 PayPay App、門市海報或特定地區，
          你的回報可以幫助其他人不要錯過。
        </p>
      </section>

      <section class="report-section">
        <div v-if="!submitted" class="report-card">
          <div class="report-grid">
            <label>
              品牌名稱 *
              <input v-model="reportForm.brand" placeholder="例如 PayPay、Lawson" />
            </label>

            <label>
              適用店家
              <input v-model="reportForm.merchant" placeholder="例如 7-Eleven" />
            </label>

            <label class="full">
              活動標題 *
              <input v-model="reportForm.title" placeholder="例如 PayPay Coupon 最高回饋 10%" />
            </label>

            <label>
              優惠內容
              <input v-model="reportForm.reward" placeholder="例如 10%、¥100 OFF" />
            </label>

            <label>
              活動期間
              <input v-model="reportForm.period" placeholder="例如 7/13－7/20" />
            </label>

            <label class="full">
              活動網址
              <input v-model="reportForm.sourceUrl" type="url" placeholder="https://..." />
            </label>

            <label class="full">
              活動說明 *
              <textarea v-model="reportForm.note" rows="5" placeholder="請說明在哪裡看到、使用條件、是否需要先領券等。" />
            </label>

            <label class="full">
              聯絡 Email
              <input v-model="reportForm.email" type="email" placeholder="選填，僅用於確認活動內容" />
            </label>
          </div>

          <button class="submit-btn" @click="submitReport">
            <Send :size="17" />
            送出優惠回報
          </button>
        </div>

        <div v-else class="report-success">
          <div>
            <CheckCircle2 :size="28" />
          </div>

          <h2>感謝你的回報</h2>
          <p>
            活動確認後會顯示在今日優惠或過往活動紀錄。
          </p>

          <button @click="submitted = false">
            再回報一筆優惠
          </button>
        </div>
      </section>
    </template>

    <footer class="footer">
      <div>
        <strong>SaveFlow</strong>
        <span>每天打開一次，就知道今天哪裡最值得省錢。</span>
      </div>

      <p>優惠內容請以品牌與支付平台官方公告為準。</p>
    </footer>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

#featured,
#today-deals,
#paypay-beginner {
  scroll-margin-top: 32px;
}

button,
input,
textarea {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

button {
  cursor: pointer;
}

.page {
  min-height: 100vh;
  padding: 26px;
  color: #172033;
  background:
    radial-gradient(circle at 10% 0%, rgba(53, 111, 255, 0.13), transparent 30%),
    radial-gradient(circle at 95% 15%, rgba(91, 33, 182, 0.07), transparent 27%),
    #f7f9fc;
  font-family:
    Inter,
    "Noto Sans TC",
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.nav {
  max-width: 1160px;
  margin: 0 auto 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.brand {
  padding: 0;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-align: left;
  text-decoration: none;
}

.logo {
  width: 43px;
  height: 43px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  color: white;
  background: #172033;
  box-shadow: 0 14px 32px rgba(23, 32, 51, 0.22);
}

.brand strong,
.brand span {
  display: block;
}

.brand strong {
  font-size: 18px;
  letter-spacing: -0.04em;
}

.brand span {
  margin-top: 2px;
  color: #778197;
  font-size: 12px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-actions a {
  height: 40px;
  padding: 0 13px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #697386;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-actions a:hover {
  color: #172033;
  background: white;
}

.nav-actions .report-nav-btn {
  margin-left: 6px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: white;
  background: #356fff;
}

.nav-actions .report-nav-btn:hover {
  color: white;
  background: #285fe8;
}

.hero {
  max-width: 900px;
  margin: 0 auto 48px;
  text-align: center;
}

.date-badge,
.featured-label,
.eyebrow {
  color: #356fff;
  font-weight: 900;
}

.date-badge {
  width: fit-content;
  margin: 0 auto 20px;
  padding: 8px 13px;
  border: 1px solid #dbe6ff;
  border-radius: 999px;
  background: #edf3ff;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
}

.hero h1,
.inner-hero h1 {
  margin: 0;
  letter-spacing: -0.075em;
}

.hero h1 {
  font-size: clamp(36px, 5vw, 60px);
  line-height: 1.5;
}

.hero p,
.inner-hero p {
  color: #697386;
  line-height: 1.8;
}

.hero p {
  max-width: 650px;
  margin: 22px auto 0;
  font-size: 18px;
}

.hero-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.hero-actions a,
.hero-actions button {
  height: 47px;
  padding: 0 19px;
  border-radius: 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  font-weight: 850;
}

.primary-link {
  color: white;
  background: #172033;
  box-shadow: 0 14px 35px rgba(23, 32, 51, 0.2);
}

.hero-actions button {
  border: 1px solid #dfe5ef;
  color: #172033;
  background: white;
}

.featured-section,
.deals-section,
.daily-note,
.inner-hero,
.history-section,
.source-grid,
.source-flow,
.report-section,
.footer {
  max-width: 1160px;
  margin-left: auto;
  margin-right: auto;
}

.featured-section {
  margin-bottom: 26px;
}

.featured-label {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
}

.featured-card {
  padding: 29px;
  border-radius: 30px;
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 30px;
  color: white;
  background:
    radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.15), transparent 30%),
    linear-gradient(135deg, #172033, #315fd2);
  box-shadow: 0 28px 70px rgba(42, 79, 164, 0.22);
}

.merchant-line,
.deal-card-head {
  display: flex;
  align-items: center;
}

.merchant-line {
  gap: 11px;
}

.merchant-line strong,
.merchant-line span {
  display: block;
}

.merchant-line span {
  margin-top: 3px;
  color: #c9d8ff;
  font-size: 12px;
}

.merchant-avatar,
.history-brand {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-weight: 950;
}

.merchant-avatar {
  width: 41px;
  height: 41px;
  border-radius: 14px;
  color: #356fff;
  background: white;
}

.featured-content h2 {
  margin: 24px 0 9px;
  font-size: 31px;
  letter-spacing: -0.05em;
  color: #dce6ff;
}

.featured-content>p {
  max-width: 650px;
  margin: 0;
  color: #dce6ff;
  line-height: 1.75;
}

.featured-meta {
  margin-top: 22px;
  display: flex;
  gap: 17px;
  color: #dce6ff;
  font-size: 13px;
}

.featured-meta span,
.updated-time,
.source-card>span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.reward-panel {
  padding: 24px;
  border-radius: 23px;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.reward-panel>span {
  color: #c9d8ff;
  font-size: 13px;
}

.reward-panel strong {
  margin-top: 5px;
  font-size: 37px;
  letter-spacing: -0.06em;
}

.reward-panel a {
  height: 42px;
  margin-top: 20px;
  border-radius: 13px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  color: #172033;
  background: white;
  text-decoration: none;
  font-weight: 850;
}

.deals-section {
  padding-top: 24px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.12em;
}

.section-head h2 {
  margin: 7px 0 0;
  font-size: 34px;
  letter-spacing: -0.055em;
}

.updated-time {
  color: #8790a2;
  font-size: 13px;
}

.category-tabs {
  margin-top: 21px;
  display: flex;
  gap: 7px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs button {
  height: 38px;
  padding: 0 15px;
  border: 1px solid #dfe5ef;
  border-radius: 999px;
  flex-shrink: 0;
  color: #697386;
  background: white;
  font-weight: 750;
}

.category-tabs button.active {
  border-color: #172033;
  color: white;
  background: #172033;
}

.deal-grid {
  margin-top: 17px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 17px;
}

.deal-card,
.history-item,
.source-card,
.report-card,
.report-success,
.daily-note,
.source-flow {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e3e8f0;
  box-shadow: 0 18px 54px rgba(23, 32, 51, 0.055);
}

.deal-card {
  min-width: 0;
  padding: 22px;
  border-radius: 24px;
}

.deal-card-head {
  gap: 10px;
}

.merchant-info {
  min-width: 0;
  flex: 1;
}

.merchant-info strong,
.merchant-info span {
  display: block;
}

.merchant-info span {
  margin-top: 2px;
  color: #8790a2;
  font-size: 12px;
}

.verified {
  color: #1ca56c;
}

.reward {
  margin-top: 23px;
}

.reward strong,
.reward span {
  display: block;
}

.reward strong {
  color: #356fff;
  font-size: 28px;
  letter-spacing: -0.055em;
}

.reward span {
  margin-top: 3px;
  color: #8790a2;
  font-size: 12px;
}

.deal-card h3 {
  margin: 19px 0 7px;
  font-size: 18px;
  letter-spacing: -0.035em;
}

.deal-card>p {
  min-height: 48px;
  margin: 0;
  color: #697386;
  line-height: 1.65;
  font-size: 14px;
}

.deal-bottom {
  margin-top: 22px;
  padding-top: 17px;
  border-top: 1px solid #edf0f5;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
}

.deal-bottom span,
.deal-bottom small {
  display: block;
}

.deal-bottom span {
  color: #e45b55;
  font-size: 13px;
  font-weight: 850;
}

.deal-bottom small {
  margin-top: 3px;
  color: #9aa2b1;
}

.deal-bottom a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #356fff;
  text-decoration: none;
  font-weight: 800;
  font-size: 13px;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #8790a2;
}

.daily-note {
  margin-top: 22px;
  padding: 20px 22px;
  border-radius: 22px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
}

.daily-note>svg {
  color: #356fff;
}

.daily-note strong {
  display: block;
}

.daily-note p {
  margin: 4px 0 0;
  color: #778197;
  font-size: 13px;
}

.daily-note button {
  padding: 0;
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #356fff;
  background: transparent;
  font-weight: 800;
}

.paypay-referral {
  max-width: 1160px;
  margin: 22px auto 0;
  padding: 28px;
  border: 1px solid #e3e8f0;
  border-radius: 28px;
  display: grid;
  grid-template-columns: 1fr 310px;
  gap: 30px;
  background:
    radial-gradient(circle at 92% 8%,
      rgba(34, 197, 194, 0.2),
      transparent 33%),
    radial-gradient(circle at 76% 100%,
      rgba(255, 208, 61, 0.23),
      transparent 35%),
    rgba(255, 255, 255, 0.94);
  box-shadow: 0 20px 60px rgba(23, 32, 51, 0.07);
}

.referral-main {
  min-width: 0;
}

.referral-badge {
  width: fit-content;
  padding: 7px 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #168f91;
  background: #e6fafa;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.referral-main h2 {
  margin: 14px 0 8px;
  font-size: 31px;
  letter-spacing: -0.055em;
}

.referral-description {
  max-width: 650px;
  margin: 0;
  color: #697386;
  line-height: 1.75;
}

.referral-code-box {
  max-width: 650px;
  margin-top: 21px;
  padding: 16px;
  border: 1px solid #dce2ec;
  border-radius: 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: #f8fafc;
}

.referral-code-content {
  min-width: 0;
}

.referral-code-content span,
.referral-code-content strong {
  display: block;
}

.referral-code-content span {
  color: #8790a2;
  font-size: 12px;
}

.referral-code-content strong {
  margin-top: 5px;
  font-size: 24px;
  letter-spacing: 0.055em;
  overflow-wrap: anywhere;
}

.copy-code-btn {
  height: 43px;
  padding: 0 15px;
  border: 0;
  border-radius: 13px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: white;
  background: #356fff;
  font-weight: 850;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.copy-code-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(53, 111, 255, 0.24);
}

.referral-notice {
  max-width: 650px;
  margin-top: 14px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #8790a2;
}

.referral-notice svg {
  margin-top: 2px;
  flex-shrink: 0;
}

.referral-notice p {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
}

.referral-side {
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.64);
  border-radius: 23px;
  background:
    linear-gradient(145deg,
      rgba(24, 178, 181, 0.96),
      rgba(38, 145, 218, 0.96));
  color: white;
}

.referral-point span,
.referral-point strong,
.referral-point small {
  display: block;
}

.referral-point span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.referral-point strong {
  margin-top: 7px;
  font-size: 31px;
  letter-spacing: -0.055em;
}

.referral-point small {
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.72);
}

.referral-steps {
  margin-top: 25px;
  display: grid;
  gap: 10px;
}

.referral-steps>div {
  padding: 11px 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  background: rgba(255, 255, 255, 0.12);
}

.referral-steps span {
  width: 27px;
  height: 27px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #167f91;
  background: white;
  font-size: 11px;
  font-weight: 950;
}

.referral-steps p {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
}

.inner-hero {
  margin-bottom: 30px;
  text-align: center;
}

.page-icon {
  width: 51px;
  height: 51px;
  margin: 0 auto 17px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #356fff;
  background: #eaf1ff;
}

.inner-hero h1 {
  margin-top: 8px;
  font-size: clamp(39px, 6vw, 63px);
}

.inner-hero p {
  max-width: 650px;
  margin: 16px auto 0;
}

.history-section {
  max-width: 880px;
}

.search-box {
  height: 49px;
  padding: 0 15px;
  border: 1px solid #dfe5ef;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 9px;
  background: white;
}

.search-box svg {
  color: #98a1b2;
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #172033;
  background: transparent;
}

.history-list {
  margin-top: 15px;
  display: grid;
  gap: 12px;
}

.history-item {
  padding: 19px;
  border-radius: 21px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 15px;
}

.history-brand {
  width: 46px;
  height: 46px;
  border-radius: 15px;
  color: white;
  background: #356fff;
}

.history-content>div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-content>div span {
  padding: 4px 7px;
  border-radius: 999px;
  color: #8790a2;
  background: #f1f3f6;
  font-size: 11px;
  font-weight: 800;
}

.history-content h3 {
  margin: 7px 0 3px;
}

.history-content p,
.history-reward span {
  margin: 0;
  color: #8790a2;
  font-size: 12px;
}

.history-reward {
  text-align: right;
}

.history-reward strong,
.history-reward span {
  display: block;
}

.history-reward strong {
  color: #356fff;
  font-size: 19px;
}

.history-reward span {
  margin-top: 5px;
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.source-card {
  padding: 22px;
  border-radius: 23px;
}

.source-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #356fff;
  background: #edf3ff;
}

.source-card h3 {
  margin: 17px 0 7px;
}

.source-card p {
  min-height: 66px;
  margin: 0;
  color: #697386;
  line-height: 1.65;
  font-size: 14px;
}

.source-card>span {
  margin-top: 18px;
  color: #8790a2;
  font-size: 12px;
}

.source-flow {
  margin-top: 19px;
  padding: 23px;
  border-radius: 24px;
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  align-items: center;
  gap: 13px;
}

.source-flow>div>span {
  color: #356fff;
  font-size: 12px;
  font-weight: 950;
}

.source-flow strong,
.source-flow p {
  display: block;
}

.source-flow strong {
  margin-top: 5px;
}

.source-flow p {
  margin: 4px 0 0;
  color: #8790a2;
  font-size: 12px;
}

.source-flow>svg {
  color: #bcc4d1;
}

.report-section {
  max-width: 800px;
}

.report-card {
  padding: 26px;
  border-radius: 27px;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.report-grid label {
  display: grid;
  gap: 7px;
  color: #4d586d;
  font-size: 13px;
  font-weight: 850;
}

.report-grid .full {
  grid-column: 1 / -1;
}

.report-grid input,
.report-grid textarea {
  width: 100%;
  border: 1px solid #d7deea;
  border-radius: 14px;
  outline: 0;
  color: #172033;
  background: white;
}

.report-grid input {
  height: 47px;
  padding: 0 13px;
}

.report-grid textarea {
  padding: 13px;
  resize: vertical;
}

.report-grid input:focus,
.report-grid textarea:focus {
  border-color: #356fff;
  box-shadow: 0 0 0 4px rgba(53, 111, 255, 0.11);
}

.submit-btn {
  width: 100%;
  height: 50px;
  margin-top: 18px;
  border: 0;
  border-radius: 15px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: white;
  background: #356fff;
  font-weight: 900;
}

.report-success {
  padding: 52px 28px;
  border-radius: 27px;
  text-align: center;
}

.report-success>div {
  width: 59px;
  height: 59px;
  margin: 0 auto 15px;
  border-radius: 19px;
  display: grid;
  place-items: center;
  color: #14855a;
  background: #def7ea;
}

.report-success h2 {
  margin: 0;
}

.report-success p {
  color: #697386;
}

.report-success button {
  height: 42px;
  padding: 0 16px;
  border: 1px solid #dfe5ef;
  border-radius: 13px;
  color: #172033;
  background: white;
  font-weight: 800;
}

.footer {
  margin-top: 70px;
  padding: 25px 0 8px;
  border-top: 1px solid #e2e7ef;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  color: #8790a2;
  font-size: 12px;
}

.footer strong,
.footer span {
  display: block;
}

.footer strong {
  color: #172033;
  font-size: 15px;
}

.footer span {
  margin-top: 4px;
}

.footer p {
  margin: 0;
}

@media (max-width: 880px) {
  .page {
    padding: 18px;
  }

 .nav {
    margin-bottom: 48px;
  }

  .brand span {
    display: none;
  }

  .nav-actions a:not(.report-nav-btn) {
    display: none;
  }

  .nav-actions .report-nav-btn {
    margin-left: 0;
    padding: 0 12px;
    font-size: 13px;
  }

  .featured-card,
  .deal-grid,
  .source-grid {
    grid-template-columns: 1fr;
  }

  .featured-card {
    gap: 18px;
  }

  .reward-panel {
    min-height: 170px;
  }

  .source-flow {
    grid-template-columns: 1fr;
  }

  .source-flow>svg {
    display: none;
  }
}

@media (max-width: 620px) {
 .nav {
    margin-bottom: 48px;
  }

  .brand span {
    display: none;
  }

  .nav-actions a:not(.report-nav-btn) {
    display: none;
  }

  .nav-actions .report-nav-btn {
    margin-left: 0;
    padding: 0 12px;
    font-size: 13px;
  }

  .hero h1 {
    font-size: 43px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions a,
  .hero-actions button {
    width: 100%;
  }

  .section-head,
  .daily-note,
  .footer {
    display: block;
  }

  .updated-time {
    margin-top: 9px;
  }

  .daily-note button {
    margin-top: 13px;
  }

  .history-item {
    grid-template-columns: auto 1fr;
  }

  .history-reward {
    grid-column: 2;
    text-align: left;
  }

  .report-grid {
    grid-template-columns: 1fr;
  }

  .report-grid .full {
    grid-column: auto;
  }

  .footer p {
    margin-top: 13px;
  }
}
/* =========================
   PayPay Referral RWD
========================= */

@media (max-width: 900px) {
  .paypay-referral {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 24px;
  }

  .referral-code-box,
  .referral-description,
  .referral-notice {
    max-width: none;
  }

  .referral-side {
    display: grid;
    grid-template-columns: 220px 1fr;
    align-items: center;
    gap: 20px;
  }

  .referral-steps {
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  .paypay-referral {
    margin-top: 18px;
    padding: 20px;
    border-radius: 22px;
    gap: 20px;
  }

  .referral-main h2 {
    margin-top: 12px;
    font-size: 27px;
  }

  .referral-description {
    font-size: 14px;
    line-height: 1.7;
  }

  .referral-code-box {
    margin-top: 18px;
    padding: 14px;
    border-radius: 17px;
    flex-direction: column;
    align-items: stretch;
    gap: 13px;
  }

  .referral-code-content {
    text-align: center;
  }

  .referral-code-content strong {
    font-size: 22px;
  }

  .copy-code-btn {
    width: 100%;
    height: 45px;
  }

  .referral-side {
    padding: 19px;
    border-radius: 19px;
    display: block;
  }

  .referral-point {
    text-align: center;
  }

  .referral-point strong {
    font-size: 28px;
  }

  .referral-steps {
    margin-top: 20px;
  }
}

@media (max-width: 420px) {
  .paypay-referral {
    padding: 17px;
    border-radius: 19px;
  }

  .referral-badge {
    padding: 6px 9px;
    font-size: 10px;
  }

  .referral-main h2 {
    font-size: 24px;
  }

  .referral-description {
    font-size: 13px;
  }

  .referral-code-content strong {
    font-size: 19px;
    letter-spacing: 0.035em;
  }

  .referral-notice {
    gap: 7px;
  }

  .referral-notice p {
    font-size: 11px;
  }

  .referral-side {
    padding: 16px;
  }

  .referral-point strong {
    font-size: 25px;
  }

  .referral-steps > div {
    padding: 10px;
  }

  .referral-steps p {
    font-size: 12px;
  }
}
</style>