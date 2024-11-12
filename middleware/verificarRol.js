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
        include: { roles: true },
      });

      if (!usuario) return res.sendStatus(403);

      const tieneRolPermitido = usuario.roles.some(rol => rolesPermitidos.includes(rol.nombre));
      if (!tieneRolPermitido) return res.sendStatus(403);

      req.user = usuario;
      next();
    } catch (err) {
      return res.sendStatus(403);
    }
  };
};

module.exports = verificarRol;