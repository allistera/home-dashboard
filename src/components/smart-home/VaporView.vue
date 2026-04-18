<template>
  <div :style="root">
    <!-- Ambient orb -->
    <div :style="{
      position: 'absolute', top: '20%', left: '45%',
      width: '360px', height: '360px', borderRadius: '50%',
      background: `radial-gradient(circle, ${accent}88, transparent 70%)`,
      filter: 'blur(60px)', pointerEvents: 'none',
    }" />

    <header :style="headerStyle">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '14px' }">
        <div :style="logoBox">◉</div>
        <div>
          <div :style="{ fontSize: '17px', fontWeight: 600 }">Maple House</div>
          <div :style="{ fontSize: '12px', color: 'rgba(15,16,32,0.6)' }">7 rooms · 23 devices · all systems nominal</div>
        </div>
      </div>
      <div :style="{ display: 'flex', gap: '8px' }">
        <button v-for="r in ROOMS" :key="r.id" @click="store.setRoom(r.id)" :style="pillBtn(store.activeRoom === r.id)">{{ r.name }}</button>
      </div>
    </header>

    <div :style="gridStyle">
      <!-- Climate (tall) -->
      <section :style="{ ...glass, gridRow: 'span 2', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }">
          <div>
            <div :style="eyebrow">Climate · {{ roomName(store.activeRoom) }}</div>
            <div :style="{ fontSize: '15px', color: 'rgba(15,16,32,0.7)', marginTop: '4px' }">Cool & still · AC cycling low</div>
          </div>
          <div :style="{ textAlign: 'right' }">
            <div :style="{ fontSize: '36px', fontWeight: 200, letterSpacing: '-0.03em' }">{{ store.tempOutside }}°</div>
            <div :style="{ fontSize: '11px', color: 'rgba(15,16,32,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase' }">outside</div>
          </div>
        </div>

        <div :style="{ flex: 1, display: 'grid', placeItems: 'center', margin: '20px 0' }">
          <div :style="{ position: 'relative', width: '300px', height: '300px' }">
            <svg width="300" height="300" :style="{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }">
              <defs>
                <linearGradient id="vapor-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" :stop-color="accent" />
                  <stop offset="100%" stop-color="oklch(0.75 0.14 240)" />
                </linearGradient>
              </defs>
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="20" />
              <circle cx="150" cy="150" r="130" fill="none" stroke="url(#vapor-ring)" stroke-width="20" stroke-linecap="round"
                :stroke-dasharray="`${(store.tempTarget - 55) / 30 * 816} 816`" />
            </svg>
            <div :style="glassOrb">
              <div :style="{ fontSize: '96px', fontWeight: 200, letterSpacing: '-0.05em', lineHeight: 1 }">
                {{ store.tempTarget }}<span :style="{ fontSize: '36px', verticalAlign: 'top', color: 'rgba(15,16,32,0.5)' }">°</span>
              </div>
              <div :style="{ fontSize: '12px', color: 'rgba(15,16,32,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }">target</div>
              <div :style="{ display: 'flex', gap: '8px', marginTop: '16px' }">
                <button @click="store.setTemp(Math.max(55, store.tempTarget - 1))" :style="tempBtn">−</button>
                <button @click="store.setTemp(Math.min(85, store.tempTarget + 1))" :style="tempBtn">+</button>
              </div>
            </div>
          </div>
        </div>

        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }">
          <div v-for="m in climateStats" :key="m.label" :style="miniStatCard">
            <div :style="miniStatLabel">{{ m.label }}</div>
            <div :style="{ fontSize: '20px', fontWeight: 500, marginTop: '4px' }">{{ m.value }}</div>
          </div>
        </div>
      </section>

      <!-- Lights (span 2 cols) -->
      <section :style="{ ...glass, gridColumn: 'span 2' }">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }">
          <div :style="eyebrow">Lights</div>
          <div :style="{ fontSize: '12px', color: 'rgba(15,16,32,0.55)' }">{{ store.activeLightsCount }} of {{ ROOMS.length }} on</div>
        </div>
        <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }">
          <div v-for="r in ROOMS" :key="r.id" :style="lightCard(r.id)">
            <button @click="store.toggleLight(r.id)" :style="lightDot(r.id)">{{ store.lights[r.id].on ? '●' : '○' }}</button>
            <div :style="{ fontSize: '12px', fontWeight: 500 }">{{ r.name }}</div>
            <div :style="{ fontSize: '11px', color: 'rgba(15,16,32,0.55)', fontFamily: '\'JetBrains Mono\', monospace' }">
              {{ store.lights[r.id].on ? `${store.lights[r.id].level}%` : 'off' }}
            </div>
            <input type="range" min="0" max="100" :value="store.lights[r.id].on ? store.lights[r.id].level : 0"
              @input="e => store.setLightLevel(r.id, +(e.target as HTMLInputElement).value)"
              :style="{ width: '100%', accentColor: accent, marginTop: 'auto' }" />
          </div>
        </div>
      </section>

      <!-- Scenes -->
      <section :style="glass">
        <div :style="eyebrow">Scenes</div>
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '4px' }">
          <button v-for="sc in SCENES" :key="sc.id" @click="store.setScene(sc.id)" :style="sceneBtn(sc.id)">
            <span :style="{ fontSize: '18px' }">{{ sc.glyph }}</span>
            <span :style="{ fontSize: '11px' }">{{ sc.name }}</span>
          </button>
        </div>
      </section>

      <!-- Media (dark glass) -->
      <section :style="{ ...glass, display: 'flex', flexDirection: 'column', background: 'rgba(15,16,32,0.75)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }">
        <div :style="{ ...eyebrow, color: 'rgba(255,255,255,0.6)' }">Playing · {{ roomName(store.media.room) }}</div>
        <div :style="{ display: 'flex', gap: '14px', marginTop: '4px' }">
          <StripePlaceholder label="art" tone="frost" :radius="10" :style="{ width: '64px', height: '64px', flexShrink: 0 }" />
          <div :style="{ minWidth: 0, flex: 1 }">
            <div :style="{ fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">{{ store.media.track }}</div>
            <div :style="{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }">{{ store.media.artist }}</div>
          </div>
        </div>
        <div :style="{ marginTop: '14px' }">
          <div :style="{ height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '99px', overflow: 'hidden' }">
            <div :style="{ width: `${(store.media.elapsed / store.media.duration) * 100}%`, height: '100%', background: '#fff' }" />
          </div>
          <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontFamily: '\'JetBrains Mono\', monospace' }">
            <span>{{ fmtTime(store.media.elapsed) }}</span>
            <span>−{{ fmtTime(store.media.duration - store.media.elapsed) }}</span>
          </div>
        </div>
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', marginTop: '12px' }">
          <button :style="{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '16px', cursor: 'pointer' }">⇤</button>
          <button @click="store.toggleMedia" :style="{ width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: '#fff', color: '#0f1020', fontSize: '14px', cursor: 'pointer' }">{{ store.media.playing ? '❚❚' : '▶' }}</button>
          <button :style="{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '16px', cursor: 'pointer' }">⇥</button>
        </div>
      </section>

      <!-- Camera -->
      <section :style="glass">
        <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }">
          <div :style="eyebrow">Live Camera</div>
          <div :style="{ display: 'flex', gap: '4px' }">
            <button v-for="c in store.security.cameras" :key="c.id" @click="store.setCamera(c.id)"
              :style="camDot(c.id)" style="position: relative;">
              {{ c.id[0].toUpperCase() }}
              <span v-if="c.motion" :style="{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', borderRadius: '50%', background: accent }" />
            </button>
          </div>
        </div>
        <StripePlaceholder
          :label="store.security.cameras.find(c => c.id === store.security.activeCamera)?.name"
          tone="dark" :radius="10"
          :style="{ width: '100%', aspectRatio: '16/10' }" />
        <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(15,16,32,0.6)', marginTop: '8px' }">
          <span>● Live</span>
          <span :style="{ fontFamily: '\'JetBrains Mono\', monospace' }">1080p · 24fps</span>
        </div>
      </section>

      <!-- Activity -->
      <section :style="{ ...glass, gridColumn: 'span 2' }">
        <div :style="eyebrow">Activity</div>
        <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginTop: '4px' }">
          <div v-for="a in store.activity.slice(0, 6)" :key="a.id" :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }">
            <span :style="{ width: '6px', height: '6px', borderRadius: '50%', background: accent, flexShrink: 0 }" />
            <span :style="{ fontSize: '13px', flex: 1 }">{{ a.text }}</span>
            <span :style="{ fontSize: '11px', color: 'rgba(15,16,32,0.5)', fontFamily: '\'JetBrains Mono\', monospace' }">{{ a.when }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useHomeStore, ROOMS, SCENES, roomName, fmtTime } from '@/stores/homeState'
import StripePlaceholder from './StripePlaceholder.vue'

const props = defineProps<{ accent: string }>()
const store = useHomeStore()

onMounted(() => store.startMediaTimer())
onUnmounted(() => store.stopMediaTimer())

const climateStats = computed(() => [
  { label: 'Humidity', value: `${store.humidity}%` },
  { label: 'Air Q',    value: store.airQuality },
  { label: 'Inside',   value: `${store.tempInside}°` },
])

const root = computed(() => ({
  fontFamily: "'Inter', system-ui, sans-serif",
  minHeight: '100vh', padding: '32px 40px 40px',
  position: 'relative', overflow: 'hidden', color: '#0f1020',
  background: `
    radial-gradient(70% 50% at 10% 10%, ${props.accent}55, transparent 60%),
    radial-gradient(55% 45% at 95% 0%, oklch(0.85 0.12 220 / 0.55), transparent 60%),
    radial-gradient(70% 50% at 90% 100%, oklch(0.88 0.1 340 / 0.55), transparent 60%),
    radial-gradient(60% 45% at 0% 100%, oklch(0.9 0.08 150 / 0.45), transparent 60%),
    linear-gradient(180deg, #eef0f6, #e4e8f2)
  `,
}))

const glass = {
  background: 'rgba(255, 255, 255, 0.55)',
  backdropFilter: 'blur(30px) saturate(160%)',
  WebkitBackdropFilter: 'blur(30px) saturate(160%)',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  boxShadow: '0 1px 0 rgba(255,255,255,0.9) inset, 0 20px 40px -20px rgba(30, 35, 80, 0.25)',
  borderRadius: '22px', padding: '22px',
}

const eyebrow = {
  fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
  color: 'rgba(15,16,32,0.55)', fontWeight: 500, marginBottom: '10px',
}

const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  marginBottom: '20px', padding: '0 6px',
}

const logoBox = {
  width: '36px', height: '36px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)',
  display: 'grid', placeItems: 'center', fontSize: '18px', fontWeight: 600,
}

const gridStyle = {
  display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr',
  gridTemplateRows: 'auto auto auto', gap: '18px', position: 'relative',
}

const glassOrb = {
  position: 'absolute', inset: '30px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.8)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
}

const tempBtn = {
  width: '36px', height: '36px', borderRadius: '50%',
  border: '1px solid rgba(15,16,32,0.2)', background: 'rgba(255,255,255,0.6)',
  fontSize: '16px', cursor: 'pointer',
}

const miniStatCard = {
  background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.7)',
  borderRadius: '14px', padding: '12px 14px',
}

const miniStatLabel = {
  fontSize: '10px', color: 'rgba(15,16,32,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase',
}

function pillBtn(active: boolean) {
  return {
    padding: '8px 14px', borderRadius: '999px',
    background: active ? 'rgba(15,16,32,0.88)' : 'rgba(255,255,255,0.55)',
    color: active ? '#fff' : '#0f1020',
    border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)',
    fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: active ? '0 6px 20px -8px rgba(0,0,0,0.4)' : 'none',
  }
}

function lightCard(id: string) {
  const L = store.lights[id]
  return {
    background: L.on
      ? `linear-gradient(180deg, oklch(0.96 0.08 ${L.hue} / 0.85), oklch(0.86 0.12 ${L.hue} / 0.6))`
      : 'rgba(255,255,255,0.35)',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: '16px', padding: '14px 12px',
    display: 'flex', flexDirection: 'column', gap: '10px',
    transition: 'background 250ms ease', position: 'relative',
  }
}

function lightDot(id: string) {
  const on = store.lights[id].on
  return {
    width: '26px', height: '26px', borderRadius: '50%',
    background: on ? '#0f1020' : 'rgba(255,255,255,0.7)',
    color: on ? '#fff' : '#0f1020', border: 'none', cursor: 'pointer',
    fontSize: '11px', display: 'grid', placeItems: 'center',
  }
}

function sceneBtn(id: string) {
  const active = store.activeScene === id
  return {
    padding: '14px 10px', borderRadius: '14px',
    background: active ? `linear-gradient(180deg, ${props.accent}, oklch(0.6 0.15 30))` : 'rgba(255,255,255,0.5)',
    color: active ? '#fff' : '#0f1020',
    border: '1px solid rgba(255,255,255,0.8)',
    cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
  }
}

function camDot(id: string) {
  const active = store.security.activeCamera === id
  return {
    width: '22px', height: '22px', borderRadius: '6px',
    background: active ? '#0f1020' : 'rgba(255,255,255,0.5)',
    color: active ? '#fff' : '#0f1020', border: '1px solid rgba(255,255,255,0.7)',
    fontSize: '10px', cursor: 'pointer',
  }
}
</script>
