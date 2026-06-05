<script setup lang="ts">
import {computed, h, ref, resolveComponent, watch} from 'vue'
import type {TableColumn} from '@nuxt/ui'
import type {PodLog} from "@/api/interfaces/pod.log.interface.ts";
import {formatLocalDateTime} from "@/utils/DateUtils.ts";
import {getFilteredRowModel, getPaginationRowModel} from '@tanstack/vue-table'
import type {ColumnFiltersState, VisibilityState} from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')
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
  podLogs: PodLog[]
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
const containerFilter = ref<string>()
const logLevelFilter = ref<string>()

const podOptions = computed(() => [...new Set(props.podLogs.map((log) => log.podName))].sort())
const namespaceOptions = computed(() => [...new Set(props.podLogs.map((log) => log.namespace))].sort())
const containerOptions = computed(() => [...new Set(props.podLogs.map((log) => log.containerName))].sort())
const logLevelOptions = computed(() => [...new Set(props.podLogs.map((log) => log.logLevel?.logLevel))].filter(Boolean).sort() as string[])

const visibleColumns = computed<HideableColumn[]>(() =>
    table.value?.tableApi?.getAllColumns().filter((column: HideableColumn) => column.getCanHide()) || []
)

const setColumnFilter = (id: string, value?: string) => {
  table.value?.tableApi?.getColumn(id)?.setFilterValue(value || undefined)
}

const getColumnLabel = (column: HideableColumn) => String(column.columnDef.header || column.id)

watch(podFilter, (value) => setColumnFilter('podName', value))
watch(namespaceFilter, (value) => setColumnFilter('namespace', value))
watch(containerFilter, (value) => setColumnFilter('containerName', value))
watch(logLevelFilter, (value) => setColumnFilter('logLevel', value))
watch([globalFilter, columnFilters], () => {
  table.value?.tableApi?.setPageIndex(0)
}, {deep: true})

const columns: TableColumn<PodLog>[] = [
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
    accessorKey: 'containerName',
    header: 'Container',
    cell: ({row}) => {
      return row.getValue("containerName")
    }
  },
  {
    id: 'logLevel',
    accessorFn: (row) => row.logLevel?.logLevel,
    header: 'Log Level',
    cell: ({row}) => {
      const color = {
        INFO: 'info' as const,
        ERROR: 'error' as const,
        WARN: 'warning' as const
      }[row.getValue('logLevel') as string]

      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () =>
          row.getValue('logLevel')
      )
    }
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({row}) => {
      return formatLocalDateTime(row.getValue("timestamp"))
    }
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({row}) => {
      return row.getValue("message")
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
          placeholder="Search logs"
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

              <UFormField label="Container">
                <USelectMenu
                    v-model="containerFilter"
                    :items="containerOptions"
                    placeholder="All containers"
                    class="w-full"
                />
              </UFormField>

              <UFormField label="Log level">
                <USelectMenu
                    v-model="logLevelFilter"
                    :items="logLevelOptions"
                    placeholder="All levels"
                    class="w-full"
                />
              </UFormField>

              <UButton
                  label="Clear filters"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-x"
                  class="w-full justify-center"
                  @click="podFilter = undefined; namespaceFilter = undefined; containerFilter = undefined; logLevelFilter = undefined"
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

    <UTable :data="props.podLogs" v-model:pagination="pagination"
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
