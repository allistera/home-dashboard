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
          <div :style="eyebrow">Nexus</div>
          <div :style="{ fontSize: '18px', fontWeight: 600, marginTop: '2px', fontFamily: '\'Orbitron\', sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }">
            Ambient Assistant
          </div>
        </div>
      </div>
      <div :style="{ display: 'flex', gap: '10px', fontSize: '12px', color: 'rgba(232,233,240,0.7)', fontFamily: '\'JetBrains Mono\', monospace' }">
        <span>{{ currentTime }}</span>
        <span :style="{ color: 'rgba(232,233,240,0.3)' }">·</span>
        <span>{{ store.tempOutside }}° clear</span>
        <span :style="{ color: 'rgba(232,233,240,0.3)' }">·</span>
        <span :style="{ color: accent }">● Listening</span>
      </div>
    </header>

    <main :style="mainGrid">
      <!-- LEFT: conversation -->
      <aside :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
        <section :style="{ ...panel, flex: 1, display: 'flex', flexDirection: 'column' }">
          <div :style="eyebrow">Conversation</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }">
            <div v-for="(m, i) in conversation" :key="i" :style="{ display: 'flex', flexDirection: 'column', gap: '4px' }">
              <div :style="{
                fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: m.who === 'ai' ? accent : 'rgba(232,233,240,0.5)',
                fontFamily: '\'JetBrains Mono\', monospace', fontWeight: 600,
              }">{{ m.who === 'ai' ? 'Nexus' : 'Ava' }} · {{ m.time }}</div>
              <div :style="{
                fontSize: '13px', lineHeight: 1.4,
                color: m.who === 'ai' ? '#e8e9f0' : 'rgba(232,233,240,0.75)',
                fontStyle: m.who === 'ai' ? 'normal' : 'italic',
              }">{{ m.text }}</div>
            </div>
          </div>
        </section>

        <section :style="panel">
          <div :style="eyebrow">Suggestions</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '6px' }">
            <button v-for="(q, i) in suggestions" :key="i" @click="runSuggestion(q)" :style="suggBtn">
              <span :style="{ color: accent }">›</span> {{ q }}
            </button>
          </div>
        </section>
      </aside>

      <!-- CENTER: AI pulse + rooms -->
      <section :style="{ position: 'relative', display: 'grid', placeItems: 'center' }">
        <svg viewBox="0 0 1080 800" width="100%" height="100%" :style="{ maxHeight: 'calc(100vh - 120px)' }">
          <defs>
            <radialGradient id="nexCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" :stop-color="accent" stop-opacity="0.55" />
              <stop offset="60%" :stop-color="accent" stop-opacity="0.08" />
              <stop offset="100%" :stop-color="accent" stop-opacity="0" />
            </radialGradient>
            <filter id="nexGlow"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>

          <circle v-for="(r, i) in [orbitR, orbitR + 28, orbitR - 30]" :key="i"
            :cx="cx" :cy="cy" :r="r"
            fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"
            :stroke-dasharray="i === 0 ? 'none' : '2 6'" />

          <line v-for="r in roomPositions" :key="r.id"
            :x1="cx" :y1="cy" :x2="r.x" :y2="r.y"
            :stroke="store.lights[r.id].on ? `oklch(0.8 0.14 ${store.lights[r.id].hue})` : 'rgba(255,255,255,0.06)'"
            :stroke-width="store.lights[r.id].on ? 1.5 : 1"
            :opacity="store.lights[r.id].on ? 0.5 : 1"
            :stroke-dasharray="store.lights[r.id].on ? 'none' : '3 5'" />

          <circle :cx="cx" :cy="cy" r="200" fill="url(#nexCore)" />

          <!-- Pulsing rings -->
          <circle v-for="i in 3" :key="i"
            :cx="cx" :cy="cy"
            :r="75 + (Math.sin(phase - (i - 1) * 0.6) * 0.5 + 0.5) * 40"
            fill="none" :stroke="accent" stroke-width="1.5" :opacity="0.35 - (i - 1) * 0.1" />

          <circle :cx="cx" :cy="cy" r="70" fill="rgba(15,16,22,0.95)" :stroke="accent" stroke-width="1.5" opacity="0.9" />

          <!-- Waveform -->
          <g :transform="`translate(${cx} ${cy - 6})`">
            <polyline :points="wavePoints" fill="none" :stroke="accent" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />
            <polyline :points="wavePoints" fill="none" :stroke="accent" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.25" filter="url(#nexGlow)" />
          </g>

          <text :x="cx" :y="cy + 32" text-anchor="middle" font-size="10" letter-spacing="3" fill="rgba(232,233,240,0.6)" font-family="'JetBrains Mono', monospace">
            {{ listening ? 'LISTENING' : 'STANDBY' }}
          </text>
          <text :x="cx" :y="cy + 52" text-anchor="middle" font-size="11" :fill="accent" font-family="'Orbitron', sans-serif" letter-spacing="0.12em">NEXUS</text>

          <g v-for="r in roomPositions" :key="r.id" style="cursor: pointer" @click="store.setRoom(r.id)">
            <circle v-if="store.lights[r.id].on"
              :cx="r.x" :cy="r.y" :r="(store.activeRoom === r.id ? 42 : 34) + 20"
              :fill="`oklch(0.8 0.14 ${store.lights[r.id].hue})`" opacity="0.15" filter="url(#nexGlow)" />
            <circle :cx="r.x" :cy="r.y" :r="store.activeRoom === r.id ? 42 : 34"
              :fill="store.lights[r.id].on ? `oklch(0.8 0.14 ${store.lights[r.id].hue})` : 'rgba(255,255,255,0.04)'"
              :stroke="store.activeRoom === r.id ? '#fff' : (store.lights[r.id].on ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)')"
              :stroke-width="store.activeRoom === r.id ? 2 : 1" />
            <text :x="r.x" :y="r.y - 2" text-anchor="middle" font-size="12" font-weight="500"
              :fill="store.lights[r.id].on ? '#0a0a0a' : '#e8e9f0'" font-family="'Space Grotesk', sans-serif">
              {{ r.name.split(' ')[0] }}
            </text>
            <text :x="r.x" :y="r.y + 12" text-anchor="middle" font-size="9" font-family="'JetBrains Mono', monospace"
              :fill="store.lights[r.id].on ? '#0a0a0a' : 'rgba(232,233,240,0.5)'">
              {{ store.lights[r.id].on ? `${store.lights[r.id].level}%` : 'off' }}
            </text>
          </g>
        </svg>

        <!-- Voice prompt bar -->
        <div :style="{
          position: 'absolute', bottom: 0, left: '20px', right: '20px',
          ...panel, display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px',
        }">
          <button @click="listening = !listening" :style="micBtn">{{ listening ? '■' : '●' }}</button>
          <div :style="{ flex: 1, minWidth: 0 }">
            <div :style="{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,233,240,0.5)', fontFamily: '\'JetBrains Mono\', monospace' }">
              {{ listening ? 'Listening…' : 'Last prompt' }}
            </div>
            <div :style="{ fontSize: '14px', marginTop: '2px', fontStyle: listening ? 'italic' : 'normal', color: listening ? accent : '#e8e9f0' }">
              {{ listening ? '…' : `"${lastPrompt}"` }}
            </div>
          </div>
          <div :style="{ fontSize: '10px', color: 'rgba(232,233,240,0.4)', fontFamily: '\'JetBrains Mono\', monospace', letterSpacing: '0.1em' }">HEY NEXUS</div>
        </div>
      </section>

      <!-- RIGHT: context panels -->
      <aside :style="{ display: 'flex', flexDirection: 'column', gap: '14px' }">
        <section :style="{ ...panel, borderColor: accent + '55', background: `linear-gradient(180deg, ${accent}15, rgba(20,22,32,0.6))` }">
          <div :style="{ ...eyebrow, color: accent }">Nexus suggests</div>
          <div :style="{ fontSize: '15px', lineHeight: 1.4, fontFamily: '\'Space Grotesk\', sans-serif' }">
            "{{ suggestion }}"
          </div>
          <div :style="{ display: 'flex', gap: '6px', marginTop: '12px' }">
            <button @click="confirmSuggestion" :style="{ ...confirmBtn, flex: 1 }">Yes, do it</button>
            <button @click="suggestion = 'Okay, standing by.'" :style="{ ...dismissBtn, flex: 1 }">Not now</button>
          </div>
        </section>

        <section :style="panel">
          <div :style="eyebrow">Currently Executing</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
            <div v-for="(x, i) in executing" :key="i">
              <div :style="{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }">
                <span>{{ x.t }}</span>
                <span :style="{ color: accent, fontFamily: '\'JetBrains Mono\', monospace' }">{{ x.p }}%</span>
              </div>
              <div :style="{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px' }">
                <div :style="{ width: x.p + '%', height: '100%', background: accent, borderRadius: '99px' }" />
              </div>
            </div>
          </div>
        </section>

        <section :style="{ ...panel, flex: 1 }">
          <div :style="eyebrow">Signal</div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '10px' }">
            <div v-for="a in store.activity.slice(0, 4)" :key="a.id" :style="{ display: 'flex', gap: '10px', alignItems: 'flex-start' }">
              <span :style="{
                width: '6px', height: '6px', borderRadius: '50%',
                background: a.kind === 'motion' ? accent : 'rgba(232,233,240,0.4)',
                marginTop: '6px', flexShrink: 0,
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
import { useHomeStore, ROOMS } from '@/stores/homeState'

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

const phase = ref(0)
let raf: number
const tick = () => { phase.value = (phase.value + 0.08) % (Math.PI * 2); raf = requestAnimationFrame(tick) }
onMounted(() => { raf = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(raf))

const listening = ref(false)
const lastPrompt = ref('Dim the living room to 40 and start movie night.')
const suggestion = ref('Good evening, Ava. Want me to start Movie Night?')

const conversation = computed(() => [
  { who: 'ai',  text: "Good evening, Ava. Want me to start Movie Night?",          time: 'now' },
  { who: 'you', text: 'Dim the living room to 40 and start movie night.',           time: '1s' },
  { who: 'ai',  text: 'On it — dimming 3 lights, lowering blinds, queuing film.',  time: '2s' },
  { who: 'you', text: "What's the temp in the bedroom?",                            time: '5m' },
  { who: 'ai',  text: `Bedroom is holding at ${store.tempInside}°F. Feels cool.`,  time: '5m' },
])

const suggestions = ['Start Movie Night', 'Dim all lights to 30%', 'Lock up for the night', 'Show front porch camera']
const executing = [{ t: 'Dimming Living Room', p: 70 }, { t: 'Lowering blinds', p: 45 }, { t: 'Queuing Netflix', p: 90 }]

const wavePoints = computed(() => {
  const waveW = 280, waveSteps = 60
  return Array.from({ length: waveSteps }).map((_, i) => {
    const t = i / (waveSteps - 1)
    const x = -waveW / 2 + t * waveW
    const amp = listening.value ? 18 : 6
    const freq = listening.value ? 6 : 3
    const y = Math.sin(t * Math.PI * freq + phase.value) * amp * (0.4 + Math.sin(t * Math.PI) * 0.7)
    return `${x},${y}`
  }).join(' ')
})

function runSuggestion(q: string) {
  lastPrompt.value = q
  if (q.includes('Movie')) store.setScene('movie')
  if (q.includes('Dim')) store.setAllLightLevel(30)
  if (q.includes('Lock')) store.toggleArmed()
}

function confirmSuggestion() {
  store.setScene('movie')
  suggestion.value = 'Movie Night started. Enjoy.'
}

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

const suggBtn = {
  padding: '10px 12px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.04)', color: '#e8e9f0',
  border: '1px solid rgba(255,255,255,0.1)',
  cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', gap: '8px',
}

const confirmBtn = computed(() => ({
  padding: '8px 10px', borderRadius: '8px',
  background: props.accent, color: '#0a0a0a', border: 'none',
  fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
  cursor: 'pointer', fontFamily: 'inherit',
}))

const dismissBtn = {
  padding: '8px 10px', borderRadius: '8px',
  background: 'rgba(255,255,255,0.04)', color: '#e8e9f0',
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase',
  cursor: 'pointer', fontFamily: 'inherit',
}

const micBtn = computed(() => ({
  width: '42px', height: '42px', borderRadius: '50%',
  background: listening.value ? props.accent : 'rgba(255,255,255,0.08)',
  color: listening.value ? '#0a0a0a' : props.accent,
  border: '1px solid ' + (listening.value ? props.accent : 'rgba(255,255,255,0.15)'),
  cursor: 'pointer', fontSize: '16px', flexShrink: 0,
}))
</script>
