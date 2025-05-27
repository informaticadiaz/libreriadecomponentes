import { ThumbsUp } from 'lucide-react';
import { RatingStars } from './RatingStarts';

interface Review {
  user: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  avatar: string;
}

export const ReviewPreview = ({ review }: { review: Review }) => (
  <div className="bg-gray-50 rounded-lg p-3 border">
    <div className="flex items-center space-x-2 mb-2">
      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
        {review.avatar}
      </div>
      <span className="text-sm font-medium">{review.user}</span>
      <RatingStars rating={review.rating} />
      <span className="text-xs text-gray-500">{review.date}</span>
    </div>
    <p className="text-sm text-gray-700 mb-2">&ldquo;{review.text}&rdquo;</p>
    <div className="flex items-center text-xs text-gray-500">
      <ThumbsUp className="w-3 h-3 mr-1" />
      {review.helpful} personas encontraron esto útil
    </div>
  </div>
);