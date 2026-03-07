import { ref } from 'vue'
import { format, subDays } from 'date-fns'

export function useDateFilter() {
  const dateRange = ref<[Date, Date] | null>(null)

  const shortcuts = [
    {
      text: 'Last 7 days',
      value: () => [subDays(new Date(), 7), new Date()] as [Date, Date],
    },
    {
      text: 'Last 30 days',
      value: () => [subDays(new Date(), 30), new Date()] as [Date, Date],
    },
    {
      text: 'Last 90 days',
      value: () => [subDays(new Date(), 90), new Date()] as [Date, Date],
    },
  ]

  function getDateParams() {
    if (!dateRange.value) return {}
    return {
      start_date: format(dateRange.value[0], 'yyyy-MM-dd'),
      end_date: format(dateRange.value[1], 'yyyy-MM-dd'),
    }
  }

  return { dateRange, shortcuts, getDateParams }
}
