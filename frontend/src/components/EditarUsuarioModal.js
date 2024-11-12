import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const EditarUsuarioModal = ({ visible, onCancel, onOk, usuario, roles }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (usuario) {
      form.setFieldsValue({
        correo: usuario.correo,
        nombre: usuario.nombre,
        apell_paterno: usuario.apell_paterno,
        apell_materno: usuario.apell_materno,
        tipo_usuario: usuario.tipo_usuario,
        usuario: usuario.usuario,
        rol: usuario.roles && usuario.roles.length > 0 ? usuario.roles[0].nombre : undefined,
      });
    }
  }, [usuario, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
    });
  };

  return (
    <Modal title="Editar Usuario" visible={visible} onCancel={onCancel} footer={null}>
      <Form form={form} onFinish={handleOk}>
        <Form.Item name="correo" rules={[{ required: true, message: 'Por favor ingrese su correo' }]}>
          <Input placeholder="Correo" />
        </Form.Item>
        <Form.Item name="nombre" rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}>
          <Input placeholder="Nombre" />
        </Form.Item>
        <Form.Item name="apell_paterno" rules={[{ required: true, message: 'Por favor ingrese su apellido paterno' }]}>
          <Input placeholder="Apellido Paterno" />
        </Form.Item>
        <Form.Item name="apell_materno" rules={[{ required: true, message: 'Por favor ingrese su apellido materno' }]}>
          <Input placeholder="Apellido Materno" />
        </Form.Item>
        <Form.Item name="contrasena">
          <Input.Password placeholder="Nueva Contraseña (opcional)" />
        </Form.Item>
        <Form.Item name="tipo_usuario" rules={[{ required: true, message: 'Por favor ingrese el tipo de usuario' }]}>
          <Input placeholder="Tipo de Usuario" />
        </Form.Item>
        <Form.Item name="usuario" rules={[{ required: true, message: 'Por favor ingrese el nombre de usuario' }]}>
          <Input placeholder="Usuario" />
        </Form.Item>
        <Form.Item name="rol" rules={[{ required: true, message: 'Por favor seleccione un rol' }]}>
          <Select placeholder="Seleccione un rol">
            {roles.map((rol) => (
              <Option key={rol.id} value={rol.nombre}>
                {rol.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditarUsuarioModal;