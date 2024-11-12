const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authController = {
  login: async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
      console.log('Correo recibido:', correo); // Registro para depuración

      // Buscar al usuario en la base de datos
      const usuario = await prisma.usuario.findUnique({
        where: { correo },
      });

      console.log('Usuario encontrado:', usuario); // Registro para depuración

      if (!usuario) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);

      if (!isMatch) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }

      // Crear el token JWT
      const token = jwt.sign(
        { id: usuario.id, usuario: usuario.usuario, tipo_usuario: usuario.tipo_usuario },
        process.env.JWT_SECRET || 'mi_clave_secreta',
        { expiresIn: '1h' } // El token expirará en una hora
      );

      res.json({ token });
    } catch (error) {
      console.error('Error en el servidor:', error); // Registrar el error completo en la consola
      res.status(500).json({ error: 'Error en el servidor', detalles: error.message });
    }
  },
};

module.exports = authController;