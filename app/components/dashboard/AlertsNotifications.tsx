import React from 'react';

interface Alert {
  icon: string;
  title: string;
  details: string;
  color: string;
  button: { label: string; color: string };
}

const AlertsNotifications: React.FC = () => {
  const alerts: Alert[] = [
    {
      icon: 'fa-exclamation-triangle',
      title: 'File hash mismatch detected',
      details: 'File: sales.xls | Time: 2025-06-27 13:00 | Status: Unresolved',
      color: 'bg-yellow-100 text-warning',
      button: { label: 'Investigate', color: 'bg-primary-blue text-white' },
    },
    {
      icon: 'fa-lock',
      title: 'Unauthorized user tried to download',
      details: 'File: payroll.pdf | Time: 2025-06-27 12:30 | Status: Blocked',
      color: 'bg-red-100 text-danger',
      button: { label: 'Review', color: 'bg-white border border-border-color text-text-primary' },
    },
    {
      icon: 'fa-brain',
      title: 'Sensitive keyword detected: "account no."',
      details: 'File: bank.txt | Time: 2025-06-26 18:12 | Status: Investigating',
      color: 'bg-blue-100 text-accent-blue',
      button: { label: 'Review AI Flag', color: 'bg-yellow-600 text-white' },
    },
  ];

  return (
    <div className="bg-white border border-border-color rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border-color flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary-blue">
          <i className="fas fa-bell mr-2"></i> Alerts & Notifications
        </h2>
        <button className="bg-white border border-border-color text-text-primary px-4 py-2 rounded-lg hover:bg-hover-bg transition">
          <i className="fas fa-check-double mr-2"></i> Mark All Read
        </button>
      </div>
      <div>
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border-b border-border-color last:border-b-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${alert.color}`}>
              <i className={`fas ${alert.icon}`}></i>
            </div>
            <div className="flex-1">
              <div className="font-semibold">{alert.title}</div>
              <div className="text-sm text-text-secondary">{alert.details}</div>
            </div>
            <button className={`px-4 py-2 rounded-lg hover:-translate-y-0.5 transition ${alert.button.color}`}>
              {alert.button.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsNotifications;