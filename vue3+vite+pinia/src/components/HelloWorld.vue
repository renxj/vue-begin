<template>
  <div class="hello">
    <p>{{ msg }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ msg?: string }>()
const msg = props.msg ?? 'Hello from HelloWorld'
</script>

<style scoped>
.hello { color: #42b983; font-size: 18px; }
</style>
