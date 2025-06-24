import { ShoppingCart, LogOut, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-64 bg-white shadow-lg min-h-screen fixed">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">S-SNEAKER</h1>
            </div>

            <nav className="mt-6">
                <div
                    className={`px-6 py-3 cursor-pointer ${isActive('/admin/dashboard') ? 'bg-indigo-600 text-white rounded-r-full mr-4' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => navigate('/admin/dashboard')}
                >
                    <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-3" />
                        <span className="font-medium">Dashboard</span>
                    </div>
                </div>

                <div
                    className={`px-6 py-3 cursor-pointer ${isActive('/admin/order') ? 'bg-indigo-600 text-white rounded-r-full mr-4' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => navigate('/admin/order')}
                >
                    <div className="flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-3" />
                        <span>Order</span>
                    </div>
                </div>

                <div
                    className="px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        // Tùy ý logout thực tế
                        navigate('/login');
                    }}
                >
                    <div className="flex items-center">
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Sign Out</span>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default AdminSideBar;
