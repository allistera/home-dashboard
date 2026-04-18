<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img src="/images/user/owner.jpg" alt="User" />
      </span>

      <span class="block mr-1 font-medium text-theme-sm">Allister </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          Allister Antosik
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          me@allisterantosik.com
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.text">
          <router-link
            v-if="item.href"
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
          <button
            v-else
            type="button"
            @click="openSettings"
            class="flex w-full items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </button>
        </li>
      </ul>
      <router-link
        to="/signin"
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </router-link>
    </div>
    <!-- Dropdown End -->

    <Modal v-if="isSettingsOpen" full-screen-backdrop @close="closeSettings">
      <template #body>
        <div
          class="no-scrollbar relative flex w-full max-w-[900px] flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900"
        >
          <div
            class="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800"
          >
            <h4 class="text-xl font-semibold text-gray-800 dark:text-white/90">Settings</h4>
            <button
              @click="closeSettings"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
            >
              <svg
                class="fill-current"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                  fill=""
                />
              </svg>
            </button>
          </div>

          <div class="flex min-h-[480px] flex-col md:flex-row">
            <nav
              class="shrink-0 border-b border-gray-200 p-4 md:w-56 md:border-b-0 md:border-r dark:border-gray-800"
            >
              <ul class="flex gap-1 md:flex-col">
                <li v-for="tab in tabs" :key="tab.id">
                  <button
                    type="button"
                    @click="activeTab = tab.id"
                    :class="[
                      'w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition',
                      activeTab === tab.id
                        ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5',
                    ]"
                  >
                    {{ tab.label }}
                  </button>
                </li>
              </ul>
            </nav>

            <div class="flex-1 overflow-y-auto p-6">
              <div v-if="activeTab === 'general'">
                <h5 class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">General</h5>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  General application settings.
                </p>
              </div>
              <div v-else-if="activeTab === 'home-assistant'">
                <h5 class="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                  Home Assistant
                </h5>
                <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
                  Home Assistant integration settings.
                </p>
                <form class="space-y-5" @submit.prevent="saveHomeAssistantSettings">
                  <div>
                    <label
                      for="home-assistant-url"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      Home Assistant URL
                    </label>
                    <input
                      id="home-assistant-url"
                      v-model.trim="homeAssistantSettings.url"
                      type="text"
                      placeholder="https://homeassistant.local:8123"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>

                  <div>
                    <label
                      for="home-assistant-api-key"
                      class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
                    >
                      API Key
                    </label>
                    <input
                      id="home-assistant-api-key"
                      v-model.trim="homeAssistantSettings.apiKey"
                      type="text"
                      placeholder="Enter your Home Assistant API key"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    />
                  </div>

                  <div class="flex items-center justify-between gap-3 pt-2">
                    <p
                      v-if="saveMessage"
                      class="text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ saveMessage }}
                    </p>
                    <button
                      type="submit"
                      class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ChevronDownIcon, LogoutIcon, SettingsIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import Modal from '@/components/ui/Modal.vue'

const HOME_ASSISTANT_STORAGE_KEY = 'home-dashboard.home-assistant-settings'

const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const isSettingsOpen = ref(false)
const activeTab = ref('general')
const saveMessage = ref('')
const homeAssistantSettings = ref({
  url: '',
  apiKey: '',
})

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'home-assistant', label: 'Home Assistant' },
]

const menuItems = [{ icon: SettingsIcon, text: 'Account settings' }]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const openSettings = () => {
  isSettingsOpen.value = true
  activeTab.value = 'general'
  closeDropdown()
}

const closeSettings = () => {
  isSettingsOpen.value = false
}

const loadHomeAssistantSettings = () => {
  const storedSettings = localStorage.getItem(HOME_ASSISTANT_STORAGE_KEY)

  if (!storedSettings) {
    return
  }

  try {
    const parsedSettings = JSON.parse(storedSettings)

    homeAssistantSettings.value = {
      url: parsedSettings.url ?? '',
      apiKey: parsedSettings.apiKey ?? '',
    }
  } catch (error) {
    console.error('Unable to load Home Assistant settings from local storage.', error)
  }
}

const saveHomeAssistantSettings = () => {
  localStorage.setItem(
    HOME_ASSISTANT_STORAGE_KEY,
    JSON.stringify({
      url: homeAssistantSettings.value.url,
      apiKey: homeAssistantSettings.value.apiKey,
    }),
  )

  saveMessage.value = 'Saved locally on this device.'
}

const signOut = () => {
  console.log('Signing out...')
  closeDropdown()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  loadHomeAssistantSettings()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
