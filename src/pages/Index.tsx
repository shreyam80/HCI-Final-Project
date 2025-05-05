
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import DiscoverItinerariesScreen from '../screens/DiscoverItinerariesScreen';
import PreviewItineraryScreen from '../screens/PreviewItineraryScreen';
import SearchScreen from '../screens/SearchScreen';
import DestinationScreen from '../screens/DestinationScreen';
import BrowseItinerariesScreen from '../screens/BrowseItinerariesScreen';
import ItinerariesOverviewScreen from '../screens/ItinerariesOverviewScreen';
import CreateItineraryScreen from '../screens/CreateItineraryScreen';
import EditItineraryScreen from '../screens/EditItineraryScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Components
import AddToItineraryModal from '../components/AddToItineraryModal';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenType.LOGIN:
        return <LoginScreen />;
      case ScreenType.SIGNUP:
        return <SignupScreen />;
      case ScreenType.HOME:
        return <HomeScreen />;
      case ScreenType.DISCOVER_ITINERARIES:
        return <DiscoverItinerariesScreen />;
      case ScreenType.PREVIEW_ITINERARY:
        return <PreviewItineraryScreen />;
      case ScreenType.SEARCH:
        return <SearchScreen />;
      case ScreenType.DESTINATION:
        return <DestinationScreen />;
      case ScreenType.BROWSE_ITINERARIES:
        return <BrowseItinerariesScreen />;
      case ScreenType.ITINERARIES_OVERVIEW:
        return <ItinerariesOverviewScreen />;
      case ScreenType.CREATE_ITINERARY:
        return <CreateItineraryScreen />;
      case ScreenType.EDIT_ITINERARY:
        return <EditItineraryScreen />;
      case ScreenType.REVIEWS:
        return <ReviewsScreen />;
      case ScreenType.PROFILE:
        return <ProfileScreen />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <>
      {renderScreen()}
      <AddToItineraryModal />
    </>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default Index;
