<template>
    <div>
      <h2>Home</h2>
      <HelloWorld msg="这是首页，使用 Router + Pinia" />
  
      <div style="margin-top:16px;">
        <button @click="inc">+1</button>
        <button @click="dec">-1</button>
        <button @click="sum">+10</button>
        <p>当前计数：{{ counter.count }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import HelloWorld from '@/components/HelloWorld.vue'
  import { useCounterStore } from '@/stores/counter'
  const counter = useCounterStore()
  const inc = () => counter.increment()
  const dec = () => counter.decrement()
  const sum = () => counter.sum()
  </script>
  