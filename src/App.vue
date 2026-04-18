<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
      <SpeedInsights />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue'
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
</script>
