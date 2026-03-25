'use client'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  className,
}: AnimatedCounterProps) {
  const display = value >= 1000
    ? `${prefix}${Math.round(value / 1000)}K${suffix}`
    : `${prefix}${value}${suffix}`

  return (
    <span className={className}>
      {display}
    </span>
  )
}
