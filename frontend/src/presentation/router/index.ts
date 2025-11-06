import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export * from './navigationHelper'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/presentation/views/HomeView.vue'),
    meta: { titleKey: 'nav.home' }
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/presentation/views/CardsView.vue'),
    meta: { titleKey: 'nav.cards' }
  },
  {
    path: '/participants',
    name: 'participants',
    component: () => import('@/presentation/views/ParticipantsView.vue'),
    meta: { titleKey: 'nav.participants' }
  },
  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('@/presentation/views/InvoicesView.vue'),
    meta: { titleKey: 'nav.invoices' }
  },
  {
    path: '/invoice/:id',
    name: 'invoice-detail',
    component: () => import('@/presentation/views/InvoiceDetailView.vue'),
    meta: { titleKey: 'invoice.detail' },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((_to, _from, next) => {
  document.title = 'InvoiceManager'
  next()
})

export default router
