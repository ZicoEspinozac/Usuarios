require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('./controllers/authController'); // Importa el controlador de autenticación
const JWT_SECRET = process.env.JWT_SECRET; // Usa la variable de entorno para el secreto

const prisma = new PrismaClient();
const app = express();
const port = 8080;

app.use(express.json()); // Middleware para parsear JSON

// Middleware para autenticar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Ruta para obtener datos de la base de datos
app.get('/', authenticateToken, async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (err) {
    console.error('Error al consultar la base de datos:', err);
    res.status(500).send('Error al consultar la base de datos');
  }
});

// Ruta para crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  const { correo, nombre, apell_paterno, apell_materno, contrasena, tipo_usuario, usuario } = req.body;
  try {
    // Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: { correo, nombre, apell_paterno, apell_materno, contrasena: hashedPassword, tipo_usuario, usuario },
    });
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    res.status(500).send('Error al crear el usuario');
  }
});

// Ruta para eliminar un usuario
app.delete('/usuarios/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No Content
  } catch (err) {
    console.error('Error al eliminar el usuario:', err);
    res.status(500).send('Error al eliminar el usuario');
  }
});

// Ruta para editar un usuario
app.put('/usuarios/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { correo, nombre, apell_paterno, apell_materno, contrasena, tipo_usuario, usuario } = req.body;
  try {
    // Hashear la nueva contraseña si se proporciona
    let hashedPassword;
    if (contrasena) {
      hashedPassword = await bcrypt.hash(contrasena, 10);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: {
        correo,
        nombre,
        apell_paterno,
        apell_materno,
        contrasena: hashedPassword || undefined, // Solo actualizar si se proporciona una nueva contraseña
        tipo_usuario,
        usuario,
      },
    });
    res.json(usuarioActualizado);
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).send('Error al actualizar el usuario');
  }
});

// Ruta para autenticación y generación de token JWT
app.post('/login', authController.login);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});