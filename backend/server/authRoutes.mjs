import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.mjs'; 
import { JWT_SECRET } from '../server.mjs'; // Importar el secreto

const router = Router();

// --- Funciones de Ayuda (CRUD con MySQL) ---
const executeQuery = async (sql, params = []) => {
    try {
        const [rows] = await pool.query(sql, params);
        return rows;
    } catch (error) {
        console.error('Error en consulta SQL:', error.message);
        throw new Error('Error al acceder a la base de datos.');
    }
};

// --- RUTA DE LOGIN ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan credenciales (username y password).' });
    }
    try {
        // 1. Buscar usuario
        const users = await executeQuery('SELECT * FROM usuarios WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        const user = users[0];
        
        // 2. Comparar la contraseña
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        
        // 3. Generar un JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, nombre: user.nombre, rol: user.rol }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        // 4. Devolver el token
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, username: user.username, rol: user.rol } 
        });

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor durante el login.' });
    }
});

export default router;