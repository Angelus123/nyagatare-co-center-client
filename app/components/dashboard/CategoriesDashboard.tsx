import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle,
  FaFileExport,
  FaImage
} from 'react-icons/fa';

interface ThemeStyles {
  mutedText: string;
  buttonBg: string;
  cardBg: string;
  borderColor: string;
  inputBg: string;
  textColor: string;
  tableHeaderBg: string;
  tableRowHover: string;
  secondaryBg: string;
}

interface Category {
  id: string;
  name: string;
  displayName: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

interface CategoriesManagementProps {
  themeStyles: ThemeStyles;
}

// Toast component
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transform transition-transform duration-300 translate-x-0 ${
      type === 'success' 
        ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
        : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {type === 'success' ? <FaCheck size={12} /> : <FaExclamationTriangle size={12} />}
        </div>
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <FaTimes size={14} />
        </button>
      </div>
    </div>
  );
};

export default function CategoriesManagement({ themeStyles }: CategoriesManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    displayName: '',
    description: '',
    image: '',
    icon: '',
    productCount: 0,
    isActive: true,
    sortOrder: 0
  });

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      console.log('Fetched categories:', data); // Debug log
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to fetch categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (category.isActive ? 'active' : 'inactive') === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Modal Handlers
  const openCreateModal = () => {
    setNewCategory({
      name: '',
      displayName: '',
      description: '',
      image: '',
      icon: '',
      productCount: 0,
      isActive: true,
      sortOrder: categories.length + 1
    });
    setIsCreateModalOpen(true);
  };

  const openViewModal = (category: Category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setNewCategory({ ...category });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    setCategoryToDelete(null);
    setNewCategory({
      name: '',
      displayName: '',
      description: '',
      image: '',
      icon: '',
      productCount: 0,
      isActive: true,
      sortOrder: 0
    });
  };

  // CRUD Operations
  const handleCreateCategory = async () => {
    setModalLoading(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCategory,
          productCount: Number(newCategory.productCount) || 0,
          sortOrder: Number(newCategory.sortOrder) || 0,
          isActive: Boolean(newCategory.isActive),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      await fetchCategories();
      closeModals();
      showToast('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      showToast('Failed to create category. Please try again.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory?.id) return;
    setModalLoading(true);
    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCategory,
          productCount: Number(newCategory.productCount) || 0,
          sortOrder: Number(newCategory.sortOrder) || 0,
          isActive: Boolean(newCategory.isActive),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      await fetchCategories();
      closeModals();
      showToast('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      showToast('Failed to update category. Please try again.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete?.id) return;
    
    setModalLoading(true);
    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      await fetchCategories();
      closeModals();
      showToast('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Failed to delete category. Please try again.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleExportCategories = () => {
    const headers = ['Display Name', 'Name', 'Description', 'Product Count', 'Is Active', 'Sort Order'];
    const csvContent = [
      headers.join(','),
      ...categories.map(category => [
        `"${category.displayName}"`,
        category.name,
        `"${category.description}"`,
        category.productCount,
        category.isActive ? 'true' : 'false',
        category.sortOrder
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `categories_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (field: keyof Category, value: string | number | boolean) => {
    setNewCategory(prev => ({ ...prev, [field]: value }));
  };

  // Delete Confirmation Modal
  const renderDeleteModal = () => {
    if (!isDeleteModalOpen || !categoryToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${themeStyles.cardBg} rounded-2xl w-full max-w-md border ${themeStyles.borderColor} shadow-2xl`}>
          {/* Header */}
          <div className={`border-b ${themeStyles.borderColor} px-6 py-4 flex justify-between items-center`}>
            <h3 className="text-xl font-bold flex items-center gap-2 text-red-600">
              <FaExclamationTriangle />
              Delete Category
            </h3>
            <button
              onClick={closeModals}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
                <FaTrash />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{categoryToDelete.displayName}</h4>
                <p className={themeStyles.mutedText}>{categoryToDelete.name}</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this category? This action cannot be undone and may affect associated products.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModals}
                disabled={modalLoading}
                className={`px-6 py-3 border cursor-pointer ${themeStyles.borderColor} ${themeStyles.textColor} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={modalLoading}
                className="bg-red-600 text-white cursor-pointer px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {modalLoading ? 'Deleting...' : (
                  <>
                    <FaTrash />
                    Delete Category
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Category Modal (Create/View/Edit)
  const renderCategoryModal = () => {
    const modalConfig = {
      create: { 
        isOpen: isCreateModalOpen, 
        title: 'Create New Category', 
        action: handleCreateCategory,
        actionText: 'Create Category'
      },
      view: { 
        isOpen: isViewModalOpen, 
        title: 'Category Details', 
        action: null,
        actionText: ''
      },
      edit: { 
        isOpen: isEditModalOpen, 
        title: 'Edit Category', 
        action: handleUpdateCategory,
        actionText: 'Update Category'
      }
    };

    const currentModal = isCreateModalOpen ? modalConfig.create : 
                        isViewModalOpen ? modalConfig.view : 
                        modalConfig.edit;

    if (!currentModal.isOpen) return null;

    const category = isViewModalOpen ? selectedCategory : newCategory;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${themeStyles.cardBg} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border ${themeStyles.borderColor} shadow-2xl`}>
          {/* Header */}
          <div className={`border-b ${themeStyles.borderColor} px-6 py-4 flex justify-between items-center sticky top-0 ${themeStyles.cardBg}`}>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {category?.icon} {currentModal.title}
            </h3>
            <button
              onClick={closeModals}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Image & Stats */}
              <div className="space-y-6">
                {/* Image Preview */}
                <div className={`border-2 border-dashed ${themeStyles.borderColor} rounded-xl p-8 text-center`}>
                  <img 
                    src={category?.image || '/images/default-category.jpg'} 
                    alt={category?.displayName} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className={themeStyles.mutedText}>Category Image</p>
                  <p className="text-sm text-gray-400 mt-2">Click to upload or drag and drop</p>
                </div>

                {/* Quick Stats */}
                {isViewModalOpen && selectedCategory && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`text-center p-4 rounded-lg ${themeStyles.secondaryBg}`}>
                      <div className="text-2xl font-bold text-blue-500">{selectedCategory.productCount}</div>
                      <div className={themeStyles.mutedText}>Products</div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${themeStyles.secondaryBg}`}>
                      <div className={`text-2xl font-bold ${selectedCategory.isActive ? 'text-green-500' : 'text-red-500'}`}>
                        {selectedCategory.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <div className={themeStyles.mutedText}>Status</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <input
                    type="text"
                    value={category?.displayName || ''}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    disabled={isViewModalOpen}
                    className={`w-full px-4 py-3 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50`}
                    placeholder="Enter display name"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Name (URL Slug)</label>
                  <input
                    type="text"
                    value={category?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={isViewModalOpen}
                    className={`w-full px-4 py-3 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50`}
                    placeholder="Enter name (lowercase, no spaces)"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={category?.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={isViewModalOpen}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 resize-none`}
                    placeholder="Describe the category..."
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium mb-2">Icon (Emoji or Icon Name)</label>
                  <input
                    type="text"
                    value={category?.icon || ''}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    disabled={isViewModalOpen}
                    className={`w-full px-4 py-3 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50`}
                    placeholder="e.g., 🎨 or FaPaintBrush"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={category?.image || ''}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    disabled={isViewModalOpen}
                    className={`w-full px-4 py-3 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Product Count & Sort Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Count</label>
                    <input
                      type="number"
                      value={category?.productCount || 0}
                      onChange={(e) => handleInputChange('productCount', parseInt(e.target.value) || 0)}
                      disabled={isViewModalOpen}
                      className={`w-full px-4 py-3 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={category?.sortOrder || 0}
                      onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                      disabled={isViewModalOpen}
                      className={`w-full px-4 py-3 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50`}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Is Active Toggle */}
                {!isViewModalOpen && (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={category?.isActive || false}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                    />
                    <label className="text-sm font-medium">Is Active</label>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!isViewModalOpen && (
              <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeModals}
                  disabled={modalLoading}
                  className={`px-6 py-3 border cursor-pointer ${themeStyles.borderColor} ${themeStyles.textColor} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  onClick={currentModal.action ?? undefined}
                  disabled={modalLoading}
                  className={`${themeStyles.buttonBg} text-white cursor-pointer px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50`}
                >
                  <FaCheck />
                  {modalLoading ? 'Saving...' : currentModal.actionText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Categories Management</h1>
            <p className={`${themeStyles.mutedText} font-bold text-white`}>Manage your store&apos;s product categories</p>
          </div>
        </div>
        <div className={`${themeStyles.cardBg} rounded-xl border ${themeStyles.borderColor} p-8 text-center`}>
          <p className={themeStyles.textColor}>Loading categories...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories Management</h1>
          <p className={`${themeStyles.mutedText} font-bold text-white`}>Organize and manage your product categories</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCategories}
            className={`${themeStyles.secondaryBg} border ${themeStyles.borderColor} ${themeStyles.textColor} px-4 py-2 rounded-lg hover:bg-gray-700/10 transition-colors flex items-center gap-2`}
          >
            <FaFileExport /> Export Categories
          </button>
          <button 
            onClick={openCreateModal}
            className={`${themeStyles.buttonBg} text-white px-4 py-2 cursor-pointer rounded-lg hover:opacity-90 transition-colors flex items-center gap-2`}
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Categories', value: totalCategories.toLocaleString(), color: 'text-amber-500' },
          { label: 'Active', value: activeCategories, color: 'text-green-500' },
          { label: 'Total Products', value: totalProducts.toLocaleString(), color: 'text-blue-500' },
        ].map((stat, index) => (
          <div key={stat.label} className={`${themeStyles.cardBg} rounded-xl p-4 border ${themeStyles.borderColor}`}>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`text-sm ${themeStyles.mutedText}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <FaSearch className={`absolute left-3 top-3 ${themeStyles.mutedText}`} />
          <input
            type="text"
            placeholder="Search categories by name..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${themeStyles.inputBg} ${themeStyles.textColor} ${themeStyles.borderColor} border focus:outline-none focus:ring-2 focus:ring-amber-500`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg ${themeStyles.inputBg} ${themeStyles.textColor} ${themeStyles.borderColor} border focus:outline-none focus:ring-2 focus:ring-amber-500`}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Categories Table */}
      <div className={`${themeStyles.cardBg} rounded-xl border ${themeStyles.borderColor} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={themeStyles.tableHeaderBg}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Display Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sort Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className={themeStyles.mutedText}>No categories found matching the current filters.</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className={themeStyles.tableRowHover}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <div className="font-medium">{category.displayName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm max-w-xs truncate" title={category.description}>
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{category.productCount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(category.isActive)}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{category.sortOrder}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => openViewModal(category)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(category)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modals */}
      {renderCategoryModal()}
      {renderDeleteModal()}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}