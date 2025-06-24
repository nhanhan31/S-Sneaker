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
import PrivateRoute from './PrivateRoute';
import Userpage from '../pages/Userpage/Userpage';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Loginpage />} />
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Homepage />} />
      <Route path="product" element={<Productpage />} />
      <Route path="/detail/:id" element={<ProductDetailpage />} />
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
            <Checkoutpage />
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
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Route>
  </Routes>
);

export default AppRoutes;