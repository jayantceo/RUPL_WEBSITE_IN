import React, { useState, useRef } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { X, Camera } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ username, bio, profilePic });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Edit Profile</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
             <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-100" />
               <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
               </div>
             </div>
             <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 font-bold text-sm mt-3">Change Profile Photo</button>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
               <input 
                 type="text" 
                 value={username} 
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-black outline-none"
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
               <textarea 
                 value={bio} 
                 onChange={(e) => setBio(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-black outline-none"
                 rows={3}
               />
            </div>

            <Button onClick={handleSave} className="w-full">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};