import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useBlogPosts } from '../hooks/useBlogPosts';

export default function Admin() {
  const { addPost } = useBlogPosts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addPost({
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setContent('');
    setImageUrl('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Markdown Tips:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use # for headings (# H1, ## H2, ### H3)</li>
            <li>• *italic* or _italic_</li>
            <li>• **bold** or __bold__</li>
            <li>• - or * for bullet points</li>
            <li>• [Link text](URL)</li>
            <li>• ![Alt text](image URL)</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Cover Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content (Markdown supported)
            </label>
            <textarea
              id="content"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Write your post content here using Markdown..."
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}