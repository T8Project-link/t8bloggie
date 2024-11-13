import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { BlogPost as BlogPostType } from '../types';

interface Props {
  post: BlogPostType;
}

export default function BlogPost({ post }: Props) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <time className="text-sm text-gray-500 mb-4 block">
          {format(new Date(post.createdAt), 'MMMM d, yyyy')}
        </time>
        <div className="prose prose-indigo max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}