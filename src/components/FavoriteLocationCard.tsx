
import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';

interface FavoriteLocationCardProps {
  location: string;
  count: number;
}

const FavoriteLocationCard: React.FC<FavoriteLocationCardProps> = ({ location, count }) => {
  const { setCurrentScreen, setSelectedLocation } = useApp();
  
  const getLocationImage = () => {
    // Use different images based on location
    const images: { [key: string]: string } = {
      'Cancun, Mexico': 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542',
      'Barcelona, Spain': 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
      'Paris, France': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
      'Tokyo, Japan': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
    };
    
    return images[location] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
  };
  
  const handleClick = () => {
    setSelectedLocation(location);
    setCurrentScreen(ScreenType.DESTINATION);  // Change to DESTINATION instead of FAVORITES
  };
  
  return (
    <div 
      className="relative rounded-xl overflow-hidden bg-white shadow cursor-pointer h-32"
      onClick={handleClick}
    >
      <img 
        src={getLocationImage()}
        alt={location}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
        <div className="absolute bottom-0 left-0 p-3 text-white">
          <h3 className="font-medium text-sm">{location.split(',')[0]}</h3>
          <p className="text-xs text-gray-200">{count} favorites</p>
        </div>
      </div>
    </div>
  );
};

export default FavoriteLocationCard;
