
import React, { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const CreateItineraryScreen: React.FC = () => {
  const { setCurrentScreen, createTrip, setCurrentTripIndex } = useApp();
  
  const [name, setName] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!name.trim() || !destination.trim() || !startDate || !endDate) {
      alert('Please fill all required fields');
      return;
    }
    
    // Format dates to strings
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    
    // Create new trip and get its index
    const newTripIndex = createTrip(
      name,
      destination,
      formattedStartDate,
      formattedEndDate,
      imagePreview || undefined
    );
    
    // Set the current trip index to the newly created trip
    setCurrentTripIndex(newTripIndex);
    
    // Navigate to edit screen
    setCurrentScreen(ScreenType.EDIT_ITINERARY);
  };

  return (
    <PhoneFrame 
      title="Create Itinerary" 
      showBackButton 
      onBack={() => setCurrentScreen(ScreenType.ITINERARIES_OVERVIEW)}
    >
      <div className="px-4 py-5">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input 
              type="text"
              className="travel-input"
              placeholder="Summer Vacation"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Destination</label>
            <input 
              type="text"
              className="travel-input"
              placeholder="Paris, France"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="travel-input flex items-center justify-between w-full"
                >
                  {startDate ? format(startDate, 'PPP') : <span className="text-gray-400">Select date</span>}
                  <CalendarIcon className="h-4 w-4 opacity-70" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="travel-input flex items-center justify-between w-full"
                >
                  {endDate ? format(endDate, 'PPP') : <span className="text-gray-400">Select date</span>}
                  <CalendarIcon className="h-4 w-4 opacity-70" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Cover Image (optional)</label>
            <div className="space-y-2">
              {imagePreview && (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              <input 
                type="file"
                id="tripImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <label 
                htmlFor="tripImage" 
                className="travel-btn block text-center cursor-pointer"
              >
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </label>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-6">
            <button 
              className="flex-1 py-3 border border-gray-300 rounded-full text-gray-700"
              onClick={() => setCurrentScreen(ScreenType.ITINERARIES_OVERVIEW)}
            >
              Cancel
            </button>
            <button 
              className="flex-1 py-3 bg-travel-primary text-white rounded-full"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};

export default CreateItineraryScreen;
