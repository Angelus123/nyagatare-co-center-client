import { FaChartPie, FaChartBar, FaChartLine } from 'react-icons/fa';

export const FileIntegritySummary = () => (
  <div className="bg-white border border-gray-200 rounded-xl mb-8 overflow-hidden">
    <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
        <FaChartPie /> File Integrity Summary
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div className="h-48 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 italic">
        <div className="text-center">
          <FaChartPie className="text-3xl mb-2 mx-auto" />
          File Status Distribution<br />
          <small className="text-xs">(Verified, Tampered, Pending)</small>
        </div>
      </div>
      <div className="h-48 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 italic">
        <div className="text-center">
          <FaChartBar className="text-3xl mb-2 mx-auto" />
          File Types Breakdown<br />
          <small className="text-xs">(PDF, DOCX, XLSX, ZIP)</small>
        </div>
      </div>
      <div className="h-48 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 italic">
        <div className="text-center">
          <FaChartLine className="text-3xl mb-2 mx-auto" />
          File Volume Trends<br />
          <small className="text-xs">(Last 7 days)</small>
        </div>
      </div>
    </div>
  </div>
);