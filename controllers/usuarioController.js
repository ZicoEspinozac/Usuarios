const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (err) {
    res.status(500).send('Error al obtener los usuarios');
  }
};

const crearUsuario = async (req, res) => {
  const { correo, nombre, apell_paterno, apell_materno, contrasena, tipo_usuario, usuario, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: { correo, nombre, apell_paterno, apell_materno, contrasena: hashedPassword, tipo_usuario, usuario },
    });

    // Asignar el rol al usuario
    const role = await prisma.role.findUnique({ where: { nombre: rol } });
    if (!role) {
      return res.status(400).json({ error: 'Rol no encontrado' });
    }

    await prisma.usuarioRole.create({
      data: {
        usuarioId: nuevoUsuario.id,
        roleId: role.id,
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.log('Error al crear el usuario:', err);
    res.status(500).send('Error al crear el usuario');
  }
};

const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { correo, nombre, apell_paterno, apell_materno, contrasena, tipo_usuario, usuario } = req.body;
  try {
    let hashedPassword;
    if (contrasena) {
      hashedPassword = await bcrypt.hash(contrasena, 10);
    }
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { correo, nombre, apell_paterno, apell_materno, contrasena: hashedPassword || undefined, tipo_usuario, usuario },
    });
    res.json(usuarioActualizado);
  } catch (err) {
    res.status(500).send('Error al actualizar el usuario');
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Error al eliminar el usuario');
  }
};

// Nuevo método para obtener los roles disponibles
const obtenerRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (err) {
    res.status(500).send('Error al obtener los roles');
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  obtenerRoles, // Exportar el nuevo método
};