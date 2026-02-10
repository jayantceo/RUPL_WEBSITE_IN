import React, { useState } from 'react';
import { Post, User } from '../types';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
      >
        <X size={32} />
      </button>

      <div className="bg-white w-full max-w-5xl h-[90vh] md:h-[80vh] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Image Side */}
        <div className="w-full md:w-[60%] bg-black flex items-center justify-center">
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Details Side */}
        <div className="w-full md:w-[40%] flex flex-col h-full bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={post.userProfilePic} 
                alt={post.username} 
                className="w-8 h-8 rounded-full object-cover mr-3 ring-1 ring-gray-200"
              />
              <span className="font-bold text-sm">{post.username}</span>
            </div>
            <button className="text-gray-500 hover:text-black">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Comments Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Caption */}
            <div className="flex items-start mb-4">
              <img 
                src={post.userProfilePic} 
                alt={post.username} 
                className="w-8 h-8 rounded-full object-cover mr-3 shrink-0"
              />
              <div className="text-sm">
                <span className="font-bold mr-2">{post.username}</span>
                {post.caption}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Comments */}
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start">
                 <img 
                  src={comment.userProfilePic || "https://picsum.photos/200"} 
                  alt={comment.username} 
                  className="w-8 h-8 rounded-full object-cover mr-3 shrink-0"
                />
                <div className="text-sm">
                  <span className="font-bold mr-2">{comment.username}</span>
                  {comment.text}
                   <div className="text-xs text-gray-400 mt-1 flex space-x-3">
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      <button className="font-semibold hover:text-gray-600">Reply</button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <button onClick={() => onLike(post.id)} className={isLiked ? 'text-red-500' : 'text-black hover:opacity-60'}>
                  <Heart size={26} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button className="text-black hover:opacity-60">
                  <MessageCircle size={26} />
                </button>
                <button onClick={() => onShare(post.id)} className="text-black hover:opacity-60">
                  <Send size={26} />
                </button>
              </div>
              <button onClick={() => onSave(post.id)} className={isSaved ? 'text-black' : 'text-black hover:opacity-60'}>
                <Bookmark size={26} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="font-bold text-sm mb-1">{post.likes.length} likes</div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">
               {new Date(post.createdAt).toLocaleString()}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center opacity-80">
               <input 
                 type="text" 
                 placeholder="Add a comment..."
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 className="flex-1 text-sm outline-none"
               />
               <button 
                 type="submit" 
                 disabled={!commentText.trim()}
                 className="text-blue-500 font-semibold text-sm disabled:opacity-50"
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