// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// export default defineConfig({
//   plugins: [vue()],
//   build: {
//     rollupOptions: {
//       input: './index.html'
//     }
//   },
//   ssr: {
//     noExternal: ['vue', 'vue-router', 'pinia']
//   }
// })


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  },
  ssr: {
    noExternal: ['vue', 'vue-router', 'pinia']
  }
})

