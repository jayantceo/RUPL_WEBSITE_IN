import React, { useState, useRef } from 'react';
import { User, Post, PageView } from './types';
import { Navbar } from './components/Navbar';
import { PostCard } from './components/PostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ShareModal } from './components/ShareModal';
import { SettingsModal } from './components/SettingsModal';
import { RuplFeed } from './components/RuplFeed';
import { Stories } from './components/Stories';
import { Toast } from './components/Toast';
import { Button } from './components/Button';
import { Search, Lock, Mail, User as UserIcon, Check, Settings, Grid, Heart, Camera, Bookmark, AlignJustify } from 'lucide-react';

// --- MOCK DATA ---
const DEFAULT_AVATAR = "https://picsum.photos/200/200";

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'traveler_joe',
    email: 'joe@example.com',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    followers: ['2', '3'],
    following: ['2'],
    saved: ['102'],
    bio: 'Exploring the world one pixel at a time 🌍',
  },
  {
    id: '2',
    username: 'artistic_anna',
    email: 'anna@example.com',
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    followers: ['1'],
    following: ['1', '3'],
    saved: [],
    bio: 'Digital Artist | Coffee Lover ☕',
  },
  {
    id: '3',
    username: 'lens_master',
    email: 'lens@example.com',
    profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    followers: ['1', '2'],
    following: [],
    saved: [],
    bio: 'Capturing moments 📸',
  },
];

const INITIAL_POSTS: Post[] = [
  {
    id: '101',
    userId: '1',
    username: 'traveler_joe',
    userProfilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
    caption: 'Sunset vibes in the mountains 🏔️ #nature #peace',
    likes: ['2', '3'],
    comments: [
      { id: 'c1', userId: '2', username: 'artistic_anna', userProfilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop', text: 'Stunning view!', createdAt: Date.now() - 3600000 }
    ],
    createdAt: Date.now() - 7200000,
    isPublic: true,
  },
  {
    id: '102',
    userId: '2',
    username: 'artistic_anna',
    userProfilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    caption: 'Morning inspiration. Time to create! 🎨',
    likes: ['1'],
    comments: [],
    createdAt: Date.now() - 86400000,
    isPublic: true,
  },
   {
    id: '103',
    userId: '3',
    username: 'lens_master',
    userProfilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800',
    caption: 'My loyal companion. 🐶',
    likes: ['1', '2'],
    comments: [],
    createdAt: Date.now() - 100000000,
    isPublic: false,
  }
];

// --- APP COMPONENT ---

const App: React.FC = () => {
  // STATE
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageView>('AUTH');
  const [isLogin, setIsLogin] = useState(true); 
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & UI State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sharingPostId, setSharingPostId] = useState<string | null>(null);
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [profileActiveTab, setProfileActiveTab] = useState<'POSTS' | 'SAVED'>('POSTS');
  
  // Auth Form State
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authBio, setAuthBio] = useState('');
  const [authPfp, setAuthPfp] = useState<string | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const authFileRef = useRef<HTMLInputElement>(null);

  // --- HELPERS ---

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  const handleAuthFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuthPfp(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (isLogin) {
      const foundUser = users.find(u => u.email === authEmail);
      if (foundUser) {
        if (authPass === 'password' || authPass.length > 0) {
            setUser(foundUser);
            setCurrentPage('HOME');
            showToast(`Welcome back, ${foundUser.username}!`);
        } else {
             setAuthError('Incorrect password.');
        }
      } else {
         setAuthError('User not found.');
      }
    } else {
      if (!privacyAgreed) {
        setAuthError('Please agree to the privacy policy.');
        return;
      }
      if (!authName || !authEmail || !authPass) {
        setAuthError('All fields are required.');
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        username: authName,
        email: authEmail,
        profilePic: authPfp || DEFAULT_AVATAR,
        followers: [],
        following: [],
        saved: [],
        bio: authBio || 'New to Rupl.'
      };
      
      setUsers([...users, newUser]);
      setUser(newUser);
      setCurrentPage('HOME');
      showToast('Account created successfully!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('AUTH');
    setAuthName('');
    setAuthEmail('');
    setAuthPass('');
    setAuthPfp(null);
    setAuthBio('');
    setIsSettingsOpen(false);
  };

  // --- ACTIONS ---

  const handleCreatePost = (image: string, caption: string, isPublic: boolean) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userProfilePic: user.profilePic,
      imageUrl: image,
      caption: caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      isPublic: isPublic,
    };
    setPosts([newPost, ...posts]);
    showToast(isPublic ? 'Posted to Rupl Feed!' : 'Saved to Profile');
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.id);
        const newLikes = isLiked 
          ? post.likes.filter(id => id !== user.id)
          : [...post.likes, user.id];
        return { ...post, likes: newLikes };
      }
      return post;
    }));
    if (viewingPost && viewingPost.id === postId) {
       setViewingPost(prev => {
          if (!prev) return null;
          const isLiked = prev.likes.includes(user.id);
           const newLikes = isLiked 
          ? prev.likes.filter(id => id !== user.id)
          : [...prev.likes, user.id];
          return { ...prev, likes: newLikes };
       });
    }
  };

  const handleSavePost = (postId: string) => {
    if (!user) return;
    const isSaved = user.saved.includes(postId);
    const newSaved = isSaved 
      ? user.saved.filter(id => id !== postId)
      : [...user.saved, postId];
    
    setUser({ ...user, saved: newSaved });
    setUsers(users.map(u => u.id === user.id ? { ...u, saved: newSaved } : u));
    showToast(isSaved ? 'Removed from saved' : 'Post saved');
  };

  const handleComment = (postId: string, text?: string) => {
    if (!user) return;
    // If text is provided (from Home feed), add immediately. 
    // If not (from Rupl feed), open detail modal.
    if (text) {
      const newComment = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        userProfilePic: user.profilePic,
        text,
        createdAt: Date.now()
      };
      
      const updatePosts = (currentPosts: Post[]) => currentPosts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      });

      setPosts(updatePosts(posts));
      if (viewingPost && viewingPost.id === postId) {
         setViewingPost(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
      }
    } else {
      // Open modal for commenting
      const post = posts.find(p => p.id === postId);
      if (post) setViewingPost(post);
    }
  };

  const handleShareClick = (postId: string) => {
    setSharingPostId(postId);
    setIsShareModalOpen(true);
  };

  const handleShareToUser = (targetUserId: string) => {
    const targetUser = users.find(u => u.id === targetUserId);
    showToast(`Sent to ${targetUser?.username || 'user'}`);
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    setPosts(posts.map(p => p.userId === user.id ? { ...p, username: updatedUser.username, userProfilePic: updatedUser.profilePic } : p));
    showToast('Profile updated');
  };

  // --- RENDER SECTIONS ---

  const filteredPosts = posts.filter(p => 
    p.caption.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAuth = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic">RUPL.</h1>
          <p className="text-gray-500 font-medium">Capture. Share. Inspire.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="flex flex-col items-center mb-6">
               <div 
                 className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-100 transition-all group"
                 onClick={() => authFileRef.current?.click()}
               >
                 {authPfp ? (
                   <img src={authPfp} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <Camera className="text-gray-400 group-hover:text-black transition-colors" size={32} />
                 )}
               </div>
               <span className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wide">Add Profile Photo</span>
               <input type="file" ref={authFileRef} onChange={handleAuthFileChange} className="hidden" accept="image/*" />
            </div>
          )}

          {!isLogin && (
            <div className="relative group">
              <UserIcon className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
              <input
                type="text"
                placeholder="Username"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              />
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
            />
          </div>
          
           {!isLogin && (
            <div className="relative">
              <input
                type="text"
                placeholder="Bio (Optional)"
                value={authBio}
                onChange={(e) => setAuthBio(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
              />
            </div>
          )}

          {!isLogin && (
            <div className="flex items-center space-x-2 py-2">
              <div 
                className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-colors ${privacyAgreed ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}
                onClick={() => setPrivacyAgreed(!privacyAgreed)}
              >
                {privacyAgreed && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm text-gray-600">I agree to the Terms & Privacy</span>
            </div>
          )}

          {authError && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg font-medium">{authError}</p>}

          <Button type="submit" className="w-full py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform transition-transform active:scale-95">
            {isLogin ? 'Log In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500">
            {isLogin ? "New to Rupl? " : "Already have an account? "}
          </span>
          <button 
            onClick={() => { setIsLogin(!isLogin); setAuthError(''); }} 
            className="font-bold text-black hover:underline transition-all"
          >
            {isLogin ? 'Join Now' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="max-w-xl mx-auto pt-2 md:pt-10 pb-20">
      {/* Professional Search Bar */}
      <div className="sticky top-14 md:top-4 z-30 bg-white/95 backdrop-blur-md px-4 py-2 md:py-0 md:mb-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border-none rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white shadow-sm transition-all"
              placeholder="Search Rupl..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
      </div>

       {/* Stories */}
      <div className="px-4 md:px-0 mb-6">
        <Stories currentUser={user!} users={users} />
      </div>

      {/* Feed */}
      <div className="space-y-6 px-0 md:px-0">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <PostCard
                post={post}
                currentUser={user!}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShareClick}
                onSave={handleSavePost}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search size={48} strokeWidth={1} className="mb-4 opacity-50" />
            <p className="font-medium">No posts found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRupl = () => (
    <RuplFeed 
      posts={posts.filter(p => p.isPublic)}
      currentUser={user!}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShareClick}
    />
  );

  const renderProfile = () => {
    if (!user) return null;
    const myPosts = posts.filter(p => p.userId === user.id);
    const savedPosts = posts.filter(p => user.saved.includes(p.id));
    
    // Moved activeTab state to top level App component
    const displayPosts = profileActiveTab === 'POSTS' ? myPosts : savedPosts;

    return (
      <div className="max-w-4xl mx-auto pt-20 pb-20 px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start mb-8 md:mb-12">
          <div className="relative group mb-6 md:mb-0 md:mr-12">
            <div className="w-28 h-28 md:w-40 md:h-40 rounded-full p-1 border-2 border-gray-200 group-hover:border-black transition-colors">
               <img 
                 src={user.profilePic} 
                 alt={user.username} 
                 className="w-full h-full rounded-full object-cover"
               />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:mb-6">
              <h2 className="text-2xl md:text-3xl font-light mr-0 md:mr-6 mb-3 md:mb-0">{user.username}</h2>
              <div className="flex space-x-2">
                <Button 
                   variant="secondary" 
                   className="px-6 py-2 text-sm h-auto font-semibold bg-gray-100 hover:bg-gray-200"
                   onClick={() => setIsEditProfileOpen(true)}
                >
                   Edit Profile
                </Button>
                <Button 
                  variant="secondary" 
                  className="p-2 h-auto bg-gray-100 hover:bg-gray-200"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings size={20} />
                </Button>
              </div>
            </div>
            
            {/* Stats - Improved UI */}
            <div className="flex justify-center md:justify-start space-x-8 md:space-x-12 mb-6 border-t border-b md:border-none py-4 md:py-0 border-gray-100 w-full md:w-auto">
              <div className="flex flex-col md:flex-row md:items-baseline md:space-x-1">
                 <span className="font-bold text-lg md:text-xl text-black">{myPosts.length}</span>
                 <span className="text-gray-500 text-sm md:text-base">posts</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline md:space-x-1">
                 <span className="font-bold text-lg md:text-xl text-black">{user.followers.length}</span>
                 <span className="text-gray-500 text-sm md:text-base">followers</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline md:space-x-1">
                 <span className="font-bold text-lg md:text-xl text-black">{user.following.length}</span>
                 <span className="text-gray-500 text-sm md:text-base">following</span>
              </div>
            </div>
            
            <div className="text-sm hidden md:block max-w-md">
               <p className="font-bold text-base mb-1">{user.username}</p>
               <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{user.bio || 'No bio yet.'}</p>
            </div>
          </div>
        </div>
        
        {/* Mobile Bio */}
        <div className="md:hidden text-sm px-2 mb-8 text-center">
             <p className="font-bold text-base mb-1">{user.username}</p>
             <p className="whitespace-pre-wrap text-gray-700">{user.bio || 'No bio yet.'}</p>
        </div>

        {/* Profile Tabs */}
        <div className="flex justify-center border-t border-gray-200 sticky top-14 md:top-0 bg-white z-20">
           <button 
             onClick={() => setProfileActiveTab('POSTS')}
             className={`flex items-center space-x-2 text-xs font-bold tracking-widest h-12 px-8 md:px-12 border-t-2 transition-all ${profileActiveTab === 'POSTS' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
           >
             <Grid size={14} />
             <span>POSTS</span>
           </button>
           <button 
             onClick={() => setProfileActiveTab('SAVED')}
             className={`flex items-center space-x-2 text-xs font-bold tracking-widest h-12 px-8 md:px-12 border-t-2 transition-all ${profileActiveTab === 'SAVED' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
           >
             <Bookmark size={14} />
             <span>SAVED</span>
           </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-0.5 md:gap-6 mt-1">
          {displayPosts.map((post) => (
            <div 
              key={post.id} 
              className="aspect-square bg-gray-100 overflow-hidden relative group cursor-pointer md:rounded-lg"
              onClick={() => setViewingPost(post)}
            >
               <img src={post.imageUrl} alt="My Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity">
                  <Heart className="mr-2 fill-white" size={20} /> {post.likes.length}
               </div>
               {/* Icon indicating type if needed */}
               {!post.isPublic && (
                 <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">
                   <Lock size={12} />
                 </div>
               )}
            </div>
          ))}
          {displayPosts.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                 {profileActiveTab === 'POSTS' ? <Camera size={32} strokeWidth={1} /> : <Bookmark size={32} strokeWidth={1} />}
              </div>
              <h3 className="text-2xl font-light text-black mb-2">{profileActiveTab === 'POSTS' ? 'Share Photos' : 'Save Photos'}</h3>
              <p className="text-sm max-w-xs text-center">{profileActiveTab === 'POSTS' ? 'When you share photos, they will appear on your profile.' : 'Save photos that you want to see again.'}</p>
              {profileActiveTab === 'POSTS' && (
                <button onClick={() => setIsCreateModalOpen(true)} className="text-blue-500 font-bold text-sm mt-6 hover:text-blue-600">
                  Share your first photo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (currentPage === 'AUTH') {
    return (
      <>
        {renderAuth()}
        <Toast message={toast.message} isVisible={toast.isVisible} onClose={() => setToast(prev => ({...prev, isVisible: false}))} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onCreatePost={() => setIsCreateModalOpen(true)}
        userProfilePic={user?.profilePic}
      />

      <main className="md:pl-20 xl:pl-64 min-h-screen transition-all duration-300">
        {currentPage === 'HOME' && renderHome()}
        {currentPage === 'RUPL' && renderRupl()}
        {currentPage === 'PROFILE' && renderProfile()}
      </main>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onPost={handleCreatePost}
      />
      
      <PostDetailModal 
        post={viewingPost}
        currentUser={user!}
        onClose={() => setViewingPost(null)}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShareClick}
        onSave={handleSavePost}
      />

      <EditProfileModal 
        user={user!}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleUpdateProfile}
      />

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => { setIsShareModalOpen(false); setSharingPostId(null); }}
        users={users.filter(u => u.id !== user?.id)}
        onShareToUser={handleShareToUser}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
      />

      <Toast message={toast.message} isVisible={toast.isVisible} onClose={() => setToast(prev => ({...prev, isVisible: false}))} />
    </div>
  );
};

export default App;