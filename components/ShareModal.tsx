import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { X, Search, CheckCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onShareToUser: (userId: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, users, onShareToUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentTo, setSentTo] = useState<string[]>([]);

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = (userId: string) => {
    onShareToUser(userId);
    setSentTo([...sentTo, userId]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 h-[60vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">Share</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>

        <div className="p-3 border-b">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-gray-100 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center p-4 text-gray-500 text-sm">No people found.</div>
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                 <div className="flex items-center">
                    <img src={user.profilePic} alt={user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
                    <div className="flex flex-col">
                       <span className="text-sm font-semibold">{user.username}</span>
                       <span className="text-xs text-gray-500">{user.username}</span>
                    </div>
                 </div>
                 <Button 
                   variant={sentTo.includes(user.id) ? "outline" : "primary"}
                   className={`px-4 py-1.5 h-auto text-xs ${sentTo.includes(user.id) ? 'border-transparent text-green-600 hover:bg-transparent' : ''}`}
                   onClick={() => !sentTo.includes(user.id) && handleSend(user.id)}
                 >
                   {sentTo.includes(user.id) ? 'Sent' : 'Send'}
                 </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};