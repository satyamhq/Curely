import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: number
  showScore?: boolean
}

export function RatingStars({
  rating,
  maxRating = 5,
  showScore = true,
}: RatingStarsProps) {
  const rounded = Math.round(rating * 10) / 10

  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: maxRating }).map((_, i) => {
        const fill = i + 1 <= Math.floor(rating)
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${fill ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
          />
        )
      })}
      {showScore && (
        <span className="ml-1 text-xs font-semibold text-foreground">{rounded}</span>
      )}
    </div>
  )
}
