import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: { title: 'Calendar' },
    },
    {
      path: '/email',
      name: 'Email',
      component: () => import('../views/Email.vue'),
      meta: { title: 'Email' },
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: () => import('../views/Tasks.vue'),
      meta: { title: 'Tasks' },
    },
    {
      path: '/ai/text',
      name: 'Text Generator',
      component: () => import('../views/AI/TextGenerator.vue'),
      meta: { title: 'Text Generator' },
    },
    {
      path: '/ai/image',
      name: 'Image Generator',
      component: () => import('../views/AI/ImageGenerator.vue'),
      meta: { title: 'Image Generator' },
    },
    {
      path: '/ai/code',
      name: 'Code Generator',
      component: () => import('../views/AI/CodeGenerator.vue'),
      meta: { title: 'Code Generator' },
    },
    {
      path: '/ai/video',
      name: 'Video Generator',
      component: () => import('../views/AI/VideoGenerator.vue'),
      meta: { title: 'Video Generator' },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `TailAdmin - ${to.meta.title}`
  next()
})
