<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import type {TableColumn} from '@nuxt/ui'
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import {getFilteredRowModel, getPaginationRowModel} from '@tanstack/vue-table'
import type {ColumnFiltersState, VisibilityState} from '@tanstack/vue-table'
import type {PodMetric} from "@/api/interfaces/pod.metric.interface.ts";

type HideableColumn = {
  id: string
  columnDef: {
    header?: unknown
  }
  getCanHide: () => boolean
  getIsVisible: () => boolean
  toggleVisibility: (value?: boolean) => void
}

const table = ref<any>(null)

const props = defineProps<{
  podMetrics: PodMetric[]
}>()

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})

const globalFilter = ref('')
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const podFilter = ref<string>()
const namespaceFilter = ref<string>()

const podOptions = computed(() => [...new Set(props.podMetrics.map((metric) => metric.podName))].sort())
const namespaceOptions = computed(() => [...new Set(props.podMetrics.map((metric) => metric.namespace))].sort())

const visibleColumns = computed<HideableColumn[]>(() =>
    table.value?.tableApi?.getAllColumns().filter((column: HideableColumn) => column.getCanHide()) || []
)

const setColumnFilter = (id: string, value?: string) => {
  table.value?.tableApi?.getColumn(id)?.setFilterValue(value || undefined)
}

const getColumnLabel = (column: HideableColumn) => String(column.columnDef.header || column.id)

watch(podFilter, (value) => setColumnFilter('podName', value))
watch(namespaceFilter, (value) => setColumnFilter('namespace', value))
watch([globalFilter, columnFilters], () => {
  table.value?.tableApi?.setPageIndex(0)
}, {deep: true})

const columns: TableColumn<PodMetric>[] = [
  {
    accessorKey: 'podName',
    header: 'Pod',
    cell: ({row}) => {
      return row.getValue("podName")
    }
  },
  {
    accessorKey: 'namespace',
    header: 'Namespace',
    cell: ({row}) => {
      return row.getValue("namespace")
    }
  },
  {
    accessorKey: 'cpuUsageCores',
    header: 'CPU Usage (Cores)',
    cell: ({row}) => {
      return row.getValue("cpuUsageCores")
    }
  },
  {
    accessorKey: 'memoryUsageBytes',
    header: 'Memory Usage (MB)',
    cell: ({row}) => {
      return `${Number(row.getValue("memoryUsageBytes")) * 0.000001}`
    }
  },
  {
    accessorKey: 'requestCount',
    header: 'Request Count',
    cell: ({row}) => {
      return `${Number(row.getValue("requestCount"))} req`
    }
  },
  {
    accessorKey: 'errorCount',
    header: 'Error Count',
    cell: ({row}) => {
      return `${Number(row.getValue("errorCount"))} err`
    }
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({row}) => {
      return formatLocalDateTime(row.getValue("timestamp"))
    }
  },
]
</script>

<template>
  <UCard variant="soft" class="mt-5">
    <div class="flex flex-col gap-3 border-b border-default p-4 lg:flex-row lg:items-center lg:justify-between">
      <UInput
          v-model="globalFilter"
          icon="i-lucide-search"
          placeholder="Search metrics"
          class="w-full lg:max-w-xs"
      />

      <div class="flex flex-wrap gap-2">
        <UPopover>
          <UButton label="Filter" color="neutral" variant="outline" icon="i-lucide-list-filter"/>

          <template #content>
            <div class="w-64 space-y-3 p-3">
              <UFormField label="Pod">
                <USelectMenu
                    v-model="podFilter"
                    :items="podOptions"
                    placeholder="All pods"
                    class="w-full"
                />
              </UFormField>

              <UFormField label="Namespace">
                <USelectMenu
                    v-model="namespaceFilter"
                    :items="namespaceOptions"
                    placeholder="All namespaces"
                    class="w-full"
                />
              </UFormField>

              <UButton
                  label="Clear filters"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-x"
                  class="w-full justify-center"
                  @click="podFilter = undefined; namespaceFilter = undefined"
              />
            </div>
          </template>
        </UPopover>

        <UPopover>
          <UButton label="Visibility" color="neutral" variant="outline" icon="i-lucide-columns-3"/>

          <template #content>
            <div class="w-56 space-y-2 p-3">
              <UCheckbox
                  v-for="column in visibleColumns"
                  :key="column.id"
                  :model-value="column.getIsVisible()"
                  :label="getColumnLabel(column)"
                  @update:model-value="(value) => column.toggleVisibility(!!value)"
              />
            </div>
          </template>
        </UPopover>
      </div>
    </div>

    <UTable :data="props.podMetrics" v-model:pagination="pagination"
            v-model:global-filter="globalFilter"
            v-model:column-filters="columnFilters"
            v-model:column-visibility="columnVisibility"
            ref="table" :columns="columns" class="flex-1"
            :get-filtered-row-model="getFilteredRowModel()"
            :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"/>
    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
          :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </UCard>
</template>
