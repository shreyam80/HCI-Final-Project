
import React, { useState, useEffect } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType, Trip } from '../types';
import { Search } from 'lucide-react';
import { toast } from '../components/ui/sonner';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PublicTripCard: React.FC<{ trip: Trip, onClick: () => void }> = ({ trip, onClick }) => {
  const getImage = () => {
    if (trip.image && (trip.image.startsWith('http://') || trip.image.startsWith('https://'))) {
      return trip.image;
    }
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
  };

  return (
    <div className="relative rounded-lg overflow-hidden mb-4 cursor-pointer" onClick={onClick}>
      <img 
        src={getImage()}
        alt={trip.name}
        className="w-full h-52 object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
          console.log('Trip image failed to load:', trip.image);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-white font-semibold text-xl">{trip.name}</h3>
          <p className="text-gray-200 text-sm">{trip.destination}</p>
          <p className="text-gray-200 mt-1 text-xs">by {trip.author || "Anonymous"}</p>
        </div>
      </div>
    </div>
  );
};

const FeaturedTripCard: React.FC<{ trip: Trip, onClick: () => void }> = ({ trip, onClick }) => {
  const getImage = () => {
    if (trip.image && (trip.image.startsWith('http://') || trip.image.startsWith('https://'))) {
      return trip.image;
    }
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
  };

  return (
    <div className="relative rounded-lg overflow-hidden cursor-pointer w-full h-40 flex-shrink-0" onClick={onClick}>
      <img 
        src={getImage()}
        alt={trip.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
        <div className="absolute bottom-0 left-0 p-3 w-full">
          <h3 className="text-white font-semibold">{trip.name}</h3>
          <p className="text-gray-200 text-xs">{trip.destination}</p>
        </div>
      </div>
    </div>
  );
};

const DiscoverItinerariesScreen: React.FC = () => {
  const { 
    filteredPublicItineraries, 
    filterPublicItineraries,
    setPreviewTrip,
    setCurrentScreen,
    trips
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayedTrips, setDisplayedTrips] = useState<Trip[]>([]);
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);

  // Filter out duplicates and prepare trips for display
  useEffect(() => {
    const tripsMap = new Map<string, Trip>();
    
    // Add all filtered public itineraries first
    filteredPublicItineraries.forEach(trip => {
      tripsMap.set(trip.id, trip);
    });
    
    // Process our trips, but don't add duplicates
    setDisplayedTrips(Array.from(tripsMap.values()));
    
    // Set featured trips (just take first 5)
    setFeaturedTrips(Array.from(tripsMap.values()).slice(0, 5));
  }, [filteredPublicItineraries, trips]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterPublicItineraries(query);
  };

  const handleTripPreview = (trip: Trip) => {
    setPreviewTrip(trip);
    setCurrentScreen(ScreenType.PREVIEW_ITINERARY);
  };

  return (
    <PhoneFrame title="Discover Itineraries">
      <div className="px-4 py-5 space-y-6">
        {/* Search */}
        <div className="relative mb-2">
          <input 
            type="text" 
            className="travel-input pl-10"
            placeholder="Search public itineraries..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
        </div>

        {/* Featured Itineraries */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Featured Itineraries</h2>
          <Carousel className="w-full max-w-md mx-auto">
            <CarouselContent className="-ml-4">
              {featuredTrips.map((trip) => (
                <CarouselItem key={trip.id} className="pl-4 basis-3/4 md:basis-3/4">
                  <FeaturedTripCard 
                    trip={trip} 
                    onClick={() => handleTripPreview(trip)} 
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* Public Itineraries */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Public Itineraries</h2>
          <div className="space-y-4">
            {displayedTrips.length > 0 ? (
              displayedTrips.map((trip) => (
                <PublicTripCard 
                  key={trip.id} 
                  trip={trip} 
                  onClick={() => handleTripPreview(trip)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No itineraries found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};

export default DiscoverItinerariesScreen;
