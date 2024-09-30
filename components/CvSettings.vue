<script setup lang="ts">
import { SectionNameList } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'
import { useGoogleAI } from '~/composables/useGoogleAI'

const {
  formSettings,
  uploadCV,
  clearForm,
  resetForm,
} = useCvState()
const switchLocalePath = useSwitchLocalePath()
const i18n = useI18n()
const { downloadPdf, downloadWord } = usePrint()
const { generateContent } = useGoogleAI()
const isLoading = ref(false)
const loading = ref(false)

async function translate(text: string, lang: string, formType: string) {
  isLoading.value = true
  try {
    formSettings.value.aboutme = await generateContent(
      `translate the following " ${text}" in this ${lang}. And return only string. if its already in ${lang} language keep it as it `,
    )
  }
  catch (e) {
    console.log(e)
  }
  isLoading.value = false
}

const config = {
  layouts: ['one-column', 'two-column', 'one-column-alt', 'two-column-alt'],
  colors: [
    { name: 'pink', color: '#9D174D', darker: '#831843' },
    { name: 'purple', color: '#5B21B6', darker: '#4C1D95' },
    { name: 'blue', color: '#1E40AF', darker: '#1E3A8A' },
    { name: 'green', color: '#065F46', darker: '#064E3B' },
    { name: 'black', color: '#1F2937', darker: '#111827' },
  ],
  languages: [
    { name: 'en-name', code: 'en', isoname: 'English' },
    { name: 'tr-name', code: 'tr', isoname: 'Turkish' },
    { name: 'nl-name', code: 'nl', isoname: 'Dutch' },
    { name: 'bn-name', code: 'bn', isoname: 'Bangla' },
  ],
}

const selectedLanguage = ref(config.languages[0].code)

watch(
  () => formSettings.value,
  (newValue, oldValue) => {
    localStorage.setItem(`cvSettings-${i18n.locale.value}`, JSON.stringify(newValue))
    if (newValue.activeColor !== oldValue.activeColor) {
      const newColor = getCurrentColor(newValue.activeColor)
      changeColor(newColor.color, newColor.darker)
    }
  },
  { deep: true },
)

const formSettingsHref = computed(() => {
  return `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ formSettings: formSettings.value }),
  )}`
})

const availableLocales = computed(() => {
  return i18n.localeCodes.value.filter((locale: any) => !locale.includes('-'))
})

function changeColor(color: string, darker: string): void {
  formSettings.value.activeColor = color
  document.documentElement.style.setProperty('--primary', color)
  document.documentElement.style.setProperty('--primary-darker', darker)
}

function getCurrentColor(colorValue: string): {
  color: string
  darker: string
} {
  return (
    config.colors.find(color => color.color === colorValue)
    || config.colors[1]
  )
}

function onVideoLoad() {
  loading.value = false
}
</script>

<template>
  <div class="settings">
    <div class="flex justify-between items-center title pt-2 px-6">
      <LandingLogo />
    </div>

    <div class="px-6 py-4">
      <h5 class="m-2">
        How it Works
      </h5>
      <div class="px-2 py-4">
        <!-- Loader -->
        <div v-if="loading" class="loader" />

        <!-- Iframe video -->
        <iframe
          v-show="!loading"
          height="200"
          width="400"
          src="https://www.youtube.com/embed/22bdbn276t8?si=emXQEMshn1bbrlEg"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          @load="onVideoLoad"
        />
      </div>
    </div>

    <form class="form mb-10" autocomplete="on">
      <div class="form__section px-6 py-3">
        <h2 class="flex flex-wrap text-xl/normal pt-10 px-2 tracking-wide uppercase">
          <span class="title__text">
            <legend class="form__legend">
              {{ $t("cv-settings") }}
            </legend>
          </span>
        </h2>
        <button class="form__btn form__btn--ghost" type="button" @click="resetForm">
          {{ $t("reset-settings") }}
        </button>
        <button class="form__btn form__btn--ghost" type="button" @click="clearForm">
          {{ $t("clear-settings") }}
        </button>
      </div>

      <!-- LANGUAGE -->
      <fieldset class="form__section px-6 py-3">
        <legend class="form__legend">
          {{ $t("cv-language") }}
        </legend>
        <div class="flex flex-wrap gap-2 justify-start w-full">
          <nuxt-link
            v-for="locale in availableLocales" :key="locale" class="form__btn form__btn--ghost"
            :to="switchLocalePath(locale)" :exact="true"
          >
            {{ $t(`${locale}-name`) }}
          </nuxt-link>
        </div>
      </fieldset>
      <!-- LANGUAGE -->

      <!-- LAYOUT -->
      <fieldset class="form__section px-6 py-3">
        <legend class="form__legend">
          {{ $t("layout-theme") }}
        </legend>
        <div class="flex flex-wrap gap-2 justify-start">
          <label
            v-for="layout in config.layouts" :key="layout" tabindex="0"
            class="form__btn form__btn--ghost capitalize" :class="[
              {
                'form__btn--active':
                  layout === formSettings.layout,
              },
            ]"
          >
            {{ $t(layout) }}
            <input v-model="formSettings.layout" :value="layout" type="radio" class="sr-only">
          </label>
        </div>
      </fieldset>
      <!-- LAYOUT -->

      <!-- COLOR THEME -->
      <fieldset class="form__section px-6 py-3">
        <legend class="form__legend">
          {{ $t("color-theme") }}
        </legend>
        <div class="flex flex-wrap gap-2 justify-start">
          <label
            v-for="color in config.colors" :key="color.color" tabindex="0"
            class="form__btn form__btn--color-theme capitalize" :class="[
              `form__btn--${color.name}`,
              {
                'form__btn--color-selected':
                  color.color === formSettings.activeColor,
              },
            ]" @keydown.enter="changeColor(color.color, color.darker)"
          >
            {{ $t(color.name) }}
            <input
              v-model="formSettings.activeColor" type="radio" class="sr-only" :value="color.color"
              @change="changeColor(color.color, color.darker)"
            >
          </label>
        </div>
      </fieldset>
      <!-- COLOR THEME -->

      <!-- PERSONAL DETAILS -->
      <fieldset class="form__section">
        <expansion-panel :panel-name="$t('personal-details')">
          <template #title>
            <legend class="form__legend">
              {{ $t("personal-details") }}
            </legend>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-x-3 gap-y-10">
              <!-- Existing form fields -->
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="job-pos"
                >💼 {{ $t("job-title") }}</label>
                <input
                  id="job-pos"
                  v-model="formSettings.jobTitle"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="first-name"
                >👤 {{ $t("first-name") }}</label>
                <input
                  id="first-name"
                  v-model="formSettings.name"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="last-name"
                >👤 {{ $t("last-name") }}</label>
                <input
                  id="last-name"
                  v-model="formSettings.lastName"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  for="email"
                >✉️ {{ $t("email") }}</label>
                <input
                  id="email"
                  v-model="formSettings.email"
                  class="form__control"
                  type="email"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="location"
                >📍 {{ $t("location") }}</label>
                <input
                  id="location"
                  v-model="formSettings.location"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group">
                <label
                  class="form__label"
                  for="phone"
                >📱 {{ $t("phone-number") }}</label>
                <input
                  id="phone"
                  v-model="formSettings.phoneNumber"
                  class="form__control"
                  type="tel"
                >
              </div>

              <!-- About Me Section -->
              <div v-if="!isLoading" class="form__group col-span-full">
                <label class="form__label" for="aboutme">🌟 {{ $t("about-me") }}</label>
                <textarea
                  id="aboutme"
                  v-model="formSettings.aboutme"
                  class="form__control"
                  name="aboutme"
                  cols="30"
                  rows="10"
                />
              </div>
              <div v-else class="loader" />

              <!-- Language selection dropdown -->
              <div class="form__group col-span-full">
                <label class="form__label" for="language-select">
                  🌐 {{ $t("select-language") }}
                </label>
                <select
                  id="language-select"
                  v-model="selectedLanguage"
                  class="form__control"
                >
                  <option v-for="lang in config.languages" :key="lang.code" :value="lang.code">
                    {{ $t(lang.isoname) }}
                  </option>
                </select>
              </div>

              <!-- Translate button -->
              <div class="form__group col-span-full">
                <button
                  type="button"
                  class="form__btn form__btn--ghost"
                  @click="translate(formSettings.aboutme, selectedLanguage, 'aboutme')"
                >
                  {{ $t("translate-about-me") }}
                </button>
              </div>
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- PERSONAL DETAILS -->

      <!-- SKILLS -->
      <fieldset class="form__section grid gap-3">
        <expansion-panel :panel-name="$t('skills')">
          <template #title>
            <legend class="form__legend">
              {{ $t("skills") }}
            </legend>
          </template>
          <template #content>
            <div>
              <div class="video-container">
                <h2 class="video-heading">
                  Necessary Skills
                </h2>
                <div class="iframe-container">
                  <iframe

                    height="200"
                    width="400"
                    src="https://www.youtube.com/embed/22bdbn276t8?si=emXQEMshn1bbrlEg"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen
                  />
                </div>
              </div>
              <CvInputTags
                v-model="formSettings.jobSkills" tag-list-name="jobSkills"
                :tag-list-label="`🛠 ${$t('technical-skills')}`" :display="Boolean(formSettings.displayJobSkills)"
              />
              <CvInputTags
                v-model="formSettings.softSkills" tag-list-name="softSkills"
                :tag-list-label="`🧸 ${$t('soft-skills')}`" :display="Boolean(formSettings.displaySoftSkills)"
              />
              <CvInputTags
                v-model="formSettings.languages" tag-list-name="languages"
                :tag-list-label="`🌎 ${$t('languages')}`" :display="Boolean(formSettings.displayLanguages)"
              />
              <CvInputTags
                v-if="formSettings.layout === 'two-column-alt'" v-model="formSettings.interests" tag-list-name="interests"
                :tag-list-label="`🧸 ${$t('achievement')}`" :display="Boolean(formSettings.displayInterests)"
              />
              <CvInputTags
                v-else v-model="formSettings.interests" tag-list-name="interests"
                :tag-list-label="`🧸 ${$t('interests')}`" :display="Boolean(formSettings.displayInterests)"
              />
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- SKILLS -->

      <!-- SOCIAL -->
      <fieldset class="form__section grid gap-3">
        <expansion-panel :panel-name="$t('social')">
          <template #title>
            <legend class="form__legend">
              {{ $t("social") }}
            </legend>
          </template>
          <template #content>
            <div>
              <div class="video-container">
                <h2 class="video-heading">
                  Why Social Media are important
                </h2>
                <div class="iframe-container">
                  <iframe
                    width="560" height="315" src="https://www.youtube.com/embed/BBkhmog1ngw?si=9lO4LpXtSAVLq7NV"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
                  />
                </div>
              </div>
              <CvDisplayCheckbox
                class="form__display-checkbox mb-10" :display-section="formSettings.displaySocial"
                section-name="social"
              />
              <div class="grid grid-cols-2 gap-x-3 gap-y-10">
                <div class="form__group col-span-full">
                  <label class="form__label flex" for="linkedin">
                    <svg class="form__icon rounded mr-1">
                      <use href="@/assets/sprite.svg#linkedin" />
                    </svg>
                    Linkedin
                  </label>
                  <input id="linkedin" v-model="formSettings.linkedin" class="form__control" type="text">
                </div>
                <div class="form__group col-span-full">
                  <label class="form__label flex" for="twitter">
                    <svg class="form__icon rounded mr-1">
                      <use href="@/assets/sprite.svg#twitter" />
                    </svg>
                    Twitter
                  </label>
                  <input id="twitter" v-model="formSettings.twitter" class="form__control" type="text">
                </div>
                <div class="form__group col-span-full">
                  <label class="form__label flex" for="github">
                    <svg class="form__icon mr-1">
                      <use href="@/assets/sprite.svg#github" />
                    </svg>
                    GitHub
                  </label>
                  <input id="github" v-model="formSettings.github" class="form__control" type="text">
                </div>
                <div class="form__group col-span-full">
                  <label class="form__label flex" for="website">
                    <svg class="form__icon mr-1">
                      <use href="@/assets/sprite.svg#website" />
                    </svg>
                    Website
                  </label>
                  <input id="website" v-model="formSettings.website" class="form__control" type="text">
                </div>
              </div>
            </div>
          </template>
        </expansion-panel>
      </fieldset>
      <!-- SOCIAL -->

      <!-- HISTORY SECTIONS -->
      <CvSettingsHistorySection v-for="(value, key) in SectionNameList" :key="key" :section="key" :name="value" />
      <!-- HISTORY SECTIONS -->

      <!-- CTA -->
      <div class="form__section flex flex-col p-6 gap-3">
        <button type="button" class="form__btn flex flex-col justify-center" @click="downloadPdf">
          <span>{{ $t("download-cv-pdf") }}</span>
        </button>
        <button type="button" class="form__btn flex flex-col justify-center" @click="downloadWord">
          <span>{{ $t("download-cv-word") }}</span>
        </button>
      </div>
      <!-- CTA -->
    </form>
  </div>
</template>

<style lang="postcss" scoped>
.settings {
  @apply bg-slate-50 bg-opacity-100 shadow-lg font-bold z-10;

  @media screen and (min-width: 1024px) {
    & {
      @apply overflow-y-auto;
    }
  }

  @media print {
    display: none;
    box-shadow: none;
    z-index: 0;
  }
}

.buy-me-a-coffee {
  flex-shrink: 1;

  &__image {
    width: 118px;
    height: 30px;
    font-size: 0.5rem;
  }
}

.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
