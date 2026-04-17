<template>
  <admin-layout>
    <div class="flex gap-5 h-[calc(100vh-120px)]">
      <!-- Chat History Sidebar -->
      <div class="w-72 flex-shrink-0 flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            @click="newChat"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-3 space-y-5">
          <div v-for="group in historyGroups" :key="group.label">
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase px-2 mb-1">{{ group.label }}</p>
            <ul class="space-y-0.5">
              <li
                v-for="item in group.chats"
                :key="item.id"
                class="group relative flex items-center rounded-lg px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                :class="{ 'bg-gray-100 dark:bg-gray-800': activeChatId === item.id }"
                @click="selectChat(item)"
              >
                <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate pr-6">{{ item.title }}</span>
                <div class="absolute right-2 hidden group-hover:flex items-center">
                  <button
                    @click.stop="openMenu(item.id)"
                    class="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                    </svg>
                  </button>
                </div>
                <!-- Context Menu -->
                <div
                  v-if="openMenuId === item.id"
                  v-click-outside="closeMenu"
                  class="absolute right-0 top-8 z-50 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1"
                >
                  <button
                    @click.stop="renameChat(item)"
                    class="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >Rename</button>
                  <button
                    @click.stop="deleteChat(item.id)"
                    class="w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >Delete</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="flex-1 flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Text Generator</h2>
        </div>

        <!-- Messages -->
        <div ref="messagesEl" class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center">
            <div class="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-4">
              <svg class="w-7 h-7 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Start a conversation to generate text</p>
          </div>

          <div v-for="msg in messages" :key="msg.id">
            <!-- User message -->
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <div class="max-w-[75%] bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                {{ msg.content }}
              </div>
            </div>
            <!-- AI message -->
            <div v-else class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/10 flex-shrink-0 flex items-center justify-center">
                <svg class="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                </svg>
              </div>
              <div class="max-w-[75%]">
                <div
                  class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
                  :class="{ 'animate-pulse': msg.loading }"
                >
                  <span v-if="msg.loading" class="text-gray-400 dark:text-gray-500">Generating...</span>
                  <span v-else>{{ msg.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <div class="flex items-end gap-3 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
            <label class="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 mb-0.5">
              <input type="file" class="hidden" @change="handleAttach" />
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
              </svg>
            </label>
            <textarea
              ref="inputEl"
              v-model="inputText"
              @keydown.enter.exact.prevent="sendMessage"
              rows="1"
              placeholder="Ask me to generate text..."
              class="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none outline-none max-h-32 overflow-y-auto"
              @input="autoResize"
            />
            <button
              @click="sendMessage"
              :disabled="!inputText.trim() || isLoading"
              class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors mb-0.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>

    <!-- Rename Modal -->
    <div v-if="renameModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 w-96 shadow-xl">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Rename Chat</h3>
        <input
          v-model="renameModal.value"
          @keydown.enter="confirmRename"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white outline-none focus:border-brand-500"
        />
        <div class="flex justify-end gap-3 mt-4">
          <button @click="renameModal.open = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cancel</button>
          <button @click="confirmRename" class="px-4 py-2 text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg">Save</button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const AI_RESPONSES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
]

let nextId = 1
const uid = () => nextId++

const messagesEl = ref(null)
const inputEl = ref(null)
const inputText = ref('')
const isLoading = ref(false)
const openMenuId = ref(null)
const activeChatId = ref(null)
const messages = ref([])

const renameModal = reactive({ open: false, chatId: null, value: '' })

const history = ref([
  { id: uid(), title: 'Write a follow-up email to a client', group: 'today', messages: [] },
  { id: uid(), title: 'Create a form layout with validation', group: 'today', messages: [] },
  { id: uid(), title: 'Design a modal component', group: 'today', messages: [] },
  { id: uid(), title: 'Generate a color palette for a brand', group: 'today', messages: [] },
  { id: uid(), title: 'Improve accessibility in navigation', group: 'yesterday', messages: [] },
  { id: uid(), title: 'Add animations to sidebar menu', group: 'yesterday', messages: [] },
  { id: uid(), title: 'Write form field validation logic', group: 'yesterday', messages: [] },
  { id: uid(), title: 'Create a responsive hero section', group: 'yesterday', messages: [] },
  { id: uid(), title: 'Build a pricing table component', group: 'yesterday', messages: [] },
  { id: uid(), title: 'Draft product description copy', group: 'lastweek', messages: [] },
  { id: uid(), title: 'Write API documentation outline', group: 'lastweek', messages: [] },
  { id: uid(), title: 'Generate onboarding email series', group: 'lastweek', messages: [] },
])

const historyGroups = computed(() => [
  { label: 'Today', chats: history.value.filter(h => h.group === 'today') },
  { label: 'Yesterday', chats: history.value.filter(h => h.group === 'yesterday') },
  { label: 'Last Week', chats: history.value.filter(h => h.group === 'lastweek') },
].filter(g => g.chats.length > 0))

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

const autoResize = () => {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 128) + 'px'
}

const newChat = () => {
  activeChatId.value = null
  messages.value = []
  inputText.value = ''
}

const selectChat = (item) => {
  activeChatId.value = item.id
  messages.value = [...item.messages]
  openMenuId.value = null
  scrollToBottom()
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  isLoading.value = true
  inputText.value = ''
  if (inputEl.value) inputEl.value.style.height = 'auto'

  const userMsg = { id: uid(), role: 'user', content: text }
  messages.value.push(userMsg)
  await scrollToBottom()

  // Add to history if it's a new chat
  if (!activeChatId.value) {
    const newEntry = { id: uid(), title: text.slice(0, 50), group: 'today', messages: [] }
    history.value.unshift(newEntry)
    activeChatId.value = newEntry.id
  }

  const aiMsg = { id: uid(), role: 'ai', content: '', loading: true }
  messages.value.push(aiMsg)
  await scrollToBottom()

  await new Promise(r => setTimeout(r, 1200))

  const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
  aiMsg.loading = false
  aiMsg.content = response

  // Save messages to history entry
  const entry = history.value.find(h => h.id === activeChatId.value)
  if (entry) entry.messages = messages.value.map(m => ({ ...m }))

  isLoading.value = false
  await scrollToBottom()
}

const openMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const closeMenu = () => {
  openMenuId.value = null
}

const renameChat = (item) => {
  renameModal.chatId = item.id
  renameModal.value = item.title
  renameModal.open = true
  openMenuId.value = null
}

const confirmRename = () => {
  const entry = history.value.find(h => h.id === renameModal.chatId)
  if (entry && renameModal.value.trim()) {
    entry.title = renameModal.value.trim()
  }
  renameModal.open = false
}

const deleteChat = (id) => {
  history.value = history.value.filter(h => h.id !== id)
  if (activeChatId.value === id) newChat()
  openMenuId.value = null
}

const handleAttach = (e) => {
  const file = e.target.files[0]
  if (file) inputText.value += ` [Attached: ${file.name}]`
}

// Click-outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value() }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  },
}
</script>
