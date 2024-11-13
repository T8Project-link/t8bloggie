import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BlogPost } from '../types';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate().toISOString()
        } as BlogPost));
        setPosts(newPosts);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPost = async (post: Omit<BlogPost, 'id'>) => {
    try {
      await addDoc(collection(db, 'posts'), {
        ...post,
        createdAt: Timestamp.now()
      });
    } catch (err) {
      console.error('Error adding post:', err);
      throw new Error('Failed to add post');
    }
  };

  return { posts, loading, error, addPost };
}