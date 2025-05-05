
import React from 'react';
import { Review } from '../types';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  onDelete,
  showDeleteButton = true
}) => {
  const { setSelectedPlace, places, likeReview, unlikeReview, isReviewLiked } = useApp();
  
  const getPlaceImage = () => {
    // Use default images for demo purposes if placeImage is not provided
    if (review.placeImage) {
      const images: { [key: string]: string } = {
        'tacos.png': 'https://images.unsplash.com/photo-1551504734-5ee1c4a3479b',
        'mayan_ruins.png': 'https://images.unsplash.com/photo-1518638150340-f706e86654de',
        'handicraft.png': 'https://images.unsplash.com/photo-1528283648649-33347faa5d9e',
        'seafood.png': 'https://images.unsplash.com/photo-1579631542720-3a87824837de',
        'cruise.png': 'https://images.unsplash.com/photo-1548574505-5e239809ee19',
        'gift_shop.png': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
      };
      
      return images[review.placeImage] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
    }
    
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
  };
  
  const handleShowDetails = () => {
    // Find the place associated with the review and show its details
    if (review.placeId) {
      const place = places.find(p => p.id === review.placeId);
      if (place) {
        setSelectedPlace(place);
      }
    }
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReviewLiked(review.id)) {
      unlikeReview(review.id);
    } else {
      likeReview(review.id);
    }
  };
  
  const isLiked = isReviewLiked(review.id);
  
  return (
    <div className="travel-card mb-4" onClick={handleShowDetails}>
      <div className="flex items-start">
        {review.placeImage && (
          <div className="mr-3">
            <img 
              src={getPlaceImage()} 
              alt={review.title} 
              className="h-16 w-16 object-cover rounded-lg"
            />
          </div>
        )}
        {!review.placeImage && (
          <div className="bg-travel-light p-2 rounded-lg mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0CBDDE" strokeWidth="2">
              <path d="M2 7v13h20V7" />
              <path d="M2 7h20" />
              <path d="M16 7V3H8v4" />
              <path d="M12 12v5" />
              <path d="M10 14l2 2 2-2" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-medium">{review.placeName || review.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{review.text}</p>
          {review.date && (
            <p className="text-xs text-gray-500 mt-1">{review.date}</p>
          )}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <button 
                onClick={handleLikeToggle}
                className="flex items-center text-gray-500 hover:text-travel-primary"
              >
                <Heart 
                  size={16} 
                  className={`mr-1 ${isLiked ? "fill-travel-primary text-travel-primary" : ""}`} 
                />
                <span className="text-xs">{review.likes || 0}</span>
              </button>
            </div>
            
            {showDeleteButton && onDelete && (
              <button 
                className="bg-red-500 text-white rounded-lg px-3 py-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
