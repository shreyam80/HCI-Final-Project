
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

const AddToItineraryModal: React.FC = () => {
  const { trips, selectedPlace, setSelectedPlace, addPlaceToTrip } = useApp();
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);

  const handleClose = () => {
    document.getElementById('itinerarySelectModal')?.classList.add('hidden');
    setSelectedPlace(null);
  };

  const handleAddToItinerary = () => {
    if (!selectedPlace) return;
    
    addPlaceToTrip(selectedPlace, selectedTripIndex);
    toast.success(`Added "${selectedPlace.name}" to "${trips[selectedTripIndex]?.name}"`);
    handleClose();
  };

  return (
    <div 
      id="itinerarySelectModal" 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4 hidden"
    >
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Add to Itinerary</h3>
        </div>
        
        <div className="p-4">
          <p className="mb-2">Choose an itinerary:</p>
          <select 
            className="travel-input" 
            value={selectedTripIndex} 
            onChange={e => setSelectedTripIndex(parseInt(e.target.value))}
          >
            {trips.map((trip, index) => (
              <option key={trip.id} value={index}>{trip.name}</option>
            ))}
          </select>
          
          {trips.length === 0 && (
            <p className="text-center text-gray-500 py-3">No itineraries available</p>
          )}
        </div>
        
        <div className="p-4 border-t flex space-x-3">
          <button 
            className="flex-1 py-2 border border-gray-300 rounded-full text-gray-700"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button 
            className="flex-1 py-2 bg-travel-primary text-white rounded-full disabled:bg-gray-300"
            disabled={trips.length === 0}
            onClick={handleAddToItinerary}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToItineraryModal;
