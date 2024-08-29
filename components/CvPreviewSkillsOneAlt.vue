<script lang="ts" setup>
import { useCvState } from '~/data/useCvState'

const { formSettings } = useCvState()
</script>

<template>
  <section class="cv__section">
    <h4 class="cv__section-title cv__section-title--main">
      {{ $t("technical-skills") }}
    </h4>

    <CvPreviewSkill
      :skill-name="''"
      :display="formSettings.displayJobSkills"
      :skills="formSettings.jobSkills"
      :with-tags="true"
    />
  </section>
</template>