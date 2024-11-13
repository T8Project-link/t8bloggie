export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
}

export interface User {
  email: string;
  isAdmin: boolean;
}