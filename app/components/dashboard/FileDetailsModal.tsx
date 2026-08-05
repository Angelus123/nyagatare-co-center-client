import React from 'react';

interface Detail {
  label: string;
  value: string;
  color?: string;
}

interface FileDetailsModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const FileDetailsModal: React.FC<FileDetailsModalProps> = ({ isOpen, closeModal }) => {
  const details: Detail[] = [
    { label: 'Sender', value: 'mark@bk.rw' },
    { label: 'Recipient(s)', value: 'finance@bk.rw' },
    { label: 'Date Sent', value: '2025-06-28' },
    { label: 'Time', value: '14:03' },
    { label: 'File Name', value: 'Q2_report.pdf' },
    { label: 'File Type', value: 'PDF' },
    { label: 'Size', value: '2.4 MB' },
    { label: 'SHA-256 Hash (Original)', value: 'ae5ff19acbd8f4c2e73d...' },
    { label: 'Current Hash', value: 'mismatch detected', color: 'text-danger' },
    { label: 'Flag Status', value: 'Flagged by AI (keyword: "Account PIN")' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white border border-border-color rounded-lg w-11/12 max-w-xl max-h-[80vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border-color flex justify-between items-center">
          <h3 className="text-base font-semibold">
            <i className="fas fa-file-alt mr-2"></i> File Details
          </h3>
          <button onClick={closeModal} className="text-text-secondary text-xl">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-4">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between p-3 border-b border-border-color last:border-b-0">
              <span className="font-semibold text-text-secondary">{detail.label}:</span>
              <span className={`font-mono text-sm ${detail.color || 'text-text-primary'}`}>
                {detail.value}
              </span>
            </div>
          ))}
          <div className="mt-6 flex gap-2">
            <button className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
              <i className="fas fa-download mr-2"></i> Download File
            </button>
            <button className="bg-white border border-border-color text-text-primary px-4 py-2 rounded-lg hover:bg-hover-bg transition">
              <i className="fas fa-eye mr-2"></i> View File
            </button>
            <button className="bg-white border border-border-color text-text-primary px-4 py-2 rounded-lg hover:bg-hover-bg transition">
              <i className="fas fa-history mr-2"></i> Audit Trail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsModal;