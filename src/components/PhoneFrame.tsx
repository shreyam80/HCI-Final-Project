
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import BottomNavigation from './BottomNavigation';
import { ChevronLeft, Wifi } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showNav?: boolean;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  title,
  showBackButton = false,
  onBack,
  showNav = true,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  
  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };
    
    updateTime(); // Initial update
    
    const intervalId = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="flex justify-center items-center h-full pt-4 pb-0 px-4">
      <div className="relative w-full max-w-sm h-[85vh] overflow-hidden bg-gray-50 rounded-[40px] shadow-lg border-8 border-black">
        {/* Status Bar */}
        <div className="bg-black text-white px-6 pt-2 pb-1 flex justify-between items-center">
          <div className="text-sm font-medium">{currentTime}</div>
          
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[30%] h-8 bg-black rounded-b-3xl flex justify-center items-end pb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
          </div>
          
          {/* Right Icons */}
          <div className="flex items-center space-x-1">
            <div className="flex items-end space-x-[2px]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-2 w-[3px] bg-white rounded-sm" style={{ height: `${i * 2}px` }}></div>
              ))}
            </div>
            <Wifi size={14} className="text-white mx-1" />
            <div className="text-xs">100%</div>
          </div>
        </div>

        {/* Header with Title */}
        {(title || showBackButton) && (
          <div className="py-3 px-4 flex items-center justify-center sticky top-0 bg-white border-b border-gray-100 z-10">
            {showBackButton && (
              <button 
                className="absolute left-4 p-1 rounded-full hover:bg-gray-100" 
                onClick={onBack}
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {title && <h1 className="font-semibold text-center">{title}</h1>}
          </div>
        )}

        {/* Content */}
        <div className="overflow-auto h-[calc(100%-110px)]">
          {children}
        </div>

        {/* Bottom Navigation */}
        {showNav && (
          <BottomNavigation />
        )}
        
        {/* Home Bar */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="w-1/3 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;
