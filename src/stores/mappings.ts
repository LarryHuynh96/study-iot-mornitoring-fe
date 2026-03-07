import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMappings, createMapping, updateMapping, deleteMapping } from '@/api/mappings'
import type { Mapping, MappingForm } from '@/types'
import { ElMessage } from 'element-plus'

export const useMappingStore = defineStore('mappings', () => {
  const mappings = ref<Mapping[]>([])
  const total = ref(0)
  const loading = ref(false)

  async function loadMappings(params?: { page?: number; page_size?: number; search?: string }) {
    loading.value = true
    try {
      const { data } = await fetchMappings(params)
      mappings.value = data.items
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  async function addMapping(form: MappingForm) {
    await createMapping(form)
    ElMessage.success('Mapping created successfully')
  }

  async function editMapping(id: number, form: MappingForm) {
    await updateMapping(id, form)
    ElMessage.success('Mapping updated successfully')
  }

  async function removeMapping(id: number) {
    await deleteMapping(id)
    ElMessage.success('Mapping deleted successfully')
  }

  return { mappings, total, loading, loadMappings, addMapping, editMapping, removeMapping }
})
