import React from 'react';

interface File {
  timestamp: string;
  sender: string;
  recipient: string;
  fileName: string;
  status: { type: string; label: string; icon: string; color: string };
  integrity: { label: string; icon: string; color: string };
  action: { label: string; icon: string; color: string; onClick?: () => void };
}

interface RecentFileActivityProps {
  openModal: () => void;
}

const RecentFileActivity: React.FC<RecentFileActivityProps> = ({ openModal }) => {
  const files: File[] = [
    {
      timestamp: '2025-06-28 14:22',
      sender: 'jane@bk.rw',
      recipient: 'john@bk.rw',
      fileName: 'loan_data.xlsx',
      status: { type: 'sent', label: 'Sent', icon: 'fa-check', color: 'bg-green-100 text-success' },
      integrity: { label: 'Verified', icon: 'fa-shield-check', color: 'text-success' },
      action: { label: 'View', icon: 'fa-eye', color: 'bg-white border border-border-color text-text-primary', onClick: openModal },
    },
    {
      timestamp: '2025-06-28 14:03',
      sender: 'mark@bk.rw',
      recipient: 'finance@bk.rw',
      fileName: 'Q2_report.pdf',
      status: { type: 'flagged', label: 'Flagged', icon: 'fa-flag', color: 'bg-yellow-100 text-warning' },
      integrity: { label: 'Tampered', icon: 'fa-exclamation-triangle', color: 'text-danger' },
      action: { label: 'Investigate', icon: 'fa-search', color: 'bg-danger text-white' },
    },
    {
      timestamp: '2025-06-28 13:50',
      sender: 'eva@bk.rw',
      recipient: 'security@bk.rw',
      fileName: 'passwords.txt',
      status: { type: 'blocked', label: 'Blocked', icon: 'fa-ban', color: 'bg-red-100 text-danger' },
      integrity: { label: 'Failed Hash', icon: 'fa-times', color: 'text-danger' },
      action: { label: 'Alert Sent', icon: 'fa-bell', color: 'bg-danger text-white' },
    },
  ];

  return (
    <div className="bg-white border border-border-color rounded-lg mb-8 overflow-hidden">
      <div className="p-4 border-b border-border-color flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary-blue">
          <i className="fas fa-history mr-2"></i> Recent File Activity
        </h2>
        <div className="flex gap-2">
          <button className="bg-white border border-border-color text-text-primary px-4 py-2 rounded-lg hover:bg-hover-bg transition">
            <i className="fas fa-download mr-2"></i> Download Metadata
          </button>
          <button className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
            <i className="fas fa-refresh mr-2"></i> Refresh
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-bg-light">
              <th className="p-4 text-left font-semibold text-primary-blue">Timestamp</th>
              <th className="p-4 text-left font-semibold text-primary-blue">Sender Email</th>
              <th className="p-4 text-left font-semibold text-primary-blue">Recipient(s)</th>
              <th className="p-4 text-left font-semibold text-primary-blue">File Name</th>
              <th className="p-4 text-left font-semibold text-primary-blue">Status</th>
              <th className="p-4 text-left font-semibold text-primary-blue">Integrity</th>
              <th className="p-4 text-left font-semibold text-primary-blue">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index} className="hover:bg-hover-bg transition">
                <td className="p-4">{file.timestamp}</td>
                <td className="p-4">{file.sender}</td>
                <td className="p-4">{file.recipient}</td>
                <td className="p-4">{file.fileName}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${file.status.color}`}>
                    <i className={`fas ${file.status.icon}`}></i> {file.status.label}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 ${file.integrity.color}`}>
                    <i className={`fas ${file.integrity.icon}`}></i> {file.integrity.label}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    className={`px-4 py-2 rounded-lg hover:-translate-y-0.5 transition ${file.action.color}`}
                    onClick={file.action.onClick}
                  >
                    <i className={`fas ${file.action.icon} mr-2`}></i> {file.action.label}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentFileActivity;