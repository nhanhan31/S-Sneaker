import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { getAllTransactionByStatus } from '../../utils/transactionService';
import './AdminChart.css';


const ChartSection = ({ isMobile, isTablet, isXS, windowSize }) => {
    const [chartDataSuccess, setChartDataSuccess] = useState([]);
    const [chartDataRefund, setChartDataRefund] = useState([]);
    const [loading, setLoading] = useState(true);

    const processChartData = (transactions) => {
        return transactions.map((tx, index) => ({
            id: index,
            date: isXS 
                ? new Date(tx.createdAt).toLocaleDateString('vi-VN', { 
                    day: 'numeric'
                })
                : isMobile 
                    ? new Date(tx.createdAt).toLocaleDateString('vi-VN', { 
                        month: 'short', 
                        day: 'numeric' 
                    })
                    : new Date(tx.createdAt).toLocaleString('vi-VN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
            amount: parseFloat(tx.amount || 0),
            fullDate: new Date(tx.createdAt).toLocaleString('vi-VN')
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const resSuccess = await getAllTransactionByStatus("Success");
                const resRefund = await getAllTransactionByStatus("Refund");

                setChartDataSuccess(processChartData(resSuccess?.transactions || []));
                setChartDataRefund(processChartData(resRefund?.transactions || []));
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isXS, isMobile]);

    if (loading) {
        return (
            <div className="chart-loading">
                <div className="chart-loading-spinner"></div>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    Đang tải biểu đồ...
                </p>
            </div>
        );
    }

    // Custom tooltip for better mobile experience
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`
                    custom-chart-tooltip
                    ${isXS ? 'p-2' : 'p-3'}
                `}>
                    <p className={`text-gray-600 ${isXS ? 'text-xs' : isMobile ? 'text-xs' : 'text-sm'}`}>
                        {payload[0]?.payload?.fullDate || label}
                    </p>
                    <p className={`text-indigo-600 font-semibold ${isXS ? 'text-xs' : isMobile ? 'text-sm' : 'text-base'}`}>
                        {`${payload[0].value.toLocaleString('vi-VN')} VNĐ`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`
            charts-grid
            ${isXS 
                ? 'grid-cols-1' 
                : isMobile 
                    ? 'grid-cols-1' 
                    : isTablet 
                        ? 'grid-cols-1' 
                        : 'grid-cols-2'
            }
        `}>
            {/* Biểu đồ thành công */}
            <div className={`
                chart-container
                ${isXS ? 'p-4' : 'p-6'}
            `}>
                <h3 className={`chart-title ${isXS ? 'text-sm' : isMobile ? 'text-base' : 'text-lg'}`}>
                    Giao dịch thành công
                </h3>
                <div className={`
                    chart-wrapper
                    ${isXS 
                        ? 'h-40' 
                        : isMobile 
                            ? 'h-48' 
                            : isTablet 
                                ? 'h-56' 
                                : 'h-64'
                    }
                `}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={chartDataSuccess} 
                            className="bar-chart"
                            margin={{ 
                                top: 5, 
                                right: isXS ? 2 : 5, 
                                left: isXS ? 2 : 5, 
                                bottom: isXS ? 40 : 5 
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ 
                                    fill: '#666', 
                                    fontSize: isXS ? 8 : isMobile ? 10 : 11 
                                }}
                                interval={isXS ? 'preserveEnd' : isMobile ? 'preserveStartEnd' : 0}
                                angle={isXS ? -90 : isMobile ? -90 : -45}
                                textAnchor="end"
                                height={isXS ? 70 : isMobile ? 60 : 50}
                            />
                            <YAxis 
                                tickFormatter={(v) => isXS || isMobile 
                                    ? `${(v / 1000000).toFixed(1)}M`
                                    : v.toLocaleString('vi-VN')
                                }
                                tick={{ fontSize: isXS ? 8 : isMobile ? 10 : 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="amount" 
                                fill="#34D399" 
                                barSize={isXS ? 15 : isMobile ? 20 : 30}
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Biểu đồ hoàn tiền */}
            <div className={`
                chart-container
                ${isXS ? 'p-4' : 'p-6'}
            `}>
                <h3 className={`chart-title ${isXS ? 'text-sm' : isMobile ? 'text-base' : 'text-lg'}`}>
                    Giao dịch hoàn tiền
                </h3>
                <div className={`
                    chart-wrapper
                    ${isXS 
                        ? 'h-40' 
                        : isMobile 
                            ? 'h-48' 
                            : isTablet 
                                ? 'h-56' 
                                : 'h-64'
                    }
                `}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={chartDataRefund} 
                            className="bar-chart"
                            margin={{ 
                                top: 5, 
                                right: isXS ? 2 : 5, 
                                left: isXS ? 2 : 5, 
                                bottom: isXS ? 40 : 5 
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ 
                                    fill: '#666', 
                                    fontSize: isXS ? 8 : isMobile ? 10 : 11 
                                }}
                                interval={isXS ? 'preserveEnd' : isMobile ? 'preserveStartEnd' : 0}
                                angle={isXS ? -90 : isMobile ? -90 : -45}
                                textAnchor="end"
                                height={isXS ? 70 : isMobile ? 60 : 50}
                            />
                            <YAxis 
                                tickFormatter={(v) => isXS || isMobile 
                                    ? `${(v / 1000000).toFixed(1)}M`
                                    : v.toLocaleString('vi-VN')
                                }
                                tick={{ fontSize: isXS ? 8 : isMobile ? 10 : 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="amount" 
                                fill="#F87171" 
                                barSize={isXS ? 15 : isMobile ? 20 : 30}
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Biểu đồ tổng hợp - full width */}
            <div className={`
                chart-container
                ${isXS ? 'p-4 col-span-1' : 'p-6'}
                ${(isMobile || isTablet) ? 'col-span-1' : 'col-span-2 full-width'}
            `}>
                <h3 className={`chart-title ${isXS ? 'text-sm' : isMobile ? 'text-base' : 'text-lg'}`}>
                    Tổng giao dịch theo thời gian
                </h3>
                <div className={`
                    chart-wrapper
                    ${isXS 
                        ? 'h-48' 
                        : isMobile 
                            ? 'h-56' 
                            : isTablet 
                                ? 'h-64' 
                                : 'h-80'
                    }
                `}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={[...chartDataSuccess, ...chartDataRefund]}
                            className="bar-chart"
                            margin={{ 
                                top: 5, 
                                right: isXS ? 2 : 5, 
                                left: isXS ? 2 : 5, 
                                bottom: isXS ? 40 : 5 
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ 
                                    fill: '#666', 
                                    fontSize: isXS ? 8 : isMobile ? 10 : 11 
                                }} 
                                interval={isXS ? 'preserveEnd' : isMobile ? 'preserveStartEnd' : 0}
                                angle={isXS ? -90 : isMobile ? -90 : -45}
                                textAnchor="end"
                                height={isXS ? 70 : isMobile ? 60 : 50}
                            />
                            <YAxis 
                                tickFormatter={(v) => isXS || isMobile 
                                    ? `${(v / 1000000).toFixed(1)}M`
                                    : v.toLocaleString('vi-VN')
                                }
                                tick={{ fontSize: isXS ? 8 : isMobile ? 10 : 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="amount" 
                                fill="#6366F1" 
                                barSize={isXS ? 12 : isMobile ? 15 : isTablet ? 25 : 30}
                                radius={[3, 3, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ChartSection;
