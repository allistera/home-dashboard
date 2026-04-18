<template>
  <div :style="{ position: 'relative', overflow: 'hidden', borderRadius: `${radius}px`, background: palette.bg, ...style }">
    <svg width="100%" height="100%" :style="{ position: 'absolute', inset: 0 }">
      <defs>
        <pattern :id="uid" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="14" :stroke="palette.fg" stroke-width="6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" :fill="`url(#${uid})`" opacity="0.55" />
    </svg>
    <div :style="{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '\'JetBrains Mono\', ui-monospace, monospace',
      fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
      color: palette.text,
    }">
      <span :style="{ background: palette.bg, padding: '4px 10px', borderRadius: '999px' }">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
  tone?: 'neutral' | 'dark' | 'frost' | 'ink'
  radius?: number
  style?: Record<string, string | number>
}>(), {
  label: 'camera feed',
  tone: 'neutral',
  radius: 12,
  style: () => ({}),
})

const uid = `strip-${Math.random().toString(36).slice(2)}`

const palette = computed(() => ({
  neutral: { bg: '#e9e6e0', fg: '#b9b3a6', text: '#6b6558' },
  dark:    { bg: '#1c1c1c', fg: '#2b2b2b', text: '#8a8a8a' },
  frost:   { bg: 'rgba(255,255,255,0.18)', fg: 'rgba(255,255,255,0.32)', text: 'rgba(255,255,255,0.75)' },
  ink:     { bg: '#f4f1ea', fg: '#ddd6c7', text: '#111' },
}[props.tone] ?? { bg: '#e9e6e0', fg: '#b9b3a6', text: '#6b6558' }))
</script>
