<template>
  <div class="m-3">
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <PodMetricCard
          label="CPU Usage"
          suffix=" Cores"
          description="Average CPU usage (cores) for the selected pod"
          :pods="pods"
          :fetcher="getAverageCpuByPod"
      />
      <PodMetricCard
          label="Memory Usage"
          suffix=" MB"
          description="Average Memory usage for the selected pod"
          :pods="pods"
          :fetcher="(pod:string) => getAverageMemoryByPod(pod).then(v => v * 0.000001)"
      />
      <PodMetricCard
          label="Total Requests"
          suffix=" req"
          description="Total requests per pod"
          :pods="pods"
          :fetcher="totalRequestsByPod"
      />
      <PodMetricCard
          label="Total Errors"
          suffix=" err"
          description="Total errors per namespace"
          :namespaces="namespaces"
          :fetcher="totalErrorsByNamespace"
      />
      <UCard class="w-full" variant="outline">
        <div class="flex flex-col gap-5">
          <div>
            <p class="text-sm text-gray-400 uppercase tracking-wide">CPU Spike Alert</p>
          </div>

          <div>
            <NumberFlow
                :value="cpuSpikesCount"
                suffix=" spikes"
                class="text-4xl font-bold tracking-tight"
            />
            <p class="text-xs text-gray-500 mt-2">Detected number of spike events</p>
          </div>

          <USeparator/>

          <UForm :schema="schema" :state="state as any" class="space-y-4" @submit="onSubmit">
            <UFormField label="CPU Threshold" name="threshold">
              <UInputNumber
                  :increment="false"
                  :decrement="false"
                  :step="0.01"
                  v-model="state.threshold"
                  :format-options="{
                    minimumFractionDigits: 2,
                    style: 'decimal'
                  }"
                  placeholder="Enter threshold"
                  prefix="MHz"
              />
            </UFormField>

            <UFormField label="Monitoring Date" name="since">
              <UInputDate ref="inputDate" v-model="state.since as DateValue" class="w-fit">
                <template #trailing>
                  <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                    <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        icon="i-lucide-calendar"
                        aria-label="Select a date"
                        class="px-0"
                    />
                    <template #content>
                      <UCalendar v-model="state.since as DateValue" class="p-2"/>
                    </template>
                  </UPopover>
                </template>
              </UInputDate>
            </UFormField>

            <div class="flex justify-end">
              <UButton type="submit" label="Go"/>
            </div>
          </UForm>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import {onMounted, reactive, ref, type Ref, useTemplateRef} from 'vue'
import {CalendarDate, type DateValue} from '@internationalized/date'
import {
  findCpuSpikes,
  getAllUniquePodNames,
  getAverageCpuByPod,
  getAverageMemoryByPod,
  totalErrorsByNamespace,
  totalRequestsByPod
} from "@/api/services/PodMetricService.ts"
import {getAllUniqueNamespaces} from "@/api/services/PodLogService.ts"
import * as z from 'zod'
import type {FormSubmitEvent} from '@nuxt/ui'

interface FormState {
  threshold?: number
  since?: DateValue
}

const schema = z.object({
  threshold: z.number('Invalid number').min(0.01, "Must be greater than 0"),
  since: z.custom<DateValue>(
      (val) => val instanceof CalendarDate,
      { message: "Invalid date" }
  )
})

type Schema = z.output<typeof schema>

const state = reactive<FormState>({
  threshold: undefined,
  since: undefined
})

const pods: Ref<string[]> = ref<string[]>([])
const namespaces: Ref<string[]> = ref<string[]>([])
const cpuSpikesCount: Ref<number> = ref<number>(0)

const inputDate = useTemplateRef('inputDate')


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
  const { threshold, since } = event.data
  const res = await findCpuSpikes(
      threshold,
      (since as CalendarDate).toDate("UTC").toISOString()
  )
  cpuSpikesCount.value = res.length
}
</script>