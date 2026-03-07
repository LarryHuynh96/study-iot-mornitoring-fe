import { format, parseISO } from 'date-fns'

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), 'yyyy-MM-dd HH:mm:ss')
  } catch {
    return dateStr
  }
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  try {
    return format(parseISO(dateStr), 'yyyy-MM-dd')
  } catch {
    return dateStr
  }
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return '-'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const parts: string[] = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

export function formatIP(ip: string | null | undefined): string {
  return ip || '-'
}
