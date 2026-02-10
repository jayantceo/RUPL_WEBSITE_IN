import React, { useState, useRef, useEffect } from 'react';
import { Post, User } from '../types';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react';

interface PostDetailModalProps {
  post: Post | null;
  currentUser: User;
  onClose: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ 
  post, 
  currentUser, 
  onClose, 
  onLike, 
  onComment,
  onShare,
  onSave
}) => {
  const [commentText, setCommentText] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of comments when modal opens or comments change
  useEffect(() => {
    if (post) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [post?.comments.length, post]);

  if (!post) return null;

  const isLiked = post.likes.includes(currentUser.id);
  const isSaved = currentUser.saved.includes(post.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-0 md:p-8 animate-in fade-in duration-200">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/20 rounded-full"
      >
        <X size={24} />
      </button>

      <div className="bg-white w-full h-full md:max-w-6xl md:h-[85vh] md:rounded-r-2xl md:rounded-l-none md:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Image Side */}
        <div className="w-full md:w-[60%] bg-black flex items-center justify-center h-[40vh] md:h-full relative">
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Details Side (Comments & Interface) */}
        <div className="w-full md:w-[40%] flex flex-col h-[60vh] md:h-full bg-white relative">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-10">
            <div className="flex items-center space-x-3">
              <img 
                src={post.userProfilePic} 
                alt={post.username} 
                className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
              />
              <span className="font-bold text-sm hover:underline cursor-pointer">{post.username}</span>
              {post.isPublic ? null : <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500 font-medium">Followers</span>}
            </div>
            <button className="text-gray-500 hover:text-black">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Scrollable Comments Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Caption as first 'comment' */}
            <div className="flex items-start group">
              <img 
                src={post.userProfilePic} 
                alt={post.username} 
                className="w-8 h-8 rounded-full object-cover mr-4 shrink-0 cursor-pointer"
              />
              <div className="text-sm">
                <div className="mb-1">
                  <span className="font-bold mr-2 cursor-pointer hover:underline">{post.username}</span>
                  <span className="text-gray-900 leading-relaxed">{post.caption}</span>
                </div>
                <div className="text-xs text-gray-400 font-medium mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <p>No comments yet.</p>
                    <p className="text-xs">Start the conversation.</p>
                </div>
            ) : (
                post.comments.map(comment => (
                  <div key={comment.id} className="flex items-start group animate-in slide-in-from-bottom-2 duration-300">
                     <img 
                      src={comment.userProfilePic || "https://picsum.photos/200"} 
                      alt={comment.username} 
                      className="w-8 h-8 rounded-full object-cover mr-4 shrink-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="text-sm flex flex-col">
                        <div className="mb-0.5">
                           <span className="font-bold mr-2 cursor-pointer hover:underline">{comment.username}</span>
                           <span className="text-gray-800">{comment.text}</span>
                        </div>
                         <div className="flex items-center space-x-4 text-xs text-gray-400 font-medium mt-1">
                            <span>Just now</span> {/* Realtime simulation */}
                            <button className="font-semibold hover:text-gray-600">Reply</button>
                            <button className="hover:text-gray-600">Like</button>
                         </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart size={12} />
                    </button>
                  </div>
                ))
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Sticky Bottom Actions & Input */}
          <div className="border-t border-gray-100 bg-white shrink-0 pb-safe">
            {/* Action Icons */}
            <div className="p-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <button onClick={() => onLike(post.id)} className={`transition-transform active:scale-90 ${isLiked ? 'text-red-500' : 'text-black hover:opacity-60'}`}>
                    <Heart size={28} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
                  </button>
                  <button className="text-black hover:opacity-60">
                    <MessageCircle size={28} strokeWidth={2} />
                  </button>
                  <button onClick={() => onShare(post.id)} className="text-black hover:opacity-60">
                    <Send size={28} strokeWidth={2} className="-rotate-12" />
                  </button>
                </div>
                <button onClick={() => onSave(post.id)} className={isSaved ? 'text-black' : 'text-black hover:opacity-60'}>
                  <Bookmark size={28} fill={isSaved ? "currentColor" : "none"} strokeWidth={2} />
                </button>
              </div>
              <div className="font-bold text-sm text-black mb-1">{post.likes.length.toLocaleString()} likes</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                 {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric'})}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 border-t border-gray-100">
               <button type="button" className="text-gray-400 hover:text-gray-600 mr-3">
                  <Smile size={24} />
               </button>
               <input 
                 type="text" 
                 placeholder="Add a comment..."
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
                 autoFocus
               />
               <button 
                 type="submit" 
                 disabled={!commentText.trim()}
                 className="text-blue-500 font-bold text-sm disabled:opacity-50 ml-3 hover:text-blue-700"
               >
                 Post
               </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
