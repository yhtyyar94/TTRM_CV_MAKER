<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'
import { useLanguage } from '~/composables/useCvLang'

import cvLang from '~/data/cv'

const { language } = useLanguage()

const { formSettings } = useCvState()
</script>

<template>
  <section class="cv__section">
    <h4 class="cv__section-title cv__section-title--main">
      {{ cvLang[language].technical_skills }}
    </h4>

    <CvPreviewSkill
      skill-name=""
      :display="formSettings.displayJobSkills"
      :skills="formSettings.jobSkills"
      :with-tags="true"
    />
  </section>
</template>
