// components/dashboard/Sidebar.tsx
import { JSX, useState } from "react";
import { 
  FaHome,  
  FaStar, 
  FaUserFriends, 
  FaBookOpen, 
  FaBell, 
  FaChartLine, 
  FaCog, 
  FaShoppingCart,
  FaPalette,
  FaStore,
  FaLayerGroup,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from "react-icons/fa";

export type MenuItem = {
  label: string;
  icon: JSX.Element;
  id: string;
  active: boolean;
}

type Theme = "light" | "dark";

interface ThemeStyles {
  secondaryBg: string;
  borderColor: string;
  textColor: string;
}

interface SidebarProps {
  theme: Theme;
  themeStyles: ThemeStyles;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: <FaHome />, id: "dashboard", active: true },
  { label: "Orders", icon: <FaShoppingCart />, id: "orders", active: false },
  { label: "Artworks", icon: <FaPalette />, id: "artworks", active: false },
  { label: "Categories", icon: <FaLayerGroup />, id: "categories", active: false },
  { label: "Featured Collections", icon: <FaStar />, id: "collections", active: false },
  { label: "Exhibitions", icon: <FaBookOpen />, id: "exhibitions", active: false },
  { label: "Analytics", icon: <FaChartLine />, id: "analytics", active: false },
  { label: "Notifications", icon: <FaBell />, id: "notifications", active: false },
  { label: "Settings", icon: <FaCog />, id: "settings", active: false },
];

export default function Sidebar({ theme, themeStyles, activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"} 
      ${themeStyles.secondaryBg} border-r ${themeStyles.borderColor} 
      sticky top-15 h-[calc(100vh-80px)] overflow-y-auto transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h2 className={`text-lg font-semibold ${themeStyles.textColor} flex items-center gap-2`}>
            <FaStore className="text-amber-500" />
            Admin Panel
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-900/20 cursor-pointer"
        >
          {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </button>
      </div>

      {/* Menu */}
      <nav className="py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left flex items-center cursor-pointer gap-3 px-6 py-3 font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? theme === "dark"
                      ? "text-amber-400 bg-amber-900/20 border-r-2 border-amber-400"
                      : "text-amber-600 bg-amber-50 border-r-2 border-amber-500"
                    : `${themeStyles.textColor} hover:text-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10`
                }`}
              >
                <span className={`text-lg ${
                  activeTab === item.id ? 'text-amber-500' : 'text-gray-400'
                }`}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
