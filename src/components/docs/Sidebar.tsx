'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { useDocument } from '../../context/DocumentContext';

interface SidebarProps {
  editor: Editor | null;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ editor, isOpen, toggleSidebar }: SidebarProps) => {
  const {
    handleFetchVersions,
    versions,
    handleRestoreVersion,
    handleDeleteVersion,
    isOwner,
  } = useDocument();

  
return (
  <div className="flex flex-col h-full text-teal-200 px-2 border border-amber-300">
    <h3 className="text-lg font-semibold mb-2">Version History</h3>
    <button
      onClick={handleFetchVersions}
      className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-600 w-full mb-4"
    >
      View Versions
    </button>

    {versions.length > 0 && (
      <ul className="max-h-64 overflow-y-auto">
        {versions.map(version => (
          <li key={version._id} className="mb-2 p-2 border rounded-md text-sm bg-gray-700 text-teal-200">
            <p className="font-medium">{version.editedBy.username}</p>
            <p className="text-xs">{new Date(version.editedAt).toLocaleString()}</p>
            <div className="flex justify-end gap-2 mt-1">
              <button
                onClick={() => handleRestoreVersion(version._id)}
                className="bg-blue-400 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-500"
              >
                Restore
              </button>
              {isOwner && (
                <button
                  onClick={() => handleDeleteVersion(version._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

};

export default Sidebar;
