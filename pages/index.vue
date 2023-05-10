<script setup lang="ts">
const firstLesson = useFirstLesson();
</script>

<template>
  <NuxtLink class="underline font-medium" :href="firstLesson.path">
    Go to first lesson
  </NuxtLink>
</template>
