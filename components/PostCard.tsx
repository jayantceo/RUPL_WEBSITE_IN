import React, { useState } from 'react';
import { Post, User } from '../types';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onLike, onComment, onShare, onSave }) => {
  const [commentText, setCommentText] = useState('');
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const isLiked = post.likes.includes(currentUser.id);
  const isSaved = currentUser.saved.includes(post.id);

  const handleLike = () => {
    onLike(post.id);
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      onLike(post.id);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 1000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="bg-white border-b md:border border-gray-200 md:rounded-xl mb-4 md:mb-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5">
        <div className="flex items-center cursor-pointer group">
          <div className="relative">
             <img 
              src={post.userProfilePic} 
              alt={post.username} 
              className="w-9 h-9 rounded-full object-cover mr-3 ring-1 ring-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-900 group-hover:text-gray-600 transition-colors">{post.username}</span>
            {/* Optional Location mock */}
            <span className="text-[11px] text-gray-500">Rupl Original</span> 
          </div>
        </div>
        <button className="text-gray-500 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-50">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div 
        className="relative aspect-square w-full bg-gray-100 cursor-pointer overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.imageUrl} 
          alt="Post" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Heart Overlay Animation */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ease-out ${showHeartOverlay ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <Heart size={120} className="fill-white text-white drop-shadow-2xl opacity-90 animate-bounce" />
        </div>
      </div>

      {/* Actions */}
      <div className="px-3.5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={`transition-transform duration-200 active:scale-75 hover:opacity-70 ${isLikeAnimating ? 'scale-125' : ''} ${isLiked ? 'text-red-500' : 'text-black'}`}
            >
              <Heart size={26} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
            </button>
            <button 
              onClick={() => onComment(post.id, '')} 
              className="text-black hover:opacity-50 transition-opacity active:scale-90 duration-200"
            >
              <MessageCircle size={26} strokeWidth={2} />
            </button>
            <button 
              onClick={() => onShare(post.id)}
              className="text-black hover:opacity-50 transition-opacity active:scale-90 duration-200 transform -rotate-12"
            >
              <Send size={26} strokeWidth={2} />
            </button>
          </div>
          <button 
             onClick={() => onSave(post.id)}
             className={`transition-all duration-200 active:scale-75 hover:opacity-70 ${isSaved ? 'text-black' : 'text-black'}`}
          >
             <Bookmark size={26} fill={isSaved ? "currentColor" : "none"} strokeWidth={2} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-bold text-sm mb-2 text-gray-900 cursor-pointer hover:underline">
          {post.likes.length > 0 ? `${post.likes.length.toLocaleString()} likes` : 'Be the first to like'}
        </div>

        {/* Caption */}
        <div className="text-sm mb-2 leading-relaxed">
          <span className="font-bold mr-2 text-gray-900 cursor-pointer hover:underline">{post.username}</span>
          <span className="text-gray-900">{post.caption}</span>
        </div>

        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <button 
            onClick={() => onComment(post.id, '')}
            className="text-gray-500 text-sm mb-2 font-medium hover:text-gray-700 transition-colors"
          >
            View all {post.comments.length} comments
          </button>
        )}
        
        <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">
          {getTimeAgo(post.createdAt)}
        </div>

        {/* Add Comment Input */}
        <div className="border-t border-gray-100 pt-3 hidden md:block">
          <form onSubmit={handleSubmitComment} className="flex items-center">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-sm outline-none placeholder-gray-400 bg-transparent"
            />
            {commentText && (
              <button 
                type="submit" 
                className="text-blue-500 font-bold text-sm hover:text-blue-700 transition-colors ml-2"
              >
                Post
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
