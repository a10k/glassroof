import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Flex } from 'antd';
import './editor.css';

export default function RichTextEditor({ initialContent, onSubmit, disabled }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
  });

  const handleSubmit = () => {
    if (!editor) return;
    onSubmit(editor.getHTML());
    editor.commands.clearContent();
  };

  if (!editor) return null;

  return (
    <Flex vertical gap={12} style={{ flex: 1 }}>
      <EditorContent editor={editor} className="tiptap-editor" />
      <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px 0 20px' }}>
        <Button type="primary" onClick={handleSubmit} disabled={disabled} block>
          Submit Anonymously
        </Button>
      </div>
    </Flex>
  );
}
