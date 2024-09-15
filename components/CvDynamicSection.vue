<script setup lang="ts">
import type { CvEvent, SectionName } from '~/types/cvfy'
import { useCvState } from '~/data/useCvState'
import { useGoogleAI } from "~/composables/useGoogleAI";

const { sectionName, entries = [] } = defineProps<{
  sectionName: SectionName
  entries: CvEvent[]
}>()
const { addEntry, removeEntry } = useCvState()
const { generateContent } = useGoogleAI();
const isLoading= ref(false)
function focusEditor(id: string) {
  const editorElem = document.getElementById(`${id}-editor`)
  if (editorElem)
    editorElem.focus()
}

const selectedLanguage = ref('en')
const isSummaryLoading = ref(false)

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
    { name: 'en-name', code: 'en' , isoname: 'English' },
    { name: 'tr-name', code: 'tr' , isoname: 'Turkish'},
    { name: 'nl-name', code: 'nl', isoname: 'Dutch' },
    { name: 'bn-name', code: 'bn', isoname: 'Bangla' }
  ],
}

async function translate(text: string, lang: string, field: 'title' | 'summary', entryId: string) {
  if(field==='summary')
  { 
    isSummaryLoading.value = true
  }
  else
  isLoading.value = true
  try {

    const translatedText = await generateContent(
      `translate the following "${text}" in ${lang}. And return only string. If it's already in ${lang}, keep it as it is. if it has html tag translate only the elements inside it and return with html tag as it is`
    )
    const entry = entries.find(e => e.id === entryId)
    if (entry) {
      entry[field] = translatedText
    }
  } catch (e) {
    console.error(e)
  }
 
  if(field==='summary')
  { 
    isSummaryLoading.value = false
  }
  else  isLoading.value = false
}
</script>

<template>
  <div
    v-if="sectionName"
    class="dynamic-section"
  >
    <button
      class="form__btn col-span-full"
      type="button"
      @click="addEntry({ sectionName })"
    >
      {{ $t("add") }} {{ $t(sectionName) }}
    </button>
    <ul class="col-span-full">
      <li
        v-for="entry in entries"
        :key="entry.id"
      >
        <expansion-panel
          :panel-name="`${entry.title}`"
          class="mb-3"
        >
          <template #title>
            <h3 class="form__legend form__legend--small dynamic-section__title">
              <span>
                {{ entry.title }}
              </span>
            </h3>
          </template>
          <template #action-button>
            <button
              :aria-label="`Remove ${entry.title} ${$t(sectionName)} from CV`"
              type="button"
              class="form__btn form__btn--delete mr-3"
              @click.stop="removeEntry({ sectionName, entry })"
            >
              <svg class="form__icon">
                <use href="@/assets/sprite.svg#trash" />
              </svg>
            </button>
          </template>
          <template #content>
            <div class="dynamic-section">

              <div v-if="!isLoading" class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryTitle--${entry.id}`"
                >
                  <template v-if="sectionName === 'education'">🎓</template>
                  <template v-else-if="sectionName === 'projects'">✨</template>
                  <template v-else>💼</template>
                  {{ $t("title") }}
                </label>
                <input
                  :id="`entryTitle--${entry.id}`"
                  v-model="entry.title"
                  class="form__control"
                  type="text"
                >
              </div>
              <div v-else class="loader"></div>
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

            <div class="form__group col-span-full">
            <button
              type="button"
              class="form__btn form__btn--ghost"
              @click="translate(entry.title, selectedLanguage, 'title', entry.id)"
            >
              {{ $t("translate-title") }}
            </button>

           
          </div>
          </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryLocation-${entry.id}`"
                >
                  <template v-if="sectionName === 'projects'">
                    🔗 Link
                  </template>
                  <template v-else>
                    📍 {{ $t("location") }}
                  </template>
                </label>
                <input
                  :id="`entryLocation-${entry.id}`"
                  v-model="entry.location"
                  class="form__control"
                  type="text"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entryFrom-${entry.id}`"
                >📆 {{ $t("from")
                }}</label>
                <input
                  :id="`entryFrom-${entry.id}`"
                  v-model="entry.from"
                  class="form__control"
                  type="date"
                >
              </div>
              <div class="form__group col-span-full">
                <label
                  class="form__label flex justify-between"
                  :for="`entryTo-${entry.id}`"
                >
                  📆 {{ $t("to") }}
                  <label class="form__label flex items-center">
                    <input
                      v-model="entry.current"
                      class="form__control form__control--checkbox"
                      type="checkbox"
                    >
                    {{ $t("current") }}
                  </label>
                </label>
                <input
                  v-if="!entry.current"
                  :id="`entryTo-${entry.id}`"
                  v-model="entry.to"
                  class="form__control"
                  type="date"
                >
              </div>
              <div v-if="!isSummaryLoading" class="form__group col-span-full">
                <label
                  class="form__label"
                  :for="`entrySummary-${entry.id}`"
                  @click="focusEditor(`entrySummary-${entry.id}`)"
                >📝 {{ $t("summary")
                }}</label>
                <CvTextEditor
                  :id="`entrySummary-${entry.id}`"
                  v-model="entry.summary"
                  class="form__control"
                  :read-only="false"
                />
              </div>
              <div v-else class="loader"></div>




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
            <div class="form__group col-span-full">
          
            <button
              type="button"
              class="form__btn form__btn--ghost"
              @click="translate(entry.summary, selectedLanguage, 'summary', entry.id)"
            >
              {{ $t("translate-summary") }}
            </button>
            </div>
              
            </div>
          </template>
        </expansion-panel>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.dynamic-section {
  @apply grid grid-cols-2 gap-x-3 gap-y-4;

  &__title {
    @apply flex items-center flex-row-reverse;
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
