import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Pencil, Trash2 } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  post: BlogPostType;
  onDelete?: (postId: string) => void;
  onEdit?: (post: BlogPostType) => void;
}

export default function BlogPost({ post, onDelete, onEdit }: Props) {
  const { user } = useAuth();

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
            </div>
          )}
        </div>
        <div className="prose prose-indigo max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}