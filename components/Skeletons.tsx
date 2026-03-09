const pulse = 'animate-pulse rounded-lg'

function Bar({ className }: { className?: string }) {
  return <div className={`${pulse} ${className}`} />
}

export function AboutSkeleton() {
  return (
    <div className="px-6 py-28 md:py-40 max-w-6xl mx-auto">
      <Bar className="bg-charcoal/10 h-3 w-24 mx-auto mb-8" />
      <Bar className="bg-charcoal/10 h-10 w-80 mx-auto mb-6" />
      <Bar className="bg-charcoal/10 h-4 w-96 mx-auto mb-20" />
      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Bar key={i} className="bg-charcoal/5 h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export function ScheduleSkeleton() {
  return (
    <div className="px-6 py-28 md:py-40 max-w-5xl mx-auto">
      <Bar className="bg-charcoal/10 h-3 w-20 mx-auto mb-8" />
      <Bar className="bg-charcoal/10 h-10 w-64 mx-auto mb-16" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Bar key={i} className="bg-charcoal/5 h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export function EventsSkeleton() {
  return (
    <div className="bg-charcoal px-6 py-28 md:py-40">
      <div className="max-w-6xl mx-auto">
        <Bar className="bg-cream/5 h-3 w-28 mx-auto mb-8" />
        <Bar className="bg-cream/10 h-10 w-72 mx-auto mb-16" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Bar key={i} className="bg-cream/5 h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function MenuSkeleton() {
  return (
    <div className="px-6 py-28 md:py-40 max-w-4xl mx-auto">
      <Bar className="bg-charcoal/10 h-3 w-16 mx-auto mb-8" />
      <Bar className="bg-charcoal/10 h-10 w-48 mx-auto mb-12" />
      <div className="flex gap-3 justify-center mb-12">
        {[...Array(3)].map((_, i) => (
          <Bar key={i} className="bg-charcoal/10 h-10 w-28 rounded-full" />
        ))}
      </div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <Bar className="bg-charcoal/5 h-5 w-48" />
            <Bar className="bg-charcoal/5 h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function InfoSkeleton() {
  return (
    <div className="bg-charcoal px-6 py-28 md:py-40">
      <div className="max-w-6xl mx-auto">
        <Bar className="bg-cream/5 h-3 w-20 mx-auto mb-8" />
        <Bar className="bg-cream/10 h-10 w-56 mx-auto mb-20" />
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Bar className="bg-cream/5 h-3 w-16 mb-3" />
                <Bar className="bg-cream/8 h-5 w-48" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Bar className="bg-cream/5 h-[280px] rounded-2xl" />
            <Bar className="bg-cream/5 h-[280px] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FooterSkeleton() {
  return (
    <div className="bg-charcoal px-6 py-20">
      <Bar className="bg-cream/5 h-20 w-96 mx-auto mb-12 rounded-2xl" />
      <Bar className="bg-cream/5 h-3 w-48 mx-auto" />
    </div>
  )
}

export function EventsPageSkeleton() {
  return (
    <div className="bg-charcoal px-6 py-28 md:py-40">
      <div className="max-w-6xl mx-auto">
        <Bar className="bg-cream/5 h-3 w-32 mx-auto mb-8" />
        <Bar className="bg-cream/10 h-12 w-80 mx-auto mb-6" />
        <Bar className="bg-cream/5 h-4 w-64 mx-auto mb-16" />
        <div className="flex gap-3 justify-center mb-12">
          {[...Array(3)].map((_, i) => (
            <Bar key={i} className="bg-cream/5 h-10 w-32 rounded-full" />
          ))}
        </div>
        <Bar className="bg-cream/5 h-48 rounded-2xl mb-6" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Bar key={i} className="bg-cream/5 h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function GalleryPageSkeleton() {
  return (
    <div className="bg-charcoal px-6 py-28 md:py-40">
      <div className="max-w-6xl mx-auto">
        <Bar className="bg-cream/5 h-3 w-24 mx-auto mb-8" />
        <Bar className="bg-cream/10 h-12 w-72 mx-auto mb-16" />
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {['h-48', 'h-64', 'h-44', 'h-56', 'h-48', 'h-72', 'h-52', 'h-60', 'h-44'].map((h, i) => (
            <Bar key={i} className={`bg-cream/5 rounded-2xl mb-4 w-full ${h}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
