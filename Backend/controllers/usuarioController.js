const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const obtenerUsuarios = async (req, res) => {
  const { search = '', page = 1, pageSize = 10 } = req.query;
  const skip = (page - 1) * pageSize;
  const take = parseInt(pageSize);

  try {
    const where = search
      ? {
          OR: [
            {
              nombre: {
                contains: search,
                
              },
            },
            {
              apell_paterno: {
                contains: search,
                
              },
            },
            {
              apell_materno: {
                contains: search,
                
              },
            },
          ],
        }
      : {};

    const [usuarios, total] = await prisma.$transaction([
      prisma.usuario.findMany({
        where,
        skip,
        take,
      }),
      prisma.usuario.count({ where }),
    ]);

    res.json({ usuarios, total });
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
    // Eliminar los registros relacionados en la tabla UsuarioRole
    await prisma.usuarioRole.deleteMany({
      where: { usuarioId: parseInt(id) },
    });

    // Eliminar el usuario
    await prisma.usuario.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send(); // No Content
  } catch (err) {
    console.log('Error al eliminar el usuario:', err);
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