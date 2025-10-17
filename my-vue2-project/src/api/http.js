import axios from 'axios'
import store from '@/store' // 引入 Vuex store
import router from '@/router' // 引入 Vue Router

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 从环境变量获取基础 API 地址
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      // 如果存在 token，则在请求头中添加 token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log(error+'请求错误') // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const res = response.data
    console.log(res)
    // 假设业务状态码不是 200 则为错误
    if (res.code !== 200) {
      // 处理业务错误
      if (res.code === 401 || res.code === 403) {
        // 未授权或禁止访问，跳转到登录页
        // router.push('/login')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    // 对响应错误做点什么
    console.log('err' + error+ 'eeee') // for debug
    // // 处理 HTTP 错误
    if (error.response && error.response.status === 401) {
      // 未授权，跳转到登录页
      router.push('/login')
    }
    
    return Promise.reject(error)
  }
)

export default service