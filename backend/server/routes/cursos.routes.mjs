// routes/cursos.routes.mjs
import { Router } from 'express';
import pool from '../../server/db.mjs';

const router = Router();

const executeQuery = async (sql, params = []) => {
    const [rows] = await pool.query(sql, params);
    return rows;
};

// GET /cursos/activos/count
router.get('/activos/count', async (req, res) => {
    try {
        const [row] = await executeQuery(
            "SELECT COUNT(*) AS count FROM cursos WHERE estado = 'activo'"
        );
        res.json({ success: true, count: row.count });
    } catch (error) {
        console.error('Error en /cursos/activos/count:', error.message);
        res.status(500).json({ error: 'Error al contar cursos activos.' });
    }
});

// POST /cursos
router.post('/', async (req, res) => {
    const { titulo, descripcion, instructor_id } = req.body;
    if (!titulo || !descripcion || !instructor_id) {
        return res.status(400).json({ error: 'Campos faltantes: titulo, descripcion, instructor_id' });
    }
    try {
        const result = await executeQuery(
            `INSERT INTO cursos (titulo, descripcion, instructor_id) VALUES (?, ?, ?)`,
            [titulo, descripcion, instructor_id]
        );
        res.status(201).json({ id: result.insertId, titulo, descripcion, instructor_id });
    } catch (error) {
        console.error('Error al crear curso:', error.message);
        res.status(500).json({ error: error.message });
    }
});


// GET /cursos (soporta paginación real con _page y _limit)
router.get('/', async (req, res) => {
    try {
        let { _page = 1, _limit = 10 } = req.query;

        _page = Number(_page);
        _limit = Number(_limit);

        if (_page < 1) _page = 1;
        if (_limit < 1) _limit = 10;

        const offset = (_page - 1) * _limit;

        // 1) Obtener total de registros
        const totalRows = await executeQuery(`SELECT COUNT(*) AS total FROM cursos`);
        const total = totalRows[0].total;

        // 2) Obtener la página solicitada
        const rows = await executeQuery(
            `SELECT * FROM cursos ORDER BY id ASC LIMIT ? OFFSET ?`,
            [_limit, offset]
        );

        // 3) Enviar header X-Total-Count (importante para Angular)
        res.set('X-Total-Count', String(total));

        res.json(rows);

    } catch (error) {
        console.error('Error en GET /cursos (paginado):', error.message);
        res.status(500).json({ error: 'Error al obtener cursos.' });
    }
});

// GET /cursos/:id
router.get('/:id', async (req, res) => {
    try {
        const rows = await executeQuery(`SELECT * FROM cursos WHERE id = ?`, [req.params.id]);
        res.json(rows[0] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /cursos/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const fields = Object.keys(body).filter(k => k !== 'id');
    if (fields.length === 0) {
        return res.status(400).json({ error: 'No hay campos para actualizar.' });
    }
    try {
        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = [...fields.map(f => body[f]), id];
        const result = await executeQuery(
            `UPDATE cursos SET ${setClause} WHERE id = ?`,
            values
        );
        if (result.affectedRows > 0) {
            res.json({ id: Number(id), ...body });
        } else {
            res.status(404).json({ error: 'Curso no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar curso:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /cursos/:id
router.delete('/:id', async (req, res) => {
    try {
        const result = await executeQuery(`DELETE FROM cursos WHERE id = ?`, [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Curso no encontrado.' });
        }
        res.json({ success: true, message: `Curso con ID ${req.params.id} eliminado.` });
    } catch (error) {
        console.error('Error al eliminar curso:', error.message);
        res.status(500).json({ error: 'Error interno al eliminar.' });
    }
});

export default router;