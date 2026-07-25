import { AlertCircle, FolderOpen, RefreshCw } from 'lucide-react'

// 1. Loading Skeleton View
interface LoadingStateProps {
  count?: number
  type?: 'card' | 'list' | 'table'
}

export function LoadingState({ count = 3, type = 'card' }: LoadingStateProps) {
  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </div>
            <div className="h-8 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded-lg bg-muted/60 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 animate-pulse space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </div>
            <div className="h-12 w-full rounded bg-muted/50" />
          </div>
          <div className="h-10 w-full rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  )
}

// 2. Empty State View
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-4 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// 3. Error State View
interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while fetching information. Please check your network connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive space-y-3">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <h3 className="font-bold text-base">{title}</h3>
      </div>
      <p className="text-xs opacity-90 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground shadow hover:bg-destructive/90 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </button>
      )}
    </div>
  )
}
