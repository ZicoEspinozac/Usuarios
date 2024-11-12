import React from 'react';
import { Layout, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './header.css';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Header className="app-header">
      <div className="header-content">
        <h1 className="header-title">Gestión de Usuarios</h1>
        <Button type="primary" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;