
import React, { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import TripCard from '../components/TripCard';
import { Search } from 'lucide-react';

const BrowseItinerariesScreen: React.FC = () => {
  const { filteredTrips, setCurrentTripIndex, setCurrentScreen, filterTrips } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterTrips(query);
  };

  const handleTripClick = (index: number) => {
    setCurrentTripIndex(index);
    setCurrentScreen(ScreenType.EDIT_ITINERARY);
  };

  return (
    <PhoneFrame title="Browse Itineraries">
      <div className="px-4 py-5">
        {/* Search */}
        <div className="relative mb-6">
          <input 
            type="text" 
            className="travel-input pl-10"
            placeholder="Search itineraries..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
        </div>

        {/* Itineraries List */}
        {filteredTrips.length > 0 ? (
          <div>
            {filteredTrips.map((trip, index) => (
              <TripCard 
                key={trip.id} 
                trip={trip}
                onClick={() => handleTripClick(index)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No itineraries found</p>
            <button 
              className="travel-btn"
              onClick={() => setCurrentScreen(ScreenType.CREATE_ITINERARY)}
            >
              Create New Itinerary
            </button>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
};

export default BrowseItinerariesScreen;
