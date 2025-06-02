import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  text?: string;
}

const Rating = ({ value, text }: RatingProps) => {
  return (
    <div className="rating flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? (
            <Star className="rating-filled" size={16} fill="currentColor" />
          ) : value >= star - 0.5 ? (
            <Star className="rating-filled" size={16} fill="currentColor" />
          ) : (
            <Star className="rating-empty" size={16} />
          )}
        </span>
      ))}
      {text && <span className="ml-1 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;