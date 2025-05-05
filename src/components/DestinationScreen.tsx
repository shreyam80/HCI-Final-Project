
import React from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import PlaceCard from '../components/PlaceCard';

const DestinationScreen: React.FC = () => {
  const { setCurrentScreen, places, destinationTab, setDestinationTab, selectedLocation } = useApp();
  
  const tabs = ["All", "Restaurants", "Shops", "Excursions"];
  
  const getFilteredPlaces = () => {
    // Start with all places
    let filteredPlaces = [...places];
    
    // Filter by tab
    switch (destinationTab) {
      case 0: // All
        return filteredPlaces;
      case 1: // Restaurants
        return filteredPlaces.filter(p => p.category === "Restaurants");
      case 2: // Shops
        return filteredPlaces.filter(p => p.category === "Shops");
      case 3: // Excursions
        return filteredPlaces.filter(p => p.category === "Excursions");
      default:
        return filteredPlaces;
    }
  };
  
  const filteredPlaces = getFilteredPlaces();
  const locationName = selectedLocation.split(',')[0];

  return (
    <PhoneFrame 
      title={locationName} 
      showBackButton 
      onBack={() => setCurrentScreen(ScreenType.HOME)}
    >
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab, index) => (
            <div 
              key={tab} 
              className={`flex-1 text-center py-3 px-2 whitespace-nowrap ${destinationTab === index ? 'border-b-2 border-travel-primary text-travel-primary' : 'text-gray-500'}`}
              onClick={() => setDestinationTab(index)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      
      {/* Places List */}
      <div className="px-4 py-5">
        {filteredPlaces.length > 0 ? (
          <div className="space-y-3">
            {filteredPlaces.map(place => (
              <PlaceCard 
                key={place.id} 
                place={{
                  ...place,
                  distance: place.id === "c1" ? "1.2 mi" : "0.5 mi",
                  location: locationName
                }}
                showAddButton 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No places found.</p>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
};

export default DestinationScreen;
