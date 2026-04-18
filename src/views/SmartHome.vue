<template>
  <div style="position: relative; min-height: 100vh; overflow-x: hidden;">
    <component :is="currentView" :accent="accent" />

    <!-- Tweaks panel -->
    <div v-if="tweaksOpen" style="
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      background: rgba(15, 16, 20, 0.92); color: #fff;
      backdrop-filter: blur(20px) saturate(140%);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 14px; padding: 14px 16px; width: 260px;
      font-family: 'Inter', sans-serif; font-size: 12px;
      box-shadow: 0 20px 50px -20px rgba(0,0,0,0.6);
    ">
      <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.6); margin-bottom: 10px; font-weight: 600; font-family: 'JetBrains Mono', monospace;">
        Tweaks
      </div>

      <div style="margin-bottom: 12px;">
        <div style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 6px;">Variation</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <button v-for="v in VARIATIONS" :key="v.id" @click="variation = v.id"
            :style="{
              padding: '8px 10px',
              background: variation === v.id ? '#fff' : 'rgba(255,255,255,0.05)',
              color: variation === v.id ? '#0f1014' : 'rgba(255,255,255,0.9)',
              border: variation === v.id ? '1px solid #fff' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', fontSize: '11px', cursor: 'pointer',
              textAlign: 'left', fontFamily: 'inherit',
            }">
            <div style="font-weight: 600;">{{ v.name }}</div>
            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">{{ v.sub }}</div>
          </button>
        </div>
      </div>

      <div style="margin-bottom: 12px;">
        <div style="font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 6px;">Accent</div>
        <div style="display: flex; gap: 6px;">
          <button v-for="a in ACCENTS" :key="a.hex" :title="a.name" @click="accent = a.hex"
            :style="{
              width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer', padding: '0',
              background: a.hex,
              border: accent === a.hex ? '2px solid #fff' : '2px solid rgba(255,255,255,0.15)',
              transform: accent === a.hex ? 'scale(1.08)' : 'scale(1)',
            }" />
        </div>
      </div>

      <div style="font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 8px; line-height: 1.5;">
        State is shared across variations.
      </div>
    </div>

    <!-- Tweaks toggle -->
    <button @click="tweaksOpen = !tweaksOpen" :style="{
      position: 'fixed', bottom: '20px',
      right: tweaksOpen ? '296px' : '20px',
      width: '44px', height: '44px', borderRadius: '50%',
      background: 'rgba(15, 16, 20, 0.92)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: '#fff', cursor: 'pointer', fontSize: '18px', zIndex: 10000,
      backdropFilter: 'blur(20px)',
      display: 'grid', placeItems: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      transition: 'right 200ms ease',
    }">⚙</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import NexusView from '@/components/smart-home/NexusView.vue'
import KinView from '@/components/smart-home/KinView.vue'
import VaporView from '@/components/smart-home/VaporView.vue'

const VARIATIONS = [
  { id: 'vapor', name: 'Vapor', sub: 'Glassmorphic' },
  { id: 'nexus', name: 'Nexus', sub: 'AI at center' },
  { id: 'kin', name: 'Kin', sub: 'People-first' },
]

const ACCENTS = [
  { hex: '#d97757', name: 'Terracotta' },
  { hex: '#4f7cff', name: 'Azure' },
  { hex: '#2f9d6e', name: 'Moss' },
  { hex: '#c2492c', name: 'Ember' },
  { hex: '#8b5cf6', name: 'Iris' },
  { hex: '#eab308', name: 'Amber' },
]

const saved = (() => { try { return JSON.parse(localStorage.getItem('home-dash') ?? '{}') } catch { return {} } })()
const validIds = new Set(['vapor', 'nexus', 'kin'])
const variation = ref<string>(validIds.has(saved.variation) ? saved.variation : 'kin')
const accent = ref<string>(saved.accent ?? '#2f9d6e')
const tweaksOpen = ref(false)

const viewMap: Record<string, unknown> = {
  vapor: VaporView,
  nexus: NexusView,
  kin: KinView,
}

const currentView = computed(() => viewMap[variation.value] ?? KinView)

watch([variation, accent], ([v, a]) => {
  localStorage.setItem('home-dash', JSON.stringify({ variation: v, accent: a }))
})
</script>
