import React, { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { getAllOrder, getStatusOrderGHN } from '../../utils/orderService';

const ghnStatusMap = {
    ready_to_pick: 'Chờ lấy hàng',
    picking: 'Đang lấy hàng',
    picked: 'Đã lấy hàng',
    transporting: 'Đang vận chuyển',
    delivering: 'Đang giao',
    delivered: 'Đã giao',
    return: 'Hoàn hàng',
    cancel: 'Đã hủy',
};

const shippingStatusColor = (status) => {
    switch (status) {
        case 'cancel': return 'bg-red-100 text-red-600';
        case 'delivered': return 'bg-green-100 text-green-700';
        case 'ready_to_pick': return 'bg-blue-100 text-blue-700';
        case 'delivering': return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const ordersPerPage = 10;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrdersWithStatus = async () => {
            try {
                setLoading(true);
                const res = await getAllOrder();
                const orders = res?.orders || [];

                const ordersWithShipping = await Promise.all(
                    orders.map(async (order) => {
                        let status = 'pending';
                        let label = 'Chờ xử lý';
                        if (order.OrderId && order.orderCode !== null) {
                            const result = await getStatusOrderGHN(order.OrderId);
                            status = result?.data?.status || 'pending';
                            label = ghnStatusMap[status] || status;
                        }

                        return {
                            ...order,
                            shippingStatus: status,
                            shippingLabel: label,
                        };
                    })
                );
                // 🔽 Sắp xếp theo thời gian tạo mới nhất
                const sortedOrders = ordersWithShipping.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
                setOrders(ordersWithShipping);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }


        };

        fetchOrdersWithStatus();
    }, []);
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const filteredOrders = orders.filter(order =>
        order.shippingStatus?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === '' || order.shippingStatus === statusFilter)
    );

    const indexOfLast = currentPage * ordersPerPage;
    const indexOfFirst = indexOfLast - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
        <div className="p-8 w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Order</h2>
                <button className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                    <Download className="w-5 h-5 mr-2" /> Export
                </button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
                <select
                    className="border rounded px-4 py-2 text-base"
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Shipping Status</option>
                    {Object.entries(ghnStatusMap).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>

                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2 border rounded w-full text-base"
                        placeholder="Search by order code..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full text-base divide-y divide-gray-200">
                    <thead className="bg-slate-700 text-white text-base">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Mã đơn hàng</th>
                            <th className="px-4 py-3 font-semibold">Mã khách hàng</th>
                            <th className="px-4 py-3 font-semibold">Order Status</th>
                            <th className="px-4 py-3 font-semibold">Tổng tiền</th>
                            <th className="px-4 py-3 font-semibold">Mã vận đơn</th>
                            <th className="px-4 py-3 font-semibold">Mã giảm giá</th>
                            <th className="px-4 py-3 font-semibold">Ngày tạo đơn</th>
                            <th className="px-4 py-3 font-semibold">Xem chi tiết</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentOrders.map((order, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-center" >{order.orderCode}</td>
                                <td className="px-4 py-3 text-center">SNEAKERCUSTOMER{order.userId}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 rounded-full font-semibold text-center ${shippingStatusColor(order.shippingStatus)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-center" >{order.totalPrice?.toLocaleString('vi-VN') || 'N/A'}</td>
                                <td className="px-4 py-3 font-mono text-center">{order.shippingCode || 'N/A'}</td>
                                <td className="px-4 py-3 text-center">{order.promotionId || 'N/A'}</td>
                                <td className="px-4 py-3 text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        className="text-indigo-600 font-semibold hover:underline"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-base text-gray-700">
                <span>
                    Trang {indexOfFirst + 1} gồm {Math.min(indexOfLast, filteredOrders.length)} trên {filteredOrders.length} kết quả
                </span>
                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-4 py-2 rounded-lg ${currentPage === idx + 1
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'}`}
                            onClick={() => setCurrentPage(idx + 1)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h3>
                        <ul className="space-y-4 max-h-96 overflow-y-auto">
                            {selectedOrder.orderdetails?.map((item, idx) => (
                                <li key={idx} className="flex gap-4 items-center border-b pb-3">
                                    <img src={item.product?.productImage} alt="product" className="w-16 h-16 rounded object-cover" />
                                    <div>
                                        <p className="font-semibold text-base">{item.product?.productName}</p>
                                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="text-right mt-6">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrder;
