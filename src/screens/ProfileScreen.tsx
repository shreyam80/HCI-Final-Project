
import React, { useState, useRef } from 'react';
import PhoneFrame from '../components/PhoneFrame';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { toast } from '../components/ui/sonner';
import { Camera, Users } from 'lucide-react';
import TripCard from '../components/TripCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Friend, ScreenType } from '../types';

const ProfileScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { userProfile, updateUserProfile, trips, setCurrentTripIndex, setCurrentScreen, setPreviewTrip } = useApp();
  const [bio, setBio] = useState('Travel enthusiast exploring the world one destination at a time!');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(bio);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFriends, setShowFriends] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([
    { id: 1, name: "Alex Johnson", image: "https://i.pravatar.cc/36?u=5" },
    { id: 2, name: "Maria Garcia", image: "https://i.pravatar.cc/36?u=6" },
    { id: 3, name: "Tom Wilson", image: "https://i.pravatar.cc/36?u=7" },
  ]);
  const [newFriend, setNewFriend] = useState('');
  const [searchFriend, setSearchFriend] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  // Get public trips
  const publicTrips = trips.filter(trip => trip.isPublic);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleSaveBio = () => {
    setBio(newBio);
    setIsEditingBio(false);
    toast.success('Bio updated successfully');
  };
  
  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ picture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleToggleNotifications = () => {
    updateUserProfile({ 
      notificationsEnabled: !userProfile.notificationsEnabled 
    });
  };

  const handleAddFriend = () => {
    if (!newFriend.trim()) {
      toast.error('Please enter a friend name');
      return;
    }
    
    const newId = Math.max(...friends.map(f => f.id), 0) + 1;
    const friend: Friend = {
      id: newId,
      name: newFriend,
      image: `https://i.pravatar.cc/36?u=${newId + 10}`
    };
    
    setFriends([...friends, friend]);
    setNewFriend('');
    toast.success(`${newFriend} added to friends`);
  };
  
  const handleRemoveFriend = (id: number) => {
    setFriends(friends.filter(f => f.id !== id));
    toast.success('Friend removed');
  };
  
  const filteredFriends = searchFriend.trim() 
    ? friends.filter(f => f.name.toLowerCase().includes(searchFriend.toLowerCase()))
    : friends;

  const handleTripClick = (index: number) => {
    setCurrentTripIndex(index);
    setCurrentScreen(ScreenType.EDIT_ITINERARY);
  };
  
  const handleViewFriendTrip = (trip: any) => {
    setPreviewTrip(trip);
    setCurrentScreen(ScreenType.PREVIEW_ITINERARY);
    setSelectedFriend(null);
  };

  // Friend's public trips (mock data)
  const friendPublicTrips = [
    {
      id: "f1",
      name: "Weekend in Paris",
      destination: "Paris, France",
      startDate: "2025-06-15",
      endDate: "2025-06-17",
      image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
      items: [],
      isPublic: true,
    },
    {
      id: "f2",
      name: "Tokyo Adventure",
      destination: "Tokyo, Japan",
      startDate: "2025-07-10",
      endDate: "2025-07-20",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      items: [],
      isPublic: true,
    }
  ];

  return (
    <PhoneFrame title="Profile">
      <div className="px-4 py-5 pb-20">
        <div className="flex flex-col items-center mb-6">
          <div 
            className="w-24 h-24 rounded-full bg-travel-light flex items-center justify-center mb-3 cursor-pointer relative overflow-hidden"
            onClick={handleProfilePictureClick}
          >
            {userProfile.picture ? (
              <img 
                src={userProfile.picture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0CBDDE" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <h2 className="text-xl font-semibold">{currentUser}</h2>
          <p className="text-gray-500">{currentUser}@example.com</p>
          
          {/* Friends Button */}
          <button 
            className="flex items-center gap-2 bg-travel-light text-travel-primary px-4 py-2 rounded-full mt-2"
            onClick={() => setShowFriends(true)}
          >
            <Users size={18} />
            <span>Friends ({friends.length})</span>
          </button>
        </div>

        {/* Bio */}
        <div className="travel-card mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Bio</h3>
            {!isEditingBio && (
              <button 
                className="text-travel-primary"
                onClick={() => {
                  setIsEditingBio(true);
                  setNewBio(bio);
                }}
              >
                Edit
              </button>
            )}
          </div>
          
          {isEditingBio ? (
            <>
              <textarea
                className="travel-input resize-none min-h-[100px] mb-3"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <div className="flex space-x-3">
                <button 
                  className="flex-1 py-2 border border-gray-300 rounded-full text-gray-700"
                  onClick={() => setIsEditingBio(false)}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-2 bg-travel-primary text-white rounded-full"
                  onClick={handleSaveBio}
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600">{bio}</p>
          )}
        </div>

        {/* Public Itineraries */}
        {publicTrips.length > 0 && (
          <div className="travel-card mb-6">
            <h3 className="font-medium mb-3">Public Itineraries</h3>
            <div className="space-y-4">
              {publicTrips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => handleTripClick(trips.indexOf(trip))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="travel-card mb-6">
          <h3 className="font-medium mb-3">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 text-gray-500">
                  <path d="M9 7 H5 a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4" />
                  <rect width="10" height="5" x="7" y="2" rx="1" />
                </svg>
                <span>Notifications</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="notification-toggle" 
                  checked={userProfile.notificationsEnabled}
                  onChange={handleToggleNotifications}
                  className="sr-only" 
                />
                <label
                  htmlFor="notification-toggle"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    userProfile.notificationsEnabled ? 'bg-travel-primary' : 'bg-gray-300'
                  }`}
                >
                  <span 
                    className={`block w-6 h-6 bg-white rounded-full transform transition-transform duration-200 ease-in ${
                      userProfile.notificationsEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 text-gray-500">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                </svg>
                <span>Language</span>
              </div>
              <div className="text-gray-500">English</div>
            </div>
          </div>
        </div>

        <button 
          className="travel-btn w-full bg-gray-100 text-gray-800 hover:bg-gray-200 mt-6"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      {/* Friends Dialog */}
      <Dialog open={showFriends} onOpenChange={setShowFriends}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Friends</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Add Friend Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add friend by name..."
                className="travel-input flex-1"
                value={newFriend}
                onChange={(e) => setNewFriend(e.target.value)}
              />
              <button 
                className="bg-travel-primary text-white px-3 py-2 rounded-md"
                onClick={handleAddFriend}
              >
                Add
              </button>
            </div>
            
            {/* Search Friends */}
            <input
              type="text"
              placeholder="Search friends..."
              className="travel-input w-full"
              value={searchFriend}
              onChange={(e) => setSearchFriend(e.target.value)}
            />
            
            {/* Friends List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div 
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <img 
                        src={friend.image} 
                        alt={friend.name} 
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                      <span>{friend.name}</span>
                    </div>
                    <button 
                      className="text-red-500 px-2"
                      onClick={() => handleRemoveFriend(friend.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No friends found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Friend Profile Dialog */}
      <Dialog open={!!selectedFriend} onOpenChange={(open) => !open && setSelectedFriend(null)}>
        {selectedFriend && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedFriend.name}'s Profile</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <img 
                  src={selectedFriend.image} 
                  alt={selectedFriend.name} 
                  className="w-24 h-24 rounded-full object-cover" 
                />
                <h2 className="text-xl font-semibold mt-2">{selectedFriend.name}</h2>
                <p className="text-gray-500">{selectedFriend.name.toLowerCase().replace(' ', '')}@example.com</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Bio</h3>
                <p className="text-gray-600">Travel lover exploring new destinations whenever possible!</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Public Itineraries</h3>
                <div className="space-y-3">
                  {friendPublicTrips.map(trip => (
                    <div 
                      key={trip.id} 
                      className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewFriendTrip(trip)}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={trip.image} 
                          alt={trip.name} 
                          className="w-16 h-16 rounded-md object-cover" 
                        />
                        <div>
                          <h4 className="font-medium">{trip.name}</h4>
                          <p className="text-sm text-gray-500">{trip.destination}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PhoneFrame>
  );
};

export default ProfileScreen;
