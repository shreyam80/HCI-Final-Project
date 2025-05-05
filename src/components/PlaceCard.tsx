
import React, { useState } from 'react';
import { Place } from '../types';
import { Star, Plus, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from '../components/ui/sonner';

interface PlaceCardProps {
  place: Place;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  isDraggable?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ 
  place, 
  showAddButton = false, 
  showRemoveButton = false,
  isDraggable = false 
}) => {
  const { 
    setSelectedPlace, 
    removePlaceFromTrip,
    reviews
  } = useApp();
  
  const [showDetails, setShowDetails] = useState(false);
  
  // Find reviews for this place
  const placeReviews = reviews.filter(review => review.placeId === place.id);

  const getPlaceImage = () => {
    // If it's a direct URL, use it directly
    if (place.image && (place.image.startsWith('http://') || place.image.startsWith('https://'))) {
      return place.image;
    }
    
    // Use default images for demo purposes
    const images: { [key: string]: string } = {
      'tacos.png': 'https://images.unsplash.com/photo-1551504734-5ee1c4a3479b',
      'mayan_ruins.png': 'https://images.unsplash.com/photo-1518638150340-f706e86654de',
      'handicraft.png': 'https://images.unsplash.com/photo-1528283648649-33347faa5d9e',
      'seafood.png': 'https://images.unsplash.com/photo-1579631542720-3a87824837de',
      'cruise.png': 'https://images.unsplash.com/photo-1548574505-5e239809ee19',
      'gift_shop.png': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
    };
    
    return images[place.image] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
  };

  const handleAddToItinerary = () => {
    setSelectedPlace(place);
    document.getElementById('itinerarySelectModal')?.classList.remove('hidden');
  };
  
  const handleRemoveFromItinerary = () => {
    removePlaceFromTrip(place.id);
    toast.success("Removed from itinerary");
  };

  const renderRatingStars = (rating: number = 4) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill={i < rating ? "currentColor" : "none"} 
            className={i < rating ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div 
        className="travel-card flex mb-3 cursor-pointer"
        draggable={isDraggable}
        onClick={() => setShowDetails(true)}
      >
        <img 
          src={getPlaceImage()} 
          alt={place.name} 
          className="h-16 w-16 object-cover rounded-xl mr-3"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
            console.log('Place image failed to load:', place.image);
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-medium">{place.name}</h3>
            {place.distance && <span className="text-sm text-gray-500">{place.distance}</span>}
          </div>
          <p className="text-sm text-gray-500">{place.category}</p>
          {place.location && (
            <p className="text-xs text-gray-400">{place.location}</p>
          )}
          {renderRatingStars(place.rating || 4)}
        </div>
        
        <div className="flex flex-col justify-center gap-2 ml-2">
          {isDraggable && (
            <div className="flex items-center px-2 cursor-move">☰</div>
          )}
          
          {showAddButton && (
            <button 
              className="bg-travel-primary text-white rounded-lg p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToItinerary();
              }}
              aria-label="Add to itinerary"
            >
              <Plus size={16} />
            </button>
          )}
          
          {showRemoveButton && (
            <button 
              className="bg-red-500 text-white rounded-lg p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromItinerary();
              }}
              aria-label="Remove from itinerary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{place.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <img 
              src={getPlaceImage()} 
              alt={place.name} 
              className="w-full h-48 object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
              }}
            />
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} />
              <span>{place.category}</span>
              {place.distance && <span>• {place.distance}</span>}
              {place.location && <span>• {place.location}</span>}
            </div>
            
            <div className="flex items-center">
              {renderRatingStars(place.rating || 4)}
              <span className="ml-2 text-sm text-gray-500">{place.rating || 4}/5</span>
            </div>
            
            {place.description ? (
              <DialogDescription>{place.description}</DialogDescription>
            ) : (
              <DialogDescription>
                Visit this amazing {place.category.toLowerCase()} during your trip.
                {place.open && place.close ? ` Open from ${place.open}:00 to ${place.close}:00.` : ''}
              </DialogDescription>
            )}
            
            <div className="flex justify-between">
              {showAddButton && (
                <button 
                  className="bg-travel-primary text-white rounded-lg px-3 py-1 text-sm flex items-center gap-1"
                  onClick={handleAddToItinerary}
                >
                  <Plus size={14} />
                  Add to Itinerary
                </button>
              )}
            </div>
            
            {/* Reviews Section */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Reviews</h3>
              
              {placeReviews.length > 0 ? (
                <div className="space-y-3">
                  {placeReviews.map(review => (
                    <div key={review.id} className="border-t pt-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{review.title}</h4>
                          <p className="text-sm mt-1">{review.text}</p>
                        </div>
                      </div>
                      {review.date && (
                        <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaceCard;
