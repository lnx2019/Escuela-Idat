// routes/reportes.routes.mjs
import { Router } from 'express';
import pool from '../../server/db.mjs';

const router = Router();

// Función auxiliar para ejecutar consultas
const executeQuery = async (sql, params = []) => {
    const [rows] = await pool.query(sql, params);
    return rows;
};

// --- Reporte 1: Cursos más Populares (por número de inscripciones) ---
router.get('/cursos-populares', async (req, res) => {
    try {
        const rows = await executeQuery(`
            SELECT 
                c.titulo AS curso_titulo,
                COUNT(i.id) AS total_inscripciones
            FROM cursos c
            JOIN inscripciones i ON c.id = i.curso_id
            GROUP BY c.id, c.titulo
            ORDER BY total_inscripciones DESC
            LIMIT 10
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error en /reportes/cursos-populares:', error.message);
        res.status(500).json({ error: 'Error al generar el reporte de cursos populares.' });
    }
});

// --- Reporte 2: Usuarios Registrados por Rol ---
router.get('/usuarios-por-rol', async (req, res) => {
    try {
        const rows = await executeQuery(`
            SELECT 
                rol, 
                COUNT(*) AS total
            FROM usuarios
            GROUP BY rol
            ORDER BY total DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error en /reportes/usuarios-por-rol:', error.message);
        res.status(500).json({ error: 'Error al generar el reporte de usuarios por rol.' });
    }
});

// --- Reporte 3: Instructores y Cursos Asignados ---
router.get('/instructores-cursos', async (req, res) => {
    try {
        const rows = await executeQuery(`
            SELECT 
                u.nombre AS instructor_nombre,
                COUNT(c.id) AS total_cursos_impartidos
            FROM usuarios u
            LEFT JOIN cursos c ON u.id = c.instructor_id
            WHERE u.rol = 'instructor'
            GROUP BY u.id, u.nombre
            ORDER BY total_cursos_impartidos DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error en /reportes/instructores-cursos:', error.message);
        res.status(500).json({ error: 'Error al generar el reporte de instructores.' });
    }
});

export default router;