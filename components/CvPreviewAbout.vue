<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import cvLang from '~/data/cv'
import { useLanguage } from '~/composables/useCvLang'

const { formSettings } = useCvState()
const { language } = useLanguage()
</script>

<template>
  <section class="cv__section cv__section--main">
    <h4
      class="cv__section-title cv__section-title--main"
      :class="formSettings.layout === 'one-column' && 'sr-only'"
    >
      {{ cvLang[language].about }}
    </h4>
    <p class="font-light">
      <!-- Avoids unnecessary spaces at the begging while still allowing break lines -->
      <span class="whitespace-pre-wrap">{{ formSettings.aboutme }}</span>
    </p>
  </section>
</template>
