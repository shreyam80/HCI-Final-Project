
import React, { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import PlaceCard from '../components/PlaceCard';
import ReviewCard from '../components/ReviewCard';
import { Search } from 'lucide-react';
import { toast } from '../components/ui/sonner';

const HomeScreen: React.FC = () => {
  const { setCurrentScreen, places, reviews, setSelectedLocation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  const trendingPlaces = places.slice(0, 2); // Just take the first two places
  const featuredReview = reviews[0]; // Just take the first review

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    // Check if search query contains a valid location
    const validLocations = [
      'cancun', 'barcelona', 'paris', 'tokyo', 
      'cancun, mexico', 'barcelona, spain', 'paris, france', 'tokyo, japan'
    ];
    
    const normalizedQuery = searchQuery.toLowerCase();
    
    if (validLocations.some(loc => normalizedQuery.includes(loc))) {
      // Set the location based on search
      if (normalizedQuery.includes('cancun')) {
        setSelectedLocation('Cancun, Mexico');
      } else if (normalizedQuery.includes('barcelona')) {
        setSelectedLocation('Barcelona, Spain');
      } else if (normalizedQuery.includes('paris')) {
        setSelectedLocation('Paris, France');
      } else if (normalizedQuery.includes('tokyo')) {
        setSelectedLocation('Tokyo, Japan');
      }
      
      setCurrentScreen(ScreenType.DESTINATION);
    } else {
      // Invalid location
      toast.error('Location not found. Try Cancun, Barcelona, Paris, or Tokyo.');
    }
  };

  return (
    <PhoneFrame title="Travel Express">
      <div className="px-4 py-5">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="travel-input flex items-center justify-center bg-gray-100 mb-2">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search location..."
              className="ml-2 bg-transparent border-0 flex-1 focus:outline-none text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        {/* Popular Destinations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular Destinations</h2>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {[
              { name: 'Cancun', image: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542' },
              { name: 'Barcelona', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded' },
              { name: 'Paris', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f' },
              { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26' }
            ].map(destination => (
              <div 
                key={destination.name}
                className="relative rounded-xl overflow-hidden flex-shrink-0 w-32 h-24 cursor-pointer"
                onClick={() => {
                  setSelectedLocation(`${destination.name}${destination.name === 'Cancun' ? ', Mexico' : destination.name === 'Barcelona' ? ', Spain' : destination.name === 'Paris' ? ', France' : ', Japan'}`);
                  setCurrentScreen(ScreenType.DESTINATION);
                }}
              >
                <img 
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 p-2 text-white">
                    <h3 className="font-medium text-sm">{destination.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Trending</h2>
          <div className="space-y-3">
            {trendingPlaces.map(place => (
              <PlaceCard 
                key={place.id} 
                place={{
                  ...place,
                  distance: place.id === "c1" ? "1.2 mi" : "0.5 mi",
                  location: "Cancun"
                }}
                showAddButton 
              />
            ))}
          </div>
        </div>

        {/* Featured Review */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Featured Review</h2>
          {featuredReview ? (
            <ReviewCard 
              review={featuredReview} 
              showDeleteButton={false}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">No reviews yet</p>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
};

export default HomeScreen;
