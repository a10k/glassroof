import { useState } from 'react';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import templateMd from './template.md?raw';
import { markdownToHtml } from './markdownToHtml';
import PinPreview from './PinPreview';
import RichTextEditor from './RichTextEditor';

const initialContent = markdownToHtml(templateMd);

const FORM_ID = '1FAIpQLSeAVba3-NUR0hA1DtPu7fd3-KCQFT0m0VkOq-3YszFu_DnN0w';
const ENTRY = {
  lat: 'entry.1783660073',
  lng: 'entry.744345063',
  notes: 'entry.44724644',
};

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

const checkIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="#129865" strokeWidth="2" />
    <path
      d="M12 20l6 6 10-12"
      stroke="#129865"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Contribute({ tempPin, onAddListing }) {
  const [showModal, setShowModal] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const handleSubmit = (notesText) => {
    if (!tempPin) return;
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '16px 20px',
        height: '100%',
      }}
    >
      <PinPreview tempPin={tempPin} onRemove={() => onAddListing(null)} />
      <RichTextEditor
        initialContent={initialContent}
        disabled={!tempPin}
        onSubmit={handleSubmit}
        resetSignal={resetSignal}
      />

      <Modal
        open={showModal}
        onClose={handleReset}
        footer={
          <Button variant="primary" onClick={handleReset}>
            Done, add another
          </Button>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            textAlign: 'center',
          }}
        >
          {checkIcon}
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Opened in a new tab.</p>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>
            Your location and notes are pre-filled — just review and submit. Come back here to log
            another entry.
          </p>
        </div>
      </Modal>
    </div>
  );
}
