import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Input, Space, Modal, Form, notification, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
import EditarUsuarioModal from './EditarUsuarioModal';

const { confirm } = Modal;

const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { search: searchText, page: pagination.current, pageSize: pagination.pageSize },
      });
      setUsuarios(response.data.usuarios);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
      }));
    } catch (error) {
      notification.error({ message: 'Error al cargar usuarios', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [searchText, pagination.current, pagination.pageSize]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/usuarios/roles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRoles(response.data);
    } catch (error) {
      notification.error({ message: 'Error al cargar roles', description: error.message });
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

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

  const handleAddOk = async (values) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/usuarios/crear`, values, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsuarios();
      setIsAddModalVisible(false);
      notification.success({ message: 'Usuario agregado exitosamente' });
    } catch (error) {
      notification.error({ message: 'Error al agregar usuario', description: error.message });
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reiniciar la paginación al buscar
  };

  const handleReset = () => {
    setSearchText('');
    setPagination((prev) => ({ ...prev, current: 1 })); // Reiniciar la paginación al resetear
    fetchUsuarios(); // Refresca la lista de usuarios después de resetear
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => {
            setSearchText(selectedKeys[0]);
            setPagination((prev) => ({ ...prev, current: 1 }));
            confirm();
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSearchText(selectedKeys[0]);
              setPagination((prev) => ({ ...prev, current: 1 }));
              confirm();
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Resetear
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: (text) =>
      searchText ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: true, ...getColumnSearchProps('id') },
    { title: 'Usuario', dataIndex: 'usuario', key: 'usuario', sorter: true, ...getColumnSearchProps('usuario') },
    { title: 'Correo', dataIndex: 'correo', key: 'correo', sorter: true, ...getColumnSearchProps('correo') },
    {
      title: 'Nombre Completo',
      key: 'nombreCompleto',
      sorter: true,
      ...getColumnSearchProps('nombreCompleto'),
      render: (text, record) => `${record.nombre} ${record.apell_paterno} ${record.apell_materno}`,
    },
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
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)} icon={<PlusOutlined />}>
          Agregar Usuario
        </Button>
        <Input.Search
          placeholder="Buscar por nombre completo"
          onSearch={handleSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button onClick={handleReset} size="small" style={{ width: 90 }}>
          Resetear
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={usuarios}
        loading={loading}
        pagination={pagination}
        onChange={(pagination) => setPagination(pagination)}
        rowKey="id"
      />
      <EditarUsuarioModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        usuario={editingUser}
        roles={roles}
      />
      <Modal
        title="Agregar Usuario"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddOk} layout="vertical">
          <Form.Item name="correo" label="Correo" rules={[{ required: true, message: 'Por favor ingrese su correo' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="apell_paterno" label="Apellido Paterno" rules={[{ required: true, message: 'Por favor ingrese su apellido paterno' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="apell_materno" label="Apellido Materno" rules={[{ required: true, message: 'Por favor ingrese su apellido materno' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contrasena" label="Contraseña" rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="tipo_usuario" label="Tipo de Usuario" rules={[{ required: true, message: 'Por favor ingrese el tipo de usuario' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="usuario" label="Usuario" rules={[{ required: true, message: 'Por favor ingrese el nombre de usuario' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="rol" label="Rol" rules={[{ required: true, message: 'Por favor seleccione un rol' }]}>
            <Select placeholder="Seleccione un rol">
              {roles.map((rol) => (
                <Select.Option key={rol.id} value={rol.nombre}>
                  {rol.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Agregar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UsuariosTable;