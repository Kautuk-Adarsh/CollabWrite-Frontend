'use client';

import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useDocument } from '../../context/DocumentContext';

interface DocumentLayoutProps {
  children: ReactNode;
}

const DocumentLayout = ({ children }: DocumentLayoutProps) => {
  const { editor } = useDocument();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-black via-gray-700 ">
      <div className="z-20 sticky top-0 shadow-md bg-white">
        <Header editor={editor} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
        className={`bg-gray-800 text-teal-200 shadow-lg transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64 p-4' : 'w-0 p-0'} overflow-hidden`}
      >
        {isSidebarOpen && (
        <Sidebar
          editor={editor}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        )}
      </div>
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DocumentLayout;
