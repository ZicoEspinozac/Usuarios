const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarRol = require('../middleware/verificarRol');  // Importar el middleware

// Esta ruta estará protegida y solo accesible para el rol 'admin'
router.get('/', verificarRol(['admin', 'usuario']), usuarioController.obtenerUsuarios);

// Ruta para crear un nuevo usuario, accesible solo para el rol 'admin'
router.post('/crear', verificarRol(['admin']), usuarioController.crearUsuario);

// Ruta para editar un usuario, accesible solo para el rol 'admin'
router.put('/editar/:id', verificarRol(['admin']), usuarioController.editarUsuario);

// Ruta para eliminar un usuario, accesible solo para el rol 'admin'
router.delete('/eliminar/:id', verificarRol(['admin']), usuarioController.eliminarUsuario);

// Ruta para obtener los roles disponibles
router.get('/roles', verificarRol(['admin']), usuarioController.obtenerRoles);

module.exports = router;