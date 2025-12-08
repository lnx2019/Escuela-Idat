// routes/inscripciones.routes.mjs
import { Router } from 'express';
import { executeQuery } from "../db.mjs";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const rows = await executeQuery("SELECT * FROM inscripciones"); // devuelve un array
        // res.json({ success: true, data: rows });
        res.json(rows);
    } catch (error) {
        console.error('Error en /inscripciones:', error.message);
        res.status(500).json({ success: false, error: 'Error al obtener inscripciones.' });
    }
});

// 🔵 GET /inscripciones/mis-inscripciones?estudiante_id=123
// Endpoint exclusivo para que un estudiante vea SOLO sus inscripciones
router.get('/mis-inscripciones', async (req, res) => {
  const { estudiante_id } = req.query;

  // Validación básica
  if (!estudiante_id || isNaN(estudiante_id)) {
    return res.status(400).json({
      success: false,
      error: 'Parámetro "estudiante_id" es obligatorio y debe ser un número.'
    });
  }

  try {
    const sql = `
      SELECT 
        i.id,
        i.estudiante_id,
        i.curso_id,
        i.fecha_inscripcion,
        i.estado,
        u.nombre AS estudiante_nombre,
        c.titulo AS curso_titulo
      FROM inscripciones i
      JOIN usuarios u ON i.estudiante_id = u.id
      JOIN cursos c ON i.curso_id = c.id
      WHERE i.estudiante_id = ?
      ORDER BY i.fecha_inscripcion DESC
    `;

    const inscripciones = await executeQuery(sql, [estudiante_id]);

    res.json({
      success: true,
      data: inscripciones
    });
  } catch (error) {
    console.error('Error en /inscripciones/mis-inscripciones:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al obtener tus inscripciones.'
    });
  }
});

router.get('/fregistro', async (req, res) => {
  try {
    // Obtener las últimas 5 inscripciones
    const rows = await executeQuery(
    //   "SELECT * FROM inscripciones ORDER BY fecha_inscripcion DESC LIMIT 5"
      "SELECT * FROM inscripciones ORDER BY fecha_inscripcion DESC"
    );

    if (rows.length === 0) {
      return res.json({ success: true, message: 'No hay inscripciones.' });
    }

    // res.json({ success: true, ultimasInscripciones: rows });
        res.json(rows);
  } catch (error) {
    console.error('Error en /inscripciones/fregistro:', error.message);
    res.status(500).json({ error: 'Error al obtener las últimas inscripciones.' });
  }
});

router.post('/', async (req, res) => {
    // Nota: El servicio Angular usa estudiante_id y curso_id
    const { estudiante_id, curso_id } = req.body; 

    if (!estudiante_id || !curso_id) {
        return res.status(400).json({ 
            success: false, 
            error: 'Campos faltantes: estudiante_id, curso_id' 
        });
    }

    try {
        const result = await executeQuery(
            `INSERT INTO inscripciones (estudiante_id, curso_id, estado, fecha_inscripcion) 
             VALUES (?, ?, 'activo', NOW())`,
            [estudiante_id, curso_id]
        );
        
        // El Angular Service espera una respuesta DynamicResponse con los datos de la inscripción creada.
        res.status(201).json({ 
            success: true, 
            data: { 
                id: result.insertId, 
                estudiante_id, 
                curso_id,
                fecha_inscripcion: new Date().toISOString(),
                estado: 'activo'
            }
        });
    } catch (error) {
        console.error('Error al crear inscripción:', error.message);
        res.status(500).json({ success: false, error: 'Error interno al crear inscripción.' });
    }
});

// ======================================================
// 🟣 GET /inscripciones/paginado - LISTADO PAGINADO
// ESTA ES LA RUTA CRUCIAL PARA LA VISUALIZACIÓN
// ======================================================
router.get('/paginado', async (req, res) => {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const offset = (page - 1) * limit;

    try {
        // 1) Obtener total de registros (para la paginación)
        const totalRows = await executeQuery(`SELECT COUNT(*) AS total FROM inscripciones`);
        const total = totalRows[0].total;

        // 2) Obtener la página solicitada con JOIN para datos legibles
        const sql = `
            SELECT 
                i.id,
                i.estudiante_id,
                i.curso_id,
                i.fecha_inscripcion,
                i.estado,
                u.nombre AS estudiante_nombre,
                c.titulo AS curso_titulo
            FROM inscripciones i
            JOIN usuarios u ON i.estudiante_id = u.id
            JOIN cursos c ON i.curso_id = c.id
            ORDER BY i.fecha_inscripcion DESC
            LIMIT ? OFFSET ?
        `;

        const inscripciones = await executeQuery(sql, [limit, offset]);

        // 3) La respuesta debe coincidir con la estructura esperada por el servicio Angular:
        // map(res => ({ data: res.data.inscripciones ?? [], total: res.data.total ?? 0 }))
        res.json({
            success: true,
            data: {
                inscripciones: inscripciones,
                total: total
            }
        });

    } catch (error) {
        console.error('Error en /inscripciones/paginado:', error.message);
        res.status(500).json({ success: false, error: 'Error al obtener inscripciones paginadas.' });
    }
});

router.get('/count', async (req, res) => {
    try {
        const rows = await executeQuery("SELECT COUNT(*) AS count FROM inscripciones WHERE estado = 'activo'");
        const count = rows.length > 0 ? rows[0].count : 0;
        
        res.json({ success: true, data: { count: count } });
    } catch (error) {
        console.error('Error en /inscripciones/count:', error.message);
        res.status(500).json({ success: false, error: 'Error al contar inscripciones activas.' });
    }
});

router.get('/activo', async (req, res) => {
    try {
        const rows = await executeQuery("SELECT * FROM inscripciones WHERE estado='activo'");
        if (!rows || rows.length === 0) {
            // Un 200 con data vacía es a menudo preferido en APIs para listados
            // return res.status(404).json({ success: false, error: 'No hay inscripciones activas.' });
            return res.json({ success: true, data: [] });
        }
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error en /inscripciones/activo:', error.message);
        res.status(500).json({ success: false, error: 'Error al obtener inscripciones activas.' });
    }
});


// ======================================================
// 🔵 GET /inscripciones/:id - OBTENER UNA INSCRIPCIÓN
// ======================================================
router.get('/:id', async (req, res) => {
    try {
        const rows = await executeQuery(
            `SELECT i.*, u.nombre AS estudiante_nombre, c.titulo AS curso_titulo
             FROM inscripciones i
             JOIN usuarios u ON i.estudiante_id = u.id
             JOIN cursos c ON i.curso_id = c.id
             WHERE i.id = ?`, 
            [req.params.id]
        );
        const data = rows[0] || null;

        if (!data) {
             return res.status(404).json({ success: false, error: 'Inscripción no encontrada.' });
        }
        
        res.json({ success: true, data: data });
    } catch (error) {
        console.error('Error en GET /inscripciones/:id:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


// ======================================================
// 🟠 PATCH /inscripciones/:id - CAMBIAR ESTADO
// ======================================================
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // Solo se permite actualizar el estado
    
    if (!estado) {
        return res.status(400).json({ success: false, error: 'Campo faltante: estado' });
    }
    
    // Opcional: Validar que el estado sea uno permitido
    const estadosValidos = ['activo', 'completado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ success: false, error: 'Estado no válido.' });
    }
    
    try {
        const result = await executeQuery(
            `UPDATE inscripciones SET estado = ? WHERE id = ?`,
            [estado, id]
        );

        if (result.affectedRows > 0) {
            // Devolvemos el objeto actualizado (simulado si no queremos hacer un SELECT posterior)
            res.json({ success: true, data: { id: Number(id), estado } });
        } else {
            res.status(404).json({ success: false, error: 'Inscripción no encontrada.' });
        }
    } catch (error) {
        console.error('Error al actualizar inscripción:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


// ======================================================
// 🔴 DELETE /inscripciones/:id - ELIMINAR
// ======================================================
router.delete('/:id', async (req, res) => {
    try {
        const result = await executeQuery(`DELETE FROM inscripciones WHERE id = ?`, [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Inscripción no encontrada.' });
        }
        res.json({ success: true, message: `Inscripción con ID ${req.params.id} eliminada.` });
    } catch (error) {
        console.error('Error al eliminar inscripción:', error.message);
        res.status(500).json({ success: false, error: 'Error interno al eliminar.' });
    }
});

export default router;