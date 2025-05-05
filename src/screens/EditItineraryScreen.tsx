import React, { useState, useRef, useEffect } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useApp } from '../context/AppContext';
import { ScreenType, Trip, Place } from '../types';
import PlaceCard from '../components/PlaceCard';
import { toast } from 'sonner';
import { Calendar, ChevronLeft, ChevronRight, WifiHigh } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CalendarCellProps {
  day: string;
  hour: number;
  onDrop: (day: string, hour: number) => void;
  children?: React.ReactNode;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ day, hour, onDrop, children }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(day, hour);
  };

  return (
    <div 
      className={`border border-gray-200 h-16 relative ${isOver ? 'bg-travel-light bg-opacity-30' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </div>
  );
};

// Event component for calendar
const EventItem: React.FC<{
  item: Place;
  onRemove: () => void;
  onUnschedule: () => void;
  onEdit: () => void;
}> = ({ item, onRemove, onUnschedule, onEdit }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [height, setHeight] = useState((item.duration || 1) * 64);
  const startY = useRef(0);
  const startHeight = useRef(0);

  // Update height whenever item duration changes
  useEffect(() => {
    setHeight((item.duration || 1) * 64);
  }, [item.duration]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    startY.current = e.clientY;
    startHeight.current = height;
    setIsResizing(true);

    const handleResizeMove = (moveEvent: MouseEvent) => {
      if (isResizing) {
        const diff = moveEvent.clientY - startY.current;
        const newHeight = Math.max(64, startHeight.current + diff);
        // Snap to hour increments
        const hours = Math.round(newHeight / 64);
        setHeight(hours * 64);
      }
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      
      // Update duration based on height
      const newDuration = Math.max(1, Math.round(height / 64));
      if (newDuration !== (item.duration || 1)) {
        // This is handled by the parent component
        onEdit();
      }
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  return (
    <div 
      className="absolute top-0 left-0 right-0 bg-travel-primary text-white p-1 text-sm overflow-hidden rounded-md"
      style={{ height: `${height}px` }}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
    >
      <div className="flex justify-between">
        <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</div>
        <div className="flex space-x-1">
          <button 
            className="w-5 h-5 flex items-center justify-center bg-white bg-opacity-20 rounded text-xs"
            onClick={onEdit}
            title="Edit"
          >
            ✎
          </button>
          <button 
            className="w-5 h-5 flex items-center justify-center bg-white bg-opacity-20 rounded text-xs"
            onClick={onUnschedule}
            title="Move to unscheduled"
          >
            ↑
          </button>
          <button 
            className="w-5 h-5 flex items-center justify-center bg-white bg-opacity-20 rounded text-xs"
            onClick={onRemove}
            title="Remove"
          >
            ×
          </button>
        </div>
      </div>
      {item.time && <div className="text-xs mt-1">{item.time} - {calculateEndTime(item.time, item.duration || 1)}</div>}
      <div 
        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-white bg-opacity-10 flex items-center justify-center"
        onMouseDown={handleResizeStart}
      >
        <div className="w-10 h-1 bg-white bg-opacity-50 rounded-full"></div>
      </div>
    </div>
  );
};

// Helper to calculate end time based on start time and duration
const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration * 60;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

const EditItineraryScreen: React.FC = () => {
  const { 
    trips, 
    currentTripIndex, 
    setCurrentScreen, 
    invitedFriends,
    removePlaceFromTrip,
    updatePlaceInTrip,
    toggleTripPublic,
    optimizeItinerary,
    findAlternativePlaces,
    places
  } = useApp();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isPublic, setIsPublic] = useState(trips[currentTripIndex]?.isPublic || false);
  const [currentWeekStart, setCurrentWeekStart] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Place | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [dayToOptimize, setDayToOptimize] = useState<string | null>(null);
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);
  const [alternativePlaces, setAlternativePlaces] = useState<Place[]>([]);
  const [daysWithMultipleEvents, setDaysWithMultipleEvents] = useState<string[]>([]);
  const [optimizedDays, setOptimizedDays] = useState<string[]>([]);
  const [dropTargetHour, setDropTargetHour] = useState<number | null>(null);
  const [dropTargetDay, setDropTargetDay] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Update isPublic when the trip changes
  React.useEffect(() => {
    if (trips[currentTripIndex]) {
      setIsPublic(trips[currentTripIndex].isPublic || false);
    }
  }, [trips, currentTripIndex]);
  
  // Calculate days with multiple events for optimization
  useEffect(() => {
    if (trips[currentTripIndex]) {
      const trip = trips[currentTripIndex];
      const eventsByDay: { [day: string]: number } = {};
      
      // Count events per day
      trip.items.forEach(item => {
        if (item.day && item.time) {
          eventsByDay[item.day] = (eventsByDay[item.day] || 0) + 1;
        }
      });
      
      // Find days with more than one event
      const daysToOptimize = Object.entries(eventsByDay)
        .filter(([_, count]) => count > 1)
        .map(([day]) => day)
        // Filter out days that have already been optimized
        .filter(day => !optimizedDays.includes(day));
      
      setDaysWithMultipleEvents(daysToOptimize);
    }
  }, [trips, currentTripIndex, optimizedDays]);
  
  if (!trips[currentTripIndex]) {
    return (
      <PhoneFrame title="Itinerary not found">
        <div className="text-center py-10">
          <p className="text-gray-500">Itinerary not found</p>
          <button 
            className="travel-btn mt-4"
            onClick={() => setCurrentScreen(ScreenType.ITINERARIES_OVERVIEW)}
          >
            Back to Itineraries
          </button>
        </div>
      </PhoneFrame>
    );
  }
  
  const trip = trips[currentTripIndex];
  
  const unscheduledItems = trip.items.filter(item => !item.time);
  const scheduledItems = trip.items.filter(item => item.time && item.day);
  
  // Generate days for calendar
  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push({
      name: dayNames[d.getDay()],
      date: d.toISOString().split('T')[0],
      fullDate: new Date(d)
    });
  }
  
  // Get current week days (7 days max)
  const displayDays = days.slice(currentWeekStart, currentWeekStart + 7);
  
  // Check if we can go to previous/next week
  const canGoPrev = currentWeekStart > 0;
  const canGoNext = currentWeekStart + 7 < days.length;
  
  // Create time slots (with 30-minute increments)
  const timeSlots = [];
  for (let hour = 6; hour < 23; hour++) {
    timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
    timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
  }
  
  const handleDrop = (placeId: string, day: string, hour: number) => {
    const place = trip.items.find(item => item.id === placeId);
    
    if (!place) return;
    
    // Store the target day and hour for potential alternative selection
    setDropTargetDay(day);
    setDropTargetHour(hour);
    setErrorMessage(null);
    
    // Check if place has opening hours and if the drop is within those hours
    if (place.open !== undefined && place.close !== undefined) {
      if (hour < place.open || hour >= place.close) {
        // If outside opening hours, find alternatives that are open at this time
        const hourInt = Math.floor(hour);
        const alternatives = findAlternativePlaces(place).filter(alt => {
          // Check if alternative is open at this time
          if (alt.open === undefined || alt.close === undefined) return true;
          return hourInt >= alt.open && hourInt < alt.close;
        });
        
        if (alternatives.length > 0) {
          setAlternativePlaces(alternatives);
          setSelectedEvent({...place, day, time: `${Math.floor(hour)}:${hour % 1 > 0 ? '30' : '00'}`});
          setShowAlternativesModal(true);
        } else {
          // No alternatives available, show error message
          setErrorMessage(`"${place.name}" is only open from ${place.open}:00 to ${place.close}:00, and no alternatives are available for this time slot.`);
          setSelectedEvent({...place, day, time: `${Math.floor(hour)}:${hour % 1 > 0 ? '30' : '00'}`});
          setShowAlternativesModal(true);
        }
        return;
      }
    }
    
    // Update place with new schedule
    const updatedPlace = {
      ...place,
      day: day,
      time: `${Math.floor(hour)}:${hour % 1 > 0 ? '30' : '00'}`,
      duration: place.duration || 1
    };
    
    updatePlaceInTrip(updatedPlace);
  };
  
  const handleEventEdit = (event: Place) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const updateEventTime = (event: Place, newTime: string) => {
    const updatedEvent = {
      ...event,
      time: newTime
    };
    updatePlaceInTrip(updatedEvent);
    // Update the selected event to show changes immediately in modal
    setSelectedEvent(updatedEvent);
  };
  
  const updateEventDuration = (event: Place, newDuration: number) => {
    const updatedEvent = {
      ...event,
      duration: newDuration
    };
    updatePlaceInTrip(updatedEvent);
    // Update the selected event to show changes immediately in modal
    setSelectedEvent(updatedEvent);
  };
  
  const unscheduleEvent = (event: Place) => {
    const updatedEvent = { ...event };
    delete updatedEvent.day;
    delete updatedEvent.time;
    updatePlaceInTrip(updatedEvent);
  };
  
  const onNextWeek = () => {
    if (canGoNext) {
      setCurrentWeekStart(currentWeekStart + 7);
    }
  };
  
  const onPrevWeek = () => {
    if (canGoPrev) {
      setCurrentWeekStart(currentWeekStart - 7);
    }
  };
  
  const handleInviteFriends = () => {
    setShowInviteModal(true);
  };
  
  const handleTogglePublic = () => {
    toggleTripPublic(currentTripIndex);
    setIsPublic(!isPublic);
  };
  
  const handleOpenOptimizeModal = (day: string) => {
    setDayToOptimize(day);
    setShowOptimizeModal(true);
  };
  
  const handleOptimizeItinerary = () => {
    if (dayToOptimize) {
      optimizeItinerary(currentTripIndex, dayToOptimize);
      // Add the day to the list of optimized days
      setOptimizedDays([...optimizedDays, dayToOptimize]);
      setShowOptimizeModal(false);
    }
  };
  
  const handleSelectAlternative = (place: Place) => {
    if (dropTargetDay && dropTargetHour !== null) {
      // Add alternative to calendar at the target location
      updatePlaceInTrip({
        ...place,
        day: dropTargetDay,
        time: `${Math.floor(dropTargetHour)}:${dropTargetHour % 1 > 0 ? '30' : '00'}`
      });
      setShowAlternativesModal(false);
    }
  };

  const renderRightActions = () => {
    return (
      <div className="flex items-center space-x-2">
        <button 
          className="flex items-center text-travel-primary"
          onClick={handleInviteFriends}
        >
          <Calendar className="h-5 w-5" />
        </button>
        <div 
          className={`px-2 py-1 text-xs rounded-full flex items-center cursor-pointer ${isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
          onClick={handleTogglePublic}
        >
          {isPublic ? 'Public' : 'Private'}
        </div>
      </div>
    );
  };

  return (
    <PhoneFrame 
      title={trip.name} 
      showBackButton 
      onBack={() => setCurrentScreen(ScreenType.ITINERARIES_OVERVIEW)}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div></div> {/* Empty div for flex spacing */}
        {renderRightActions()}
      </div>

      <div className="px-4 py-5">
        {/* Invited Friends Status */}
        {invitedFriends.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">SHARED WITH</h4>
            <div className="flex flex-wrap gap-2">
              {invitedFriends.map(friend => (
                <div 
                  key={friend.id} 
                  className="bg-gray-100 rounded-full py-1 px-3 flex items-center text-sm"
                >
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={friend.image} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{friend.name}</span>
                  <span className="text-xs text-gray-500 ml-1">({friend.status})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unscheduled Items */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Unscheduled</h4>
          <ScrollArea className="h-32">
            <div className="space-y-3 pr-4">
              {unscheduledItems.length > 0 ? (
                unscheduledItems.map(item => (
                  <div 
                    key={item.id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('text/plain', item.id)}
                    className="cursor-grab"
                  >
                    <PlaceCard 
                      place={item} 
                      showRemoveButton 
                      isDraggable 
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-3">No unscheduled items</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Calendar Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <h4 className="text-lg font-medium">Calendar</h4>
            <div className="ml-4 flex items-center space-x-2">
              <button 
                className={`p-1 rounded ${canGoPrev ? 'text-travel-primary hover:bg-gray-100' : 'text-gray-300'}`}
                onClick={onPrevWeek}
                disabled={!canGoPrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                className={`p-1 rounded ${canGoNext ? 'text-travel-primary hover:bg-gray-100' : 'text-gray-300'}`}
                onClick={onNextWeek}
                disabled={!canGoNext}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Week {Math.floor(currentWeekStart / 7) + 1} of {Math.ceil(days.length / 7)}
          </div>
        </div>
        
        {/* Optimization Alerts - Only show for days that haven't been optimized */}
        {daysWithMultipleEvents.length > 0 && (
          <div className="mb-4">
            {daysWithMultipleEvents.map(day => (
              <div 
                key={day} 
                className="flex items-center justify-between bg-blue-50 text-blue-700 p-3 rounded-md mb-2"
              >
                <div className="flex items-center">
                  <WifiHigh size={18} className="mr-2" />
                  <div>
                    <p className="text-sm font-medium">Optimize {day}'s schedule?</p>
                    <p className="text-xs">Reorder by distance to save travel time</p>
                  </div>
                </div>
                <button 
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md"
                  onClick={() => handleOpenOptimizeModal(day)}
                >
                  Optimize
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Calendar Header */}
        <div className="flex border-b mb-2">
          <div className="w-16 p-2 font-medium text-gray-500 text-sm">Time</div>
          {displayDays.map((day, idx) => (
            <div key={idx} className="flex-1 p-2 text-center">
              <div className="font-medium">{day.name}</div>
              <div className="text-xs text-gray-500">{day.date.split('-').slice(1).join('/')}</div>
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="overflow-y-auto h-96">
          {timeSlots.map((timeSlot, timeIdx) => (
            <div key={timeSlot} className="flex h-16 relative">
              <div className="w-16 py-2 pr-2 text-right text-sm text-gray-500 sticky left-0 bg-white">
                {timeSlot}
              </div>
              
              {/* Time columns for each day */}
              {displayDays.map((day, dayIdx) => {
                const hour = parseInt(timeSlot.split(':')[0], 10);
                const minute = parseInt(timeSlot.split(':')[1], 10);
                const calculatedHour = hour + (minute / 60);
                const cellEvents = scheduledItems.filter(item => {
                  // Check if this event belongs to this day and time slot
                  if (item.day !== day.name) return false;
                  
                  const [itemHour, itemMinute] = item.time?.split(':').map(Number) || [0, 0];
                  const itemCalculatedHour = itemHour + (itemMinute / 60);
                  return Math.abs(calculatedHour - itemCalculatedHour) < 0.01;
                });
                
                return (
                  <div 
                    key={`${day.name}-${timeSlot}`} 
                    className="flex-1 border border-gray-100 relative"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const placeId = e.dataTransfer.getData('text/plain');
                      handleDrop(placeId, day.name, calculatedHour);
                    }}
                  >
                    {cellEvents.map(event => (
                      <EventItem
                        key={event.id}
                        item={event}
                        onRemove={() => removePlaceFromTrip(event.id)}
                        onUnschedule={() => unscheduleEvent(event)}
                        onEdit={() => handleEventEdit(event)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Event Edit Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.name} 
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{selectedEvent.name}</h3>
                  <p className="text-sm text-gray-500">{selectedEvent.category}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <select 
                    className="w-full p-2 mt-1 border rounded-md"
                    value={selectedEvent.time || ''}
                    onChange={(e) => {
                      updateEventTime(selectedEvent, e.target.value);
                    }}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Duration (hours)</label>
                  <select 
                    className="w-full p-2 mt-1 border rounded-md"
                    value={selectedEvent.duration || 1}
                    onChange={(e) => {
                      const newDuration = Number(e.target.value);
                      updateEventDuration(selectedEvent, newDuration);
                    }}
                  >
                    {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6].map(hours => (
                      <option key={hours} value={hours}>{hours}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm mt-1">{selectedEvent.description}</p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <button 
                  className="px-4 py-2 flex items-center gap-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setShowEventModal(false)}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <div className="space-x-2">
                  <button 
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => {
                      removePlaceFromTrip(selectedEvent.id);
                      setShowEventModal(false);
                    }}
                  >
                    Delete
                  </button>
                  <button 
                    className="px-4 py-2 bg-travel-primary text-white rounded-md hover:bg-opacity-90"
                    onClick={() => {
                      // Save any pending changes
                      toast.success("Changes saved");
                      setShowEventModal(false);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite Friends Modal */}
      {showInviteModal && (
        <InviteFriendsModal onClose={() => setShowInviteModal(false)} />
      )}
      
      {/* Optimize Itinerary Modal */}
      <Dialog open={showOptimizeModal} onOpenChange={setShowOptimizeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Optimize Itinerary</DialogTitle>
            <DialogDescription>
              Reorder activities on {dayToOptimize} to optimize travel time by distance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <p className="text-sm">
              This will reorder your activities to minimize travel time between locations, keeping your earliest start time the same.
            </p>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm flex items-center">
                <WifiHigh className="h-4 w-4 mr-2 text-blue-500" />
                <span>Activities will be spaced 2 hours apart</span>
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptimizeModal(false)}>Cancel</Button>
            <Button onClick={handleOptimizeItinerary}>Optimize Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alternative Places Modal */}
      <Dialog open={showAlternativesModal} onOpenChange={setShowAlternativesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {alternativePlaces.length > 0 ? 'Alternative Options' : 'Schedule Issue'}
            </DialogTitle>
            <DialogDescription>
              {errorMessage || (selectedEvent?.name && 
                `${selectedEvent.name} is not available at this time. Here are some alternatives:`
              )}
            </DialogDescription>
          </DialogHeader>
          
          {alternativePlaces.length > 0 ? (
            <div className="space-y-4 py-2">
              <ScrollArea className="h-64">
                {alternativePlaces.map(place => (
                  <div 
                    key={place.id} 
                    className="mb-3 cursor-pointer" 
                    onClick={() => handleSelectAlternative(place)}
                  >
                    <PlaceCard place={place} />
                  </div>
                ))}
              </ScrollArea>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-gray-500">Try scheduling this activity at a different time or day.</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAlternativesModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PhoneFrame>
  );
};

// Invite Friends Modal Component
const InviteFriendsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { friends, inviteFriends } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleFriend = (id: number) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter(friendId => friendId !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const handleInvite = () => {
    inviteFriends(selectedFriends);
    onClose();
    toast.success('Invitations sent!');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Invite Friends</h3>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <input 
              type="text" 
              className="travel-input pl-10"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {filteredFriends.map(friend => (
              <div 
                key={friend.id} 
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={friend.image} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{friend.name}</span>
                </div>
                <input 
                  type="checkbox" 
                  className="h-5 w-5 accent-travel-primary"
                  checked={selectedFriends.includes(friend.id)}
                  onChange={() => handleToggleFriend(friend.id)}
                />
              </div>
            ))}
            
            {filteredFriends.length === 0 && (
              <p className="text-gray-500 text-center py-3">No friends found</p>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t flex space-x-3">
          <button 
            className="flex-1 py-2 border border-gray-300 rounded-full text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="flex-1 py-2 bg-travel-primary text-white rounded-full disabled:bg-gray-300"
            disabled={selectedFriends.length === 0}
            onClick={handleInvite}
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItineraryScreen;
