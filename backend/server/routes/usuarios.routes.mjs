// routes/usuarios.routes.mjs
import { Router } from 'express';
import bcrypt from 'bcrypt';
import pool from '../../server/db.mjs';
import { SALT_ROUNDS } from '../../server.mjs';

const router = Router();

const executeQuery = async (sql, params = []) => {
    const [rows] = await pool.query(sql, params);
    return rows;
};

// GET /usuarios/paginado
router.get('/paginado', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const rows = await executeQuery(
            `SELECT id, username, email, nombre, rol, activo, fecha_registro
             FROM usuarios
             ORDER BY id
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        const countRows = await executeQuery(`SELECT COUNT(*) AS total FROM usuarios`);
        const total = countRows[0].total;

        res.json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: rows
        });
    } catch (error) {
        console.error('Error en /usuarios/paginado:', error.message);
        res.status(500).json({ error: 'Error al obtener usuarios paginados.' });
    }
});

// GET /usuarios/activos/count
router.get('/activos/count', async (req, res) => {
    try {
        const [row] = await executeQuery(
            "SELECT COUNT(*) AS count FROM usuarios WHERE activo = true OR activo IS NULL"
        );
        res.json({ success: true, count: row.count });
    } catch (error) {
        console.error('Error en /usuarios/activos/count:', error.message);
        res.status(500).json({ error: 'Error al contar usuarios activos.' });
    }
});

// POST /usuarios
router.post('/', async (req, res) => {
    const { username, password, email, nombre, rol } = req.body;
    if (!username || !password || !email || !nombre || !rol) {
        return res.status(400).json({ error: 'Campos faltantes: username, password, email, nombre, rol' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await executeQuery(
            `INSERT INTO usuarios (username, password, email, nombre, rol) VALUES (?, ?, ?, ?, ?)`,
            [username, hashedPassword, email, nombre, rol]
        );
        res.status(201).json({
            id: result.insertId,
            username,
            email,
            nombre,
            rol
        });
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /usuarios (con filtros)
router.get('/', async (req, res) => {
    let sql = `SELECT id, username, email, nombre, rol, activo, fecha_registro FROM usuarios`;
    const params = [];
    const { rol, activo } = req.query;
    const conditions = [];

    if (rol) {
        conditions.push('rol = ?');
        params.push(rol);
    }
    if (activo !== undefined) {
        conditions.push('activo = ?');
        params.push(activo);
    }

    if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY id ASC';

    try {
        const rows = await executeQuery(sql, params);
        res.json(rows);
    } catch (error) {
        console.error('Error al listar usuarios:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /usuarios/estudiantes
router.get('/estudiantes', async (req, res) => {
    const sql = `
        SELECT id, username, email, nombre, rol, activo, fecha_registro
        FROM usuarios
        WHERE rol = 'estudiante'
        ORDER BY id ASC
    `;

    try {
        const rows = await executeQuery(sql, []);
        res.json(rows);
    } catch (error) {
        console.error('Error al listar estudiantes:', error.message);
        res.status(500).json({ error: error.message });
    }
});


// GET /usuarios/:id
router.get('/:id', async (req, res) => {
    try {
        const rows = await executeQuery(
            `SELECT id, username, email, nombre, rol, activo, fecha_registro FROM usuarios WHERE id = ?`,
            [req.params.id]
        );
        res.json(rows[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /usuarios/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const updateFields = Object.keys(body).filter(k => k !== 'id');
    if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar.' });
    }

    try {
        let values = [...updateFields.map(k => body[k]), id];
        if (body.password) {
            const hashed = await bcrypt.hash(body.password, SALT_ROUNDS);
            // Reemplazar password en values
            const pwdIndex = updateFields.indexOf('password');
            if (pwdIndex !== -1) values[pwdIndex] = hashed;
        }

        const setClause = updateFields.map(f => `${f} = ?`).join(', ');
        const result = await executeQuery(
            `UPDATE usuarios SET ${setClause} WHERE id = ?`,
            values
        );

        if (result.affectedRows > 0) {
            const { password, ...safeBody } = body;
            res.json({ id: Number(id), ...safeBody });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /usuarios/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await executeQuery(`UPDATE cursos SET instructor_id = NULL WHERE instructor_id = ?`, [id]);
        const result = await executeQuery(`DELETE FROM usuarios WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json({ success: true, message: `Usuario con ID ${id} eliminado.` });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).json({ error: 'Error interno al eliminar.' });
    }
});

export default router;