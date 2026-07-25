import { RatingStars } from './RatingStars'
import { formatDate } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer?: {
    full_name: string | null
  }
}

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No reviews submitted yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold">
                {r.reviewer?.full_name?.charAt(0) ?? 'P'}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {r.reviewer?.full_name ?? 'Patient'}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">{formatDate(r.created_at)}</span>
          </div>
          <RatingStars rating={r.rating} size={14} />
          {r.comment && <p className="text-xs text-muted-foreground">{r.comment}</p>}
        </div>
      ))}
    </div>
  )
}
