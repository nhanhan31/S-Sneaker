import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import FacebookMessengerChat from './components/FacebookMessengerChat';

function App() {
  return (
    <AntdApp>
      <BrowserRouter>
        <AppRoutes />
        <FacebookMessengerChat />
      </BrowserRouter>
    </AntdApp>
  );
}

export default App;
