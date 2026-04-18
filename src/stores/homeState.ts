import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const ROOMS = [
  { id: 'living',  name: 'Living Room' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'bed',     name: 'Bedroom' },
  { id: 'bath',    name: 'Bathroom' },
  { id: 'office',  name: 'Office' },
  { id: 'garage',  name: 'Garage' },
  { id: 'garden',  name: 'Garden' },
]

export const SCENES = [
  { id: 'morning', name: 'Morning',     glyph: '☼' },
  { id: 'focus',   name: 'Focus',       glyph: '◐' },
  { id: 'movie',   name: 'Movie Night', glyph: '▶' },
  { id: 'dinner',  name: 'Dinner',      glyph: '◇' },
  { id: 'away',    name: 'Away',        glyph: '↗' },
  { id: 'sleep',   name: 'Sleep',       glyph: '☾' },
]

export const PEOPLE = [
  {
    id: 'ava', name: 'Ava', initials: 'AV',
    color: 'oklch(0.78 0.14 30)',
    status: 'Focus mode', room: 'office', home: true,
    devices: [
      { id: 'phone',  name: 'iPhone',      detail: 'On · 64%',        kind: 'phone' },
      { id: 'laptop', name: 'MacBook Pro', detail: 'Active · Figma',  kind: 'laptop' },
      { id: 'head',   name: 'AirPods Pro', detail: 'Noise Cancel',    kind: 'audio' },
      { id: 'lamp',   name: 'Desk Lamp',   detail: '95% · 4000K',     kind: 'light' },
    ],
  },
  {
    id: 'sam', name: 'Sam', initials: 'SM',
    color: 'oklch(0.78 0.14 220)',
    status: 'Cooking', room: 'kitchen', home: true,
    devices: [
      { id: 'phone',  name: 'Pixel 8',      detail: 'On · 88%',        kind: 'phone' },
      { id: 'oven',   name: 'Smart Oven',   detail: '375°F · preheat', kind: 'appliance' },
      { id: 'speak',  name: 'Kitchen Mini', detail: 'Playing · 32%',   kind: 'audio' },
    ],
  },
  {
    id: 'rue', name: 'Rue', initials: 'RU',
    color: 'oklch(0.78 0.14 150)',
    status: 'Watching TV', room: 'living', home: true,
    devices: [
      { id: 'tab',    name: 'iPad',       detail: 'Idle',    kind: 'tablet' },
      { id: 'tv',     name: 'Living TV',  detail: 'Netflix', kind: 'media' },
      { id: 'switch', name: 'Switch',     detail: 'Docked',  kind: 'game' },
    ],
  },
  {
    id: 'kit', name: 'Kit', initials: 'KT',
    color: 'oklch(0.78 0.14 300)',
    status: 'Away · Office', room: null, home: false,
    devices: [
      { id: 'phone', name: 'iPhone',      detail: 'Away · 4mi', kind: 'phone' },
      { id: 'watch', name: 'Apple Watch', detail: 'Paired · 72%', kind: 'wearable' },
    ],
  },
]

type LightState = { on: boolean; level: number; hue: number }
type BlindsState = Record<string, number>

interface ApplianceState {
  on: boolean
  state: string
  detail: string
}

interface ActivityItem {
  id: number
  when: string
  text: string
  kind: string
}

export const useHomeStore = defineStore('home', () => {
  const activeRoom = ref('living')
  const activeScene = ref('morning')
  const tempTarget = ref(70)
  const tempOutside = ref(58)
  const tempInside = ref(69)
  const humidity = ref(42)
  const airQuality = ref(94)

  const lights = ref<Record<string, LightState>>({
    living:  { on: true,  level: 72, hue: 38 },
    kitchen: { on: true,  level: 88, hue: 52 },
    bed:     { on: false, level: 40, hue: 28 },
    bath:    { on: false, level: 60, hue: 30 },
    office:  { on: true,  level: 95, hue: 60 },
    garage:  { on: false, level: 30, hue: 20 },
    garden:  { on: true,  level: 50, hue: 35 },
  })

  const blinds = ref<BlindsState>({
    living:  68,
    kitchen: 100,
    bed:     20,
    bath:    45,
    office:  80,
    garage:  0,
    garden:  0,
  })

  const media = ref({
    playing: true,
    track: 'Reflections in Amber',
    artist: 'Hiroshi Yoshimura',
    album: 'Music for Nine Post Cards',
    room: 'living',
    volume: 32,
    elapsed: 142,
    duration: 268,
  })

  const security = ref({
    armed: false,
    frontDoor: 'locked',
    backDoor: 'locked',
    garage: 'closed',
    cameras: [
      { id: 'front', name: 'Front Porch',  motion: false, time: 'now' },
      { id: 'back',  name: 'Back Garden',  motion: true,  time: '2m' },
      { id: 'drive', name: 'Driveway',     motion: false, time: '14m' },
      { id: 'side',  name: 'Side Gate',    motion: false, time: '41m' },
    ],
    activeCamera: 'front',
  })

  const appliances = ref<Record<string, ApplianceState>>({
    oven:   { on: false, state: 'Idle',     detail: '—' },
    fridge: { on: true,  state: 'Cooling',  detail: '37°F · 94%' },
    washer: { on: true,  state: 'Rinse',    detail: '18m left' },
    dryer:  { on: false, state: 'Complete', detail: 'Clothes ready' },
  })

  const energy = ref({ now: 2.4, today: 18.6, solar: 1.8 })

  const activity = ref<ActivityItem[]>([
    { id: 1, when: 'just now', text: 'Motion detected · Back Garden', kind: 'motion' },
    { id: 2, when: '3m',       text: 'Washer entered rinse cycle',    kind: 'appliance' },
    { id: 3, when: '12m',      text: 'Office lights set to 95%',      kind: 'light' },
    { id: 4, when: '28m',      text: 'Front door unlocked by Ava',    kind: 'security' },
    { id: 5, when: '1h',       text: 'Morning scene activated',       kind: 'scene' },
    { id: 6, when: '2h',       text: 'Thermostat set to 70°',         kind: 'climate' },
  ])

  const activeLightsCount = computed(() =>
    Object.values(lights.value).filter(l => l.on).length,
  )

  let mediaTimer: ReturnType<typeof setInterval> | null = null

  function startMediaTimer() {
    mediaTimer = setInterval(() => {
      if (media.value.playing) {
        media.value.elapsed = (media.value.elapsed + 1) % media.value.duration
      }
    }, 1000)
  }

  function stopMediaTimer() {
    if (mediaTimer !== null) {
      clearInterval(mediaTimer)
      mediaTimer = null
    }
  }

  function setRoom(id: string) { activeRoom.value = id }

  function toggleLight(room: string) {
    lights.value[room].on = !lights.value[room].on
  }

  function setLightLevel(room: string, level: number) {
    lights.value[room].level = level
    lights.value[room].on = level > 0
  }

  function setBlinds(room: string, v: number) { blinds.value[room] = v }

  function setTemp(t: number) { tempTarget.value = t }

  function setScene(id: string) {
    activeScene.value = id
    const presets: Record<string, Record<string, [boolean, number]>> = {
      morning: { living: [true, 72],  kitchen: [true, 88],  bed: [false, 40], office: [true, 60],  bath: [false, 60], garage: [false, 30], garden: [true, 50] },
      focus:   { living: [false, 0],  kitchen: [false, 0],  bed: [false, 0],  office: [true, 98],  bath: [false, 0],  garage: [false, 0],  garden: [false, 0] },
      movie:   { living: [true, 14],  kitchen: [false, 0],  bed: [false, 0],  office: [false, 0],  bath: [false, 0],  garage: [false, 0],  garden: [true, 20] },
      dinner:  { living: [true, 55],  kitchen: [true, 72],  bed: [false, 0],  office: [false, 0],  bath: [false, 0],  garage: [false, 0],  garden: [true, 30] },
      away:    { living: [false, 0],  kitchen: [false, 0],  bed: [false, 0],  office: [false, 0],  bath: [false, 0],  garage: [false, 0],  garden: [false, 0] },
      sleep:   { living: [false, 0],  kitchen: [false, 0],  bed: [true, 12],  office: [false, 0],  bath: [false, 0],  garage: [false, 0],  garden: [false, 0] },
    }
    const preset = presets[id]
    if (preset) {
      Object.entries(preset).forEach(([r, [on, level]]) => {
        lights.value[r] = { ...lights.value[r], on, level }
      })
    }
  }

  function toggleMedia() { media.value.playing = !media.value.playing }
  function setVolume(v: number) { media.value.volume = v }

  function toggleArmed() { security.value.armed = !security.value.armed }

  function toggleLock(which: 'frontDoor' | 'backDoor') {
    security.value[which] = security.value[which] === 'locked' ? 'unlocked' : 'locked'
  }

  function setCamera(id: string) { security.value.activeCamera = id }

  function toggleAppliance(id: string) {
    appliances.value[id].on = !appliances.value[id].on
  }

  function setAllLightLevel(level: number) {
    Object.keys(lights.value).forEach(r => setLightLevel(r, level))
  }

  return {
    activeRoom, activeScene, tempTarget, tempOutside, tempInside,
    humidity, airQuality, lights, blinds, media, security, appliances,
    energy, activity, activeLightsCount,
    startMediaTimer, stopMediaTimer,
    setRoom, toggleLight, setLightLevel, setBlinds, setTemp, setScene,
    toggleMedia, setVolume, toggleArmed, toggleLock, setCamera,
    toggleAppliance, setAllLightLevel,
  }
})

export function roomName(id: string | null): string {
  return ROOMS.find(r => r.id === id)?.name ?? id ?? ''
}

export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function currentGreeting(): string {
  const h = new Date().getHours()
  if (h < 5)  return 'Late night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}
