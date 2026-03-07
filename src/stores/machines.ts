import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMachines, fetchMachine } from '@/api/machines'
import type { Machine, MachineListParams } from '@/types'

export const useMachineStore = defineStore('machines', () => {
  const machines = ref<Machine[]>([])
  const currentMachine = ref<Machine | null>(null)
  const total = ref(0)
  const loading = ref(false)

  async function loadMachines(params?: MachineListParams) {
    loading.value = true
    try {
      const { data } = await fetchMachines(params)
      machines.value = data.items
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  async function loadMachine(id: number) {
    loading.value = true
    try {
      const { data } = await fetchMachine(id)
      currentMachine.value = data
    } finally {
      loading.value = false
    }
  }

  return { machines, currentMachine, total, loading, loadMachines, loadMachine }
})
