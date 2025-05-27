import { ThumbsUp, MessageCircle } from 'lucide-react';
import { RatingStars } from '../ui/RatingStarts';

interface Review {
  user: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  avatar: string;
}

export const ReviewDetail = ({ review }: { review: Review }) => (
  <div className="border-b border-gray-100 pb-4">
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
        {review.avatar}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-base">{review.user}</h4>
        <div className="flex items-center space-x-2">
          <RatingStars rating={review.rating} />
          <span className="text-sm text-gray-500">{review.date}</span>
        </div>
      </div>
    </div>
    <p className="text-gray-700 mb-3 text-base">&ldquo;{review.text}&rdquo;</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6 text-gray-500">
        <button className="flex items-center space-x-2 active:text-green-600">
          <ThumbsUp className="w-5 h-5" />
          <span className="text-base">Útil ({review.helpful})</span>
        </button>
        <button className="flex items-center space-x-2 active:text-green-600">
          <MessageCircle className="w-5 h-5" />
          <span className="text-base">Responder</span>
        </button>
      </div>
    </div>
  </div>
);
