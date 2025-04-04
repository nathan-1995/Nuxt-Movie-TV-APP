<!-- Description: This is the default layout for the application. It includes a navigation bar and a main content area.-->
<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup>
import NavBar from '~/components/NavBar.vue'
</script>