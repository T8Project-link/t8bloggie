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
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BlogPost, User } from '../types';
import { useClientId } from './useClientId';
import { useAuth } from '../contexts/AuthContext';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clientId = useClientId();
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      async (snapshot) => {
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate().toISOString()
        } as BlogPost));

        // Fetch authors for all posts
        const authorIds = [...new Set(newPosts.map(post => post.authorId))];
        const authorData: { [key: string]: User } = {};
        
        await Promise.all(
          authorIds.map(async (authorId) => {
            const authorDoc = await getDoc(doc(db, 'users', authorId));
            if (authorDoc.exists()) {
              authorData[authorId] = authorDoc.data() as User;
            }
          })
        );

        setAuthors(authorData);
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

  const addPost = async (post: Omit<BlogPost, 'id' | 'authorId'>) => {
    if (!user) throw new Error('Must be logged in to add posts');
    
    try {
      await addDoc(collection(db, 'posts'), {
        ...post,
        authorId: user.email,
        createdAt: Timestamp.now(),
        reactions: {}
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

  const toggleReaction = async (postId: string, emoji: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const reactions = { ...post.reactions } || {};
      
      if (reactions[clientId] === emoji) {
        delete reactions[clientId];
      } else {
        reactions[clientId] = emoji;
      }

      await updateDoc(postRef, { reactions });
    } catch (err) {
      console.error('Error toggling reaction:', err);
      throw new Error('Failed to toggle reaction');
    }
  };

  return { 
    posts, 
    authors,
    loading, 
    error, 
    addPost, 
    deletePost, 
    updatePost,
    toggleReaction
  };
}