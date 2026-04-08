// server/config.mjs
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve();
dotenv.config({path: path.join(__dirname, 'server', '.env')});

// Constantes globales
export const JWT_SECRET = process.env.JWT_SECRET;
export const SALT_ROUNDS = 10;