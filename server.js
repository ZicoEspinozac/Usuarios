const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const verificarRol = require('./middleware/verificarRol');  // Importar el middleware

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios (solo accesibles para usuarios con roles específicos)
app.use('/api/usuarios', verificarRol(['admin']), usuarioRoutes);  // Protege esta ruta con el middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
