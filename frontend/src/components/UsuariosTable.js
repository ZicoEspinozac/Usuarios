import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Modal } from 'antd';
import axios from 'axios';
import EditarUsuarioModal from './EditarUsuarioModal';

const { confirm } = Modal;

const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsuarios(response.data);
    } catch (error) {
      notification.error({ message: 'Error al cargar usuarios', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuarios/roles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRoles(response.data);
    } catch (error) {
      notification.error({ message: 'Error al cargar roles', description: error.message });
    }
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    confirm({
      title: '¿Estás seguro de que deseas eliminar este usuario?',
      onOk: async () => {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/usuarios/eliminar/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          fetchUsuarios();
          notification.success({ message: 'Usuario eliminado' });
        } catch (error) {
          notification.error({ message: 'Error al eliminar usuario', description: error.message });
        }
      },
    });
  };

  const handleOk = async (values) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/usuarios/editar/${editingUser.id}`, values, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsuarios();
      setIsModalVisible(false);
      notification.success({ message: 'Usuario actualizado' });
    } catch (error) {
      notification.error({ message: 'Error al actualizar usuario', description: error.message });
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Usuario', dataIndex: 'usuario', key: 'usuario' },
    { title: 'Correo', dataIndex: 'correo', key: 'correo' },
    { title: 'Nombre Completo', key: 'nombreCompleto', render: (text, record) => `${record.nombre} ${record.apell_paterno} ${record.apell_materno}` },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Editar</Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={usuarios} loading={loading} rowKey="id" />
      <EditarUsuarioModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        usuario={editingUser}
        roles={roles}
      />
    </>
  );
};

export default UsuariosTable;