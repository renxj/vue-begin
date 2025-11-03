<template>
  <div>
    <h1>🏠 Home Page</h1>
    <button @click="increment">count: {{ store.count }}</button>
    <router-link to="/about">Go About →</router-link>
  </div>
</template>

<script setup>
import { useMainStore } from '../store'
const store = useMainStore()
const increment = () => store.increment()
</script>