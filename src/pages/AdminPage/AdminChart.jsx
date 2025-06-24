import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { getAllTransactionByStatus } from '../../utils/transactionService';


const ChartSection = () => {
    const [chartDataSuccess, setChartDataSuccess] = useState([]);
    const [chartDataRefund, setChartDataRefund] = useState([]);
    const [loading, setLoading] = useState(true);

    const processChartData = (transactions) => {
        return transactions.map(tx => ({
            date: new Date(tx.createdAt).toLocaleString('vi-VN'),
            amount: parseFloat(tx.amount || 0)
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
    }, []);

    if (loading) {
        return <div className="text-center">Đang tải biểu đồ...</div>;
    }

    return (
        <div className="grid grid-cols-2 gap-6 mt-10">
            {/* Biểu đồ thành công */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Giao dịch thành công</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataSuccess}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#666', fontSize: 11 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                            />
                            <YAxis tickFormatter={(v) => v.toLocaleString('vi-VN')} />
                            <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                            <Bar dataKey="amount" fill="#34D399" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Biểu đồ hoàn tiền */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Giao dịch hoàn tiền</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataRefund}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#666', fontSize: 11 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                            />
                            <YAxis tickFormatter={(v) => v.toLocaleString('vi-VN')} />
                            <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                            <Bar dataKey="amount" fill="#F87171" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng giao dịch theo thời gian</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[...chartDataSuccess, ...chartDataRefund]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 11 }} interval={0} angle={-45} textAnchor="end" />
                            <YAxis tickFormatter={(v) => v.toLocaleString('vi-VN')} />
                            <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VNĐ`} />
                            <Bar dataKey="amount" fill="#6366F1" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ChartSection;
