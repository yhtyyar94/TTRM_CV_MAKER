<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()

const emailHref = computed(() => {
  return `mailto:${formSettings.value.email}`
})
const phoneNumberHref = computed(() => {
  return `tel:${formSettings.value.phoneNumber}`
})
</script>

<template>
  <section
    class="cv__section"
    :class="formSettings.layout === 'one-column' && 'mt-0'"
  >
    <div
      class="flex items-center gap-4"
    >
      <div
        v-if="formSettings.email"
        class="cv__icon-wrapper flex items-center gap-2"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#email" />
        </svg>
        <a
          :href="emailHref"
          rel="noopener"
        >{{ formSettings.email }}</a>
      </div>
      <div
        v-if="formSettings.phoneNumber"
        class="cv__icon-wrapper flex items-center gap-2"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#phone" />
        </svg>
        <a
          :href="phoneNumberHref"
          rel="noopener"
        >{{ formSettings.phoneNumber }}</a>
      </div>
      <div
        v-if="formSettings.location"
        class="cv__icon-wrapper flex items-center gap-2"
      >
        <svg class="cv__icon">
          <use href="@/assets/sprite.svg#location" />
        </svg>
        <span tabindex="0">{{ formSettings.location }}</span>
      </div>
    </div>
  </section>
</template>
