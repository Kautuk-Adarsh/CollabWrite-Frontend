'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDocument } from '../../context/DocumentContext';
import TextEditorToolbar from './TextEditorToolbar';

const TextEditor = () => {
  const { content, setContent, setEditor } = useDocument();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[80vh] p-4 border rounded-b-md',
      },
    },
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    immediatelyRender: false, 
  });

  useEffect(() => {
    if (editor) setEditor(editor);
  }, [editor, setEditor]);

  if (!isClient || !editor) return null;

  return (
    <div>
      <TextEditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;
