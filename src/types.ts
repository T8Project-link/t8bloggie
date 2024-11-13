export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  reactions: {
    [key: string]: number; // emoji: count
  };
}

export interface User {
  username: string;
  passwordHash: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}