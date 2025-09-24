'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

interface TextEditorToolbarProps {
  editor: Editor | null;
}

const TextEditorToolbar = ({ editor }: TextEditorToolbarProps) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [isCode, setIsCode] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateStates = () => {
      setIsBold(editor.isActive('bold'));
      setIsItalic(editor.isActive('italic'));
      setIsStrike(editor.isActive('strike'));
      setIsCode(editor.isActive('code'));
    };

    editor.on('selectionUpdate', updateStates);
    editor.on('transaction', updateStates);

    return () => {
      editor.off('selectionUpdate', updateStates);
      editor.off('transaction', updateStates);
    };
  }, [editor]);

  const toggleMark = (type: 'bold' | 'italic' | 'strike' | 'code', state: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!editor) return;
    setter(!state);
    editor.chain().focus()[!state ? 'setMark' : 'unsetMark'](type).run();
  };

  if (!editor) return null;

  return (
    <div className="flex items-center space-x-2 p-2 bg-amber-300 rounded-t-md border-b-2 border-amber-300">
      <button
        onClick={() => toggleMark('bold', isBold, setIsBold)}
        className={`p-2 rounded ${isBold ? 'bg-red-300' : 'hover:bg-red-300'}`}
      >
        Bold
      </button>
      <button
        onClick={() => toggleMark('italic', isItalic, setIsItalic)}
        className={`p-2 rounded ${isItalic ? 'bg-red-300' : 'hover:bg-red-300'}`}
      >
        Italic
      </button>
      <button
        onClick={() => toggleMark('strike', isStrike, setIsStrike)}
        className={`p-2 rounded ${isStrike ? 'bg-red-300' : 'hover:bg-red-300'}`}
      >
        Strike
      </button>
      <button
        onClick={() => toggleMark('code', isCode, setIsCode)}
        className={`p-2 rounded ${isCode ? 'bg-red-300' : 'hover:bg-red-300'}`}
      >
        Code
      </button>
    </div>
  );
};

export default TextEditorToolbar;
