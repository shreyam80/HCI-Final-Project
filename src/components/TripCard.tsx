
import React from 'react';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const getImage = () => {
    if (trip.image) {
      if (trip.image.startsWith('http://') || trip.image.startsWith('https://')) {
        return trip.image;
      } else if (trip.image.startsWith('data:')) {
        return trip.image;
      }
    }
    
    // Default image
    return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
  };
  
  return (
    <div className="travel-card mb-4 cursor-pointer" onClick={onClick}>
      <img 
        src={getImage()} 
        alt={trip.name} 
        className="w-full h-40 object-cover rounded-xl mb-2" 
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
          console.log('Image failed to load:', trip.image);
        }}
      />
      <h3 className="font-semibold text-lg">{trip.name}</h3>
      <p className="text-sm text-gray-600">{trip.destination}</p>
      <p className="text-xs text-gray-500 mt-1">{trip.startDate} - {trip.endDate}</p>
    </div>
  );
};

export default TripCard;
