import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (p) => path.resolve(__dirname, p)

async function createServer() {
  const app = express()

  const vite = await (await import('vite')).createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  app.use(vite.middlewares)

  // app.use('*', async (req, res) => {
  //   try {
  //     const url = req.originalUrl

  //     let template = fs.readFileSync(resolve('../index.html'), 'utf-8')
  //     template = await vite.transformIndexHtml(url, template)

  //     const { render } = await vite.ssrLoadModule('/src/entry-server.js')
  //     const { appContent } = await render(url)

  //     const html = template.replace(`<!--ssr-outlet-->`, appContent)
  //     res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  //   } catch (e) {
  //     vite.ssrFixStacktrace(e)
  //     console.error(e)
  //     res.status(500).end(e.message)
  //   }
  // })


  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      process.env.VITE_SSR_FORCE_ESM = 'true' // ✅ 强制加载 ESM 构建

      let template = fs.readFileSync(resolve('../index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)

      const { render } = await vite.ssrLoadModule('/src/entry-server.js')
      const { appContent } = await render(url)

      const html = template.replace(`<!--ssr-outlet-->`, appContent)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })


  app.listen(5173, () => {
    console.log('✅ SSR server running at http://localhost:5173')
  })
}

createServer()