'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { Document as DocumentType, User, Version } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import ConfirmationModal from '../../../components/common/ConfirmationModal'; // Import the new modal component

export default function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [newCollaboratorId, setNewCollaboratorId] = useState('');
  const [versions, setVersions] = useState<Version[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for the modal
  const [versionToDeleteId, setVersionToDeleteId] = useState(''); // State to hold the version ID
  const router = useRouter();
  const { user } = useAuth();

  const fetchDocument = async () => {
    try {
      const res = await api.getDocumentById(id);
      if (res.document) { 
        setDocument(res.document);
        setTitle(res.document.title);
        setContent(res.document.content);
      } else {
        setError(res.Message);
        if (res.Message.includes('authorized')) {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('Failed to fetch document.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id, router]);

  const handleUpdate = async () => {
    if (!document) return;

    try {
      const res = await api.updateDocument(id, title, content);
      if (res.Message === 'Document Updated') {
        alert('Document saved successfully!');
      } else {
        setError(res.Message);
      }
    } catch (err) {
      setError('Failed to save document.');
      console.error(err);
    }
  };
  
  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollaboratorId) return;

    try {
      const res = await api.addCollaborator(id, newCollaboratorId);
      if (res.Message === 'Collaboraor added sucessfully') {
        setDocument(res.Docuent);
        setNewCollaboratorId('');
        alert('Collaborator added successfully!');
      } else {
        alert(res.Message);
      }
    } catch (err) {
      alert('Failed to add collaborator.');
    }
  };
  
  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const res = await api.removeCollaborator(id, collaboratorId);
      if (res.Message === 'removed teh collaborator') {
        const removedUser = document?.collaborators.find(c => c.id === collaboratorId);
        if (removedUser) {
          setDocument({
            ...document!,
            collaborators: document!.collaborators.filter(c => c.id !== collaboratorId)
          });
        }
        alert('Collaborator removed successfully!');
      } else {
        alert(res.Message);
      }
    } catch (err) {
      alert('Failed to remove collaborator.');
    }
  };

  const handleFetchVersions = async () => {
    try {
      const res = await api.getVersions(id);
      if (res.Message) {
        alert(res.Message);
      } else {
        setVersions(res);
        setShowVersions(true);
      }
    } catch (err) {
      alert('Failed to fetch versions.');
      console.error(err);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    try {
      const res = await api.restoreVersion(id, versionId);
      if (res.Message === 'Document restored to selected version') {
        setDocument(res.Document);
        setTitle(res.Document.title);
        setContent(res.Document.content);
        setShowVersions(false);
        alert('Version restored successfully!');
      } else {
        alert(res.Message);
      }
    } catch (err) {
      alert('Failed to restore version.');
      console.error(err);
    }
  };

  const handleDeleteVersion = (versionId: string) => {
    setVersionToDeleteId(versionId);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
      try {
          const res = await api.deleteVersion(id, versionToDeleteId);
          if (res.Message === "Version deleted successfully") {
              setVersions(versions.filter(v => v._id !== versionToDeleteId));
              alert("Version deleted successfully!");
          } else {
              alert(res.Message);
          }
      } catch (err) {
          alert("Failed to delete version.");
          console.error(err);
      } finally {
          setShowDeleteModal(false);
          setVersionToDeleteId('');
      }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading document...
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
  
  if (!document) {
      return (
          <div className="flex min-h-screen items-center justify-center text-red-500">
              Document not found or you do not have permission.
          </div>
      );
  }

  const isOwner = user && document.owner.id === user.id;

  return (
    <div className="min-h-screen p-8">
        <div className="w-full max-w-2xl   mb-6">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-800 px-4 py-2 flex justify-end rounded-md hover:bg-gray-500 transition-colors"
        >
          &larr; Back to Dashboard
        </button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleUpdate}
          className="text-3xl font-bold w-full p-2 border rounded-md"
        />
        <button
          onClick={handleUpdate}
          className="ml-4 bg-green-500 text-white px-6 py-2 rounded-md"
        >
          Save
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleUpdate}
        rows={20}
        className="w-full p-4 border rounded-md text-lg resize-none"
      />

      <div className="mt-8 p-6 border rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Collaborators</h2>
        <div className="mb-4">
          {document.owner && (
            <p className="font-medium">Owner: {document.owner.username} ({document.owner.email})</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-medium mb-2">Current Collaborators:</h3>
          {document.collaborators.length === 0 ? (
            <p className="text-gray-600">No collaborators added yet.</p>
          ) : (
            <ul>
              {document.collaborators.map((user) => (
                <li key={user.id} className="flex justify-between items-center mb-2">
                  <span>{user.username} ({user.email})</span>
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveCollaborator(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {isOwner && (
          <form onSubmit={handleAddCollaborator} className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter Collaborator ID"
              value={newCollaboratorId}
              onChange={(e) => setNewCollaboratorId(e.target.value)}
              className="flex-grow p-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Collaborator
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 p-6 border rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Version History</h2>
        <button
          onClick={handleFetchVersions}
          className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          View Versions
        </button>
      </div>

      {showVersions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-black">
          <div className="bg-white p-8 rounded-lg w-1/2 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl  font-bold mb-4">Document Versions</h3>
            {versions.length === 0 ? (
              <p>No versions found.</p>
            ) : (
              <ul>
                {versions.map(version => (
                  <li key={version._id} className="mb-4 p-4 border rounded-md">
                    <p className="font-medium">Edited by: {version.editedBy.username}</p>
                    <p className="text-sm text-gray-600">At: {new Date(version.editedAt).toLocaleString()}</p>
                    <p className="mt-2 line-clamp-3">{version.content}</p>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleRestoreVersion(version._id)}
                        className="bg-blue-400 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-500 "
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDeleteVersion(version._id)}
                        className="bg-red-500 text-black px-3 py-1 rounded-md text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowVersions(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <ConfirmationModal
        isOpen={showDeleteModal}
        message="Are you sure you want to delete this version?"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}