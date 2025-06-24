import React from 'react';

import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSideBar />
            <main className="ml-64 w-full">
                {/* Nội dung dashboard hoặc order ở đây */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
