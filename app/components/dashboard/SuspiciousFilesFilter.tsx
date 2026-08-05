import React from 'react';

const SuspiciousFilesFilter: React.FC = () => {
  return (
    <div className="bg-white border border-border-color rounded-lg p-4 mb-8">
      <h3 className="text-base font-semibold text-primary-blue mb-4">
        <i className="fas fa-filter mr-2"></i> Suspicious Files Filter
      </h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 p-3 bg-white border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10"
          placeholder="Search files, keywords, emails..."
        />
        <button className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          <i className="fas fa-search mr-2"></i> Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-secondary">Sender Email</label>
          <input
            type="email"
            className="p-3 bg-white border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10"
            placeholder="sender@bk.rw"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-secondary">Recipient</label>
          <input
            type="email"
            className="p-3 bg-white border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10"
            placeholder="recipient@bk.rw"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-secondary">Date Range</label>
          <input
            type="date"
            className="p-3 bg-white border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-secondary">File Type</label>
          <select className="p-3 bg-white border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10">
            <option>All Types</option>
            <option>PDF</option>
            <option>XLSX</option>
            <option>DOCX</option>
            <option>ZIP</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-secondary">Integrity Status</label>
          <select className="p-3 bg-white border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10">
            <option>All Status</option>
            <option>Verified</option>
            <option>Tampered</option>
            <option>Unverified</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-secondary">Keywords</label>
          <input
            type="text"
            className="p-3 bg-white border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10"
            placeholder="password, account no."
          />
        </div>
      </div>
    </div>
  );
};

export default SuspiciousFilesFilter;