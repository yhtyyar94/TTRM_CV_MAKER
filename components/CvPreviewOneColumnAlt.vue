<script lang="ts" setup>
import CvPreviewContactOneAlt from './CvPreviewContactOneAlt.vue';

</script>

<template>
  <div class="flex justify-between gap-1">
    <div class="flex flex-col justify-between">
      <div class="flex flex-col justify-center">
        <CvPreviewName />
        <CvPreviewTitle />
        <CvPreviewContactOneAlt />
      </div>

    </div>
   
  </div>


  <CvPreviewExperience />

  <CvPreviewEducation />

  <CvPreviewProjects />

  <CvPreviewSkillsOneAlt />
</template>

<style lang="postcss" scoped>
:deep(h4.cv__section-title) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  word-break: keep-all;
}

:deep(h4.cv__section-title::after) {
  content: '';
  width: 100%;
  height: 2px;
  margin-left: 10px;
  background-color: var(--primary);
  border-radius: 10px;
}
</style>
