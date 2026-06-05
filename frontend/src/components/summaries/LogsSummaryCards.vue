<template>
  <div class="m-3">
    <div class="flex flex-col md:flex-row gap-3">
      <UCard
          class="w-full md:max-w-[340px]"
          variant="outline"
      >
        <div class="flex flex-col gap-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm text-gray-400 uppercase tracking-wide">
                Count By Log Level
              </p>
            </div>
          </div>

          <NumberFlow
              :value="logLevelCount"
              class="text-4xl font-bold tracking-tight"
          />

          <p class="text-xs text-gray-500">
            Log count by log level/severity
          </p>
          <USeparator/>
          <div>
            <UFormField label="Select Level">
              <USelectMenu
                  class="min-w-44"
                  v-model="selectedLogLevel"
                  :items="LogLevels"
              />
            </UFormField>
          </div>
        </div>
      </UCard>
      <CountGroupedByLogLevelChart/>
    </div>
  </div>
</template>

<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import {onMounted, type Ref, ref, watch} from 'vue'
import {LogLevels} from "@/api/data/LogLevels.ts";
import {countByLogLevel} from "@/api/services/PodLogService.ts";

const selectedLogLevel: Ref<string> = ref<string>("INFO")
const logLevelCount: Ref<number> = ref<number>(0)

const onFetchLogLevelCount = async (logLevel: string) => {
  try {
    logLevelCount.value = await countByLogLevel(logLevel)
  } catch (e) {
    console.error(`Error is: ${e}`)
  }
}

onMounted(() => {
  onFetchLogLevelCount(selectedLogLevel.value)
})

watch(selectedLogLevel, (newSelectedLogLevel) => {
  onFetchLogLevelCount(newSelectedLogLevel)
})

</script>