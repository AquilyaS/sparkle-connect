import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeMap = { sm: 14, md: 16, lg: 20 };

export default function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  className = '',
}: StarRatingProps) {
  const px = sizeMap[size];

  return (
    <div className={`flex items-center gap-0.5 ${className}`} role={interactive ? 'radiogroup' : undefined}>
      {[1, 2, 3, 4, 5].map(star => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={interactive ? 'cursor-pointer focus:outline-none hover:scale-110 transition-transform' : 'cursor-default'}
            aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
          >
            <Star
              size={px}
              className={
                filled
                  ? 'text-amber-400 fill-amber-400'
                  : half
                  ? 'text-amber-400 fill-amber-200'
                  : 'text-gray-300 fill-gray-100'
              }
            />
          </button>
        );
      })}
    </div>
  );
}
