<template>
  <div @click="clickBackground" :style="{
    minHeight: '100vh', background: '#0a0b0e',
    fontFamily: `'Space Grotesk', sans-serif`,
    color: '#fff', display: 'flex', overflow: 'hidden',
  }">
    <!-- Left sidebar -->
    <div @click.stop :style="{
      width: '240px', flexShrink: '0', borderRight: '1px solid rgba(255,255,255,0.07)',
      padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: '24px',
      background: 'rgba(255,255,255,0.02)',
    }">
      <div>
        <div :style="{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', fontFamily: `'JetBrains Mono', monospace` }">Household</div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
          <div v-for="stat in householdStats" :key="stat.label" :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
            <span :style="{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }">{{ stat.label }}</span>
            <span :style="{ fontSize: '13px', fontWeight: '600', color: '#fff' }">{{ stat.value }}</span>
          </div>
        </div>
      </div>

      <div>
        <div :style="{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontFamily: `'JetBrains Mono', monospace` }">Scenes</div>
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }">
          <button v-for="s in SCENES" :key="s.id" @click="store.setScene(s.id)" :style="{
            padding: '8px', borderRadius: '8px', border: '1px solid',
            borderColor: store.activeScene === s.id ? accent : 'rgba(255,255,255,0.1)',
            background: store.activeScene === s.id ? `${accent}22` : 'rgba(255,255,255,0.04)',
            color: store.activeScene === s.id ? accent : 'rgba(255,255,255,0.7)',
            cursor: 'pointer', fontSize: '11px', textAlign: 'left', fontFamily: 'inherit',
          }">
            <div :style="{ fontSize: '14px', marginBottom: '2px' }">{{ s.glyph }}</div>
            <div>{{ s.name }}</div>
          </button>
        </div>
      </div>

      <div v-if="selectedPerson">
        <div :style="{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontFamily: `'JetBrains Mono', monospace` }">{{ selectedPerson.name }}'s Devices</div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
          <div v-for="d in selectedPerson.devices" :key="d.id" :style="{
            padding: '10px 12px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          }">
            <div :style="{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }">{{ d.name }}</div>
            <div :style="{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }">{{ d.detail }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Center: SVG kin map -->
    <div :style="{ flex: '1', position: 'relative', overflow: 'hidden' }">
      <svg :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`"
        style="width: 100%; height: 100%; position: absolute; inset: 0;"
        @click="clickBackground">

        <!-- Zoom group -->
        <g :style="zoomGroupStyle">
          <!-- Each person -->
          <g v-for="p in peoplePositions" :key="p.id" @click.stop="clickPerson($event, p.id)">
            <!-- Device orbits -->
            <g v-for="(d, di) in p.devices" :key="d.id">
              <circle
                :cx="p.x + Math.cos(deviceAngle(p.devices.length, di)) * DEVICE_R"
                :cy="p.y + Math.sin(deviceAngle(p.devices.length, di)) * DEVICE_R"
                r="22"
                :fill="zoomedPersonId === p.id ? `${p.color}22` : 'rgba(255,255,255,0.04)'"
                :stroke="zoomedPersonId === p.id ? p.color : 'rgba(255,255,255,0.1)'"
                stroke-width="1"
                style="cursor: pointer;"
              />
              <text
                :x="p.x + Math.cos(deviceAngle(p.devices.length, di)) * DEVICE_R"
                :y="p.y + Math.sin(deviceAngle(p.devices.length, di)) * DEVICE_R + 4"
                text-anchor="middle" font-size="11"
                fill="rgba(255,255,255,0.6)"
                style="pointer-events: none;"
              >{{ deviceGlyph(d.kind) }}</text>
            </g>

            <!-- Orbit ring -->
            <circle :cx="p.x" :cy="p.y" :r="DEVICE_R" fill="none"
              :stroke="zoomedPersonId === p.id ? `${p.color}40` : 'rgba(255,255,255,0.05)'"
              stroke-width="1" stroke-dasharray="4 6" />

            <!-- Person bubble -->
            <circle :cx="p.x" :cy="p.y" r="52"
              :fill="zoomedPersonId === p.id ? `${p.color}30` : 'rgba(255,255,255,0.06)'"
              :stroke="zoomedPersonId === p.id ? p.color : 'rgba(255,255,255,0.15)'"
              :stroke-width="zoomedPersonId === p.id ? 2 : 1"
              style="cursor: pointer;" />

            <!-- Initials -->
            <text :x="p.x" :y="p.y - 6" text-anchor="middle" font-size="18" font-weight="700"
              :fill="p.color" style="pointer-events: none; font-family: 'Space Grotesk', sans-serif;">
              {{ p.initials }}
            </text>
            <!-- Name -->
            <text :x="p.x" :y="p.y + 12" text-anchor="middle" font-size="12" font-weight="500"
              fill="rgba(255,255,255,0.9)" style="pointer-events: none; font-family: 'Space Grotesk', sans-serif;">
              {{ p.name }}
            </text>
            <!-- Status -->
            <text :x="p.x" :y="p.y + 72" text-anchor="middle" font-size="10"
              fill="rgba(255,255,255,0.45)" style="pointer-events: none; font-family: 'Space Grotesk', sans-serif;">
              {{ p.status }}
            </text>
            <!-- Home indicator -->
            <circle v-if="p.home" :cx="p.x + 38" :cy="p.y - 38" r="5"
              fill="#22c55e" stroke="#0a0b0e" stroke-width="2" style="pointer-events: none;" />
            <circle v-else :cx="p.x + 38" :cy="p.y - 38" r="5"
              fill="rgba(255,255,255,0.2)" stroke="#0a0b0e" stroke-width="2" style="pointer-events: none;" />
          </g>
        </g>
      </svg>
    </div>

    <!-- Right sidebar -->
    <div @click.stop :style="{
      width: '220px', flexShrink: '0', borderLeft: '1px solid rgba(255,255,255,0.07)',
      padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '20px',
      background: 'rgba(255,255,255,0.02)',
    }">
      <div>
        <div :style="{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontFamily: `'JetBrains Mono', monospace` }">Climate</div>
        <div :style="{ textAlign: 'center', padding: '16px 0' }">
          <div :style="{ fontSize: '40px', fontWeight: '700', color: accent }">{{ store.tempTarget }}°</div>
          <div :style="{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }">Inside {{ store.tempInside }}° · Outside {{ store.tempOutside }}°</div>
          <div :style="{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }">
            <button @click="store.setTemp(store.tempTarget - 1)" :style="btnStyle">−</button>
            <button @click="store.setTemp(store.tempTarget + 1)" :style="btnStyle">+</button>
          </div>
        </div>
      </div>

      <div>
        <div :style="{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontFamily: `'JetBrains Mono', monospace` }">Activity</div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px' }">
          <div v-for="item in store.activity.slice(0,5)" :key="item.id" :style="{
            fontSize: '11px', paddingBottom: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }">
            <div :style="{ color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }">{{ item.text }}</div>
            <div :style="{ color: 'rgba(255,255,255,0.3)', fontFamily: `'JetBrains Mono', monospace`, fontSize: '10px' }">{{ item.when }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHomeStore, PEOPLE, SCENES } from '@/stores/homeState'

const props = defineProps<{ accent: string }>()
const accent = computed(() => props.accent)

const store = useHomeStore()

const W = 900
const H = 700
const DEVICE_R = 95

const selectedPersonId = ref<string | null>(null)
const zoomedPersonId = ref<string | null>(null)

const selectedPerson = computed(() => PEOPLE.find(p => p.id === selectedPersonId.value) ?? null)

// 2×2 grid positions
const peoplePositions = computed(() =>
  PEOPLE.map((p, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    return {
      ...p,
      x: W * (col + 0.5) / 2,
      y: H * (row + 0.5) / 2,
    }
  })
)

function deviceAngle(total: number, idx: number): number {
  return (2 * Math.PI * idx) / total - Math.PI / 2
}

const DEVICE_GLYPHS: Record<string, string> = {
  phone: '📱', laptop: '💻', audio: '🎧', light: '💡',
  appliance: '🍳', tablet: '📱', media: '📺', game: '🎮',
  wearable: '⌚',
}
function deviceGlyph(kind: string): string {
  return DEVICE_GLYPHS[kind] ?? '·'
}

const zoomGroupStyle = computed(() => {
  if (!zoomedPersonId.value) {
    return {
      transform: 'translate(0px, 0px) scale(1)',
      transformOrigin: `${W / 2}px ${H / 2}px`,
      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
  const p = peoplePositions.value.find(p => p.id === zoomedPersonId.value)!
  const s = 2.5
  const tx = -s * (p.x - W / 2)
  const ty = -s * (p.y - H / 2)
  return {
    transform: `translate(${tx}px, ${ty}px) scale(${s})`,
    transformOrigin: `${W / 2}px ${H / 2}px`,
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  }
})

function clickPerson(e: MouseEvent, id: string) {
  e.stopPropagation()
  if (zoomedPersonId.value === id) {
    zoomedPersonId.value = null
  } else {
    selectedPersonId.value = id
    zoomedPersonId.value = id
  }
}

function clickBackground() {
  zoomedPersonId.value = null
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') zoomedPersonId.value = null
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  store.startMediaTimer()
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  store.stopMediaTimer()
})

const householdStats = computed(() => [
  { label: 'Home', value: `${PEOPLE.filter(p => p.home).length} of ${PEOPLE.length}` },
  { label: 'Lights on', value: `${store.activeLightsCount}` },
  { label: 'Humidity', value: `${store.humidity}%` },
  { label: 'Air quality', value: `${store.airQuality}` },
  { label: 'Energy', value: `${store.energy.now} kW` },
])

const btnStyle = {
  width: '32px', height: '32px', borderRadius: '8px',
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', cursor: 'pointer', fontSize: '16px', fontFamily: 'inherit',
}
</script>
