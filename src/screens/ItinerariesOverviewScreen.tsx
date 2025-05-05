
import React from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import TripCard from '../components/TripCard';
import AddTripCard from '../components/AddTripCard';
import { Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from '../components/ui/sonner';

const ItinerariesOverviewScreen: React.FC = () => {
  const { trips, setCurrentTripIndex, setCurrentScreen, deleteTrip } = useApp();
  const [tripToDelete, setTripToDelete] = React.useState<number | null>(null);
  
  const today = new Date();
  
  // Split trips into upcoming and past
  const upcomingTrips = trips.filter(trip => new Date(trip.endDate) >= today);
  const pastTrips = trips.filter(trip => new Date(trip.endDate) < today);
  
  const handleTripClick = (index: number) => {
    setCurrentTripIndex(index);
    setCurrentScreen(ScreenType.EDIT_ITINERARY);
  };
  
  const handleDeleteTrip = () => {
    if (tripToDelete !== null) {
      deleteTrip(tripToDelete);
      setTripToDelete(null);
      toast.success("Itinerary deleted successfully");
    }
  };
  
  const confirmDeleteTrip = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTripToDelete(index);
  };

  return (
    <PhoneFrame title="My Itineraries">
      <div className="px-4 py-5">
        {/* Upcoming Trips */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
          <div className="grid grid-cols-1 gap-4">
            {upcomingTrips.map((trip, index) => (
              <div key={trip.id} className="relative">
                <TripCard 
                  trip={trip}
                  onClick={() => handleTripClick(trips.indexOf(trip))} 
                />
                <button 
                  className="absolute top-3 right-3 p-2 bg-red-500 bg-opacity-70 rounded-full text-white"
                  onClick={(e) => confirmDeleteTrip(trips.indexOf(trip), e)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <AddTripCard />
          </div>
        </div>
        
        {/* Past Trips */}
        {pastTrips.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
            <div className="grid grid-cols-1 gap-4">
              {pastTrips.map((trip, index) => (
                <div key={trip.id} className="relative">
                  <TripCard 
                    trip={trip}
                    onClick={() => handleTripClick(trips.indexOf(trip))} 
                  />
                  <button 
                    className="absolute top-3 right-3 p-2 bg-red-500 bg-opacity-70 rounded-full text-white"
                    onClick={(e) => confirmDeleteTrip(trips.indexOf(trip), e)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {trips.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No itineraries yet</p>
            <button 
              className="travel-btn"
              onClick={() => setCurrentScreen(ScreenType.CREATE_ITINERARY)}
            >
              Create Your First Itinerary
            </button>
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={tripToDelete !== null} onOpenChange={(open) => !open && setTripToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Itinerary</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this itinerary? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTrip} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PhoneFrame>
  );
};

export default ItinerariesOverviewScreen;
