<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="space-y-6">
      <ComponentCard
        title="Todo"
        desc="This page is ready for your task dashboard content."
      >
        <div
          class="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900/40"
        >
          <div class="max-w-md space-y-3">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">
              Todo
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Start adding Tailadmin task widgets, lists, and filters here.
            </p>
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

defineOptions({
  name: 'TodoPage',
})

const pageTitle = 'Todo'
</script>
