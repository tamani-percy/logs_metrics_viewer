<script setup lang="ts">
import {onMounted, reactive, type Ref, ref, shallowRef, useTemplateRef} from 'vue'
import {getLocalTimeZone, today} from '@internationalized/date'
import {getAllUniquePodNames, getByNamespacePodAndTimeRange} from "@/api/services/PodMetricService.ts"
import {getAllUniqueNamespaces} from "@/api/services/PodLogService.ts"
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'
import type {PodMetric, PodMetricNamespacePodRangeRequest} from "@/api/interfaces/pod.metric.interface.ts";

const inputDate = useTemplateRef('inputDate')

const pods: Ref<string[]> = ref<string[]>([])
const namespaces: Ref<string[]> = ref<string[]>([])

const podMetrics: Ref<PodMetric[]> = ref<PodMetric[]>([])

const isPodMetricsLoading: Ref<boolean> = ref<boolean>(false)
const hasSubmitted: Ref<boolean> = ref<boolean>(false)

const calendarRange = shallowRef({
  start: today(getLocalTimeZone()),
  end: today(getLocalTimeZone())
})

const schema = z.object({
  namespace: z.string().min(1, 'Namespace is required'),
  podName: z.string().min(1, 'Pod is required')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  namespace: undefined,
  podName: undefined
})

const onFetchPods = async () => {
  try {
    pods.value = await getAllUniquePodNames()
  } catch (e) {
    console.error(`Error fetching pods: ${e}`)
  }
}

const onFetchNamespaces = async () => {
  try {
    namespaces.value = await getAllUniqueNamespaces()
  } catch (e) {
    console.error(`Error fetching namespaces: ${e}`)
  }
}


onMounted(() => {
  onFetchPods()
  onFetchNamespaces()
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const {namespace, podName} = event.data

  try {
    isPodMetricsLoading.value = true
    hasSubmitted.value = true
    const payload: PodMetricNamespacePodRangeRequest = {
      namespace,
      podName,
      startTime: calendarRange.value.start.toDate('UTC').toISOString(),
      endTime: calendarRange.value.end.toDate('UTC').toISOString(),
    }

    podMetrics.value = await getByNamespacePodAndTimeRange(payload)
  } catch (e) {
    console.error(`Error is: ${e}`)
  } finally {
    isPodMetricsLoading.value = false
  }

}
</script>

<template>
<div class="flex justify-end">
  <UPopover :dismissible="false" :ui="{ content: 'p-4' }">
    <UButton label="Fetch Metrics" color="neutral" variant="solid" icon="i-lucide-forward"/>

    <template #content="{ close }">
      <div class="flex items-center justify-end">
        <UButton color="success" variant="ghost" icon="i-lucide-x" @click="close"/>
      </div>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Select Pod" name="podName">
          <USelectMenu
              class="w-full"
              placeholder="Select a pod"
              v-model="state.podName"
              :items="pods"
          />
        </UFormField>

        <UFormField label="Select Namespace" name="namespace">
          <USelectMenu
              class="w-full"
              placeholder="Select a namespace"
              v-model="state.namespace"
              :items="namespaces"
          />
        </UFormField>

        <UFormField label="Monitoring Date Range">
          <UInputDate ref="inputDate" v-model="calendarRange" range>
            <template #trailing>
              <UPopover :reference="inputDate?.inputsRef[0]?.$el">
                <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    icon="i-lucide-calendar"
                    aria-label="Select a date range"
                    class="px-0"
                />
                <template #content>
                  <UCalendar v-model="calendarRange" class="p-2" :number-of-months="2" range/>
                </template>
              </UPopover>
            </template>
          </UInputDate>
        </UFormField>
        <UButton type="submit" :loading="isPodMetricsLoading">Submit</UButton>
      </UForm>
    </template>
  </UPopover>

</div>  <div v-if="hasSubmitted">
    <UProgress v-if="isPodMetricsLoading" class="mt-3" animation="elastic"/>
    <MetricsTable v-else :podMetrics="podMetrics"/>
  </div>
</template>

<style scoped>

</style>