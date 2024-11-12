const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verificarRol = (rolesPermitidos) => {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.id },
        include: { roles: { include: { role: true } } }, // Asegúrate de incluir los roles
      });

      if (!usuario) {
        console.log('Usuario no encontrado');
        return res.sendStatus(403);
      }

      const tieneRolPermitido = usuario.roles.some(rol => rolesPermitidos.includes(rol.role.nombre));
      if (!tieneRolPermitido) {
        console.log('Rol no permitido');
        return res.sendStatus(403);
      }

      req.user = usuario;
      next();
    } catch (err) {
      console.log('Error en la verificación del token o roles:', err);
      return res.sendStatus(403);
    }
  };
};

module.exports = verificarRol;