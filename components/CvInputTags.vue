<script setup lang="ts">
import { useCvState } from '~/data/useCvState'
import type { DefaultSkill, LanguagesSkill, Level, Skill, SkillType } from '~/types/cvfy'
import { useGoogleAI } from "~/composables/useGoogleAI";

const props = defineProps<{
  tagListName: SkillType
  modelValue: Skill[]
  tagListLabel: string
  display: boolean
}>()
const { generateContent } = useGoogleAI();
const selectedLanguage = ref('en')
const isLoading = ref(false)
const emit = defineEmits<{
  (event: 'update:modelValue', value: Skill[]): void
}>()


async function translate() {

  console.log(state.tagInput, 'dasdasdasfewf')
  isLoading.value = true
  try {
    console.log('dasdasfe', state)
    const translatedText = await generateContent(
      `translate the following word "${state.tagInput}" in ${selectedLanguage.value}. And return only string.`
    )
   state.tagInput = translatedText
   
  } catch (e) {
    console.error(e)
  }
  isLoading.value = false
}
const { t } = useI18n()

const state = reactive({
  tagInput: null as any,
})

const tagListCopy = ref<string[]>(formatList(props.modelValue))

watch(
  () => props.modelValue,
  value => tagListCopy.value = formatList(value),
)

function formatList(value: typeof props.modelValue) {
  const list = [] as string[]
  if (value) {
    for (const tag of value) {
      typeof tag === 'string'
        ? list.push(tag)
        : list.push(`${tag.lang}: ${t(tag.level)}`)
    }
  }
  return list
}

// Update skill list
const { addSkill, removeSkill } = useCvState()

const tagInputEmpty = computed(() => {
  return state.tagInput === ''
})

function cleanInput(): void {
  state.tagInput = ''
}

function handleUpdateSkill() {
  addSkill({
    skill: state.tagInput,
    skillType: props.tagListName,
  })
  cleanInput()
}

function handleRemoveSkill(tag: string) {
  if (props.tagListName === 'languages') {
    const langTag = (props.modelValue as LanguagesSkill['skill'][]).find(l => l.lang === tag.split(':')[0])
    if (langTag) {
      removeSkill<LanguagesSkill>(({
        skill: langTag,
        skillType: props.tagListName,
      }))
    }
  }
  else {
    removeSkill<DefaultSkill>(({
      skill: tag,
      skillType: props.tagListName,
    }))
  }
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
    { name: 'en-name', code: 'en' , isoname: 'English' },
    { name: 'tr-name', code: 'tr' , isoname: 'Turkish'},
    { name: 'nl-name', code: 'nl', isoname: 'Dutch' },
    { name: 'bn-name', code: 'bn', isoname: 'Bangla' }
  ],
}

// Drag and Drop
const parentEl = ref<HTMLElement>()

useDrag(parentEl, tagListCopy, { onDrop })

function onDrop() {
  if (props.tagListName === 'languages') {
    const list: LanguagesSkill['skill'][] = tagListCopy.value.map((t) => {
      const split = t.split(': ')
      return { lang: split[0], level: split[1] as Level }
    })
    emit('update:modelValue', list)
  }
  else {
    emit('update:modelValue', [...tagListCopy.value])
  }
}
</script>

<template>
  <div class="form__group mb-10">
    <label
      class="form__label"
      :for="tagListName"
    >{{ tagListLabel }}
      <CvDisplayCheckbox
        :display-section="display"
        :section-name="`${tagListName}`"
      />
    </label>
    <div v-if="!isLoading || tagListName === 'languages'" class="flex gap-3">
      <template v-if="tagListName === 'languages'">
        <CvInputLang />
      </template>

      <template v-else>
        <input
          :id="tagListName"
          v-model="state.tagInput"
          class="form__control mt-2 mb-1"
          type="text"
          @keyup.enter="handleUpdateSkill"
        >
        <button
          class="form__btn"
          type="button"
          :disabled="tagInputEmpty"
          :aria-disabled="tagInputEmpty"
          aria-live="assertive"
          @click="handleUpdateSkill"
        >
          {{ $t("add") }}
        </button>
      </template>
    </div>
    <div v-else class="loader"></div>
    <div v-if="tagListName !== 'languages'">
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
              @click="translate()"
            >
              {{ $t("translate-text") }}
            </button>
            </div>
          </div>
    <ul
      ref="parentEl"
      class="tags"
    >
      <li
        v-for="tag in tagListCopy"
        :id="tag"
        :key="tag"
        draggable="true"
        class="tags__tag form__btn"
      >
        <span class="tags__tag-text">
          {{ tag }}
        </span>
        <button
          type="button"
          @click="handleRemoveSkill(tag)"
        >
          <svg class="form__icon">
            <use href="@/assets/sprite.svg#close" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.tags {
  @apply flex flex-wrap gap-3 mt-3 text-xs/normal items-stretch w-full;

  &__tag {
    @apply flex justify-between items-end gap-3 m-0 px-2 py-1 h-fit;

    &[draggable] {
      @apply cursor-move select-none;
    }

    &:hover {
      background-color: var(--primary-darker);
    }
  }

}

.percentage {
  position: absolute;
  top: 0.5rem;
  right: 25%;
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
