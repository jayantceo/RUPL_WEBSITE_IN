import { User, Post } from '../types';

const USERS_KEY = 'rupl_users_v1';
const POSTS_KEY = 'rupl_posts_v1';
const CURRENT_USER_KEY = 'rupl_current_user_v1';

export const storage = {
  getUsers: (): User[] | null => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getPosts: (): Post[] | null => {
    const data = localStorage.getItem(POSTS_KEY);
    return data ? JSON.parse(data) : null;
  },

  savePosts: (posts: Post[]) => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }
};
