import Modal from './Modal.jsx';

export default function ThanksModal({ onClose }) {
  return (
    <Modal onClose={onClose} size="small">
      <div className="thanks">
        <div className="thanks-icon" aria-hidden="true">❤️</div>
        <h2>Special Thanks</h2>
        <p>
          A huge thank you to the <strong>PS5JBPinas Community</strong> for
          contributing in compressing and uploading PFS games that make this
          catalog possible.
        </p>
        <button type="button" className="btn primary" onClick={onClose}>
          Continue
        </button>
      </div>
    </Modal>
  );
}
