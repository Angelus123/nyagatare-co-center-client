import { 
  FaPalette, 
  FaShoppingCart, 
  FaDollarSign, 
  FaUserFriends, 
  FaStar, 
  FaBookOpen,
  FaImages
} from 'react-icons/fa';

interface MetricsCardProps {
  theme: 'light' | 'dark';
  isLoading?: boolean;
  total?: number;
  flagged?: number;
  unverified?: number;
  users?: number;
  suspicious?: number;
  pending?: number;
}

export const MetricsCard = ({ 
  theme, 
  isLoading = false,
  total = 0,
  flagged = 0,
  unverified = 0,
  users = 0,
  suspicious = 0,
  pending = 0 
}: MetricsCardProps) => {
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const skeletonBg = theme === "dark" ? "bg-gray-700" : "bg-amber-200";

  const metrics = [
    { value: total, label: "Total ArtWorks", icon: <FaPalette />, description: "Gallery collection" },
    { value: flagged, label: "Total Orders", icon: <FaShoppingCart />, description: "Completed sales" },
    { value: unverified, label: "Total Revenue", icon: <FaDollarSign />, description: "This month" },
    { value: users, label: "Active Artists", icon: <FaUserFriends />, description: "In our network" },
    { value: suspicious, label: "Featured Collections", icon: <FaStar />, description: "Curated sets" },
    // { value: pending, label: "Active Exhibitions", icon: <FaBookOpen />, description: "Live shows" }
  ];

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`relative rounded-xl px-6 py-4 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]
            ${theme === "dark"
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-lg shadow-black/30"
              : "bg-gradient-to-br from-white to-amber-50/30 border-amber-200 shadow-md shadow-amber-200/20"}
          `}
        >
          {/* Top Row: Icon + Value */}
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xl shadow">
              {metric.icon}
            </div>
            {isLoading ? (
              <div className={`${skeletonBg} rounded-full h-6 w-16 animate-pulse`}></div>
            ) : (
              <div className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {index === 2 ? formatCurrency(metric.value) : formatNumber(metric.value)}
              </div>
            )}
          </div>

          {/* Labels */}
          {isLoading ? (
            <>
              <div className={`${skeletonBg} rounded-full h-4 w-28 animate-pulse mt-3`}></div>
              <div className={`${skeletonBg} rounded-full h-3 w-20 animate-pulse mt-2`}></div>
            </>
          ) : (
            <div className="mt-4">
              <h3 className={`font-semibold text-base ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {metric.label}
              </h3>
              <p className={`${textSecondary} text-sm`}>
                {metric.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};