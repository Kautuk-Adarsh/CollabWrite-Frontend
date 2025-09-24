'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocument } from '../../context/DocumentContext';
import { api } from '../../lib/api';
import { User } from '../../types';
import { Editor } from '@tiptap/react';
import ConfirmationModal from '../common/ConfirmationModal';

interface HeaderProps {
  editor: Editor | null;
  toggleSidebar: () => void;
}

const Header = ({ editor, toggleSidebar }: HeaderProps) => {
  const {
    document,
    title,
    isOwner,
    setTitle,
    handleUpdate,
    handleAddCollaborator,
    handleRemoveCollaborator,
    loading,
    error,
  } = useDocument();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const router = useRouter();

  // Search collaborators
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout) clearTimeout(searchTimeout);

    const newTimeout = setTimeout(async () => {
      if (query.length > 2) {
        const res = await api.searchUsers(query);
        setSearchResults(Array.isArray(res) ? res : []);
      } else {
        setSearchResults([]);
      }
    }, 400);

    setSearchTimeout(newTimeout);
  };

  const addCollaborator = (id: string) => {
    handleAddCollaborator(id);
    setSearchQuery('');
    setSearchResults([]);
  };

  const confirmRemove = (id: string) => {
    setPendingRemoveId(id);
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    if (pendingRemoveId) {
      handleRemoveCollaborator(pendingRemoveId);
    }
    setPendingRemoveId(null);
    setShowConfirm(false);
  };

  if (loading || error || !document) return null;

  return (
    <>
      <header className="bg-gray-800 px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow sticky top-0 z-20 gap-2">

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={toggleSidebar}
            className="bg-gray-200 text-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-300 transition"
          >
            ☰
          </button>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-300 transition"
          >
            ← Back
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 sm:flex-none text-base sm:text-lg font-semibold px-2 py-1 border rounded-md w-32 sm:w-48 md:w-64 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleUpdate}
            className="ml-0 sm:ml-2 bg-green-500 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-md hover:bg-green-600 transition"
          >
            Save
          </button>
        </div>
        <div className="relative flex flex-col sm:items-end w-full sm:w-auto">
          {isOwner && (
            <div className="flex items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by email"
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 sm:flex-none w-full sm:w-64 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-400"
              />
              {searchResults.length > 0 && (
                <ul className="absolute right-0 top-full mt-1 z-30 w-full sm:w-64 bg-gray-700 border border-white rounded-b-sm shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((result) => (
                    <li
                      key={result.id}
                      onClick={() => addCollaborator(result.id)}
                      className="p-2 cursor-pointer hover:bg-amber-300 hover:text-black"
                    >
                      {result.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2 sm:justify-start">
            {document.collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="relative group flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                <span>{collaborator.username.charAt(0).toUpperCase()}</span>

                
                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm  rounded-lg py-1 px-3 -top-7 right-0 whitespace-nowrap z-50">
                  {collaborator.email}
                </div>

                
                {isOwner && (
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault(); 
                      confirmRemove(collaborator.id);
                    }}
                    className="ml-1 text-red-500 hover:text-red-700 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </header>


      <ConfirmationModal
        isOpen={showConfirm}
        message="Are you sure you want to remove this collaborator?"
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default Header;
