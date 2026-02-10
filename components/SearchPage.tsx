import React, { useState } from 'react';
import { User, Post } from '../types';
import { Search, Heart, MapPin, Hash, User as UserIcon } from 'lucide-react';

interface SearchPageProps {
  posts: Post[];
  users: User[];
  onPostClick: (post: Post) => void;
  currentUser: User;
}

export const SearchPage: React.FC<SearchPageProps> = ({ posts, users, onPostClick, currentUser }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'TOP' | 'ACCOUNTS' | 'TAGS'>('TOP');

  // Filter logic
  const filteredPosts = posts.filter(p => 
    p.isPublic && (
      p.caption.toLowerCase().includes(query.toLowerCase()) ||
      p.username.toLowerCase().includes(query.toLowerCase())
    )
  );

  const filteredUsers = users.filter(u => 
    u.id !== currentUser.id &&
    (u.username.toLowerCase().includes(query.toLowerCase()) || 
    (u.bio && u.bio.toLowerCase().includes(query.toLowerCase())))
  );

  return (
    <div className="max-w-4xl mx-auto pt-2 md:pt-8 pb-20 px-0 md:px-4">
      {/* Search Bar Header */}
      <div className="sticky top-0 md:top-4 z-30 bg-white/95 backdrop-blur-md px-4 py-3 md:rounded-xl md:mb-6 border-b md:border-none border-gray-100">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white shadow-sm transition-all text-sm font-medium"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Tabs - Only show when searching */}
        {query && (
          <div className="flex items-center space-x-6 mt-3 px-2 overflow-x-auto scrollbar-hide">
             {['TOP', 'ACCOUNTS', 'TAGS'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`pb-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                   activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                 }`}
               >
                 {tab === 'TOP' ? 'For you' : tab === 'ACCOUNTS' ? 'Accounts' : 'Tags'}
               </button>
             ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-h-screen">
        {activeTab === 'ACCOUNTS' && query ? (
          <div className="px-4 py-2 space-y-4">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <img src={user.profilePic} alt={user.username} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                    <div>
                       <p className="font-bold text-sm">{user.username}</p>
                       <p className="text-gray-500 text-xs">{user.username} • {user.followers.length} followers</p>
                    </div>
                 </div>
                 <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold rounded-lg transition-colors">
                   Follow
                 </button>
              </div>
            ))}
            {filteredUsers.length === 0 && <div className="text-center text-gray-500 py-10">No users found</div>}
          </div>
        ) : (
          /* Grid View for Posts (Top / Explore) */
          <div className="grid grid-cols-3 gap-0.5 md:gap-4 md:px-0">
             {filteredPosts.map((post, idx) => {
               // Staggered grid layout logic could go here for "Masonry" feel
               const isBig = idx % 10 === 0 && idx !== 0; // Example
               return (
                 <div 
                   key={post.id} 
                   onClick={() => onPostClick(post)}
                   className={`relative aspect-square group cursor-pointer overflow-hidden bg-gray-100 ${isBig ? 'row-span-2 col-span-2' : ''}`}
                 >
                   <img 
                     src={post.imageUrl} 
                     alt="Explore" 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-4">
                      <div className="flex items-center text-white font-bold">
                        <Heart size={20} className="fill-white mr-1" /> {post.likes.length}
                      </div>
                      <div className="flex items-center text-white font-bold">
                        <MapPin size={20} className="fill-white mr-1" /> {post.comments.length}
                      </div>
                   </div>
                 </div>
               )
             })}
             {filteredPosts.length === 0 && (
               <div className="col-span-3 py-20 text-center">
                 <div className="inline-block p-4 rounded-full bg-gray-50 mb-3">
                    <Hash size={32} className="text-gray-300" />
                 </div>
                 <p className="text-gray-500 font-medium">No posts found.</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
