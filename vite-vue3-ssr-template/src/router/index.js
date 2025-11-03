import { createRouter as _createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'

export function createRouter() {
  const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ]

  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  })
}