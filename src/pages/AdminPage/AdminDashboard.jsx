import React, { useState, useEffect } from 'react';
import { Search, Download, ShoppingCart, LogOut, TrendingUp, Package, Users, Landmark } from 'lucide-react';

import "./Admin.css"
import { getAllTransaction } from '../../utils/transactionService';
import ChartSection from './AdminChart';



// Mock service functions (replace with your actual service)

const processTransactionData = (transactions) => {
    let totalAmount = 0;
    let totalOrders = new Set(); // để tránh trùng order
    let productsSold = 0;

    transactions.forEach((tx) => {
        const order = tx?.payment?.order;
        if (!order) return;

        // Tổng tiền đã nhận (cộng từ transaction.amount)
        totalAmount += parseFloat(tx.amount || 0);

        // Thêm orderId vào Set để đếm tổng đơn hàng
        totalOrders.add(order.OrderId);

        // Tính tổng số lượng sản phẩm từ orderdetails
        const orderDetails = order.orderdetails || [];
        orderDetails.forEach((detail) => {
            productsSold += parseInt(detail.quantity || 0);
        });
    });

    return {
        totalAmount,
        totalOrders: totalOrders.size,
        productsSold,
        totalTransactions: transactions.length,
        // dailySales: [], // có thể thêm sau nếu cần
        // brands: {},      // có thể thêm sau nếu cần
    };
};

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllTransaction(); // API thực tế bạn gọi
                const transactions = res?.transactions || [];
                const processedData = processTransactionData(transactions);
                setDashboardData(processedData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }


    return (

        <div className="flex-1 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Transaction</h2>
                    <p className="text-gray-600">Transaction Sumary</p>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <Landmark className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                        {dashboardData?.totalAmount?.toLocaleString('vi-VN')} VNĐ
                    </h3>
                    <p className="text-gray-600 text-sm">Tổng tiền đã thanh toán</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{dashboardData?.totalOrders || 0}</h3>
                    <p className="text-gray-600 text-sm">tổng số dơn hàng</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{dashboardData?.productsSold || 0}</h3>
                    <p className="text-gray-600 text-sm">Tổng sản phẩm đã bán</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800">{dashboardData?.totalTransactions || 0}</h3>
                    <p className="text-gray-600 text-sm">Số lượng giao dịch</p>
                </div>
            </div>
            <ChartSection />
        </div>

    );
};

export default Dashboard;