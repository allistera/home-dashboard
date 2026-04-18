<template>
  <div :style="root">
    <!-- Stars -->
    <svg :style="{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }">
      <circle v-for="i in 80" :key="i"
        :cx="(i * 131) % 1800" :cy="(i * 79) % 900"
        :r="((i * 17) % 10) / 10 + 0.3"
        fill="#fff" :opacity="0.15 + ((i * 7) % 10) / 30" />
    </svg>

    <header :style="{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '14px' }">
        <div :style="{ width: '10px', height: '10px', borderRadius: '50%', background: accent, boxShadow: `0 0 14px ${accent}` }" />
        <div>
          <div :style="eyebrow">Home map</div>
          <div :style="{ fontSize: '18px', fontWeight: 600, marginTop: '2px', fontFamily: '\'Orbitron\', sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }">
            Maple House · West Wing
          </div>
        </div>
      </div>
      <div :style="{ display: 'flex', gap: '10px', fontSize: '12px', color: 'rgba(232,233,240,0.7)', fontFamily: '\'JetBrains Mono\', monospace' }">
        <span>{{ currentTime }}</span>
        <span :style="{ color: 'rgba(232,233,240,0.3)' }">·</span>
        <span>{{ store.tempOutside }}° clear</span>
        <span :style="{ color: 'rgba(232,233,240,0.3)' }">·</span>
        <span :style="{ color: accent }">● {{ store.activeLightsCount }} lights on</span>
      </div>
    </header>

    <main :style="mainGrid">
      <!-- LEFT: selected room controls -->
      <aside :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
        <section :style="panel">
          <div :style="eyebrow">Selected</div>
          <div :style="{ fontFamily: '\'Orbitron\', sans-serif', fontSize: '24px', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1, textTransform: 'uppercase' }">
            {{ roomName(store.activeRoom) }}
          </div>
          <div :style="{ fontSize: '12px', color: 'rgba(232,233,240,0.55)', marginTop: '6px' }">
            {{ activeLight.on ? `Light on · ${activeLight.level}%` : 'Light off' }} · Blinds {{ store.blinds[store.activeRoom] }}%
          </div>

          <div :style="{ marginTop: '18px' }">
            <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }">
              <span :style="slotLabel">Light</span>
              <button @click="store.toggleLight(store.activeRoom)" :style="toggleBtn(activeLight.on)">
                <span :style="toggleKnob(activeLight.on)" />
              </button>
            </div>
            <input type="range" min="0" max="100" :value="activeLight.on ? activeLight.level : 0"
              @input="e => store.setLightLevel(store.activeRoom, +(e.target as HTMLInputElement).value)"
              :style="{ width: '100%', accentColor: accent }" />
          </div>

          <div :style="{ marginTop: '14px' }">
            <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }">
              <span :style="slotLabel">Blinds</span>
              <span :style="{ fontSize: '11px', fontFamily: '\'JetBrains Mono\', monospace' }">{{ store.blinds[store.activeRoom] }}%</span>
            </div>
            <input type="range" min="0" max="100" :value="store.blinds[store.activeRoom]"
              @input="e => store.setBlinds(store.activeRoom, +(e.target as HTMLInputElement).value)"
              :style="{ width: '100%', accentColor: accent }" />
          </div>
        </section>

        <section :style="panel">
          <div :style="eyebrow">Climate</div>
          <div :style="{ display: 'flex', alignItems: 'baseline', gap: '6px' }">
            <span :style="{ fontFamily: '\'Orbitron\', sans-serif', fontSize: '52px', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }">{{ store.tempTarget }}</span>
            <span :style="{ fontSize: '18px', color: 'rgba(232,233,240,0.5)' }">°F</span>
          </div>
          <div :style="{ fontSize: '11px', color: 'rgba(232,233,240,0.5)', marginTop: '4px' }">
            Inside {{ store.tempInside }}° · humidity {{ store.humidity }}%
          </div>
          <div :style="{ display: 'flex', gap: '8px', marginTop: '12px' }">
            <button @click="store.setTemp(Math.max(55, store.tempTarget - 1))" :style="climateBtn">−</button>
            <button @click="store.setTemp(Math.min(85, store.tempTarget + 1))" :style="climateBtn">+</button>
          </div>
        </section>

        <section :style="panel">
          <div :style="eyebrow">Scenes</div>
          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }">
            <button v-for="sc in SCENES" :key="sc.id" @click="store.setScene(sc.id)" :style="sceneBtn(sc.id)">
              <span>{{ sc.glyph }}</span>
              <span>{{ sc.name }}</span>
            </button>
          </div>
        </section>
      </aside>

      <!-- CENTER: radial room map -->
      <section :style="{ position: 'relative', display: 'grid', placeItems: 'center' }">
        <svg viewBox="0 0 1080 800" width="100%" height="100%" :style="{ maxHeight: 'calc(100vh - 120px)' }">
          <defs>
            <radialGradient id="roomsCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" :stop-color="accent" stop-opacity="0.7" />
              <stop offset="60%" :stop-color="accent" stop-opacity="0.1" />
              <stop offset="100%" :stop-color="accent" stop-opacity="0" />
            </radialGradient>
            <filter id="roomsGlow">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          <!-- Orbit rings -->
          <circle v-for="(r, i) in [orbitR, orbitR + 28, orbitR - 30]" :key="i"
            :cx="cx" :cy="cy" :r="r"
            fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"
            :stroke-dasharray="i === 0 ? 'none' : '2 6'" />

          <!-- Connection lines -->
          <line v-for="r in roomPositions" :key="`line-${r.id}`"
            :x1="cx" :y1="cy" :x2="r.x" :y2="r.y"
            :stroke="store.lights[r.id].on ? `oklch(0.8 0.14 ${store.lights[r.id].hue})` : 'rgba(255,255,255,0.06)'"
            :stroke-width="store.lights[r.id].on ? 1.5 : 1"
            :opacity="store.lights[r.id].on ? 0.5 : 1"
            :stroke-dasharray="store.lights[r.id].on ? 'none' : '3 5'" />

          <!-- Core glow -->
          <circle :cx="cx" :cy="cy" r="160" fill="url(#roomsCoreGlow)" />

          <!-- Core ring -->
          <circle :cx="cx" :cy="cy" r="90" fill="rgba(20,22,32,0.9)" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <circle :cx="cx" :cy="cy" r="90" fill="none" :stroke="accent" stroke-width="2"
            :stroke-dasharray="`${store.airQuality / 100 * 565} 565`"
            :transform="`rotate(-90 ${cx} ${cy})`" opacity="0.8" />

          <!-- Central labels -->
          <text :x="cx" :y="cy - 22" text-anchor="middle" font-size="10" letter-spacing="2"
            fill="rgba(232,233,240,0.5)" font-family="'JetBrains Mono', monospace">HOME PULSE</text>
          <text :x="cx" :y="cy + 10" text-anchor="middle" font-size="46" font-weight="500"
            fill="#e8e9f0" font-family="'Orbitron', sans-serif" letter-spacing="0.02em">
            {{ store.tempInside }}°
          </text>
          <text :x="cx" :y="cy + 34" text-anchor="middle" font-size="11" :fill="accent" font-family="'JetBrains Mono', monospace">
            AQ {{ store.airQuality }} · RH {{ store.humidity }}%
          </text>
          <text :x="cx" :y="cy + 56" text-anchor="middle" font-size="10" fill="rgba(232,233,240,0.4)" font-family="'JetBrains Mono', monospace">
            scene · {{ activeSceneName }}
          </text>

          <!-- Room nodes -->
          <g v-for="r in roomPositions" :key="r.id" style="cursor: pointer" @click="store.setRoom(r.id)">
            <circle v-if="store.lights[r.id].on"
              :cx="r.x" :cy="r.y" :r="(store.activeRoom === r.id ? 42 : 34) + 20"
              :fill="`oklch(0.8 0.14 ${store.lights[r.id].hue})`" opacity="0.15" filter="url(#roomsGlow)" />
            <circle :cx="r.x" :cy="r.y" :r="store.activeRoom === r.id ? 42 : 34"
              :fill="store.lights[r.id].on ? `oklch(0.8 0.14 ${store.lights[r.id].hue})` : 'rgba(255,255,255,0.04)'"
              :stroke="store.activeRoom === r.id ? '#fff' : (store.lights[r.id].on ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)')"
              :stroke-width="store.activeRoom === r.id ? 2 : 1" />
            <text :x="r.x" :y="r.y - 2" text-anchor="middle" font-size="12" font-weight="500"
              :fill="store.lights[r.id].on ? '#0a0a0a' : '#e8e9f0'" font-family="Inter, sans-serif">
              {{ r.name.split(' ')[0] }}
            </text>
            <text :x="r.x" :y="r.y + 12" text-anchor="middle" font-size="9"
              font-family="'JetBrains Mono', monospace"
              :fill="store.lights[r.id].on ? '#0a0a0a' : 'rgba(232,233,240,0.5)'">
              {{ store.lights[r.id].on ? `${store.lights[r.id].level}%` : 'off' }}
            </text>
          </g>
        </svg>
      </section>

      <!-- RIGHT: camera + media + activity -->
      <aside :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
        <section :style="panel">
          <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }">
            <div :style="eyebrow">Camera</div>
            <span :style="{ fontSize: '10px', color: accent, fontFamily: '\'JetBrains Mono\', monospace' }">● LIVE</span>
          </div>
          <StripePlaceholder
            :label="store.security.cameras.find(c => c.id === store.security.activeCamera)?.name"
            tone="dark" :radius="10"
            :style="{ width: '100%', aspectRatio: '16/10' }" />
          <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '8px' }">
            <button v-for="c in store.security.cameras" :key="c.id" @click="store.setCamera(c.id)"
              :style="camBtn(c.id)" style="position: relative;">
              {{ c.name.split(' ')[0] }}
              <span v-if="c.motion" :style="{ position: 'absolute', top: '3px', right: '4px', width: '5px', height: '5px', borderRadius: '50%', background: accent }" />
            </button>
          </div>
        </section>

        <section :style="panel">
          <div :style="eyebrow">Playing · {{ roomName(store.media.room) }}</div>
          <div :style="{ display: 'flex', gap: '12px' }">
            <StripePlaceholder label="art" tone="frost" :radius="8" :style="{ width: '52px', height: '52px', flexShrink: 0 }" />
            <div :style="{ minWidth: 0, flex: 1 }">
              <div :style="{ fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">{{ store.media.track }}</div>
              <div :style="{ fontSize: '11px', color: 'rgba(232,233,240,0.55)', marginTop: '2px' }">{{ store.media.artist }}</div>
            </div>
          </div>
          <div :style="{ marginTop: '10px' }">
            <div :style="{ height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }">
              <div :style="{ width: `${(store.media.elapsed / store.media.duration) * 100}%`, height: '100%', background: accent, borderRadius: '99px' }" />
            </div>
          </div>
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', marginTop: '10px' }">
            <button :style="mediaBtn">⇤</button>
            <button @click="store.toggleMedia" :style="{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: accent, color: '#0a0a0a', fontSize: '12px', cursor: 'pointer' }">
              {{ store.media.playing ? '❚❚' : '▶' }}
            </button>
            <button :style="mediaBtn">⇥</button>
          </div>
        </section>

        <section :style="{ ...panel, flex: 1, display: 'flex', flexDirection: 'column' }">
          <div :style="eyebrow">Signal</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }">
            <div v-for="a in store.activity.slice(0, 5)" :key="a.id" :style="{ display: 'flex', gap: '10px', alignItems: 'flex-start' }">
              <span :style="{
                width: '6px', height: '6px', borderRadius: '50%',
                background: a.kind === 'motion' ? accent : 'rgba(232,233,240,0.4)',
                marginTop: '6px', flexShrink: 0,
                boxShadow: a.kind === 'motion' ? `0 0 8px ${accent}` : 'none',
              }" />
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '12px', lineHeight: 1.35 }">{{ a.text }}</div>
                <div :style="{ fontSize: '10px', color: 'rgba(232,233,240,0.4)', marginTop: '2px', fontFamily: '\'JetBrains Mono\', monospace' }">{{ a.when }}</div>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHomeStore, ROOMS, SCENES, roomName } from '@/stores/homeState'
import StripePlaceholder from './StripePlaceholder.vue'

const props = defineProps<{ accent: string }>()
const store = useHomeStore()

onMounted(() => store.startMediaTimer())
onUnmounted(() => store.stopMediaTimer())

const currentTime = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
setInterval(() => { currentTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, 1000)

const cx = 540, cy = 400, orbitR = 260

const roomPositions = computed(() =>
  ROOMS.map((r, i) => {
    const angle = (i / ROOMS.length) * Math.PI * 2 - Math.PI / 2
    return { ...r, x: cx + Math.cos(angle) * orbitR, y: cy + Math.sin(angle) * orbitR }
  }),
)

const activeLight = computed(() => store.lights[store.activeRoom])
const activeSceneName = computed(() => SCENES.find(s => s.id === store.activeScene)?.name)

const root = {
  fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
  background: 'radial-gradient(ellipse at 50% 40%, #1a1c28 0%, #0b0c12 70%)',
  color: '#e8e9f0', minHeight: '100vh', position: 'relative', overflow: 'hidden',
}

const panel = {
  background: 'rgba(20, 22, 32, 0.6)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px', padding: '18px',
}

const mainGrid = {
  display: 'grid', gridTemplateColumns: '280px 1fr 280px',
  gap: '20px', padding: '0 24px 24px',
  position: 'relative', zIndex: 2, minHeight: 'calc(100vh - 74px)',
}

const eyebrow = {
  fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
  color: 'rgba(232,233,240,0.5)', fontWeight: 500, marginBottom: '10px',
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
}

const slotLabel = { fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(232,233,240,0.5)' }
const climateBtn = {
  flex: 1, padding: '10px', borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
  color: '#e8e9f0', fontSize: '16px', cursor: 'pointer',
}
const mediaBtn = { background: 'none', border: 'none', color: 'rgba(232,233,240,0.6)', fontSize: '14px', cursor: 'pointer' }

function toggleBtn(on: boolean) {
  return {
    width: '40px', height: '22px', borderRadius: '999px', border: 'none', padding: 0,
    background: on ? props.accent : 'rgba(255,255,255,0.15)',
    position: 'relative', cursor: 'pointer',
  }
}
function toggleKnob(on: boolean) {
  return {
    position: 'absolute', top: '2px', left: on ? '20px' : '2px',
    width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
    transition: 'left 180ms ease',
  }
}
function sceneBtn(id: string) {
  const active = store.activeScene === id
  return {
    padding: '10px 12px', borderRadius: '10px',
    background: active ? props.accent : 'rgba(255,255,255,0.04)',
    color: active ? '#0a0a0a' : '#e8e9f0',
    border: '1px solid ' + (active ? props.accent : 'rgba(255,255,255,0.1)'),
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px',
  }
}
function camBtn(id: string) {
  const active = store.security.activeCamera === id
  return {
    padding: '6px 4px', borderRadius: '8px',
    background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
    border: '1px solid ' + (active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'),
    color: '#e8e9f0', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit',
  }
}
</script>
