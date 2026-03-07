import { ref, watch } from 'vue'

export function useTable(fetchFn: (params: Record<string, unknown>) => Promise<void>) {
  const page = ref(1)
  const pageSize = ref(20)
  const search = ref('')
  const searchDebounced = ref('')

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  watch(search, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      searchDebounced.value = val
      page.value = 1
    }, 300)
  })

  watch([page, pageSize, searchDebounced], () => {
    refresh()
  })

  function refresh() {
    const params: Record<string, unknown> = {
      page: page.value,
      page_size: pageSize.value,
    }
    if (searchDebounced.value) {
      params.search = searchDebounced.value
    }
    return fetchFn(params)
  }

  function handlePageChange(newPage: number) {
    page.value = newPage
  }

  function handleSizeChange(newSize: number) {
    pageSize.value = newSize
    page.value = 1
  }

  return {
    page,
    pageSize,
    search,
    refresh,
    handlePageChange,
    handleSizeChange,
  }
}
