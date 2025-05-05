
import React, { useState } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType, Place } from '../types';
import { Calendar, Heart, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

const EventCard: React.FC<{ item: Place }> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg p-3 mb-3 shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-md bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
          <img src={item.image || "https://via.placeholder.com/48"} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow">
          <h4 className="font-medium text-sm">{item.name}</h4>
          <p className="text-xs text-gray-500">{item.category}</p>
          {item.time && (
            <div className="flex items-center mt-1">
              <Clock size={12} className="text-gray-400 mr-1" />
              <span className="text-xs text-gray-500">{item.time} {item.duration ? `(${item.duration}h)` : ""}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PreviewItineraryScreen: React.FC = () => {
  const { 
    previewTrip, 
    setPreviewTrip, 
    setCurrentScreen,
    trips,
    importTrip
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedTripIndex, setSelectedTripIndex] = useState<number | undefined>(undefined);

  if (!previewTrip) {
    setCurrentScreen(ScreenType.DISCOVER_ITINERARIES);
    return null;
  }

  const handleImport = () => {
    setShowImportDialog(true);
  };

  const handleImportTrip = () => {
    importTrip(previewTrip, selectedTripIndex);
    toast.success("Itinerary imported successfully!");
  };

  const handleCreateNew = () => {
    importTrip(previewTrip);
    toast.success("New itinerary created successfully!");
  };

  // Group items by day
  const dayGroups: Record<string, Place[]> = {};
  previewTrip.items.forEach(item => {
    if (item.day) {
      if (!dayGroups[item.day]) {
        dayGroups[item.day] = [];
      }
      dayGroups[item.day].push(item);
    }
  });

  return (
    <PhoneFrame 
      title={previewTrip.name}
      showBackButton
      onBack={() => {
        setPreviewTrip(null);
        setCurrentScreen(ScreenType.DISCOVER_ITINERARIES);
      }}
    >
      <div className="space-y-4">
        {/* Header Image */}
        <div className="relative h-48 w-full">
          <img 
            src={previewTrip.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} 
            alt={previewTrip.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-xl">{previewTrip.name}</h2>
                  <div className="flex items-center text-gray-200 text-sm">
                    <MapPin size={14} className="mr-1" />
                    <span>{previewTrip.destination}</span>
                  </div>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Heart size={16} className="text-white mr-1" />
                  <span className="text-white">{previewTrip.likes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-4">
          <div className="flex justify-between mb-4">
            <div className="flex items-center text-sm">
              <Calendar size={16} className="text-gray-500 mr-1" />
              <span>{previewTrip.startDate} - {previewTrip.endDate}</span>
            </div>
            <div className="text-sm">
              By <span className="font-medium">{previewTrip.author || "Anonymous"}</span>
            </div>
          </div>

          <button 
            className="w-full py-3 bg-travel-primary text-white rounded-full mb-4"
            onClick={handleImport}
          >
            Import Itinerary
          </button>

          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 mb-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <p className="text-gray-600">
                A {Object.keys(dayGroups).length}-day trip to {previewTrip.destination} with {previewTrip.items.length} activities.
              </p>
              <div>
                <h3 className="font-medium mb-2">Included Activities:</h3>
                <div className="space-y-2">
                  {previewTrip.items.map(item => (
                    <div key={`${item.id}-overview`} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 mr-2 flex-shrink-0 overflow-hidden">
                        <img src={item.image || "https://via.placeholder.com/32"} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="space-y-4">
              {Object.keys(dayGroups).length > 0 ? (
                Object.entries(dayGroups).map(([day, items]) => (
                  <div key={day}>
                    <h3 className="font-medium mb-2">{day}:</h3>
                    <div className="space-y-2">
                      {items
                        .sort((a, b) => {
                          const aTime = a.time ? parseInt(a.time.split(':')[0]) : 0;
                          const bTime = b.time ? parseInt(b.time.split(':')[0]) : 0;
                          return aTime - bTime;
                        })
                        .map(item => (
                          <EventCard key={`${item.id}-${day}`} item={item} />
                        ))
                      }
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No scheduled items in this itinerary.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Itinerary</DialogTitle>
            <DialogDescription>
              Choose how you want to import this itinerary.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <h4 className="font-medium text-sm">Create new itinerary</h4>
            <Button 
              className="w-full justify-start bg-travel-primary hover:bg-travel-primary/90"
              onClick={handleCreateNew}
            >
              Create copy of "{previewTrip.name}"
            </Button>

            {trips.length > 0 && (
              <>
                <h4 className="font-medium text-sm mt-4">Or add to existing itinerary:</h4>
                <div className="space-y-2">
                  {trips.map((trip, index) => (
                    <div 
                      key={trip.id}
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedTripIndex === index ? 'border-travel-primary bg-travel-primary/10' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedTripIndex(index)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-md bg-gray-100 mr-3 flex-shrink-0 overflow-hidden">
                          <img 
                            src={trip.image || "https://via.placeholder.com/40"} 
                            alt={trip.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h5 className="font-medium">{trip.name}</h5>
                          <p className="text-xs text-gray-500">{trip.destination}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex-col gap-2">
            <Button 
              className="w-full" 
              disabled={selectedTripIndex === undefined && trips.length > 0}
              onClick={handleImportTrip}
            >
              Import to Selected Itinerary
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowImportDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PhoneFrame>
  );
};

export default PreviewItineraryScreen;
