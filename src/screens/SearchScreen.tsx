
import React, { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const SearchScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.toLowerCase().trim() === 'cancun') {
      setCurrentScreen(ScreenType.DESTINATION);
    } else if (searchQuery.trim()) {
      toast.error(`No results for "${searchQuery}". Try searching for "Cancun"!`);
    } else {
      toast.error('Please enter a location to search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <PhoneFrame 
      title="Search location..." 
      showBackButton 
      onBack={() => setCurrentScreen(ScreenType.HOME)}
    >
      <div className="px-4 py-5">
        <div className="relative mb-6">
          <input 
            type="text" 
            className="travel-input pl-10"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
        </div>

        {/* Recent Searches (Placeholder) */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">RECENT SEARCHES</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <Search size={18} className="text-gray-500" />
              </div>
              <span>Paris, France</span>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <Search size={18} className="text-gray-500" />
              </div>
              <span>Tokyo, Japan</span>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">POPULAR DESTINATIONS</h3>
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="bg-cover bg-center rounded-xl h-32 flex items-end p-3 cursor-pointer"
              style={{backgroundImage: 'url(https://images.unsplash.com/photo-1512813195386-6cf811ad3542)'}}
              onClick={() => {
                setSearchQuery('Cancun');
                handleSearch();
              }}
            >
              <span className="text-white font-medium drop-shadow-lg">Cancun</span>
            </div>
            <div 
              className="bg-cover bg-center rounded-xl h-32 flex items-end p-3"
              style={{backgroundImage: 'url(https://images.unsplash.com/photo-1542640244-7e672d6cef4e)'}}
            >
              <span className="text-white font-medium drop-shadow-lg">Hawaii</span>
            </div>
            <div 
              className="bg-cover bg-center rounded-xl h-32 flex items-end p-3"
              style={{backgroundImage: 'url(https://images.unsplash.com/photo-1523906834658-6e24ef2386f9)'}}
            >
              <span className="text-white font-medium drop-shadow-lg">Venice</span>
            </div>
            <div 
              className="bg-cover bg-center rounded-xl h-32 flex items-end p-3"
              style={{backgroundImage: 'url(https://images.unsplash.com/photo-1533929736458-ca588d08c8be)'}}
            >
              <span className="text-white font-medium drop-shadow-lg">Bali</span>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};

export default SearchScreen;
