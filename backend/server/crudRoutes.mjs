// routes/crudRoutes.mjs
import { Router } from 'express';
import usuariosRoutes from './routes/usuarios.routes.mjs';
import cursosRoutes from './routes/cursos.routes.mjs';
import inscripcionesRoutes from './routes/inscripciones.routes.mjs';
import reportesRoutes from './routes/reportes.routes.mjs';

const router = Router();

router.use('/usuarios', usuariosRoutes);
router.use('/cursos', cursosRoutes);
router.use('/inscripciones', inscripcionesRoutes);
router.use('/reportes', reportesRoutes);

export default router;