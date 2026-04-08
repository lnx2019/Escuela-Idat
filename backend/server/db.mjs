import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'mysql-dbvelrob.alwaysdata.net',
    user: 'dbvelrob',
    password: '$Soporte2025',
    database: 'dbvelrob_db_4to_ciclo',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 15000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: { rejectUnauthorized: false }
});

console.log("MySQL Pool inicializado.");


// 🔥 **AQUÍ** va el listener del pool
pool.on('error', err => {
    console.error("💥 Pool Error:", err.code);

    if (err.code === 'ECONNRESET' || err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log("🔄 Reconectando pool automáticamente...");
        // mysql2 se encarga de regenerar conexiones internas del pool
    }
});


// 💓 KeepAlive
setInterval(async () => {
    try {
        await pool.query("SELECT 1");
        console.log("✅ KeepAlive: conexión viva");
    } catch (e) {
        console.error("💀 KeepAlive falló:", e.message);
    }
}, 120000);


// Helper
export async function executeQuery(sql, params = []) {
    let conn;

    try {
        conn = await pool.getConnection();
        const [rows] = await conn.query(sql, params);
        return rows;
    } catch (err) {
        console.error("🔥 Error SQL:", err);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

export default pool;
