import { useState } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaUsers, FaShoppingBag, FaPalette, FaEye, FaHeart } from 'react-icons/fa';

interface ThemeStyles {
  secondaryBg: string;
  mutedText: string;
  buttonBg: string;
  cardBg: string;
  borderColor: string;
  inputBg: string;
  textColor: string;
  tableHeaderBg: string;
  tableRowHover: string;
}

interface AnalyticsDashboardProps {
  themeStyles: ThemeStyles ;
}

export default function AnalyticsDashboard({  themeStyles }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('30d');

  const analyticsData = {
    overview: [
      { label: 'Total Visitors', value: '12,458', change: '+15%', icon: <FaUsers />, color: 'text-blue-500' },
      { label: 'Page Views', value: '45,672', change: '+22%', icon: <FaEye />, color: 'text-green-500' },
      { label: 'Artwork Likes', value: '2,345', change: '+18%', icon: <FaHeart />, color: 'text-red-500' },
      { label: 'Conversion Rate', value: '3.2%', change: '+0.8%', icon: <FaShoppingBag />, color: 'text-amber-500' },
    ],
    topArtworks: [
      { title: 'Ocean Waves', views: 1567, likes: 124, conversion: '4.2%' },
      { title: 'Sunset Dreams', views: 1247, likes: 89, conversion: '3.8%' },
      { title: 'Abstract Harmony', views: 892, likes: 67, conversion: '3.1%' },
      { title: 'Mountain Peak', views: 734, likes: 45, conversion: '2.7%' },
    ],
    trafficSources: [
      { source: 'Direct', percentage: 45, color: 'bg-amber-500' },
      { source: 'Social Media', percentage: 25, color: 'bg-blue-500' },
      { source: 'Search', percentage: 20, color: 'bg-green-500' },
      { source: 'Referral', percentage: 10, color: 'bg-purple-500' },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className={`${themeStyles.mutedText} font-bold text-white`}>Comprehensive insights into your gallery performance</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`px-4 py-2 rounded-lg ${themeStyles.inputBg} ${themeStyles.textColor} ${themeStyles.borderColor} border focus:outline-none focus:ring-2 focus:ring-amber-500`}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.overview.map((stat, index) => (
          <div key={stat.label} className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor} shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeStyles.mutedText}`}>{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'} mt-1`}>
                  {stat.change} from previous period
                </p>
              </div>
              <div className={`text-3xl ${stat.color} bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart Placeholder */}
        <div className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Visitor Analytics</h3>
            <div className="flex gap-2 text-sm">
              <button className="px-3 py-1 rounded-lg bg-amber-500 text-white">Visitors</button>
              <button className={`px-3 py-1 rounded-lg ${themeStyles.secondaryBg} border ${themeStyles.borderColor}`}>Page Views</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-4xl text-amber-500 mx-auto mb-2" />
              <p className={themeStyles.mutedText}>Visitor trends chart</p>
              <p className="text-sm text-gray-400">(Chart visualization would be implemented here)</p>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor}`}>
          <h3 className="text-lg font-semibold mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={source.source} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{source.source}</span>
                  <span>{source.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${source.color} transition-all duration-1000`}
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Artworks */}
      <div className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor}`}>
        <h3 className="text-lg font-semibold mb-6">Top Performing Artworks</h3>
        <div className="space-y-4">
          {analyticsData.topArtworks.map((artwork, index) => (
            <div key={artwork.title} className="flex items-center justify-between p-4 rounded-lg hover:bg-amber-50/50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
                  <FaPalette />
                </div>
                <div>
                  <div className="font-medium">{artwork.title}</div>
                  <div className="flex gap-4 text-sm mt-1">
                    <span className="flex items-center gap-1">
                      <FaEye className="text-blue-500" /> {artwork.views} views
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <FaHeart /> {artwork.likes} likes
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-amber-600">{artwork.conversion}</div>
                <div className={`text-xs ${themeStyles.mutedText}`}>Conversion Rate</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor} text-center`}>
          <FaChartBar className="text-3xl text-blue-500 mx-auto mb-3" />
          <div className="text-2xl font-bold">2.4 mins</div>
          <div className={`text-sm ${themeStyles.mutedText}`}>Avg. Session Duration</div>
        </div>
        <div className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor} text-center`}>
          <FaChartPie className="text-3xl text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold">68%</div>
          <div className={`text-sm ${themeStyles.mutedText}`}>Return Visitor Rate</div>
        </div>
        <div className={`${themeStyles.cardBg} rounded-2xl p-6 border ${themeStyles.borderColor} text-center`}>
          <FaShoppingBag className="text-3xl text-amber-500 mx-auto mb-3" />
          <div className="text-2xl font-bold">$124.50</div>
          <div className={`text-sm ${themeStyles.mutedText}`}>Avg. Order Value</div>
        </div>
      </div>
    </div>
  );
}