import React, { createContext, useContext, useState, useEffect } from 'react';
import { Place, Review, Trip, Friend, ScreenType } from '../types';
import { useAuth } from './AuthContext';
import { toast } from '../components/ui/sonner';

const DEFAULT_ITINERARY_IMG = '/logo.png';

// Sample data
const samplePlacesAll = [
  { id: "c1", name: "Beachside Tacos", category: "Restaurants", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a3479b", open: 16, close: 20, rating: 4.5, distance: "1.2 mi" },
  { id: "c2", name: "Mayan Ruins Tour", category: "Excursions", image: "mayan_ruins.png", open: 8, close: 19, rating: 4.8, distance: "5.7 mi" },
  { id: "c3", name: "Local Handicraft Shop", category: "Shops", image: "handicraft.png", rating: 4.2, distance: "0.8 mi" },
  { id: "c4", name: "Cancun Seafood Fest", category: "Restaurants", image: "https://images.unsplash.com/photo-1579631542720-3a87824837de", open: 16, close: 20, rating: 4.7, distance: "2.4 mi" },
  { id: "c5", name: "Romantic Sunset Cruise", category: "Excursions", image: "cruise.png", open: 18, close: 22, rating: 4.9, distance: "3.5 mi" },
  { id: "c6", name: "Resort Gift Shop", category: "Shops", image: "gift_shop.png", rating: 3.8, distance: "0.3 mi" },
];

// Sample public itineraries
const samplePublicItineraries = [
  {
    id: "p1",
    name: "Weekend in Cancun",
    destination: "Cancun, Mexico",
    startDate: "2025-05-10",
    endDate: "2025-05-12",
    image: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542",
    items: [
      { id: "c1", name: "Beachside Tacos", category: "Restaurants", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a3479b", open: 16, close: 20, day: "Sat", time: "18:00", rating: 4.5, distance: "1.2 mi" },
      { id: "c2", name: "Mayan Ruins Tour", category: "Excursions", image: "mayan_ruins.png", open: 8, close: 19, day: "Sun", time: "10:00", duration: 3, rating: 4.8, distance: "5.7 mi" }
    ],
    isPublic: true,
    author: "TravelExplorer"
  },
  {
    id: "p2",
    name: "Family Trip to Cancun",
    destination: "Cancun, Mexico",
    startDate: "2025-06-15",
    endDate: "2025-06-22",
    image: "https://images.unsplash.com/photo-1535732820275-9ffd998cac22",
    items: [
      { id: "c1", name: "Beachside Tacos", category: "Restaurants", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a3479b", open: 16, close: 20, day: "Mon", time: "18:00", distance: "1.2 mi" },
      { id: "c5", name: "Romantic Sunset Cruise", category: "Excursions", image: "cruise.png", open: 18, close: 22, day: "Wed", time: "19:00", duration: 2, distance: "3.5 mi" }
    ],
    isPublic: true,
    author: "FamilyTravels"
  },
  {
    id: "p3",
    name: "Foodie Tour of Cancun",
    destination: "Cancun, Mexico",
    startDate: "2025-07-05",
    endDate: "2025-07-09",
    image: "https://images.unsplash.com/photo-1579631542720-3a87824837de",
    items: [
      { id: "c1", name: "Beachside Tacos", category: "Restaurants", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a3479b", open: 16, close: 20, day: "Mon", time: "17:00", distance: "1.2 mi" },
      { id: "c4", name: "Cancun Seafood Fest", category: "Restaurants", image: "https://images.unsplash.com/photo-1579631542720-3a87824837de", open: 16, close: 20, day: "Tue", time: "18:00", duration: 2, distance: "2.4 mi" }
    ],
    isPublic: true,
    author: "FoodLover"
  }
];

const initialReviews = [
  { 
    id: "r1", 
    title: "Art Gallery",
    text: "Amazing collection and inspiring exhibitions!",
    placeId: "c3",
    placeName: "Local Handicraft Shop",
    placeImage: "handicraft.png",
    likes: 8,
    date: "2025-04-28"
  },
  { 
    id: "r2", 
    title: "Gourmet Bistro",
    text: "Delicious food and impeccable service.",
    placeId: "c4",
    placeName: "Cancun Seafood Fest",
    placeImage: "seafood.png",
    likes: 12,
    date: "2025-04-30"
  }
];

const allFriends = [
  { id: 1, name: "Alice Johnson", image: "https://i.pravatar.cc/36?u=1" },
  { id: 2, name: "Bob Smith", image: "https://i.pravatar.cc/36?u=2" },
  { id: 3, name: "Charlie Lee", image: "https://i.pravatar.cc/36?u=3" },
  { id: 4, name: "Diana Chen", image: "https://i.pravatar.cc/36?u=4" },
];

interface AppContextType {
  currentScreen: ScreenType;
  setCurrentScreen: React.Dispatch<React.SetStateAction<ScreenType>>;
  places: Place[];
  reviews: Review[];
  addReview: (title: string, text: string, placeId?: string, placeName?: string, placeImage?: string) => void;
  deleteReview: (index: number) => void;
  likeReview: (reviewId: string) => void;
  unlikeReview: (reviewId: string) => void;
  isReviewLiked: (reviewId: string) => boolean;
  trips: Trip[];
  filteredTrips: Trip[];
  setFilteredTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  publicItineraries: Trip[];
  filteredPublicItineraries: Trip[];
  featuredItineraries: Trip[];
  currentTripIndex: number;
  setCurrentTripIndex: React.Dispatch<React.SetStateAction<number>>;
  previewTrip: Trip | null;
  setPreviewTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
  importTrip: (trip: Trip, targetTripIndex?: number) => void;
  createTrip: (name: string, destination: string, startDate: string, endDate: string, image?: string) => number;
  deleteTrip: (tripIndex: number) => void;
  addPlaceToTrip: (place: Place, tripIndex: number) => void;
  removePlaceFromTrip: (placeId: string) => void;
  updatePlaceInTrip: (place: Place) => void;
  destinationTab: number;
  setDestinationTab: React.Dispatch<React.SetStateAction<number>>;
  friends: Friend[];
  invitedFriends: Friend[];
  inviteFriends: (friendIds: number[]) => void;
  selectedPlace: Place | null;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
  selectedLocation: string;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
  filterTrips: (query: string) => void;
  filterPublicItineraries: (query: string) => void;
  toggleTripPublic: (tripIndex: number) => void;
  optimizeItinerary: (tripIndex: number, day: string) => void;
  findAlternativePlaces: (place: Place) => Place[];
  userProfile: { 
    picture: string | null;
    notificationsEnabled: boolean;
  };
  updateUserProfile: (updates: Partial<{ picture: string | null; notificationsEnabled: boolean }>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(ScreenType.LOGIN);
  const [places] = useState<Place[]>(samplePlacesAll);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [publicItineraries, setPublicItineraries] = useState<Trip[]>(samplePublicItineraries);
  const [filteredPublicItineraries, setFilteredPublicItineraries] = useState<Trip[]>(samplePublicItineraries);
  const [featuredItineraries, setFeaturedItineraries] = useState<Trip[]>(samplePublicItineraries.slice(0, 3));
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [previewTrip, setPreviewTrip] = useState<Trip | null>(null);
  const [destinationTab, setDestinationTab] = useState(0);
  const [friends] = useState<Friend[]>(allFriends);
  const [invitedFriends, setInvitedFriends] = useState<Friend[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  
  // Track liked reviews
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  
  // New state for selected location (for favorites view)
  const [selectedLocation, setSelectedLocation] = useState<string>("Cancun, Mexico");
  
  // User profile state for picture and notifications
  const [userProfile, setUserProfile] = useState({
    picture: null as string | null,
    notificationsEnabled: false
  });

  // Load trips and favorites from localStorage
  useEffect(() => {
    const storedTrips = localStorage.getItem('trips');
    if (storedTrips) {
      const parsedTrips = JSON.parse(storedTrips);
      // Ensure all trips have isPublic property set
      const updatedTrips = parsedTrips.map((trip: Trip) => ({
        ...trip,
        isPublic: trip.isPublic !== undefined ? trip.isPublic : false
      }));
      setTrips(updatedTrips);
      setFilteredTrips(updatedTrips);
    }
    
    const storedLikedReviews = localStorage.getItem('likedReviews');
    if (storedLikedReviews) {
      setLikedReviews(JSON.parse(storedLikedReviews));
    }
  }, []);

  // Save trips to localStorage when they change
  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);
  
  // Save liked reviews to localStorage
  useEffect(() => {
    localStorage.setItem('likedReviews', JSON.stringify(likedReviews));
  }, [likedReviews]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn && currentScreen !== ScreenType.LOGIN && currentScreen !== ScreenType.SIGNUP) {
      setCurrentScreen(ScreenType.LOGIN);
    }
  }, [isLoggedIn, currentScreen]);

  const addReview = (title: string, text: string, placeId?: string, placeName?: string, placeImage?: string) => {
    const newReview: Review = {
      id: `r${Date.now()}`,
      title,
      text,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    
    // Add place info if provided
    if (placeId) newReview.placeId = placeId;
    if (placeName) newReview.placeName = placeName;
    if (placeImage) newReview.placeImage = placeImage;
    
    setReviews([...reviews, newReview]);
  };

  const likeReview = (reviewId: string) => {
    if (likedReviews.includes(reviewId)) {
      return; // Already liked
    }
    
    // Add to liked reviews
    setLikedReviews([...likedReviews, reviewId]);
    
    // Increment the review's like count
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, likes: (review.likes || 0) + 1 };
      }
      return review;
    }));
  };
  
  const unlikeReview = (reviewId: string) => {
    if (!likedReviews.includes(reviewId)) {
      return; // Not liked yet
    }
    
    // Remove from liked reviews
    setLikedReviews(likedReviews.filter(id => id !== reviewId));
    
    // Decrement the review's like count
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return { ...review, likes: Math.max(0, (review.likes || 1) - 1) };
      }
      return review;
    }));
  };
  
  const isReviewLiked = (reviewId: string) => {
    return likedReviews.includes(reviewId);
  };

  const deleteReview = (index: number) => {
    const newReviews = [...reviews];
    const reviewToDelete = newReviews[index];
    
    // Also remove from liked reviews if it was liked
    if (reviewToDelete && likedReviews.includes(reviewToDelete.id)) {
      setLikedReviews(likedReviews.filter(id => id !== reviewToDelete.id));
    }
    
    newReviews.splice(index, 1);
    setReviews(newReviews);
  };

  const createTrip = (name: string, destination: string, startDate: string, endDate: string, image?: string) => {
    const newTrip: Trip = {
      id: Date.now().toString(),
      name,
      destination,
      startDate,
      endDate,
      image: image || DEFAULT_ITINERARY_IMG,
      items: [],
      isPublic: false // Default to private
    };
    setTrips([...trips, newTrip]);
    return trips.length; // Return the index of the new trip
  };
  
  const deleteTrip = (tripIndex: number) => {
    const updatedTrips = [...trips];
    updatedTrips.splice(tripIndex, 1);
    setTrips(updatedTrips);
    
    // If deleted the current trip, reset current trip index
    if (currentTripIndex === tripIndex) {
      setCurrentTripIndex(0);
    } else if (currentTripIndex > tripIndex) {
      setCurrentTripIndex(currentTripIndex - 1);
    }
  };

  const addPlaceToTrip = (place: Place, tripIndex: number) => {
    const updatedTrips = [...trips];
    updatedTrips[tripIndex].items.push({ ...place });
    setTrips(updatedTrips);
  };

  const removePlaceFromTrip = (placeId: string) => {
    const updatedTrips = [...trips];
    updatedTrips[currentTripIndex].items = updatedTrips[currentTripIndex].items.filter(
      item => item.id !== placeId
    );
    setTrips(updatedTrips);
  };

  const updatePlaceInTrip = (place: Place) => {
    const updatedTrips = [...trips];
    const placeIndex = updatedTrips[currentTripIndex].items.findIndex(item => item.id === place.id);
    
    if (placeIndex !== -1) {
      updatedTrips[currentTripIndex].items[placeIndex] = place;
      setTrips(updatedTrips);
    }
  };

  const inviteFriends = (friendIds: number[]) => {
    const newInvites = friends
      .filter(f => friendIds.includes(f.id))
      .filter(f => !invitedFriends.find(i => i.id === f.id))
      .map(f => ({ ...f, status: "pending" }));
    
    setInvitedFriends([...invitedFriends, ...newInvites]);
  };

  const filterTrips = (query: string) => {
    const q = query.toLowerCase();
    setFilteredTrips(
      trips.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.destination.toLowerCase().includes(q)
      )
    );
  };

  const filterPublicItineraries = (query: string) => {
    const q = query.toLowerCase();
    setFilteredPublicItineraries(
      publicItineraries.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.destination.toLowerCase().includes(q) ||
        (t.author && t.author.toLowerCase().includes(q))
      )
    );
  };

  // Toggle trip public/private status
  const toggleTripPublic = (tripIndex: number) => {
    const updatedTrips = [...trips];
    const trip = updatedTrips[tripIndex];
    
    // Toggle the isPublic status
    trip.isPublic = !trip.isPublic;
    
    // Set author if not set
    if (trip.isPublic && !trip.author) {
      trip.author = "You";
    }
    
    setTrips(updatedTrips);
    
    // Show toast notification
    toast.success(trip.isPublic ? "Trip is now public" : "Trip is now private", {
      position: "top-center",
    });
  };

  // Update user profile
  const updateUserProfile = (updates: Partial<{ picture: string | null; notificationsEnabled: boolean }>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    toast.success("Profile updated successfully", {
      position: "top-center",
    });
  };

  // Function to import a trip into user's itineraries
  const importTrip = (trip: Trip, targetTripIndex?: number) => {
    if (targetTripIndex !== undefined) {
      // Import into existing itinerary
      const updatedTrips = [...trips];
      const targetTrip = updatedTrips[targetTripIndex];
      
      // Add all items from the imported trip
      trip.items.forEach(item => {
        if (!targetTrip.items.find(i => i.id === item.id)) {
          targetTrip.items.push({ ...item });
        }
      });
      
      setTrips(updatedTrips);
      setCurrentTripIndex(targetTripIndex);
    } else {
      // Create a new itinerary with the imported items
      const newTrip: Trip = {
        id: Date.now().toString(),
        name: `Copy of ${trip.name}`,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        image: trip.image,
        items: trip.items.map(item => ({ ...item })),
        isPublic: false // Default to private for imported trips
      };
      
      setTrips([...trips, newTrip]);
      setCurrentTripIndex(trips.length);
    }
    
    // Clear preview and navigate to edit screen
    setPreviewTrip(null);
    setCurrentScreen(ScreenType.EDIT_ITINERARY);
    
    // Show success toast
    toast.success("Trip imported successfully", {
      position: "top-center",
    });
  };
  
  // New function to optimize itinerary for a specific day
  const optimizeItinerary = (tripIndex: number, day: string) => {
    const updatedTrips = [...trips];
    const trip = updatedTrips[tripIndex];
    
    // Get all places scheduled for this day
    const dayPlaces = trip.items.filter(item => item.day === day && item.time);
    
    if (dayPlaces.length <= 1) {
      toast.info("Not enough places to optimize", { position: "top-center" });
      return;
    }
    
    // Sort places by time first to get the starting point
    dayPlaces.sort((a, b) => {
      const timeA = a.time || "00:00";
      const timeB = b.time || "00:00";
      return timeA.localeCompare(timeB);
    });
    
    const firstPlace = dayPlaces[0];
    const remainingPlaces = dayPlaces.slice(1);
    
    // Sort remaining places by distance (using the string distance value, converting to number)
    const optimizedPlaces = [firstPlace];
    let currentPlace = firstPlace;
    
    while (remainingPlaces.length > 0) {
      // Find the closest place to the current place
      let closestIndex = 0;
      let closestDistance = parseFloat((remainingPlaces[0].distance || "999").replace(" mi", ""));
      
      for (let i = 1; i < remainingPlaces.length; i++) {
        const distance = parseFloat((remainingPlaces[i].distance || "999").replace(" mi", ""));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
      
      currentPlace = remainingPlaces[closestIndex];
      optimizedPlaces.push(currentPlace);
      remainingPlaces.splice(closestIndex, 1);
    }
    
    // Update time slots based on the new order
    // We'll keep the original first time and then space others by 2 hours
    const startTime = optimizedPlaces[0].time || "08:00";
    const [startHour, startMinute] = startTime.split(":").map(Number);
    
    for (let i = 0; i < optimizedPlaces.length; i++) {
      const hourOffset = i * 2; // 2 hours between each place
      let newHour = startHour + hourOffset;
      let newMinute = startMinute;
      
      // Handle hour overflow
      if (newHour >= 24) {
        newHour = newHour % 24;
      }
      
      optimizedPlaces[i].time = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
    }
    
    // Update the places in the trip
    for (const place of optimizedPlaces) {
      const index = trip.items.findIndex(item => item.id === place.id);
      if (index !== -1) {
        trip.items[index] = place;
      }
    }
    
    setTrips(updatedTrips);
    toast.success("Itinerary optimized by distance", { position: "top-center" });
  };
  
  // Function to find alternative places when a place is unavailable
  const findAlternativePlaces = (place: Place): Place[] => {
    // Find places with the same category that are open
    return places.filter(p => 
      p.id !== place.id && 
      p.category === place.category &&
      (!place.time || !p.open || !p.close || (p.open <= parseInt(place.time.split(':')[0]) && p.close > parseInt(place.time.split(':')[0])))
    ).slice(0, 3); // Return up to 3 alternatives
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        places,
        reviews,
        addReview,
        deleteReview,
        likeReview,
        unlikeReview,
        isReviewLiked,
        trips,
        filteredTrips,
        setFilteredTrips,
        publicItineraries,
        filteredPublicItineraries,
        featuredItineraries,
        currentTripIndex,
        setCurrentTripIndex,
        previewTrip,
        setPreviewTrip,
        importTrip,
        createTrip,
        deleteTrip,
        addPlaceToTrip,
        removePlaceFromTrip,
        updatePlaceInTrip,
        destinationTab,
        setDestinationTab,
        friends,
        invitedFriends,
        inviteFriends,
        selectedPlace,
        setSelectedPlace,
        selectedLocation,
        setSelectedLocation,
        filterTrips,
        filterPublicItineraries,
        toggleTripPublic,
        optimizeItinerary,
        findAlternativePlaces,
        userProfile,
        updateUserProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
