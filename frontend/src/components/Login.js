import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, values);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        notification.success({ message: 'Login exitoso' });
        navigate('/usuarios');
      } else {
        throw new Error('Respuesta del servidor inválida');
      }
    } catch (error) {
      notification.error({ message: 'Error en el login', description: error.response?.data?.error || error.message });
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-image">
        <img src="https://st3.depositphotos.com/12982378/16153/i/450/depositphotos_161537144-stock-photo-man-with-digital-laptop.jpg" alt="Illustration" />
      </div>
      <Card className="login-card">
        <Title level={2} className="login-title">Iniciar Sesión</Title>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item name="correo" rules={[{ required: true, message: 'Por favor ingrese su correo' }]}>
            <Input placeholder="Correo" />
          </Form.Item>
          <Form.Item name="contrasena" rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}>
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;