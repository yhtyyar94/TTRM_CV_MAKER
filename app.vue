<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
</script>
<template>
   <Analytics />
  <NuxtPwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
