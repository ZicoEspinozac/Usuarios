const mysql = require('mysql2/promise');  // Usar la versión con promesas de mysql2

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'usuario',
  port: 3306,
});

module.exports = connection;
