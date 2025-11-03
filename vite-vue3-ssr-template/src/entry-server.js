import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url) {
  const { app, router } = createApp()
  await router.push(url)
  await router.isReady()
  const appContent = await renderToString(app)
  return { appContent }
}