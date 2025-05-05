
import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';

// This is a placeholder screen that redirects to the home screen
// since the Favorites feature has been removed
const FavoritesScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  
  useEffect(() => {
    // Redirect to home screen
    setCurrentScreen(ScreenType.HOME);
  }, [setCurrentScreen]);

  return null; // This component doesn't render anything
};

export default FavoritesScreen;
