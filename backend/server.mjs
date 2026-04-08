// server.mjs (Actualizado)
import express from 'express';
import cors from 'cors';
import Router from './server/Routes.mjs';
import { JWT_SECRET, SALT_ROUNDS } from './server/config.mjs'; // <-- Importa desde config

const app = express();
const PORT = 3000;

export { JWT_SECRET, SALT_ROUNDS }; 

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------------RUTAS-------------------------------------------//
app.use('/', Router);
// ---------------------------------------------------------------------------------//

app.listen(PORT, () => console.log(`📡 Servidor listo en http://localhost:${PORT}`));
