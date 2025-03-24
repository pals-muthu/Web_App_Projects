import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import JobsPage from '@/views/JobsPage.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import JobPage from '@/views/JobPage.vue'
import AddJobView from '@/views/AddJobView.vue'
import EditJobView from '@/views/EditJobView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsPage,
    },
    {
      path: '/jobs/:id',
      name: 'job',
      component: JobPage,
    },
    {
      path: '/jobs/add',
      name: 'Add Job',
      component: AddJobView,
    },
    {
      path: '/jobs/edit/:id',
      name: 'Edit Job',
      component: EditJobView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView,
    },
    {
      path: '/:pathMatch(.*)',
      name: 'badNotFound',
      component: NotFoundView,
    },
  ],
})

export default router
