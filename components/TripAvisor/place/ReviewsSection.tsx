import { ReviewDetail } from './ReviewDetail';

interface Review {
  user: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
  avatar: string;
}

export const ReviewsSection = ({ review }: { review: Review }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold">Opiniones</h3>
      <button className="text-green-600 font-medium text-base">Ver todas</button>
    </div>
    <ReviewDetail review={review} />
  </div>
);