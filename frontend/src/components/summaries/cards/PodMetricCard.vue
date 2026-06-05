<template>
  <UCard class="w-full md:max-w-[340px]" variant="outline">
    <div class="flex flex-col gap-6">
      <div>
        <p class="text-sm text-gray-400 uppercase tracking-wide">{{ label }}</p>
        <h2 class="text-lg font-semibold mt-1">{{ selectedValue }} {{ selectionLabel }}</h2>
      </div>

      <NumberFlow
          :value="displayValue"
          :suffix="suffix"
          class="text-4xl font-bold tracking-tight"
      />

      <p class="text-xs text-gray-500">{{ description }}</p>
      <USeparator />

      <div class="flex flex-col gap-3">
        <UFormField v-if="namespaces?.length" label="Select Namespace">
          <USelectMenu class="min-w-44" v-model="selectedNamespace" :items="namespaces" />
        </UFormField>

        <UFormField v-if="resolvedPods.length" label="Select Pod">
          <USelectMenu class="min-w-44" v-model="selectedPod" :items="resolvedPods" />
        </UFormField>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  label: string
  suffix?: string
  description: string
  namespaces?: string[]
  pods?: string[]
  podsByNamespace?: Record<string, string[]>
  fetcher: (value: string) => Promise<number>
}>()

const selectedNamespace = ref(props.namespaces?.[0] ?? "")
const selectedPod = ref(props.pods?.[0] ?? "")

const resolvedPods = computed(() => {
  if (props.podsByNamespace && selectedNamespace.value) {
    return props.podsByNamespace[selectedNamespace.value] ?? []
  }
  return props.pods ?? []
})

const selectedValue = computed(() =>
    resolvedPods.value.length ? selectedPod.value : selectedNamespace.value
)

const selectionLabel = computed(() =>
    resolvedPods.value.length ? 'Pod' : 'Namespace'
)

const displayValue = ref(0)

watch(selectedNamespace, (ns) => {
  if (props.podsByNamespace) {
    const pods = props.podsByNamespace[ns] ?? []
    selectedPod.value = pods[0] ?? ""
  }
})

watch(
    () => props.pods,
    (newPods) => {
      if (newPods?.length) {
        selectedPod.value = newPods[0]!
      }
    },
    { immediate: true }
)

watch(() => props.namespaces, (newNamespaces) => {
  if (newNamespaces?.length) {
    selectedNamespace.value = newNamespaces[0]!
  }
}, { immediate: true })

watch(selectedValue, async (val) => {
  if (val) displayValue.value = await props.fetcher(val)
}, { immediate: true })
</script>