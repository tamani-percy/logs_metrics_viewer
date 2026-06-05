<template>
  <UCard class="w-full">
    <div class="flex flex-col gap-6">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-gray-400 uppercase tracking-wide">
            Log count by Log Level
          </p>
        </div>
      </div>

      <div class="max-h-[200px]">
        <Doughnut :data="chartData" :options="chartOptions"/>
      </div>
    </div>

  </UCard>
</template>


<script setup lang="ts">
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js'
import {Doughnut} from 'vue-chartjs'
import {computed, onMounted, ref, type Ref} from "vue"
import type {LogLevelCount} from "@/api/interfaces/pod.log.interface.ts";
import {countGroupedByLogLevel} from "@/api/services/PodLogService.ts";

const groupedLogLevel: Ref<LogLevelCount[]> = ref<LogLevelCount[]>([])

ChartJS.register(ArcElement, Tooltip, Legend)

const onFetchGroupedLogLevel = async () => {
  try {
    groupedLogLevel.value = await countGroupedByLogLevel()
  } catch (e) {
    console.error(`Error is: ${e}`)
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

const chartData = computed(() => ({
  labels: groupedLogLevel.value.map(u => u.level),
  datasets: [
    {
      label: '',
      data: groupedLogLevel.value.map(u => u.count),
      backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
    }
  ]
}))

onMounted(() => {
  onFetchGroupedLogLevel()
})

</script>

<style scoped>

</style>