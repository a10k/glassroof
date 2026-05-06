import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Flex } from 'antd';
import './editor.css';

export default function RichTextEditor({ initialContent, disabled, onSubmit, resetSignal }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
  });

  useEffect(() => {
    if (!editor || resetSignal === 0) return;
    editor.commands.setContent(initialContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  if (!editor) return null;

  return (
    <Flex vertical gap={12} style={{ flex: 1 }}>
      <EditorContent editor={editor} className="tiptap-editor" />
      <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px 0 20px' }}>
        <Button type="primary" onClick={() => onSubmit(editor.getText())} disabled={disabled} block>
          Submit Anonymously
        </Button>
      </div>
    </Flex>
  );
}
