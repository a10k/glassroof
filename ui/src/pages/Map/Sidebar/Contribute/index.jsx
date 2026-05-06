import { useState } from 'react';
import { Flex, Modal, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import templateMd from './template.md?raw';
import { markdownToHtml } from './markdownToHtml';
import PinPreview from './PinPreview';
import RichTextEditor from './RichTextEditor';

const { Text } = Typography;

const initialContent = markdownToHtml(templateMd);

// ─── Google Form config ───────────────────────────────────────────────────────
// After creating the form, replace FORM_ID and the three entry IDs.
// How to get entry IDs: open your form → ⋮ → "Get pre-filled link" → fill
// dummy values → copy the URL → read the entry.XXXXXXXXX= param names.
const FORM_ID = '1FAIpQLSeAVba3-NUR0hA1DtPu7fd3-KCQFT0m0VkOq-3YszFu_DnN0w';
const ENTRY = {
  lat: 'entry.1783660073',
  lng: 'entry.744345063',
  notes: 'entry.44724644',
};
// ─────────────────────────────────────────────────────────────────────────────

function buildFormUrl(lat, lng, notes) {
  const base = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`;
  const params = new URLSearchParams({
    usp: 'pp_url',
    [ENTRY.lat]: lat.toFixed(6),
    [ENTRY.lng]: lng.toFixed(6),
    [ENTRY.notes]: notes,
  });
  return `${base}?${params}`;
}

export default function Contribute({ tempPin, onAddListing }) {
  const [showModal, setShowModal] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const handleSubmit = (notesText) => {
    const url = buildFormUrl(tempPin.lat, tempPin.lng, notesText);
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowModal(true);
  };

  const handleReset = () => {
    setShowModal(false);
    setResetSignal((s) => s + 1);
    onAddListing(null);
  };

  return (
    <Flex vertical gap={14} style={{ padding: '16px 20px', height: '100%' }}>
      <PinPreview tempPin={tempPin} onRemove={() => onAddListing(null)} />
      <RichTextEditor
        initialContent={initialContent}
        disabled={!tempPin}
        onSubmit={handleSubmit}
        resetSignal={resetSignal}
      />
      <Modal
        open={showModal}
        onOk={handleReset}
        onCancel={handleReset}
        okText="Got it, start fresh"
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
      >
        <Flex vertical align="center" gap={12} style={{ padding: '8px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 40, color: '#52c41a' }} />
          <Text strong style={{ fontSize: 16 }}>
            Form opened in a new tab
          </Text>
          <Text type="secondary" style={{ textAlign: 'center', lineHeight: 1.6 }}>
            Fill in the details and hit Submit there. Your location and notes are already
            pre-filled. Click below to clear this form and add another contribution.
          </Text>
        </Flex>
      </Modal>
    </Flex>
  );
}
