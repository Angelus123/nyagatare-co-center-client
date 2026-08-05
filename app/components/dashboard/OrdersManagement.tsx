import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaShippingFast, 
  FaMoneyBillWave, 
  FaEdit,
  FaFileExport,
  FaUser,
  FaPalette,
  FaCalendar,
  FaDollarSign,
  FaCreditCard,
  FaTruck,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaExclamationTriangle 
} from 'react-icons/fa';

interface ThemeStyles {
  mutedText: string;
  secondaryBg: string;
  borderColor: string;
  textColor: string;
  cardBg: string;
  inputBg: string;
  tableHeaderBg: string;
  tableRowHover: string;
  buttonBg: string;
}

// API Response Interfaces
interface ApiUser {
  id: string;
  name: string;
  email: string;
}

interface ApiProduct {
  id: string;
  title: string;
}

interface ApiOrderItem {
  productId: string;
  product: ApiProduct;
}

interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  taxAmount: number;
  customerNote?: string;
  shippingFullName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  deliveredAt?: string;
  user: ApiUser;
  orderItems: ApiOrderItem[];
}

interface Order {
  id: string;
  orderNumber: string;
  artworkTitle: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  amount: number;
  status: 'Completed' | 'Shipped' | 'Pending' | 'Cancelled';
  orderDate: string;
  deliveryDate: string;
  payment: 'Paid' | 'Pending' | 'Refunded';
  artworkId?: string;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
}

interface OrdersManagementProps {
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

export default function OrdersManagement({ themeStyles }: OrdersManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const mapDbToComponentStatus = (dbStatus: string): Order['status'] => {
    switch (dbStatus) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'Pending';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const mapComponentToDbStatus = (compStatus: Order['status']): string => {
    switch (compStatus) {
      case 'Pending':
        return 'PENDING';
      case 'Shipped':
        return 'SHIPPED';
      case 'Completed':
        return 'DELIVERED';
      case 'Cancelled':
        return 'CANCELLED';
      default:
        return 'PENDING';
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const apiOrders: ApiOrder[] = await response.json();
      
      const mappedOrders: Order[] = apiOrders.map((order: ApiOrder) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        artworkTitle: order.orderItems?.[0]?.product?.title || 'N/A',
        customer: order.user?.name || order.shippingFullName,
        customerEmail: order.user?.email || '',
        customerPhone: order.shippingPhone || '',
        shippingAddress: [
          order.shippingFullName,
          order.shippingStreet,
          `${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}`,
          order.shippingCountry
        ].filter(Boolean).join(', '),
        amount: order.totalAmount,
        status: mapDbToComponentStatus(order.status),
        orderDate: new Date(order.createdAt).toISOString().split('T')[0],
        deliveryDate: order.deliveredAt ? new Date(order.deliveredAt).toISOString().split('T')[0] : '',
        payment: order.paidAt ? 'Paid' : 'Pending',
        artworkId: order.orderItems?.[0]?.productId,
        shippingMethod: 'Standard Shipping',
        trackingNumber: order.trackingNumber,
        notes: order.customerNote,
      }));
      
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentColor = (payment: string) => {
    return payment === 'Paid' 
      ? 'text-green-600 dark:text-green-400' 
      : payment === 'Pending'
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.artworkTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Modal Handlers
  const openViewModal = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditedOrder({ ...order });
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedOrder(null);
    setEditedOrder(null);
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const apiData = {
        status: mapComponentToDbStatus(newStatus),
      };
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      showToast(`Order status updated to ${newStatus}`);
      await fetchOrders();
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update order status', 'error');
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder || !editedOrder) return;
    setModalLoading(true);
    try {
      const apiData: Partial<ApiOrder> = {
        status: mapComponentToDbStatus(editedOrder.status),
        customerNote: editedOrder.notes,
      };

      // Handle delivery date
      if (editedOrder.deliveryDate) {
        apiData.deliveredAt = new Date(editedOrder.deliveryDate).toISOString();
      }

      // Handle payment
      if (editedOrder.payment !== selectedOrder.payment) {
        apiData.paidAt = editedOrder.payment === 'Paid' ? new Date().toISOString() : undefined;
      }

      // Remove undefined fields
      Object.keys(apiData).forEach(key => {
        if (apiData[key as keyof ApiOrder] === undefined) {
          delete apiData[key as keyof ApiOrder];
        }
      });

      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      showToast('Order updated successfully!');
      await fetchOrders();
      closeModals();
    } catch (err) {
      console.error('Error updating order:', err);
      showToast('Failed to update order. Please try again.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleExportOrders = () => {
    const headers = ['Order ID', 'Artwork', 'Customer', 'Amount', 'Status', 'Payment', 'Order Date', 'Delivery Date'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.orderNumber,
        `"${order.artworkTitle}"`,
        `"${order.customer}"`,
        order.amount,
        order.status,
        order.payment,
        order.orderDate,
        order.deliveryDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (field: keyof Order, value: string | number | boolean) => {
    if (editedOrder) {
      setEditedOrder(prev => ({ ...prev, [field]: value } as Order));
    }
  };

  // Modal Component
  const renderModal = () => {
    const isOpen = isViewModalOpen || isEditModalOpen;
    const isView = isViewModalOpen;
    const order = isView ? selectedOrder : editedOrder;

    if (!isOpen || !order) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className={`${themeStyles.cardBg} rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border ${themeStyles.borderColor} shadow-2xl`}>
          {/* Header */}
          <div className={`border-b ${themeStyles.borderColor} px-6 py-4 flex justify-between items-center sticky top-0 ${themeStyles.cardBg}`}>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FaFileExport className="text-amber-500" />
              {isView ? 'Order Details' : 'Edit Order'}
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
              {/* Left Column - Order & Customer Info */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className={`border ${themeStyles.borderColor} rounded-xl p-4`}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <FaFileExport className="text-blue-500" />
                    Order Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={themeStyles.mutedText}>Order ID:</span>
                      <span className="font-mono font-semibold">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeStyles.mutedText}>Artwork:</span>
                      <span className="font-semibold flex items-center gap-2">
                        <FaPalette className="text-amber-500" />
                        {order.artworkTitle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeStyles.mutedText}>Amount:</span>
                      <span className="font-semibold text-green-600 flex items-center gap-2">
                        <FaDollarSign />
                        {order.amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeStyles.mutedText}>Order Date:</span>
                      <span className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        {order.orderDate && new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className={`border ${themeStyles.borderColor} rounded-xl p-4`}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <FaUser className="text-purple-500" />
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className={themeStyles.mutedText}>Customer Name</div>
                      <div className="font-semibold">{order.customer}</div>
                    </div>
                    <div>
                      <div className={themeStyles.mutedText}>Email</div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        {order.customerEmail}
                      </div>
                    </div>
                    <div>
                      <div className={themeStyles.mutedText}>Phone</div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        {order.customerPhone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Shipping & Actions */}
              <div className="space-y-6">
                {/* Shipping Information */}
                <div className={`border ${themeStyles.borderColor} rounded-xl p-4`}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <FaTruck className="text-green-500" />
                    Shipping Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className={themeStyles.mutedText}>Shipping Address</div>
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-red-400 mt-1 flex-shrink-0" />
                        <div>{order.shippingAddress}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className={themeStyles.mutedText}>Shipping Method</div>
                        {isView ? (
                          <div>{order.shippingMethod}</div>
                        ) : (
                          <select
                            value={order.shippingMethod || ''}
                            onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          >
                            <option value="Standard Shipping">Standard Shipping</option>
                            <option value="Express Shipping">Express Shipping</option>
                            <option value="Overnight Shipping">Overnight Shipping</option>
                            <option value="International Shipping">International Shipping</option>
                          </select>
                        )}
                      </div>
                      <div>
                        <div className={themeStyles.mutedText}>Delivery Date</div>
                        {isView ? (
                          <div>{order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}</div>
                        ) : (
                          <input
                            type="date"
                            value={order.deliveryDate || ''}
                            onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          />
                        )}
                      </div>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <div className={themeStyles.mutedText}>Tracking Number</div>
                        <div className="font-mono">{order.trackingNumber}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Payment */}
                <div className={`border ${themeStyles.borderColor} rounded-xl p-4`}>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <FaCreditCard className="text-amber-500" />
                    Status & Payment
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className={themeStyles.mutedText}>Order Status</div>
                      {isView ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || '')}`}>
                          {order.status}
                        </span>
                      ) : (
                        <select
                          value={order.status || ''}
                          onChange={(e) => handleInputChange('status', e.target.value as Order['status'])}
                          className={`w-full px-3 py-2 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>
                    <div>
                      <div className={themeStyles.mutedText}>Payment Status</div>
                      {isView ? (
                        <span className={`font-medium ${getPaymentColor(order.payment || '')}`}>
                          {order.payment}
                        </span>
                      ) : (
                        <select
                          value={order.payment || ''}
                          onChange={(e) => handleInputChange('payment', e.target.value as Order['payment'])}
                          className={`w-full px-3 py-2 rounded-lg border ${themeStyles.borderColor} ${themeStyles.inputBg} ${themeStyles.textColor} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className={`border ${themeStyles.borderColor} rounded-xl p-4`}>
                    <h4 className="font-semibold mb-2">Order Notes</h4>
                    <p className={themeStyles.mutedText}>{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!isView && (
              <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={closeModals}
                  className={`px-6 py-3 border ${themeStyles.borderColor} ${themeStyles.textColor} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateOrder}
                  disabled={modalLoading}
                  className={`${themeStyles.buttonBg} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50`}
                >
                  <FaCheck />
                  {modalLoading ? 'Updating...' : 'Update Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Calculate real-time stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'Completed').length;
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const totalRevenue = orders.filter(order => order.payment === 'Paid').reduce((sum, order) => sum + order.amount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Orders Management</h1>
            <p className={`${themeStyles.mutedText} font-bold text-white`}>Manage customer orders and track shipments</p>
          </div>
        </div>
        <div className={`${themeStyles.cardBg} rounded-xl border ${themeStyles.borderColor} p-8 text-center`}>
          <p className={themeStyles.textColor}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>
          <p className={`${themeStyles.mutedText} font-bold text-white`}>Manage customer orders and track shipments</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportOrders}
            className={`${themeStyles.secondaryBg} border ${themeStyles.borderColor} ${themeStyles.textColor} px-4 py-2 rounded-lg hover:bg-gray-700/10 transition-colors flex items-center gap-2`}
          >
            <FaMoneyBillWave /> Export Orders
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: totalOrders.toLocaleString(), color: 'text-blue-500' },
          { label: 'Completed', value: completedOrders, color: 'text-green-500' },
          { label: 'Pending', value: pendingOrders, color: 'text-yellow-500' },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-amber-500' },
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
            placeholder="Search orders by customer, artwork, or order ID..."
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
          <option value="Completed">Completed</option>
          <option value="Shipped">Shipped</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className={`${themeStyles.cardBg} rounded-xl border ${themeStyles.borderColor} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={themeStyles.tableHeaderBg}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Artwork</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <p className={themeStyles.mutedText}>No orders found matching the current filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className={themeStyles.tableRowHover}>
                    <td className="px-6 py-4 font-mono text-sm font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.artworkTitle}</div>
                    </td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 font-semibold">${order.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status === 'Shipped' && <FaShippingFast className="mr-1" />}
                        {order.status === 'Completed' && <FaCheck className="mr-1" />}
                        {order.status === 'Cancelled' && <FaTimes className="mr-1" />}
                        {order.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-medium ${getPaymentColor(order.payment)}`}>
                      {order.payment}
                    </td>
                    <td className="px-6 py-4 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openViewModal(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" 
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => openEditModal(order)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                          title="Edit Order"
                        >
                          <FaEdit />
                        </button>
                        {order.status === 'Pending' && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors" 
                            title="Mark as Shipped"
                          >
                            <FaShippingFast />
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                            title="Mark as Completed"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modal */}
      {renderModal()}

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