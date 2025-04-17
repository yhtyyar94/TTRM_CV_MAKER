<script lang="ts" setup>
const localePath = useLocalePath()
</script>

<template>
  <h1>
    <NuxtLink :to="localePath('/')" class="bg-none font-bold text-fl-lg font-logo uppercase tracking-widest"
      active-class="bg-none">
      <img height="200" width="150" src="../../assets/werhere_nl_logo.png" />
    </NuxtLink>
  </h1>
</template>
