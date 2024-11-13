import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Pencil, Trash2, Ban } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  post: BlogPostType;
  onReact?: (postId: string, emoji: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (post: BlogPostType) => void;
  onToggleReactions?: (postId: string, enabled: boolean) => void;
}

const REACTIONS = ['👍', '😮', '😢', '😠'];

export default function BlogPost({ post, onReact, onDelete, onEdit, onToggleReactions }: Props) {
  const { user } = useAuth();
  const reactionsEnabled = post.reactions !== null;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 md:h-64 object-cover"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <time className="text-sm text-gray-500 block">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>
          {user && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit?.(post)}
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete?.(post.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => onToggleReactions?.(post.id, !reactionsEnabled)}
                className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
              >
                <Ban className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        <div className="prose prose-indigo max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
        {reactionsEnabled && (
          <div className="mt-6 flex flex-wrap gap-2">
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReact?.(post.id, emoji)}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-xl mr-1">{emoji}</span>
                <span className="text-sm font-medium text-gray-700">
                  {post.reactions?.[emoji] || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}