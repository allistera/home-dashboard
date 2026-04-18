<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="grid gap-6 xl:grid-cols-[minmax(280px,30%)_minmax(0,1fr)]">
      <aside
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div class="space-y-6 p-4 sm:p-5">
          <Button
            className="w-full justify-start rounded-2xl bg-[#E44332] px-4 py-3.5 text-[1.1rem] font-semibold shadow-none hover:bg-[#D53928]"
          >
            <span
              class="flex size-10 items-center justify-center rounded-full bg-white/14"
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 3.25V14.75M3.25 9H14.75"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            Add task
          </Button>

          <nav class="space-y-1.5">
            <button
              v-for="item in navigationItems"
              :key="item.label"
              type="button"
              :class="[
                'flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition',
                item.active
                  ? 'bg-[#FFF1EB] text-[#E44332]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.04] dark:hover:text-white',
              ]"
            >
              <span class="flex items-center gap-3">
                <span
                  class="flex size-10 items-center justify-center rounded-xl border"
                  :class="
                    item.active
                      ? 'border-[#F8C9BB] bg-white text-[#E44332]'
                      : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400'
                  "
                  aria-hidden="true"
                  v-html="item.icon"
                />
                <span class="text-[1.1rem] font-medium">{{ item.label }}</span>
              </span>
              <span
                v-if="item.count"
                class="min-w-6 text-right text-base font-medium"
                :class="item.active ? 'text-[#E44332]' : 'text-gray-400 dark:text-gray-500'"
              >
                {{ item.count }}
              </span>
            </button>
          </nav>

          <div class="space-y-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            <div class="px-2">
              <p
                class="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500"
              >
                My Projects
              </p>
            </div>

            <div class="space-y-1.5">
              <button
                v-for="project in myProjects"
                :key="project.name"
                type="button"
                class="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.04] dark:hover:text-white"
              >
                <span class="flex items-center gap-3">
                  <span
                    class="size-3 rounded-full ring-4 ring-white dark:ring-gray-900"
                    :style="{ backgroundColor: project.color }"
                  />
                  <span class="text-[1.02rem] font-medium">{{ project.name }}</span>
                </span>
                <span class="text-sm font-medium text-gray-400 dark:text-gray-500">
                  {{ project.count }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <ComponentCard
        title="Todo"
        desc="A mixed Tailadmin and Todoist-style task workspace."
        className="h-full"
      >
        <div class="space-y-6">
          <div
            class="rounded-2xl border border-[#F8C9BB] bg-linear-to-r from-[#FFF6F2] via-white to-white p-5"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="space-y-1">
                <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#E44332]">
                  Today
                </p>
                <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                  Focus on the next three priorities
                </h2>
                <p class="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Use the new sidebar to jump between core task views and keep personal
                  projects one click away.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div
                  v-for="stat in stats"
                  :key="stat.label"
                  class="rounded-2xl border border-white bg-white px-4 py-3 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900"
                >
                  <p class="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
                    {{ stat.label }}
                  </p>
                  <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    {{ stat.value }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="task in featuredTasks"
              :key="task.title"
              class="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/40"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="size-2.5 rounded-full"
                      :style="{ backgroundColor: task.color }"
                    />
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {{ task.project }}
                    </p>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ task.title }}
                  </h3>
                  <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {{ task.description }}
                  </p>
                </div>

                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="task.badgeClass"
                >
                  {{ task.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Button from '@/components/ui/Button.vue'

defineOptions({
  name: 'TodoPage',
})

const pageTitle = 'Todo'

const navigationItems = [
  {
    label: 'Search',
    icon: `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M9.17 15.83a6.67 6.67 0 1 0 0-13.33 6.67 6.67 0 0 0 0 13.33Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="m17.5 17.5-3.63-3.63" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    label: 'Inbox',
    count: 3,
    active: true,
    icon: `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2.5 10.83 4.71 4.7A1.67 1.67 0 0 1 6.28 3.33h7.43c.7 0 1.33.44 1.57 1.1l2.22 6.4v4.17a1.67 1.67 0 0 1-1.67 1.67H4.17A1.67 1.67 0 0 1 2.5 15v-4.17Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M2.5 10.83h4.17l1.66 2.5h3.34l1.66-2.5h4.17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
  },
  {
    label: 'Today',
    count: 3,
    icon: `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3.33" y="4.17" width="13.33" height="12.5" rx="1.67" stroke="currentColor" stroke-width="1.6"/>
        <path d="M3.33 7.5h13.34M6.67 2.5v3.33m6.66-3.33v3.33" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    label: 'Upcoming',
    icon: `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3.33" y="3.33" width="13.33" height="13.33" rx="1.67" stroke="currentColor" stroke-width="1.6"/>
        <path d="M6.67 6.67h.01M10 6.67h.01M13.33 6.67h.01M6.67 10h.01M10 10h.01M13.33 10h.01M6.67 13.33h.01M10 13.33h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    label: 'Filters & Labels',
    icon: `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="5.5" height="5.5" rx="1.2" stroke="currentColor" stroke-width="1.5"/>
        <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.2" stroke="currentColor" stroke-width="1.5"/>
        <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" stroke-width="1.5"/>
        <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    `,
  },
]

const myProjects = [
  { name: 'Home Dashboard', count: 8, color: '#E44332' },
  { name: 'Shopping List', count: 4, color: '#465FFF' },
  { name: 'Routines', count: 6, color: '#12B76A' },
]

const stats = [
  { label: 'Inbox', value: '3' },
  { label: 'Today', value: '5' },
  { label: 'Upcoming', value: '12' },
]

const featuredTasks = [
  {
    project: 'Home Dashboard',
    title: 'Review the evening automation scenes',
    description: 'Confirm that kitchen, hallway, and porch routines still align with the latest occupancy rules.',
    status: 'In progress',
    color: '#E44332',
    badgeClass: 'bg-[#FFF1EB] text-[#E44332]',
  },
  {
    project: 'Shopping List',
    title: 'Batch recurring groceries for next week',
    description: 'Prepare a reusable list for staples and mark the items that should trigger low-stock reminders.',
    status: 'Next up',
    color: '#465FFF',
    badgeClass: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  },
]
</script>
