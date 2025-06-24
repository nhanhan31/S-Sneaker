import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AntdApp>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AntdApp>
  );
}

export default App;
