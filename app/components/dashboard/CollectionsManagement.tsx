import { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaEye, FaStar, FaUsers, FaPalette } from 'react-icons/fa';

interface ThemeStyles {
  mutedText: string;
  buttonBg: string;
  cardBg: string;
  borderColor: string;
  inputBg: string;
  textColor: string;
  tableHeaderBg: string;
  tableRowHover: string;
}
interface CollectionsManagementProps {
  themeStyles: ThemeStyles;
}

export default function CollectionsManagement({ themeStyles }: CollectionsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const collections = [
    { 
      id: 1, 
      name: 'Emerging Artists 2024', 
      curator: 'Sarah Wilson', 
      artworks: 15, 
      artists: 8,
      views: 2450,
      featured: true,
      status: 'Active',
      created: '2024-01-01'
    },
    { 
      id: 2, 
      name: 'Abstract Expressions', 
      curator: 'James Wilson', 
      artworks: 12, 
      artists: 6,
      views: 1876,
      featured: true,
      status: 'Active',
      created: '2023-11-15'
    },
    { 
      id: 3, 
      name: 'Digital Revolution', 
      curator: 'Maria Rodriguez', 
      artworks: 8, 
      artists: 5,
      views: 1567,
      featured: false,
      status: 'Active',
      created: '2024-01-10'
    },
    { 
      id: 4, 
      name: 'Urban Landscapes', 
      curator: 'Robert Kim', 
      artworks: 10, 
      artists: 7,
      views: 1234,
      featured: false,
      status: 'Draft',
      created: '2023-12-20'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.curator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Collections Management</h1>
          <p className={`${themeStyles.mutedText} font-bold text-white`}>Curate and manage featured art collections</p>
        </div>
        <button className={`${themeStyles.buttonBg} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center gap-2`}>
          <FaPlus /> Create Collection
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Collections', value: '12', color: 'text-amber-500' },
          { label: 'Featured', value: '5', color: 'text-yellow-500' },
          { label: 'Total Artworks', value: '145', color: 'text-blue-500' },
          { label: 'Total Views', value: '12.4K', color: 'text-green-500' },
        ].map((stat, index) => (
          <div key={stat.label} className={`${themeStyles.cardBg} rounded-xl p-4 border ${themeStyles.borderColor}`}>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`text-sm ${themeStyles.mutedText}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FaSearch className={`absolute left-3 top-3 ${themeStyles.mutedText}`} />
          <input
            type="text"
            placeholder="Search collections by name or curator..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${themeStyles.inputBg} ${themeStyles.textColor} ${themeStyles.borderColor} border focus:outline-none focus:ring-2 focus:ring-amber-500`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection) => (
          <div key={collection.id} className={`${themeStyles.cardBg} rounded-xl border ${themeStyles.borderColor} overflow-hidden hover:shadow-lg transition-shadow`}>
            {/* Collection Header */}
            <div className="relative h-32 bg-gradient-to-br from-amber-500 to-orange-500">
              {collection.featured && (
                <div className="absolute top-3 right-3">
                  <FaStar className="text-yellow-300 text-xl" />
                </div>
              )}
              <div className="absolute bottom-3 left-3 text-white">
                <h3 className="font-bold text-lg">{collection.name}</h3>
                <p className="text-sm opacity-90">by {collection.curator}</p>
              </div>
            </div>

            {/* Collection Details */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                    <FaPalette />
                  </div>
                  <div className="font-semibold">{collection.artworks}</div>
                  <div className={`text-xs ${themeStyles.mutedText}`}>Artworks</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                    <FaUsers />
                  </div>
                  <div className="font-semibold">{collection.artists}</div>
                  <div className={`text-xs ${themeStyles.mutedText}`}>Artists</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                    <FaEye />
                  </div>
                  <div className="font-semibold">{collection.views}</div>
                  <div className={`text-xs ${themeStyles.mutedText}`}>Views</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}>
                  {collection.status}
                </span>
                <span className={`text-xs ${themeStyles.mutedText}`}>
                  Created: {new Date(collection.created).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-amber-500 text-white py-2 px-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 text-sm">
                  <FaEye /> View
                </button>
                <button className="flex-1 border border-amber-500 text-amber-500 py-2 px-3 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors flex items-center justify-center gap-2 text-sm">
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}