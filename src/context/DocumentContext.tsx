'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { Document as DocumentType, User, Version } from '../types';
import { Editor } from '@tiptap/react';

interface DocumentContextType {
  document: DocumentType | null;
  title: string;
  content: string;
  isOwner?: boolean;
  user: User | null;
  loading: boolean;
  error: string;
  setTitle: (newTitle: string) => void;
  setContent: (newContent: string) => void;
  handleUpdate: () => void;
  handleAddCollaborator: (collaboratorId: string) => Promise<void>;
  handleRemoveCollaborator: (collaboratorId: string) => Promise<void>;
  handleFetchVersions: () => Promise<void>;
  handleRestoreVersion: (versionId: string) => Promise<void>;
  handleDeleteVersion: (versionId: string) => void;
  confirmDelete: () => Promise<void>;
  versions: Version[];
  showVersions: boolean;
  setShowVersions: (show: boolean) => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  versionToDeleteId: string;
  setVersionToDeleteId: (id: string) => void;
  isRestoring: boolean;
  setIsRestoring: (isRestoring: boolean) => void;
  handleCloseVersions: () => void;
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children, docId, currentUser, isAuthLoading }: { children: ReactNode; docId: string; currentUser: User | null; isAuthLoading: boolean; }) => {
  const [document, setDocument] = useState<DocumentType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [versionToDeleteId, setVersionToDeleteId] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  const isOwner: boolean | undefined = document?.owner && currentUser
    ? String(document.owner.id || (document.owner as any)._id) === String(currentUser.id)
    : undefined;

  const fetchDocument = async () => {
    try {
      const res = await api.getDocumentById(docId);
      if (res.document) {
        setDocument(res.document);
        setTitle(res.document.title);
        setContent(res.document.content);
      } else {
        setError(res.Message);
      }
    } catch (err) {
      setError('Failed to fetch document.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (docId && !isAuthLoading) {
      fetchDocument();
    }
  }, [docId, isAuthLoading]);

  const handleUpdate = async () => {
    if (isRestoring) {
      setIsRestoring(false);
      return;
    }
    if (!document) return;
    try {
      const res = await api.updateDocument(docId, title, content);
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

  const handleAddCollaborator = async (collaboratorId: string) => {
    if (!collaboratorId) return;
    try {
      const res = await api.addCollaborator(docId, collaboratorId);
      if (res.Message === 'Collaborator added successfully') {
        setDocument(res.Document);
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
      const res = await api.removeCollaborator(docId, collaboratorId);
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
      const res = await api.getVersions(docId);
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
      setIsRestoring(true);
      const res = await api.restoreVersion(docId, versionId);
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
      const res = await api.deleteVersion(docId, versionToDeleteId);
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
  
  const handleCloseVersions = () => {
    setShowVersions(false);
  };

  const value = {
    document,
    title,
    content,
    isOwner,
    user: currentUser,
    loading,
    error,
    setTitle,
    setContent,
    handleUpdate,
    handleAddCollaborator,
    handleRemoveCollaborator,
    handleFetchVersions,
    handleRestoreVersion,
    handleDeleteVersion,
    confirmDelete,
    versions,
    showVersions,
    setShowVersions,
    showDeleteModal,
    setShowDeleteModal,
    versionToDeleteId,
    setVersionToDeleteId,
    isRestoring,
    setIsRestoring,
    handleCloseVersions,
    editor,
    setEditor,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }
  return context;
};
