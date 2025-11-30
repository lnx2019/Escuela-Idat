import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './server/authRoutes.mjs';
import crudRouter from './server/crudRoutes.mjs';
import path from 'path';

const __dirname = path.resolve();
dotenv.config({path: path.join(__dirname, 'server', '.env')});
//-----------------------------dotenv.config();--------------------------------------//
const app = express();
const PORT = 3000;
//--------------------Constantes globales (secretos y hashing)----------------------//
export const JWT_SECRET = process.env.JWT_SECRET;
export const SALT_ROUNDS = 10; // Nivel de dificultad para el hashing de Bcrypt
// ---------------------------------------------------------------------------------//
// Middleware
app.use(cors());
app.use(express.json());
// ---------------------------------RUTAS-------------------------------------------//
app.use('/auth', authRouter); 
app.use('/', crudRouter);
// ---------------------------------------------------------------------------------//
app.listen(PORT, () => console.log(`📡 Servidor listo en http://localhost:${PORT}`));