import React from 'react';
import { Layout } from 'antd';
import UsuariosTable from '../components/UsuariosTable';
import AppHeader from '../components/header'; // Asegúrate de que la importación coincida con el nombre del archivo

const { Content } = Layout;

const UsuariosPage = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '20px' }}>
        <UsuariosTable />
      </Content>
    </Layout>
  );
};

export default UsuariosPage;