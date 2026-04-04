# Informe Técnico del Proyecto: Gimnasio API

## Resumen del Proyecto

Este proyecto es una **API RESTful** para la gestión integral de un gimnasio, implementada mediante una **arquitectura de microservicios** orquestados con **.NET Aspire**. El sistema permite gestionar usuarios, perfiles de socios y entrenadores, membresías, pagos, ejercicios y rutinas de entrenamiento.

---

## 1. Arquitectura del Sistema

### 1.1 Modelo de Microservicios

El proyecto sigue una arquitectura de microservicios donde cada servicio es independiente y expose su propia API REST:

```
┌─────────────────────────────────────────────────────────────┐
│                   GimnacioCore (Orquestador)                │
│                    .NET Aspire AppHost                      │
└─────────────────────────────────────────────────────────────┘
          │            │            │            │
          ▼            ▼            ▼            ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ ApiIdentity │ │ ApiProfiles │ │ ApiBilling  │ │ ApiWorkouts │
│  (Puerto    │ │  (Puerto    │ │  (Puerto    │ │  (Puerto    │
│   dinámico) │ │   dinámico) │ │   dinámico) │ │   dinámico) │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
          │            │            │            │
          └────────────┴────────────┴────────────┘
                         │
               ┌─────────▼─────────┐
               │   SQL Server     │
               │  (GimnasioDB)    │
               └─────────────────┘
```

### 1.2 Descripción de Microservicios

| Microservicio | Funcionalidad | Puerto |
|---------------|---------------|--------|
| **ApiIdentity** | Autenticación y gestión de usuarios con JWT | Dinámico |
| **ApiProfiles** | Socios,Entrenadores y control de asistencia | Dinámico |
| **ApiBilling** | Membresías y pagos | Dinámico |
| **ApiWorkouts** | Ejercicios y rutinas | Dinámico |

---

## 2. Tecnologías y Frameworks

### 2.1-stack Tecnológico

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Framework** | .NET | 8.0 |
| **Orquestación** | .NET Aspire | 8.2.2 |
| **Web API** | ASP.NET Core | 8.0 |
| **ORM** | Entity Framework Core | 8.0 |
| **Base de Datos** | SQL Server | - |
| **Autenticación** | JWT (JSON Web Tokens) | 8.0 |
| **Encriptación** | BCrypt.Net-Next | 4.0.3 |
| **Documentación** | Swagger/OpenAPI | 6.6.2 |

### 2.2 Paquetes NuGet Principales

```xml
<!-- ApiIdentity, ApiProfiles, ApiBilling, ApiWorkouts -->
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />

<!-- GimnacioCore (Orquestador) -->
<PackageReference Include="Aspire.Hosting.AppHost" Version="8.2.2" />
```

---

## 3. Estructura del Proyecto

```
Examen Final 5to ciclo/
│
├── GimnacioCore/           # Orquestador Aspire
│   ├── Program.cs         # Configuración de servicios
│   └── GimnacioCore.csproj
│
├── ApiIdentity/           # Autenticación y Usuarios
│   ├── Controllers/
│   │   └── AuthController.cs
│   ├── Data/
│   │   └── GimnasioDbContext.cs
│   ├── Models/
│   │   └── Usuario.cs
│   └── ApiIdentity.csproj
│
├── ApiProfiles/           # Socios, Entrenadores, Asistencias
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   └── ApiProfiles.csproj
│
├── ApiBilling/            # Membresías y Pagos
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   └── ApiBilling.csproj
│
├── ApiWorkouts/           # Ejercicios y Rutinas
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   └── ApiWorkouts.csproj
│
└── README.md              # Documentación del proyecto
```

---

## 4. Funcionalidad por Microservicio

### 4.1 ApiIdentity - Autenticación Centralizada

| Endpoint | Método | Descripción | Acceso |
|----------|--------|-------------|--------|
| `/api/auth/register` | POST | Registrar nuevo usuario | Público |
| `/api/auth/login` | POST | Iniciar sesión | Público |
| `/api/auth/me` | GET | Obtener usuario actual | Autenticado |

**Características:**
- Generación de tokens JWT
- Encriptación de contraseñas con BCrypt
- Gestión de roles de usuario

### 4.2 ApiProfiles - Gestión de Socios y Entrenadores

| Endpoint | Método | Descripción | Rol |
|----------|--------|-------------|-----|
| `/api/socios` | GET | Listar todos los socios | ADMIN |
| `/api/socios/{id}` | GET | Obtener socio por ID | ADMIN, ENTRENADOR |
| `/api/socios/mi-perfil` | GET | Mi perfil de socio | SOCIO |
| `/api/socios` | POST | Crear nuevo socio | ADMIN |
| `/api/socios/{id}` | PUT | Actualizar socio | ADMIN |
| `/api/entrenadores` | GET | Listar entrenadores | ADMIN |
| `/api/entrenadores/mis-socios` | GET | Mis socios asignados | ENTRENADOR |
| `/api/asistencias` | GET | Lista general de asistencia | ADMIN |
| `/api/asistencias` | POST | Registrar entrada | ADMIN, ENTRENADOR |
| `/api/asistencias/{id}/salida` | PUT | Registrar salida | ADMIN, ENTRENADOR |

### 4.3 ApiBilling - Membresías y Pagos

| Endpoint | Método | Descripción | Acceso |
|----------|--------|-------------|--------|
| `/api/membresias` | GET | Listar membresías | Público |
| `/api/membresias` | POST | Crear membresía | ADMIN |
| `/api/sociomembresia` | POST | Asignar membresía a socio | ADMIN |

### 4.4 ApiWorkouts - Ejercicios y Rutinas

| Endpoint | Método | Descripción | Rol |
|----------|--------|-------------|-----|
| `/api/ejercicios` | GET | Listar ejercicios | Público |
| `/api/ejercicios` | POST | Crear ejercicio | ADMIN |
| `/api/rutinas` | POST | Crear rutina | ADMIN, ENTRENADOR |
| `/api/rutinas/{id}` | DELETE | Eliminar rutina | ADMIN, ENTRENADOR |

---

## 5. Sistema de Autenticación y Autorización

### 5.1 Roles de Usuario

| Rol | Descripción |
|-----|-------------|
| **ADMIN** | Acceso completo a todas las funcionalidades |
| **SOCIO** | Acceso limitado a sus propios datos |
| **ENTRENADOR** | Acceso a datos de sus socios asignados |

### 5.2 Configuración JWT

```csharp
// Parámetros de validación del token
ValidIssuer = "ApiIdentity"
ValidAudience = "GimnasioApp"
IssuerSigningKey = "GimnasioSuperSecretKey2026!@#$%^&*()"
```

### 5.3 Flujo de Autenticación

1. **Registro**: El usuario se registra en `/api/auth/register`
2. **Login**: El usuario obtiene un token JWT en `/api/auth/login`
3. **Acceso**: Las demás APIs validan el token JWT para autorizar operaciones

---

## 6. Base de Datos

### 6.1 Configuración

- **Motor**: SQL Server
- **Base de datos**: `GimnasioDB`
- **ORM**: Entity Framework Core 8.0
- **Cadena de conexión**:
  ```
  Server=TU_SERVIDOR;Database=GimnasioDB;Trusted_Connection=True;TrustServerCertificate=True;
  ```

### 6.2 Modelo de Datos (Entidades principales)

**Usuario (ApiIdentity)**
- Id, UserName, Email, PasswordHash, Role, IsActive, CreatedAt, LastLoginAt

**Socio (ApiProfiles)**
- Id, UserId, FechaNacimiento, Genero, Altura, Peso, Objetivo

**Entrenador (ApiProfiles)**
- Id, UserId, Especialidad, AñosExperiencia

**Asistencia (ApiProfiles)**
- Id, SocioId, FechaEntrada, FechaSalida, EntrenadorId

**Membresía (ApiBilling)**
- Id, Nombre, Descripcion, DuracionDias, Precio, EsRenovable

**SocioMembresía (ApiBilling)**
- Id, SocioId, MembresíaId, FechaInicio, FechaFin, Estado

**Ejercicio (ApiWorkouts)**
- Id, Nombre, Descripcion, GrupoMuscular, UrlVideo

**Rutina (ApiWorkouts)**
- Id, SocioId, Nombre, Objetivo, FechaCreación

**RutinaEjercicio (ApiWorkouts)**
- Id, RutinaId, EjercicioId, Orden, Series, Repeticiones, Descanso

---

## 7. Ejecución del Proyecto

### 7.1 Requisitos Previos

- .NET 8.0 SDK
- SQL Server (LocalDB, Express o Standard)
- Windows 10/11 o Linux con soporte para .NET

### 7.2 Pasos para Ejecutar

1. **Restaurar dependencias**:
   ```bash
   cd GimnacioCore
   dotnet restore
   ```

2. **Ejecutar con Aspire**:
   ```bash
   dotnet run --project GimnacioCore
   ```

3. **Acceder al Dashboard**:
   - URL: `https://localhost:17269`
   - Token: Mostrado en consola

### 7.3 Documentación Swagger

Cada microservicio expone su documentación Swagger en su puerto dinámico. Acceda mediante el dashboard de Aspire.

---

## 8. Ejemplos de Uso

### 8.1 Registro de Usuario
```json
POST /api/auth/register
{
  "userName": "admin",
  "email": "admin@gimnasio.com",
  "password": "Admin123!",
  "role": "ADMIN"
}
```

### 8.2 Login
```json
POST /api/auth/login
{
  "userName": "admin",
  "password": "Admin123!"
}
```

### 8.3 Crear Socio
```json
POST /api/socios
Authorization: Bearer <token>
{
  "userName": "juan",
  "email": "juan@gimnasio.com",
  "password": "Juan123!",
  "fechaNacimiento": "1990-05-15",
  "genero": "M"
}
```

### 8.4 Crear Membresía
```json
POST /api/membresias
Authorization: Bearer <token>
{
  "nombre": "Mensual",
  "descripcion": "Plan básico",
  "duracionDias": 30,
  "precio": 1000,
  "esRenovable": true
}
```

---

## 9. Conclusiones

Este proyecto demuestra el uso de:

- **Arquitectura de microservicios** con .NET Aspire
- **Autenticación centralizada** con JWT
- **Entity Framework Core** para acceso a datos
- **Swagger** para documentación de APIs
- **Control de acceso basado en roles** (RBAC)
- **Code First** con migraciones de base de datos

El sistema es escalable y permite añadir nuevos microservicios de forma independiente. La separación de responsabilidades facilita el mantenimiento y la evolución del sistema.

---

*Informe técnico generado para presentación al instructor*
*Fecha: Abril 2026*
