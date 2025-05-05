
import React, { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import ReviewCard from '../components/ReviewCard';
import { toast } from '../components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from 'lucide-react';

const ReviewsScreen: React.FC = () => {
  const { reviews, addReview, deleteReview, places } = useApp();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim() || !text.trim()) {
      toast.error('Please enter both title and text');
      return;
    }

    // Open place search dialog
    setShowPlaceSearch(true);
  };

  const handlePlaceSelect = (placeId: string) => {
    const place = places.find(p => p.id === placeId);
    
    if (place) {
      addReview(
        title, 
        text, 
        placeId, 
        place.name, 
        place.image
      );
      
      // Reset form and close dialog
      setTitle('');
      setText('');
      setSelectedPlace(null);
      setShowPlaceSearch(false);
      toast.success('Review added!');
    }
  };

  const handleDelete = (index: number) => {
    deleteReview(index);
    toast.success('Review deleted');
  };

  const filteredPlaces = searchQuery.trim() === '' 
    ? places 
    : places.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <PhoneFrame title="Reviews">
      <div className="px-4 py-5">
        {/* Add Review Form */}
        <div className="travel-card mb-6">
          <h3 className="font-medium mb-3">Add a Review</h3>
          <input 
            type="text"
            placeholder="Title"
            className="travel-input mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your review..."
            className="travel-input resize-none min-h-[100px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button 
            className="travel-btn w-full mt-3"
            onClick={handleSubmit}
          >
            Submit Review
          </button>
        </div>

        {/* Reviews List */}
        <h3 className="font-medium text-lg mb-4">Your Reviews</h3>
        {reviews.length > 0 ? (
          <div>
            {reviews.map((review, index) => (
              <ReviewCard 
                key={index} 
                review={review} 
                onDelete={() => handleDelete(index)} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">No reviews yet</p>
        )}
      </div>

      {/* Place Search Dialog */}
      <Dialog open={showPlaceSearch} onOpenChange={setShowPlaceSearch}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select a place for your review</DialogTitle>
          </DialogHeader>
          
          <div className="relative mb-4">
            <input 
              type="text"
              placeholder="Search places..."
              className="travel-input pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map(place => (
                <div 
                  key={place.id}
                  className="flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                  onClick={() => handlePlaceSelect(place.id)}
                >
                  <img 
                    src={getPlaceImage(place.image)} 
                    alt={place.name} 
                    className="h-12 w-12 object-cover rounded-md mr-3" 
                  />
                  <div>
                    <h4 className="font-medium">{place.name}</h4>
                    <p className="text-xs text-gray-500">{place.category}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No places found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PhoneFrame>
  );
};

// Helper function to get place images
const getPlaceImage = (imageName: string) => {
  // Use default images for demo purposes
  const images: { [key: string]: string } = {
    'tacos.png': 'https://images.unsplash.com/photo-1551504734-5ee1c4a3479b',
    'mayan_ruins.png': 'https://images.unsplash.com/photo-1518638150340-f706e86654de',
    'handicraft.png': 'https://images.unsplash.com/photo-1528283648649-33347faa5d9e',
    'seafood.png': 'https://images.unsplash.com/photo-1579631542720-3a87824837de',
    'cruise.png': 'https://images.unsplash.com/photo-1548574505-5e239809ee19',
    'gift_shop.png': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
  };
  
  return images[imageName] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
};

export default ReviewsScreen;
