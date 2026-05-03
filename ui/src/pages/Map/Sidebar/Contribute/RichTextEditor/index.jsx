import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Flex } from 'antd';
import './editor.css';

const GOOGLE_FORM_URL = 'https://forms.google.com'; // TODO: replace with actual form URL

export default function RichTextEditor({ initialContent, disabled }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
  });

  const handleSubmit = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
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
