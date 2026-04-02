# Gimnasio API - Arquitectura de Microservicios

API RESTful para gestión de gimnasio con 4 microservicios orquestados con .NET Aspire.

## Requisitos

- **.NET 8.0 SDK** - [Descargar](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server** (LocalDB, Express o Standard)
- **Windows 10/11** o **Linux** con soporte para .NET

## Dependencias NuGet

### ApiIdentity
```xml
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.25" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
```

### ApiProfiles
```xml
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.25" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
```

### ApiBilling
```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.25" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
```

### ApiWorkouts
```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.25" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
```

### GimnacioCore (Orquestador Aspire)
```xml
<PackageReference Include="Aspire.Hosting.AppHost" Version="8.2.2" />
```
## Estructura de Proyectos

```
src/
├── GimnacioCore/     # Orquestador Aspire (puerto 15085)
├── ApiIdentity/      # Autenticación y Usuarios
├── ApiProfiles/      # Socios, Entrenadores, Asistencias
├── ApiBilling/       # Membresías y Pagos
└── ApiWorkouts/     # Ejercicios y Rutinas
```
## Instalación de Paquetes

```bash
``abrir directorio para desplegar el proyecto
``no inicializar con git init
``ejecutar 
git clone -b EFINAL https://github.com/lnx2019/Escuela-Idat.git .

# Restaurar todas las dependencias
cd GimnacioCore
dotnet restore
```
## Ejecución con Aspire (Recomendado)
```bash
dotnet run --project GimnacioCore

```Esto inicia:
- **Dashboard**: https://localhost:17269
- **ApiIdentity**: Puerto dinámico
- **ApiProfiles**: Puerto dinámico
- **ApiBilling**: Puerto dinámico
- **ApiWorkouts**: Puerto dinámico

> **Nota**: El dashboard requiere el token que aparece en la consola (ej: `https://localhost:17269/login?t=TOKEN`)

## Puertos y Endpoints

### ApiIdentity (Auth Centralizado)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| POST | /api/auth/register | Registrarse | Público |
| POST | /api/auth/login | Iniciar sesión | Público |
| GET | /api/auth/me | Mi usuario | Autenticado |

### ApiProfiles

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | /api/socios | Listar socios | ADMIN |
| GET | /api/socios/{id} | Socio por ID | ADMIN, ENTRENADOR |
| GET | /api/socios/mi-perfil | Mi perfil | SOCIO |
| POST | /api/socios | Crear socio | ADMIN |
| PUT | /api/socios/{id} | Actualizar socio | ADMIN |
| GET | /api/entrenadores | Listar trainers | ADMIN |
| GET | /api/entrenadores/mis-socios | Mis socios | ENTRENADOR |
| POST | /api/entrenadores | Crear trainer | ADMIN |
| GET | /api/asistencias | Lista general | ADMIN |
| POST | /api/asistencias | Registrar entrada | ADMIN, ENTRENADOR |
| PUT | /api/asistencias/{id}/salida | Registrar salida | ADMIN, ENTRENADOR |

### ApiBilling

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | /api/membresias | Lista membresías | Público |
| POST | /api/membresias | Crear membresía | ADMIN |
| POST | /api/sociomembresia | Asignar membresía | ADMIN |

### ApiWorkouts

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | /api/ejercicios | Lista ejercicios | Público |
| POST | /api/ejercicios | Crear ejercicio | ADMIN |
| POST | /api/rutinas | Crear rutina | ADMIN, ENTRENADOR |
| DELETE | /api/rutinas/{id} | Eliminar rutina | ADMIN, ENTRENADOR |

## Ejemplos JSON

### Registro
```json
POST /api/auth/register
{
  "userName": "admin",
  "email": "admin@gimnasio.com",
  "password": "Admin123!",
  "role": "ADMIN"
}
```

### Login
```json
POST /api/auth/login
{
  "userName": "admin",
  "password": "Admin123!"
}
```

### Crear Socio
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

### Crear Membresía
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

### Crear Ejercicio
```json
POST /api/ejercicios
Authorization: Bearer <token>
{
  "nombre": "Sentadilla",
  "descripcion": "Ejercicio de piernas",
  "grupoMuscular": "Cuádriceps"
}
```

### Crear Rutina
```json
POST /api/rutinas
Authorization: Bearer <token>
{
  "socioId": 1,
  "nombre": "Rutina Fuerza",
  "objetivo": "Ganar masa",
  "ejercicios": [
    { "ejercicioId": 1, "orden": 1, "series": 4, "repeticiones": 12 }
  ]
}
```

## Configuración JWT

El token se genera en **ApiIdentity** y las demás APIs solo lo validan:

```csharp
// Validación en todas las APIs
ValidIssuer = "ApiIdentity"
ValidAudience = "GimnasioApp"
IssuerSigningKey = "GimnasioSuperSecretKey2026!@#$%^&*()"
```

## Base de Datos

Todas las APIs comparten la misma base de datos SQL Server: `GimnasioDB`

```
Server=TU_SERVIDOR;Database=GimnasioDB;Trusted_Connection=True;TrustServerCertificate=True;
```

> **Nota**: Actualiza la cadena de conexión en `appsettings.json` de cada API según tu servidor SQL.

## Roles Disponibles

- **ADMIN**: Acceso completo
- **SOCIO**: Acceso limitado a sus propios datos
- **ENTRENADOR**: Acceso a datos de sus socios asignados