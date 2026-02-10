import React, { useRef, useEffect } from 'react';
import { Post, User } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Music2 } from 'lucide-react';

interface RuplFeedProps {
  posts: Post[];
  currentUser: User;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

export const RuplFeed: React.FC<RuplFeedProps> = ({ posts, currentUser, onLike, onComment, onShare }) => {
  // Filter only public posts for the Rupl feed if you want, or assume posts passed are already filtered
  const feedPosts = posts; 

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic could go here, but native CSS snap is better for performance

  return (
    <div 
      ref={scrollContainerRef}
      className="h-[calc(100vh-64px)] md:h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
    >
      {feedPosts.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-white snap-center">
          <p>No public posts available.</p>
        </div>
      ) : (
        feedPosts.map((post) => {
          const isLiked = post.likes.includes(currentUser.id);
          
          return (
            <div key={post.id} className="h-full w-full relative snap-start shrink-0 flex items-center justify-center bg-gray-900">
               {/* Background Image/Video */}
               <img 
                 src={post.imageUrl} 
                 alt={post.caption} 
                 className="h-full w-full object-contain md:object-cover max-w-2xl mx-auto"
               />
               
               {/* Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />

               {/* Right Side Actions */}
               <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-10">
                  <div className="flex flex-col items-center space-y-1">
                    <button 
                      onClick={() => onLike(post.id)}
                      className="p-2 rounded-full bg-black/20 backdrop-blur-md active:scale-90 transition-transform"
                    >
                      <Heart 
                        size={32} 
                        className={isLiked ? "fill-red-500 text-red-500" : "text-white"} 
                        strokeWidth={isLiked ? 0 : 2}
                      />
                    </button>
                    <span className="text-white text-xs font-semibold shadow-black drop-shadow-md">{post.likes.length}</span>
                  </div>

                  <div className="flex flex-col items-center space-y-1">
                    <button 
                      onClick={() => onComment(post.id)}
                      className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors"
                    >
                      <MessageCircle size={30} className="text-white" />
                    </button>
                    <span className="text-white text-xs font-semibold shadow-black drop-shadow-md">{post.comments.length}</span>
                  </div>

                  <button 
                    onClick={() => onShare(post.id)}
                    className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors"
                  >
                    <Share2 size={30} className="text-white" />
                  </button>

                  <button className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors">
                    <MoreHorizontal size={30} className="text-white" />
                  </button>
               </div>

               {/* Bottom Content */}
               <div className="absolute bottom-4 left-4 right-16 z-10 text-white">
                  <div className="flex items-center mb-3 space-x-3">
                     <img 
                       src={post.userProfilePic} 
                       alt={post.username} 
                       className="w-10 h-10 rounded-full border-2 border-white object-cover"
                     />
                     <span className="font-bold text-sm md:text-base drop-shadow-md">{post.username}</span>
                     <button className="border border-white/50 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm hover:bg-white/20">Follow</button>
                  </div>
                  
                  <div className="max-w-[85%]">
                     <p className="text-sm md:text-base line-clamp-2 mb-2 drop-shadow-sm">{post.caption}</p>
                     
                     {/* Mock Music Tag */}
                     <div className="flex items-center text-xs opacity-90 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                        <Music2 size={12} className="mr-2" />
                        <span className="animate-pulse">Original Audio - {post.username}</span>
                     </div>
                  </div>
               </div>
            </div>
          );
        })
      )}
    </div>
  );
};