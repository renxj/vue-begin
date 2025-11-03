<template>
  <div id="app">
    <header>
      <img src="./assets/vue.svg" alt="logo" class="logo" />
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// 空：用 script setup 管理局部逻辑
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 20px;
}
.logo { width: 48px; vertical-align: middle; margin-right: 12px; }
header { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
</style>
