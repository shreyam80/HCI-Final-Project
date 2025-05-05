
import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';

const AddTripCard: React.FC = () => {
  const { setCurrentScreen } = useApp();
  
  return (
    <div 
      className="travel-card mb-4 flex items-center justify-center h-40 border-2 border-dashed border-travel-light cursor-pointer"
      onClick={() => setCurrentScreen(ScreenType.CREATE_ITINERARY)}
    >
      <div className="text-center">
        <div className="text-4xl text-travel-primary font-light mb-2">+</div>
        <p className="text-gray-600">Add New Trip</p>
      </div>
    </div>
  );
};

export default AddTripCard;
