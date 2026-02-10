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

  const isLiked = post.likes.includes(currentUser.id);
  const isSaved = currentUser.saved.includes(post.id);

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
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-50">
        <div className="flex items-center cursor-pointer">
          <img 
            src={post.userProfilePic} 
            alt={post.username} 
            className="w-8 h-8 rounded-full object-cover mr-3 ring-1 ring-gray-200"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none">{post.username}</span>
            <span className="text-[10px] text-gray-500 mt-0.5">{getTimeAgo(post.createdAt)}</span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-black">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Image */}
      <div 
        className="relative aspect-square w-full bg-gray-100 cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.imageUrl} 
          alt="Post" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Heart Overlay Animation */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${showHeartOverlay ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <Heart size={128} className="fill-white text-white drop-shadow-2xl opacity-90" />
        </div>
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onLike(post.id)}
              className={`transition-all active:scale-90 ${isLiked ? 'text-red-500' : 'text-black hover:opacity-60'}`}
            >
              <Heart size={26} fill={isLiked ? "currentColor" : "none"} strokeWidth={isLiked ? 0 : 2} />
            </button>
            <button 
              onClick={() => {}} // Focus input usually
              className="text-black hover:opacity-60 transition-opacity"
            >
              <MessageCircle size={26} />
            </button>
            <button 
              onClick={() => onShare(post.id)}
              className="text-black hover:opacity-60 transition-opacity"
            >
              <Send size={26} />
            </button>
          </div>
          <button 
             onClick={() => onSave(post.id)}
             className={`transition-all active:scale-90 ${isSaved ? 'text-black' : 'text-black hover:opacity-60'}`}
          >
             <Bookmark size={26} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-bold text-sm mb-2">
          {post.likes.length} likes
        </div>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-bold mr-2">{post.username}</span>
          {post.caption}
        </div>

        {/* Comments Preview */}
        {post.comments.length > 0 && (
          <div className="space-y-1 mb-2">
            <button className="text-gray-500 text-sm mb-1">
              View all {post.comments.length} comments
            </button>
            {post.comments.slice(0, 2).map((comment) => (
              <div key={comment.id} className="text-sm flex items-start">
                <span className="font-bold mr-2 shrink-0">{comment.username}</span>
                <span className="text-gray-800 line-clamp-1">{comment.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <form onSubmit={handleSubmitComment} className="flex items-center mt-2 pt-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none placeholder-gray-400 bg-transparent"
          />
          <button 
            type="submit" 
            disabled={!commentText.trim()}
            className="text-blue-500 font-semibold text-sm disabled:opacity-50 ml-2"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};