<template>
  <div id="app">
    <!-- 登录页不使用 Dashboard 布局，仅渲染路由视图 -->
    <router-view v-if="$route && $route.name === 'Login'" />
    <!-- 其他页面使用 Dashboard 布局 -->
    <Dashboard v-else />
  </div>
</template>

<script>
// @ is an alias to /src
import Dashboard from '@/views/Dashboard.vue'

export default {
  name: 'AppView',
  components: {
    Dashboard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* 全局样式 - 重置body margin */
body {
  margin: 0;
  padding: 0;
}

ul{
  padding-left:0;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
