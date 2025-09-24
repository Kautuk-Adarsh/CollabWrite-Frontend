'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import Link from 'next/link';

export default function CreateDocumentPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.createDocument(title, content);

      if (res.Message === 'Document Created') {
        alert('Document created successfully!');
        router.push(`/docs/${res.Document._id}`);
      } else {
        setError(res.Message);
      }
    } catch (err) {
      setError('Failed to create document.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-gradient-to-br from-black via-gray-700">
      <div className="w-full max-w-2xl   mb-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-800 px-4 py-2 flex justify-end rounded-md hover:bg-gray-500 transition-colors"
        >
          &larr; Back to Dashboard
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Create a New Document</h1>
      <form onSubmit={handleCreate} className="w-full max-w-2xl flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md text-xl"
          required
        />
        <textarea
          placeholder="Start writing here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="w-full p-3 border rounded-md text-lg resize-none"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold mt-4 hover:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Document'}
        </button>
      </form>
    </div>
  );
}