import { Flex } from 'antd';
import templateMd from './template.md?raw';
import { markdownToHtml } from './markdownToHtml';
import PinPreview from './PinPreview';
import RichTextEditor from './RichTextEditor';

const initialContent = markdownToHtml(templateMd);

export default function Contribute({ tempPin, onAddListing }) {
  return (
    <Flex vertical gap={14} style={{ padding: '16px 20px', height: '100%' }}>
      <PinPreview tempPin={tempPin} onRemove={() => onAddListing(null)} />
      <RichTextEditor initialContent={initialContent} disabled={!tempPin} />
    </Flex>
  );
}
