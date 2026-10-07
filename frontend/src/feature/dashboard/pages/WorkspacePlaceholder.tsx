import { Files, History } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function WorkspacePlaceholder({ page }: { page: 'Files' | 'Activity Log' }) {
  const Icon = page === 'Files' ? Files : History
  return (
    <section>
      <p className="text-xs font-semibold tracking-widest text-text-secondary">YOUR WORKSPACE</p>
      <h2 className="mt-3 mb-2 text-[28px] font-semibold tracking-tight">{page}</h2>
      <p className="text-sm text-text-secondary">
        {page === 'Files'
          ? 'Your files and redaction projects.'
          : 'Your recent workspace activity.'}
      </p>
      <Card className="mt-8 px-6 py-16 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-xl border border-[var(--color-border-secondary)] bg-(--color-chrome-bg) text-[var(--color-secondary-text)]">
          <Icon className="size-7" strokeWidth={1.5} aria-hidden />
        </span>
        <h3 className="mt-5 mb-2 text-lg font-semibold">{page} is coming soon</h3>
        <p className="text-sm text-text-secondary">This section is a placeholder for now.</p>
      </Card>
    </section>
  )
}
