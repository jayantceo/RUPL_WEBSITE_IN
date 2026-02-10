export interface User {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  bio?: string;
  followers: string[];
  following: string[];
  saved: string[]; // Array of Post IDs
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userProfilePic?: string;
  text: string;
  createdAt: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfilePic: string;
  imageUrl: string;
  caption: string;
  likes: string[]; // Array of user IDs
  comments: Comment[];
  createdAt: number;
  isPublic: boolean; // True = Rupl/Explore, False = Followers only
}

export type PageView = 'AUTH' | 'HOME' | 'RUPL' | 'PROFILE';
