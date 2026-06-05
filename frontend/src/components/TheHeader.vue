<script setup lang="ts">

</script>

<template>
  <UHeader :ui="{ container: 'min-w-full' }">
    <template #title>
      <div class="inline-flex items-center">
        <UIcon name="i-lucide-chart-bar-stacked" size="30" class="text-green-500"/>
        <h1 class="text-base">Log & Metrics Viewer</h1>
      </div>
    </template>
    <template #right>
      <UColorModeButton/>
    </template>

  </UHeader>
</template>

