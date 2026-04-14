# Ejemplos JSON para probar Endpoints

---

## API IDENTITY (Puerto: 5001)

### 1. Registro ADMIN
```json
POST http://localhost:5001/api/auth/register
{
  "userName": "admin",
  "email": "admin@gimnasio.com",
  "password": "Admin123!",
  "role": "ADMIN"
}
```

### 2. Registro ENTRENADOR
```json
POST http://localhost:5001/api/auth/register
{
  "userName": "entrenador1",
  "email": "entrenador@gimnasio.com",
  "password": "Entrenador123!",
  "role": "ENTRENADOR"
}
```

### 3. Registro SOCIO
```json
POST http://localhost:5001/api/auth/register
{
  "userName": "socio1",
  "email": "socio@gimnasio.com",
  "password": "Socio123!",
  "role": "SOCIO"
}
```

### 4. Login
```json
POST http://localhost:5001/api/auth/login
{
  "userName": "admin",
  "password": "Admin123!"
}
```

### 5. Mi Usuario (con JWT)
```json
GET http://localhost:5001/api/auth/me
Header: Authorization: Bearer <token>
```

---

## API PROFILES (Puerto: 5002)

### 6. Crear SOCIO
```json
POST http://localhost:5002/api/socios
Header: Authorization: Bearer <token_ADMIN>
{
  "userName": "juanperez",
  "email": "juan@gimnasio.com",
  "password": "Juan123!",
  "phoneNumber": "999888777",
  "fechaNacimiento": "1990-05-15",
  "genero": "M",
  "alturaCm": 175.50,
  "pesoKg": 70.00,
  "emergenciaNombre": "Maria Perez",
  "emergenciaTelefono": "999666555"
}
```

### 7. Listar Socios (ADMIN)
```json
GET http://localhost:5002/api/socios
Header: Authorization: Bearer <token_ADMIN>
```

### 8. Obtener Socio por ID
```json
GET http://localhost:5002/api/socios/1
Header: Authorization: Bearer <token>
```

### 9. Mi Perfil (SOCIO)
```json
GET http://localhost:5002/api/socios/mi-perfil
Header: Authorization: Bearer <token_SOCIO>
```

### 10. Actualizar Socio
```json
PUT http://localhost:5002/api/socios/1
Header: Authorization: Bearer <token_ADMIN>
{
  "fechaNacimiento": "1990-05-15",
  "genero": "M",
  "alturaCm": 176.00,
  "pesoKg": 72.50,
  "emergenciaNombre": "Pedro Gomez",
  "emergenciaTelefono": "555444333"
}
```

### 11. Crear ENTRENADOR
```json
POST http://localhost:5002/api/entrenadores
Header: Authorization: Bearer <token_ADMIN>
{
  "userName": "carloscoach",
  "email": "carlos@gimnasio.com",
  "password": "Carlos123!",
  "phoneNumber": "999777666",
  "especialidad": "Entrenamiento Funcional",
  "certificaciones": "ACE Certified Personal Trainer"
}
```

### 12. Listar Entrenadores (ADMIN)
```json
GET http://localhost:5002/api/entrenadores
Header: Authorization: Bearer <token_ADMIN>
```

### 13. Mis Socios Asignados (ENTRENADOR)
```json
GET http://localhost:5002/api/entrenadores/mis-socios
Header: Authorization: Bearer <token_ENTRENADOR>
```

### 14. Actualizar Entrenador
```json
PUT http://localhost:5002/api/entrenadores/1
Header: Authorization: Bearer <token_ADMIN>
{
  "especialidad": "CrossFit y Funcional",
  "certificaciones": "ACE CPT, CrossFit Level 2"
}
```

### 15. Registrar Asistencia (Entrada)
```json
POST http://localhost:5002/api/asistencias
Header: Authorization: Bearer <token_ADMIN>
{
  "socioId": 1,
  "observaciones": "Llegó temprano al gimnasio"
}
```

### 16. Listar Asistencias (ADMIN)
```json
GET http://localhost:5002/api/asistencias
Header: Authorization: Bearer <token_ADMIN>
```

### 17. Listar Asistencias por Socio
```json
GET http://localhost:5002/api/asistencias/socio/1
Header: Authorization: Bearer <token_ADMIN>
```

### 18. Mi Historial de Asistencia (SOCIO)
```json
GET http://localhost:5002/api/asistencias/mi-historial
Header: Authorization: Bearer <token_SOCIO>
```

### 19. Registrar Salida
```json
PUT http://localhost:5002/api/asistencias/1/salida
Header: Authorization: Bearer <token_ADMIN>
{}
```

---

## API BILLING (Puerto: 5003)

### 20. Listar Membresías (Público)
```json
GET http://localhost:5003/api/membresias
```

### 21. Obtener Membresía por ID
```json
GET http://localhost:5003/api/membresias/1
```

### 22. Crear Membresía (ADMIN)
```json
POST http://localhost:5003/api/membresias
Header: Authorization: Bearer <token_ADMIN>
{
  "nombre": "Mensual Premium",
  "descripcion": "Acceso completo a todas las instalaciones",
  "duracionDias": 30,
  "precio": 1500.00,
  "esRenovable": true
}
```

### 23. Actualizar Membresía (ADMIN)
```json
PUT http://localhost:5003/api/membresias/1
Header: Authorization: Bearer <token_ADMIN>
{
  "nombre": "Mensual Premium Actualizado",
  "precio": 1600.00
}
```

### 24. Asignar Membresía a Socio (ADMIN)
```json
POST http://localhost:5003/api/sociomembresia
Header: Authorization: Bearer <token_ADMIN>
{
  "socioId": 1,
  "membresiaId": 1,
  "fechaInicio": "2026-03-29",
  "montoPagado": 1500.00,
  "notas": "Pago en efectivo"
}
```

### 25. Ver Membresías de Socio (ADMIN/ENTRENADOR)
```json
GET http://localhost:5003/api/sociomembresia/socio/1
Header: Authorization: Bearer <token_ADMIN>
```

### 26. Mi Membresía (SOCIO)
```json
GET http://localhost:5003/api/sociomembresia/id
Header: Authorization: Bearer <token_SOCIO>
```

### 27. Actualizar Estado Membresía (ADMIN)
```json
PUT http://localhost:5003/api/sociomembresia/1
Header: Authorization: Bearer <token_ADMIN>
{
  "estado": "PAUSADA",
  "notas": "Suspendido temporalmente"
}
```

---

## API WORKOUTS (Puerto: 5004)

### 28. Listar Ejercicios (Público)
```json
GET http://localhost:5004/api/ejercicios
```

### 29. Obtener Ejercicio por ID
```json
GET http://localhost:5004/api/ejercicios/1
```

### 30. Crear Ejercicio (ADMIN)
```json
POST http://localhost:5004/api/ejercicios
Header: Authorization: Bearer <token_ADMIN>
{
  "nombre": "Press de Banca",
  "descripcion": "Ejercicio para pectorales con barra",
  "grupoMuscular": "Pectorales"
}
```

### 31. Actualizar Ejercicio (ADMIN)
```json
PUT http://localhost:5004/api/ejercicios/1
Header: Authorization: Bearer <token_ADMIN>
{
  "nombre": "Press de Banca",
  "descripcion": "Ejercicio compound para pectorales",
  "grupoMuscular": "Pectorales"
}
```

### 32. Crear Rutina (ADMIN/ENTRENADOR)
```json
POST http://localhost:5004/api/rutinas
Header: Authorization: Bearer <token_ENTRENADOR>
{
  "socioId": 1,
  "nombre": "Rutina Fuerza Principiante",
  "objetivo": "Ganar masa muscular",
  "fechaFin": "2026-06-29",
  "ejercicios": [
    {
      "ejercicioId": 1,
      "orden": 1,
      "series": 3,
      "repeticiones": 12,
      "pesoObjetivoKg": 20.00,
      "duracionSegundos": null,
      "descansoSegundos": 60
    },
    {
      "ejercicioId": 2,
      "orden": 2,
      "series": 3,
      "repeticiones": 10,
      "pesoObjetivoKg": 15.00,
      "descansoSegundos": 90
    }
  ]
}
```

### 33. Listar Rutinas (ADMIN)
```json
GET http://localhost:5004/api/rutinas
Header: Authorization: Bearer <token_ADMIN>
```

### 34. Rutinas de un Socio (ADMIN/ENTRENADOR)
```json
GET http://localhost:5004/api/rutinas/socio/1
Header: Authorization: Bearer <token_ADMIN>
```

### 35. Mi Rutina (SOCIO)
```json
GET http://localhost:5004/api/rutinas/id
Header: Authorization: Bearer <token_SOCIO>
```

### 36. Obtener Rutina por ID
```json
GET http://localhost:5004/api/rutinas/1
Header: Authorization: Bearer <token>
```

### 37. Eliminar Rutina (ADMIN/ENTRENADOR)
```json
DELETE http://localhost:5004/api/rutinas/1
Header: Authorization: Bearer <token_ENTRENADOR>
```

---

## FLUJO COMPLETO DE PRUEBA

### Paso 1: Registrar ADMIN
```json
POST http://localhost:5001/api/auth/register
{
  "userName": "admin",
  "email": "admin@gimnasio.com",
  "password": "Admin123!",
  "role": "ADMIN"
}
```

### Paso 2: Login ADMIN (obtener token)
```json
POST http://localhost:5001/api/auth/login
{
  "userName": "admin",
  "password": "Admin123!"
}
```
*Copiar el token de la respuesta*

### Paso 3: Crear ENTRENADOR
```json
POST http://localhost:5002/api/entrenadores
Header: Authorization: Bearer <token_ADMIN>
{
  "userName": "coach1",
  "email": "coach@gimnasio.com",
  "password": "Coach123!",
  "especialidad": "Musculación"
}
```

### Paso 4: Crear SOCIO
```json
POST http://localhost:5002/api/socios
Header: Authorization: Bearer <token_ADMIN>
{
  "userName": "socio1",
  "email": "socio@gimnasio.com",
  "password": "Socio123!"
}
```

### Paso 5: Crear MEMBRESÍA
```json
POST http://localhost:5003/api/membresias
Header: Authorization: Bearer <token_ADMIN>
{
  "nombre": "Mensual",
  "descripcion": "Plan básico",
  "duracionDias": 30,
  "precio": 1000.00
}
```

### Paso 6: Asignar MEMBRESÍA
```json
POST http://localhost:5003/api/sociomembresia
Header: Authorization: Bearer <token_ADMIN>
{
  "socioId": 1,
  "membresiaId": 1,
  "fechaInicio": "2026-03-29",
  "montoPagado": 1000.00
}
```

### Paso 7: Registrar ASISTENCIA
```json
POST http://localhost:5002/api/asistencias
Header: Authorization: Bearer <token_ADMIN>
{
  "socioId": 1
}
```

### Paso 8: Crear EJERCICIO
```json
POST http://localhost:5004/api/ejercicios
Header: Authorization: Bearer <token_ADMIN>
{
  "nombre": "Sentadilla",
  "descripcion": "Ejercicio para piernas",
  "grupoMuscular": "Cuádriceps"
}
```

### Paso 9: Crear RUTINA
```json
POST http://localhost:5004/api/rutinas
Header: Authorization: Bearer <token_ENTRENADOR>
{
  "socioId": 1,
  "nombre": "Rutina Piernas",
  "objetivo": "Fortalecer miembros inferiores",
  "ejercicios": [
    {
      "ejercicioId": 1,
      "orden": 1,
      "series": 4,
      "repeticiones": 15
    }
  ]
}
```
