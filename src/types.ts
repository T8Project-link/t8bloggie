export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  authorId: string;
  reactions?: {
    [clientId: string]: string;
  };
}

export interface User {
  email: string;
  isAdmin: boolean;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  badges: string[];
}

export interface UserProfile extends User {
  id: string;
  posts: BlogPost[];
}