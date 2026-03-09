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

/**
 * Calculate duration between two HH:MM:SS[.ms] time strings
 * and return a human-readable string like "2m 3.3s".
 */
export function calcDuration(
  startTime: string | null | undefined,
  endTime: string | null | undefined,
): string {
  if (!startTime || !endTime) return '-'
  try {
    const toSeconds = (t: string): number => {
      const parts = t.split(':')
      return (
        Number(parts[0]) * 3600 +
        Number(parts[1]) * 60 +
        Number(parts[2])
      )
    }
    const diff = toSeconds(endTime) - toSeconds(startTime)
    if (diff < 0) return '-'
    const h = Math.floor(diff / 3600)
    const m = Math.floor((diff % 3600) / 60)
    const s = diff % 60
    const sFmt = Number.isInteger(s) ? `${s}s` : `${parseFloat(s.toFixed(1))}s`
    const parts: string[] = []
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    parts.push(sFmt)
    return parts.join(' ')
  } catch {
    return '-'
  }
}
