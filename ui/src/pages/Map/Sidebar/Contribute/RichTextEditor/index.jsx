import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Button from '../../../../../components/Button';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
      <EditorContent editor={editor} className="tiptap-editor" />
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', padding: '8px 0 20px' }}>
        <Button
          variant="primary"
          block
          disabled={disabled}
          onClick={() => onSubmit(editor.getText())}
        >
          Report anonymously
        </Button>
      </div>
    </div>
  );
}
