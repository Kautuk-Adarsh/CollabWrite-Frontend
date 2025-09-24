'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import DocumentLayout from '../../../components/docs/DocumentLayout';
import { DocumentProvider, useDocument } from '../../../context/DocumentContext';
import TextEditor from '../../../components/docs/TextEditor';

export default function DocumentPageWrapper({ params }: { params: { id: string } }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {id} = params;

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <DocumentProvider docId={id} currentUser={user} isAuthLoading={isAuthLoading}>
      <DocumentPage />
    </DocumentProvider>
  );
}

function DocumentPage() {
  const {
    document,
    loading,
    error,
    showVersions,
    setShowVersions,
    showDeleteModal,
    setShowDeleteModal,
    confirmDelete,
  } = useDocument();

  const router = useRouter();

  const handleCloseVersions = () => {
    setShowVersions(false);
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
        <button onClick={() => router.push('/dashboard')} className="mt-4 text-blue-500">Go to Dashboard</button>
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

  return (
    <DocumentLayout>
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-white text-sm font-bold">
            <span className="font-medium">Owner:</span> {document.owner.email}
          </p>
        </div>
        <TextEditor />
        <ConfirmationModal
          isOpen={showDeleteModal}
          message="Are you sure you want to delete this version?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
    </DocumentLayout>
  );

}
