import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSidebar';
import { useResponsive } from '../hooks/useResponsive';
import './AdminLayout.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isMobile, isTablet, isDesktop, isXS, windowSize, isNonDesktop } = useResponsive();

    // Auto close sidebar when switching to desktop
    useEffect(() => {
        if (isDesktop && sidebarOpen) {
            setSidebarOpen(false);
        }
    }, [isDesktop, sidebarOpen]);

    // Determine if should show sidebar as overlay - use explicit width check
    const shouldShowAsOverlay = windowSize.width < 1024;

    return (
        <div className={`min-h-screen bg-gray-50 flex flex-col ${shouldShowAsOverlay ? '' : 'md:flex-row'}`}>
            {/* Sidebar: responsive behavior */}
            <div className={`
                sidebar-container
                ${sidebarOpen ? 'open' : ''}
                ${shouldShowAsOverlay ? 'fixed' : 'static'}
            `}>
                <AdminSideBar 
                    onClose={() => setSidebarOpen(false)}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    isXS={isXS}
                    isNonDesktop={isNonDesktop}
                />
            </div>
            
            {/* Overlay for mobile/tablet when sidebar is open */}
            {shouldShowAsOverlay && sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            {/* Main content */}
            <main className={`
                admin-main-content flex-1 w-full transition-all duration-300
                ${shouldShowAsOverlay
                    ? 'pt-16' 
                    : 'ml-0'
                }
            `}>
                {/* Mobile/Tablet menu button */}
                {shouldShowAsOverlay && (
                    <button
                        className={`
                            mobile-menu-button fixed z-40 rounded-lg shadow-lg transition-all duration-200
                            ${sidebarOpen 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 opacity-60' 
                            }
                            ${isXS 
                                ? 'top-2 left-2 p-2 text-xs' 
                                : 'top-4 left-4 p-3 text-sm'
                            }
                        `}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label={sidebarOpen ? "Đóng menu" : "Mở menu"}
                    >
                        <svg 
                            width={isXS ? "16" : isMobile ? "20" : "24"} 
                            height={isXS ? "16" : isMobile ? "20" : "24"} 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                            className="transition-transform duration-200"
                        >
                            {sidebarOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                )}
                
                <div className={`
                    ${isXS 
                        ? 'pt-2 px-2' 
                        : isMobile 
                            ? 'pt-4 px-4' 
                            : isTablet 
                                ? 'pt-6 px-4 md:px-6' 
                                : 'pt-6 px-6'
                    }
                `}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
