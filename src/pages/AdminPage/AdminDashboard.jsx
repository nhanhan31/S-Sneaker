import React, { useState, useEffect } from 'react';
import { Search, Download, ShoppingCart, LogOut, TrendingUp, Package, Users, Landmark } from 'lucide-react';

import "./Admin.css"
import "./AdminDashboard.css"
import { getAllTransaction } from '../../utils/transactionService';
import ChartSection from './AdminChart';
import { useResponsive } from '../../hooks/useResponsive';



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
    const { isMobile, isTablet, isDesktop, isXS, windowSize } = useResponsive();

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
                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>
        );
    }


    return (
        <div className={`flex-1 ${isXS ? 'p-2' : isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'}`}>
            {/* Header */}
            <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'} mb-8`}>
                <div>
                    <h2 className={`font-bold text-gray-800 ${isXS ? 'text-lg' : isMobile ? 'text-xl' : 'text-2xl'}`}>
                        Transaction Dashboard
                    </h2>
                    <p className={`text-gray-600 ${isXS || isMobile ? 'text-sm' : 'text-base'}`}>
                        Transaction Summary & Analytics
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <button className={`
                        flex items-center bg-white border rounded-lg hover:bg-gray-50 transition-colors
                        ${isXS ? 'px-2 py-1 text-xs' : isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'}
                    `}>
                        <Download className={`mr-2 ${isXS ? 'w-3 h-3' : isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        {isXS ? 'Export' : 'Export Data'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={`
                grid gap-6 mb-8
                ${isXS 
                    ? 'grid-cols-1' 
                    : isMobile 
                        ? 'grid-cols-2' 
                        : isTablet 
                            ? 'grid-cols-3' 
                            : 'grid-cols-4'
                }
            `}>
                {/* Total Amount Card */}
                <div className={`
                    bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow
                    ${isXS ? 'p-4' : 'p-6'}
                    ${isMobile && !isXS ? 'col-span-2' : ''}
                `}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`bg-red-100 rounded-lg flex items-center justify-center ${isXS ? 'w-10 h-10' : 'w-12 h-12'}`}>
                            <Landmark className={`text-red-600 ${isXS ? 'w-5 h-5' : 'w-6 h-6'}`} />
                        </div>
                        {(isMobile || isXS) && (
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Tổng tiền</div>
                            </div>
                        )}
                    </div>
                    <h3 className={`font-bold text-gray-800 ${isXS ? 'text-sm' : isMobile ? 'text-lg' : 'text-2xl'}`}>
                        {dashboardData?.totalAmount?.toLocaleString('vi-VN')} VNĐ
                    </h3>
                    <p className={`text-gray-600 ${isXS || isMobile ? 'text-xs' : 'text-sm'}`}>
                        Tổng tiền đã thanh toán
                    </p>
                </div>

                {/* Total Orders Card */}
                <div className={`
                    bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow
                    ${isXS ? 'p-4' : 'p-6'}
                `}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`bg-orange-100 rounded-lg flex items-center justify-center ${isXS ? 'w-10 h-10' : 'w-12 h-12'}`}>
                            <ShoppingCart className={`text-orange-600 ${isXS ? 'w-5 h-5' : 'w-6 h-6'}`} />
                        </div>
                        {(isMobile || isXS) && (
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Đơn hàng</div>
                            </div>
                        )}
                    </div>
                    <h3 className={`font-bold text-gray-800 ${isXS ? 'text-sm' : isMobile ? 'text-lg' : 'text-2xl'}`}>
                        {dashboardData?.totalOrders || 0}
                    </h3>
                    <p className={`text-gray-600 ${isXS || isMobile ? 'text-xs' : 'text-sm'}`}>
                        Tổng số đơn hàng
                    </p>
                </div>

                {/* Products Sold Card */}
                <div className={`
                    bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow
                    ${isXS ? 'p-4' : 'p-6'}
                `}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`bg-green-100 rounded-lg flex items-center justify-center ${isXS ? 'w-10 h-10' : 'w-12 h-12'}`}>
                            <Package className={`text-green-600 ${isXS ? 'w-5 h-5' : 'w-6 h-6'}`} />
                        </div>
                        {(isMobile || isXS) && (
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Sản phẩm</div>
                            </div>
                        )}
                    </div>
                    <h3 className={`font-bold text-gray-800 ${isXS ? 'text-sm' : isMobile ? 'text-lg' : 'text-2xl'}`}>
                        {dashboardData?.productsSold || 0}
                    </h3>
                    <p className={`text-gray-600 ${isXS || isMobile ? 'text-xs' : 'text-sm'}`}>
                        Tổng sản phẩm đã bán
                    </p>
                </div>

                {/* Total Transactions Card */}
                <div className={`
                    bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow
                    ${isXS ? 'p-4' : 'p-6'}
                `}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`bg-purple-100 rounded-lg flex items-center justify-center ${isXS ? 'w-10 h-10' : 'w-12 h-12'}`}>
                            <Users className={`text-purple-600 ${isXS ? 'w-5 h-5' : 'w-6 h-6'}`} />
                        </div>
                        {(isMobile || isXS) && (
                            <div className="text-right">
                                <div className="text-xs text-gray-500">Giao dịch</div>
                            </div>
                        )}
                    </div>
                    <h3 className={`font-bold text-gray-800 ${isXS ? 'text-sm' : isMobile ? 'text-lg' : 'text-2xl'}`}>
                        {dashboardData?.totalTransactions || 0}
                    </h3>
                    <p className={`text-gray-600 ${isXS || isMobile ? 'text-xs' : 'text-sm'}`}>
                        Số lượng giao dịch
                    </p>
                </div>
            </div>

            {/* Chart Section */}
            <ChartSection 
                isMobile={isMobile} 
                isTablet={isTablet} 
                isXS={isXS}
                windowSize={windowSize}
            />
        </div>
    );
};

export default Dashboard;