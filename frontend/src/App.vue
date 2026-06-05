<template>
  <UApp>
    <TheHeader/>
    <div class="px-8 py-5">
      <RouterView/>
    </div>
  </UApp>
</template>

<style>
body, html, #app, .app {
  margin: 0;
  border: 0;
  height: 100vh;
  width: 100%;
}
</style>
<script setup lang="ts">
</script>