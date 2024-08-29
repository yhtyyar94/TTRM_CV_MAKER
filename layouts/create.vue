<script lang="ts" setup>
const { locale, t } = useI18n()
const route = useRoute()

useHead({
  htmlAttrs: {
    lang: locale,
  },
  title: t(String(route.meta.titleI18n)),
  // ... (rest of your head config)
})
</script>

<template>
  <div class="font-landing text-fl-xs text-slate-800">
    <header class="p-fl-sm mb-fl-md max-w-screen-xl mx-auto">
      <nav class="font-light flex justify-between items-center">
        <LandingLogo />
        <section class="flex gap-fl-xs">
          <LandingLangSwitch />
        </section>
      </nav>
    </header>
    <main class="flex max-w-screen-xl mx-auto">
      <slot />
    </main>
  </div>
</template>