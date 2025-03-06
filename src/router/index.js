import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InvoiceView from '@/views/InvoiceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/invoice/:invoiceId',
      name: 'Invoice',
      component: InvoiceView,
      meta: {
        title: 'Home'
      }
    },

  ],
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title ?? "TAB_NAME"} | INVOICE`
  next()
})

export default router
