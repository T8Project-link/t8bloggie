import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
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
        reactions: {},
        createdAt: Timestamp.now()
      });
    } catch (err) {
      console.error('Error adding post:', err);
      throw new Error('Failed to add post');
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      throw new Error('Failed to delete post');
    }
  };

  const updatePost = async (postId: string, updates: Partial<BlogPost>) => {
    try {
      await updateDoc(doc(db, 'posts', postId), updates);
    } catch (err) {
      console.error('Error updating post:', err);
      throw new Error('Failed to update post');
    }
  };

  const addReaction = async (postId: string, emoji: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        [`reactions.${emoji}`]: increment(1)
      });
    } catch (err) {
      console.error('Error adding reaction:', err);
      throw new Error('Failed to add reaction');
    }
  };

  const toggleReactions = async (postId: string, enabled: boolean) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        reactions: enabled ? {} : null
      });
    } catch (err) {
      console.error('Error toggling reactions:', err);
      throw new Error('Failed to toggle reactions');
    }
  };

  return { 
    posts, 
    loading, 
    error, 
    addPost, 
    deletePost, 
    updatePost, 
    addReaction,
    toggleReactions 
  };
}