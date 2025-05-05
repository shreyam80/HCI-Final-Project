
import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import { Home, Search, Clipboard, MessageSquare, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();
  
  const isActive = (screen: ScreenType) => currentScreen === screen;
  
  const navItems = [
    { icon: <Home size={20} />, label: 'Home', screen: ScreenType.HOME },
    { icon: <Search size={20} />, label: 'Discover', screen: ScreenType.DISCOVER_ITINERARIES },
    { icon: <Clipboard size={20} />, label: 'Itineraries', screen: ScreenType.ITINERARIES_OVERVIEW },
    { icon: <MessageSquare size={20} />, label: 'Reviews', screen: ScreenType.REVIEWS },
    { icon: <User size={20} />, label: 'Profile', screen: ScreenType.PROFILE },
  ];

  return (
    <div className="bottom-tab-bar">
      {navItems.map((item) => (
        <div 
          key={item.label} 
          className={`tab-item ${isActive(item.screen) ? 'active' : ''}`}
          onClick={() => setCurrentScreen(item.screen)}
        >
          {item.icon}
          <span className="mt-1 text-[10px]">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;
