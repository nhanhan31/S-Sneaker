import { ShoppingCart, LogOut, TrendingUp, Package, UserCog } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSideBar = ({ onClose, isMobile, isTablet, isXS, isNonDesktop }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // Determine if should show close button (any non-desktop device)
    // Use explicit width check for reliability
    const shouldShowCloseButton = window.innerWidth < 1024;

    // Handle logout
    const handleLogout = () => {
        const rememberEmail = localStorage.getItem("rememberEmail");
        sessionStorage.clear();
        localStorage.clear();
        if (rememberEmail) {
            localStorage.setItem("rememberEmail", rememberEmail);
        }
        navigate('/login');
        if (onClose) onClose();
    };

    // Handle navigation and close sidebar on mobile/tablet
    const handleNavigation = (path) => {
        navigate(path);
        if (shouldShowCloseButton && onClose) {
            onClose();
        }
    };

    return (
        <div
            className={`
                admin-sidebar bg-white shadow-xl min-h-screen transition-all duration-300 h-full
                ${isXS 
                    ? 'w-72 max-w-[90vw]' 
                    : isMobile 
                        ? 'w-80 max-w-[85vw]' 
                        : isTablet 
                            ? 'w-64' 
                            : 'w-64'
                }
            `}
        >
            {/* Header */}
            <div className={`
                flex justify-between items-center border-b border-gray-200
                ${isXS ? 'p-3' : isMobile ? 'p-4' : 'p-6'}
            `}>
                <h1 className={`
                    font-bold text-gray-800
                    ${isXS ? 'text-lg' : isMobile ? 'text-xl' : 'text-2xl'}
                `}>
                    S-SNEAKER
                </h1>
                {/* Close button for mobile/tablet */}
                {shouldShowCloseButton && onClose && (
                    <button
                        className={`
                            text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200
                            ${isTablet ? 'bg-gray-50 border border-gray-200' : ''}
                        `}
                        onClick={onClose}
                        aria-label="Đóng sidebar"
                    >
                        <svg 
                            width={isXS ? "16" : "20"} 
                            height={isXS ? "16" : "20"} 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className={`${isXS ? 'mt-3' : isMobile ? 'mt-4' : 'mt-6'}`}>
                {/* Dashboard */}
                <div
                    className={`
                        cursor-pointer transition-all duration-200 mx-2 rounded-lg
                        ${isActive('/admin/dashboard') 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${isXS 
                            ? 'px-3 py-2 mb-1' 
                            : isMobile 
                                ? 'px-4 py-3 mb-2' 
                                : 'px-6 py-3 mb-1'
                        }
                    `}
                    onClick={() => handleNavigation('/admin/dashboard')}
                >
                    <div className="flex items-center">
                        <TrendingUp className={`mr-3 ${isXS ? 'w-3 h-3' : isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        <span className={`font-medium ${isXS ? 'text-xs' : isMobile ? 'text-sm' : 'text-base'}`}>
                            Dashboard
                        </span>
                    </div>
                </div>

                {/* Orders */}
                <div
                    className={`
                        cursor-pointer transition-all duration-200 mx-2 rounded-lg
                        ${isActive('/admin/order') 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${isXS 
                            ? 'px-3 py-2 mb-1' 
                            : isMobile 
                                ? 'px-4 py-3 mb-2' 
                                : 'px-6 py-3 mb-1'
                        }
                    `}
                    onClick={() => handleNavigation('/admin/order')}
                >
                    <div className="flex items-center">
                        <ShoppingCart className={`mr-3 ${isXS ? 'w-3 h-3' : isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        <span className={`font-medium ${isXS ? 'text-xs' : isMobile ? 'text-sm' : 'text-base'}`}>
                            Orders
                        </span>
                    </div>
                </div>

                {/* Products */}
                <div
                    className={`
                        cursor-pointer transition-all duration-200 mx-2 rounded-lg
                        ${isActive('/admin/user') 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${isXS 
                            ? 'px-3 py-2 mb-1' 
                            : isMobile 
                                ? 'px-4 py-3 mb-2' 
                                : 'px-6 py-3 mb-1'
                        }
                    `}
                    onClick={() => handleNavigation('/admin/user')}
                >
                    <div className="flex items-center">
                        <UserCog className={`mr-3 ${isXS ? 'w-3 h-3' : isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        <span className={`font-medium ${isXS ? 'text-xs' : isMobile ? 'text-sm' : 'text-base'}`}>
                            Users
                        </span>
                    </div>
                </div>

                 <div
                    className={`
                        cursor-pointer transition-all duration-200 mx-2 rounded-lg
                        ${isActive('/admin/product') 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${isXS 
                            ? 'px-3 py-2 mb-1' 
                            : isMobile 
                                ? 'px-4 py-3 mb-2' 
                                : 'px-6 py-3 mb-1'
                        }
                    `}
                    onClick={() => handleNavigation('/admin/product')}
                >
                    <div className="flex items-center">
                        <Package className={`mr-3 ${isXS ? 'w-3 h-3' : isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        <span className={`font-medium ${isXS ? 'text-xs' : isMobile ? 'text-sm' : 'text-base'}`}>
                            Products
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className={`border-t border-gray-200 mx-4 ${isXS ? 'my-3' : 'my-4'}`}></div>

                {/* Sign Out */}
                <div
                    className={`
                        cursor-pointer transition-all duration-200 mx-2 rounded-lg
                        text-red-600 hover:bg-red-50 hover:text-red-700
                        ${isXS 
                            ? 'px-3 py-2' 
                            : isMobile 
                                ? 'px-4 py-3' 
                                : 'px-6 py-3'
                        }
                    `}
                    onClick={handleLogout}
                >
                    <div className="flex items-center">
                        <LogOut className={`mr-3 ${isXS ? 'w-3 h-3' : isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                        <span className={`font-medium ${isXS ? 'text-xs' : isMobile ? 'text-sm' : 'text-base'}`}>
                            Sign Out
                        </span>
                    </div>
                </div>
            </nav>

            {/* Footer for mobile */}
            {(isMobile || isXS) && (
                <div className={`
                    absolute bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200
                    ${isXS ? 'p-3' : 'p-4'}
                `}>
                    <p className={`text-gray-500 text-center ${isXS ? 'text-xs' : 'text-xs'}`}>
                        Admin Panel v1.0
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminSideBar;
