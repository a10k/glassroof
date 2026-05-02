import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from 'antd';
import './RichTextEditor.css';

export default function RichTextEditor({ onSubmit, disabled }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `<p>🏠 <strong>Tell us about your place...</strong></p><p></p><p>I pay <strong>$1500/month</strong> for a <strong>1-bedroom</strong> apartment. My lease started <strong>January 2024</strong>. Utilities are included, and there's parking available.</p>`,
  });

  const handleSubmit = () => {
    if (editor) {
      const html = editor.getHTML();
      onSubmit(html);
      editor.commands.clearContent();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor-container">
      <EditorContent editor={editor} className="rich-text-editor" />
      <div className="editor-toolbar">
        <Button type="primary" onClick={handleSubmit} disabled={disabled} block>
          Add Anonymously
        </Button>
      </div>
    </div>
  );
}
