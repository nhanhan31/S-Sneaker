import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Homepage from '../pages/Home/Homepage';
import Productpage from '../pages/Product/Productpage';
import ProductDetailpage from '../pages/ProductDetailpage/ProductDetailpage';
import Cartpage from '../pages/Cartpage/Cartpage';
import Checkoutpage from '../pages/Checkoutpage/Checkoutpage';
import Favoritepage from '../pages/Favoritepage/Favoritepage';
import Loginpage from '../pages/Loginpage/Loginpage';
import Registerpage from '../pages/Registerpage/Registerpage';
import PrivateRoute from './PrivateRoute';
import Userpage from '../pages/Userpage/Userpage';
import UserContent from '../pages/Userpage/UserContent';
import EditInfo from '../pages/Userpage/EditInfo';
import OrderPage from '../pages/Userpage/OrderPage';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../pages/AdminPage/AdminDashboard';
import AdminOrder from '../pages/AdminPage/AdminOrder';
import ShippingStatus from '../pages/Userpage/ShippingStatus';
import AdminProductPage from '../pages/AdminPage/AdminProductPage';
import AdminProductDetailPage from '../pages/AdminPage/AdminProductDetailPage';
import AboutUs from '../pages/AboutUs/AboutUs';
import BlogPage from '../pages/BlogPage/BlogPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Loginpage />} />
    <Route path="/register" element={<Registerpage />} />
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Homepage />} />
      <Route path="/product" element={<Productpage />} />
      <Route path="/detail/:id" element={<ProductDetailpage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPage />} />
      <Route
        path="cart"
        element={
          <PrivateRoute allowedRoles={[1, 4, 5]}>
            <Cartpage />
          </PrivateRoute>
        }
      />
      <Route
        path="checkout"
        element={
          <PrivateRoute allowedRoles={[1, 4, 5]}>
            <Checkoutpage />
          </PrivateRoute>
        }
      />
      <Route
        path="favorite"
        element={
          <PrivateRoute allowedRoles={[1, 4, 5]}>
            <Favoritepage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment-cancel"
        element={
          <PrivateRoute allowedRoles={[1, 4, 5]}>
            <Productpage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment-success"
        element={
          <PrivateRoute allowedRoles={[1, 4, 5]}>
            <Productpage />
          </PrivateRoute>
        }
      />
      <Route
        path="/user"
        element={
          <PrivateRoute allowedRoles={[1, 4, 5]}>
            <Userpage />
          </PrivateRoute>
        }
      >
        <Route index element={<UserContent />} />
        <Route path="edit-info" element={<EditInfo />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="shipping-status/:orderId" element={<ShippingStatus />} />
      </Route>   
    </Route>
    <Route
      path="/admin"
      element={
        <PrivateRoute allowedRoles={[2, 3]}>
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="order" element={<AdminOrder />} />
      <Route path="product" element={ <AdminProductPage/>} />
      <Route path="product/:id" element={<AdminProductDetailPage/>} />
    </Route>
    <Route path="*" element={<div>404 Not Found</div>} />
  </Routes>
);

export default AppRoutes;