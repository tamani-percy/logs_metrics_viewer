<script setup lang="ts">
import MetricsSummaryCards from "@/components/summaries/MetricsSummaryCards.vue";
import LogsSummaryCards from "@/components/summaries/LogsSummaryCards.vue";

import {ref} from 'vue'
import type {AccordionItem, TabsItem} from '@nuxt/ui'
import Metrics from "@/components/logs_and_metrics/Metrics.vue";
import Logs from "@/components/logs_and_metrics/Logs.vue";

const accordionItems = ref<AccordionItem[]>([
  {
    label: 'METRICS SUMMARY',
    icon: 'i-lucide-scroll-text',
    slot: 'metrics_summary' as const,
  },
  {
    label: 'LOGS SUMMARY',
    icon: 'i-lucide-activity',
    slot: 'logs_summary' as const,
  },
])

const tabsItems: TabsItem[] = [
  {
    label: 'LOGS',
    icon: 'i-lucide-scroll-text',
    slot: 'logs' as const,
  },
  {
    label: 'METRICS',
    icon: 'i-lucide-activity',
    slot: 'metrics' as const,
  }
]
</script>

<template>
  <UCard variant="outline">
    <UAccordion
        default-value="0"
        :items="accordionItems"
        :unmount-on-hide="false"
    >
      <template #metrics_summary>
        <MetricsSummaryCards/>
      </template>

      <template #logs_summary>
        <LogsSummaryCards/>
      </template>
    </UAccordion>
  </UCard>

  <UCard class="mt-5">
    <UTabs :unmount-on-hide="false" :items="tabsItems" class="w-full">
      <template #metrics="{ item }">
        <Metrics/>
      </template>
      <template #logs="{ item }">
        <Logs/>
      </template>
    </UTabs>
  </UCard>
</template>