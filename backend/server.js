const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// --- Helpers robustos ---
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { usuarios: [], mascotas: [], citas: [], sesion: [] };
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return raw ? JSON.parse(raw) : { usuarios: [], mascotas: [], citas: [], sesion: [] };
  } catch (err) {
    console.error('Error leyendo DB:', err);
    return { usuarios: [], mascotas: [], citas: [], sesion: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error escribiendo DB:', err);
    return false;
  }
}

function nextIdFor(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 1;
  return Math.max(...arr.map(x => Number(x.id) || 0)) + 1;
}

// Rutas
app.get('/usuarios', (req, res) => {
  const db = readDB();
  res.json(db.usuarios);
});

app.get('/usuarios/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const usuario = (db.usuarios || []).find(c => Number(c.id) === id);
  if (!usuario) return res.status(404).json({ error: 'No encontrada' });
  res.json(usuario);
});

app.post('/usuarios', (req, res) => {
  const db = readDB();
  const data = db.usuarios;
  const nuevo = req.body;
  nuevo.id = data.length ? data[data.length - 1].id + 1 : 1;
  data.push(nuevo);
  db.usuarios = data;
  writeData(db);
  res.json(nuevo);
});


// Rutas
app.get('/sesion/:id', (req, res) => {
  const db = readDB();
  const sesionItem = db.sesion.length > 0 ? db.sesion[0] : { id: 1, usuarioId: null, nombre: null, rol: null };
  res.json(sesionItem);
});

// ✅ Ruta PUT para actualizar la sesión única
app.put('/sesion/:id', (req, res) => {
  const db = readDB();
  const nuevo = req.body;
  nuevo.id = 1; // Forzamos el ID a 1
  db.sesion = [nuevo]; // 👈 ¡Reemplazamos todo el array con un solo objeto!
  const ok = writeDB(db);
  if (!ok) return res.status(500).json({ error: 'No se pudo guardar la sesión' });
  res.json(nuevo);
});


// --- RUTAS /citas ---
app.get('/citas', (req, res) => {
  const db = readDB();
  res.json(db.citas || []);
});

app.get('/citas/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  const cita = (db.citas || []).find(c => Number(c.id) === id);
  if (!cita) return res.status(404).json({ error: 'No encontrada' });
  res.json(cita);
});

app.post('/citas', (req, res) => {
  try {
    const db = readDB();
    const nueva = req.body || {};

    // Validación mínima
    if (!nueva.nombreMascota || !nueva.duenio) {
      return res.status(400).json({ error: 'Campos requeridos: nombreMascota, duenio' });
    }

    // Asigna ID en el servidor (más seguro)
    nueva.id = nextIdFor(db.citas);
    db.citas = db.citas || [];
    db.citas.push(nueva);

    const ok = writeDB(db);
    if (!ok) {
      // Si falla la escritura, respondemos error
      return res.status(500).json({ error: 'No se pudo guardar la cita en el servidor' });
    }

    console.log(`POST /citas -> id ${nueva.id} creado`);
    return res.status(201).json(nueva);
  } catch (err) {
    console.error('POST /citas error:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

app.put('/citas/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = readDB();
    const idx = (db.citas || []).findIndex(c => Number(c.id) === id);
    if (idx === -1) return res.status(404).json({ error: 'No encontrada' });

    db.citas[idx] = req.body;
    //db.citas[idx].id = id; // forzar id coherente

    const ok = writeDB(db);
    if (!ok) return res.status(500).json({ error: 'No se pudo actualizar' });

    console.log(`PUT /citas/${id} -> actualizado`);
    return res.json(db.citas[idx]);
  } catch (err) {
    console.error('PUT /citas/:id error:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

app.delete('/citas/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = readDB();
    const before = (db.citas || []).length;
    db.citas = (db.citas || []).filter(c => Number(c.id) !== id);
    if (db.citas.length === before) return res.status(404).json({ error: 'No encontrada' });

    const ok = writeDB(db);
    if (!ok) return res.status(500).json({ error: 'No se pudo eliminar' });

    console.log(`DELETE /citas/${id} -> eliminado`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('DELETE /citas/:id error:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

app.get('/mascotas', (req, res) => res.json(readDB().mascotas || []));

// --- RUTA POST /mascotas ---
app.post('/mascotas', (req, res) => {
  try {
    const db = readDB();
    const nueva = req.body || {};

    if (!nueva.nombreMascota || !nueva.especie) {
      return res.status(400).json({ error: 'Campos requeridos: nombre, especie' });
    }

    nueva.id = nextIdFor(db.mascotas);
    db.mascotas = db.mascotas || [];
    db.mascotas.push(nueva);

    const ok = writeDB(db);
    if (!ok) return res.status(500).json({ error: 'No se pudo guardar la mascota' });

    console.log(`POST /mascotas -> id ${nueva.id} creado`);
    return res.status(201).json(nueva);
  } catch (err) {
    console.error('POST /mascotas error:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`📡 Servidor listo en http://localhost:${PORT}`));
