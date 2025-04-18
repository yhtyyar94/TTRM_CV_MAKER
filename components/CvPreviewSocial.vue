<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import { useLanguage } from '~/composables/useCvLang'

import cvLang from '~/data/cv'

const { language } = useLanguage()

const { formSettings } = useCvState()
</script>

<template>
  <section
    v-if="formSettings.displaySocial"
    class="cv__section"
  >
    <h4
      class="cv__section-title"
      :class="formSettings.layout === 'one-column' && 'sr-only'"
    >
      {{ cvLang[language].social }}
    </h4>
    <div
      class="flex"
      :class="formSettings.layout === 'one-column' ? 'flex-row flex-wrap gap-2' : 'flex-col'"
    >
      <div
        v-if="formSettings.linkedin"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#linkedin-color" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://linkedin.com/in/${formSettings.linkedin}`"
        >{{ formSettings.linkedin }}</a>
      </div>
      <div
        v-if="formSettings.twitter"
        class="cv__icon-wrapper"
      >
      <svg class="form__icon rounded mr-1" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="black"/>
</svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://twitter.com/${formSettings.twitter}`"
        >{{ formSettings.twitter }}</a>
      </div>
      <div
        v-if="formSettings.github"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#github-color" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="`https://github.com/${formSettings.github}`"
        >{{ formSettings.github }}</a>
      </div>
      <div
        v-if="formSettings.website"
        class="cv__icon-wrapper"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#website" />
        </svg>
        <a
          target="_blank"
          rel="noopener"
          :href="formSettings.website.includes('https') ? formSettings.website : `https://${formSettings.website}`"
        >{{
          formSettings.website
        }}</a>
      </div>
    </div>
  </section>
</template>
