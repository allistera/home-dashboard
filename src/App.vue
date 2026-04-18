<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
      <Analytics />
      <SpeedInsights />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
</script>
