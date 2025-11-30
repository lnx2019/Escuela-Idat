import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'mysql-dbvelrob.alwaysdata.net', // HOST DE ALWAYSADATA
    user: 'dbvelrob',                // TU USUARIO
    password: '$Soporte2025',          // TU CONTRASEÑA
    database: 'dbvelrob_db_4to_ciclo',             // EL NOMBRE DE TU BASE DE DATOS
    port: 3306,                           // El puerto por defecto (confirma si alwaysdata usa otro)
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    ssl: { rejectUnauthorized: false }

};

// Crea un Pool de conexiones para gestionar múltiples peticiones
const pool = mysql.createPool(dbConfig);

console.log("MySQL Pool de conexiones inicializado.");

export default pool;
