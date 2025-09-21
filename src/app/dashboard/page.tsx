'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '@/components/common/ConfirmationModal';

interface Document {
  _id: string;
  title: string;
  content: string;
  owner: string;
  collaborators: string[];
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { logout } = useAuth(); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDeleteId, setDocToDeleteId] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.getAllDocuments();
        if (res.Message) {
          setError(res.Message);
          if (res.Message.includes('Token')) {
            router.push('/login');
          }
        } else {
          setDocuments(res);
        }
      } catch (err) {
        setError('Failed to fetch documents.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.logout();
      logout(); 
      router.push('/login');
    } catch (err) {
      console.error(err);
      alert('Logout failed. Please try again.');
    }
  };

  const handleDelete = (id: string) => {
    setDocToDeleteId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
        const res = await api.deleteDocument(docToDeleteId);
        if (res.Message === "The Document has been Deleted Sucessfully") {
            setDocuments(documents.filter(doc => doc._id !== docToDeleteId));
        } else {
            alert(`Failed to delete document: ${res.Message}`);
        }
    } catch (err) {
        alert("An error occurred while deleting the document.");
    } finally {
        setShowDeleteModal(false);
        setDocToDeleteId('');
      }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }
  
  if (!documents) {
      return (
          <div className="flex min-h-screen items-center justify-center text-red-500">
              No Documents found or you do not have permission.
          </div>
      );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-600"
          >
            Logout
          </button>
          <Link href="/docs/create" className="bg-blue-400 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600">
            Create New Document
          </Link>
        </div>
      </div>
      {documents.length === 0 ? (
        <p>You don't have any documents yet. Click the button above to create one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc._id} className="p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
              <p className="text-gray-600 truncate">{doc.content}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => router.push(`/docs/${doc._id}`)}
                  className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Open
                </button>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmationModal
        isOpen={showDeleteModal}
        message="Are you sure you want to delete this document?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </main>
  );
}