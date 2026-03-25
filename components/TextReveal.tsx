'use client'

interface TextRevealProps {
  text: string
  className?: string
}

export default function TextReveal({ text, className = '' }: TextRevealProps) {
  return (
    <p className={className}>
      {text}
    </p>
  )
}
