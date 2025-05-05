
export interface User {
  username: string;
  password: string;
  email?: string;
  bio?: string;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  image: string;
  open?: number;
  close?: number;
  description?: string;
  rating?: number;
  distance?: string;
  duration?: number;
  day?: string;
  time?: string;
  endTime?: string; // Optional end time for events
  isPublic?: boolean; // Whether this place is publicly shared
  likes?: number; // Number of likes for public places
  isFavorite?: boolean; // Whether the place is favorited by the user
  location?: string; // Location name (e.g., "Cancun")
}

export interface Review {
  id: string; // Added ID for reviews
  title: string;
  text: string;
  author?: string;
  date?: string;
  placeId?: string; // Added placeId to associate reviews with places
  placeName?: string; // Added place name for display
  placeImage?: string; // Added place image for display
  likes?: number; // Number of likes for the review
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  image?: string;
  items: Place[];
  isPublic: boolean; // Changed from optional to required with default value
  likes?: number; // Like count for public trips
  author?: string; // Author of the trip
}

export interface Friend {
  id: number;
  name: string;
  image: string;
  status?: string;
}

export enum ScreenType {
  LOGIN = 'login',
  SIGNUP = 'signup',
  HOME = 'home',
  DISCOVER_ITINERARIES = 'discoverItineraries', // Renamed from SEARCH
  SEARCH = 'search', // Location search
  SEARCH_RESULTS = 'searchResults',
  DESTINATION = 'destination',
  BROWSE_ITINERARIES = 'browseItineraries',
  ITINERARIES_OVERVIEW = 'itinerariesOverview',
  CREATE_ITINERARY = 'createItinerary',
  EDIT_ITINERARY = 'editItinerary',
  PREVIEW_ITINERARY = 'previewItinerary', // New screen for itinerary preview before import
  REVIEWS = 'reviews',
  PROFILE = 'profile',
}
