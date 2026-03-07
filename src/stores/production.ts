import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchProductionRecords, fetchProductionRecord, exportProductionRecords } from '@/api/production'
import type { ProductionRecord, ProductionListParams } from '@/types'
import { downloadBlob } from '@/utils/export'

export const useProductionStore = defineStore('production', () => {
  const records = ref<ProductionRecord[]>([])
  const currentRecord = ref<ProductionRecord | null>(null)
  const total = ref(0)
  const loading = ref(false)

  async function loadRecords(params?: ProductionListParams) {
    loading.value = true
    try {
      const { data } = await fetchProductionRecords(params)
      records.value = data.items
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  async function loadRecord(id: number) {
    loading.value = true
    try {
      const { data } = await fetchProductionRecord(id)
      currentRecord.value = data as ProductionRecord
    } finally {
      loading.value = false
    }
  }

  async function exportRecords(params?: ProductionListParams) {
    const { data } = await exportProductionRecords(params)
    downloadBlob(data, 'production_records.xlsx')
  }

  return { records, currentRecord, total, loading, loadRecords, loadRecord, exportRecords }
})
