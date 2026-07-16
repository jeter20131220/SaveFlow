import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'

import FlightDealsView from '../views/FlightDealsView.vue'
import WhySaveFlowView from '../views/WhySaveFlowView.vue'
import DailyReportView from '../views/DailyReportView.vue'

const router = createRouter({
  history: createWebHashHistory(),

  routes: [
    {
      path: '/',
      name: 'flight-deals',
      component: FlightDealsView,
    },
    {
      path: '/why-saveflow',
      name: 'why-saveflow',
      component: WhySaveFlowView,
    },
    {
  path: '/daily-report',
  name: 'daily-report',
  component: DailyReportView,
},
  ],
})

export default router