// import { Injectable } from '@angular/core';
// import { forkJoin, map } from 'rxjs';
// import { UsuarioService } from '../services/usuario.service';
// import { CursoService } from '../services/curso.service';
// import { InscripcionService } from '../services/inscripcion.service';

// @Injectable({ providedIn: 'root' })
// export class DashboardService {

//   constructor(
//     private usuarios: UsuarioService,
//     private cursos: CursoService,
//     private inscripciones: InscripcionService,
//     private estudiantes: UsuarioService
//   ) {}

//   obtenerMétricas() {
//     const hoy = new Date();

//     return forkJoin({
//       usuarios: this.usuarios.listar(),
//       cursos: this.cursos.listar(),
//       ins: this.inscripciones.listar(),
//       est: this.estudiantes.getEstudiantes(),
//       ultimasInscripciones: this.inscripciones.fRegistro() // <-- agregado aquí
//     }).pipe(
//       map(({ usuarios, cursos, ins, est, ultimasInscripciones }) => ({
//         usuariosTotales: usuarios.length,
//         usuariosActivos: usuarios.filter(u => u.activo === 1).length,

//         cursosActivos: cursos.filter(c => c.estado === 'activo').length,
//         cursosInactivos: cursos.filter(c => c.estado !== 'activo').length,

//         estudiantesTotales: est.length,
//         estudiantesHoy: est.filter(s => {
//           const fecha = new Date((s as any).fecha_registro); 
//           return (
//             fecha.getFullYear() === hoy.getFullYear() &&
//             fecha.getMonth() === hoy.getMonth() &&
//             fecha.getDate() === hoy.getDate()
//           );
//         }).length,

//         inscripcionesActivas: ins.filter(i => i.estado === 'activo').length,
//         inscripcionesCanceladas: ins.filter(i => i.estado === 'cancelado').length,

//         actividadReciente: ultimasInscripciones.map(i => ({
//           ...i,
//           fecha: i.fecha_inscripcion // renombramos para consistencia en la UI
//         }))
//       }))
//     );
//   }
// }



import { Injectable } from '@angular/core';
import { forkJoin, map, tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { CursoService } from '../services/curso.service';
import { InscripcionService } from '../services/inscripcion.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    constructor(
    private usuarios: UsuarioService,
    private cursos: CursoService,
    private inscripciones: InscripcionService,
    private estudiantes: UsuarioService
  ) {}

  obtenerMétricas() {
    // Definimos 'hoy' una sola vez para cálculos consistentes.
    const hoy = new Date();

    return forkJoin({
      usuarios: this.usuarios.listar(),
      cursos: this.cursos.listar(),
      ins: this.inscripciones.listar(),
      est: this.estudiantes.getEstudiantes()
    }).pipe(
        map(({ usuarios, cursos, ins, est }) => ({
        usuariosTotales: usuarios.length,
        usuariosActivos: usuarios.filter(u => u.activo === 1).length,

        cursosActivos: cursos.filter(c => c.estado === 'activo').length,
        cursosInactivos: cursos.filter(c => c.estado !== 'activo').length,
        estudiantesTotales: est.length,
        estudiantesHoy: est.filter(s => {
        const fecha = new Date((s as any).fecha_registro); 
        return (
            fecha.getFullYear() === hoy.getFullYear() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getDate() === hoy.getDate()
        );
        }).length,

        inscripcionesActivas: ins.filter(i => i.estado === 'activo').length,
        inscripcionesCanceladas: ins.filter(i => i.estado === 'cancelado').length,

        actividadReciente: ins
        .sort((a, b) => new Date(b.fecha_inscripcion).getTime() - new Date(a.fecha_inscripcion).getTime())
        .slice(0, 4)
        .map(i => ({ ...i, fecha: i.fecha_inscripcion })),
    }))
    );
  }
  
}

