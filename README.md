Veterinaria - Aplicación Web con Angular

Integrantes del proyecto:
	Velarde Robles Francisco Xavier Leon   
	Roman Huaman Josled Luis Antonio  
	Osorio Guzman Jose Luis  

Proyecto de una aplicación web para gestionar una clínica veterinaria, desarrollada con Angular. Permite registrar mascotas, agendar citas, ver consultas y acceder a un dashboard con información útil.


📁 Estructura del Proyecto
La aplicación está organizada en módulos lógicos dentro de la carpeta src/app/:
app/
├── auth/              → Componente de inicio de sesión
├── citas/             → Gestión de citas médicas
├── consultas/         → Registro y visualización de consultas
├── registro-mascota/  → Formulario para registrar nuevas mascotas
├── dashboard/         → Panel principal con resúmenes y acceso rápido
├── models/            → Estructuras de datos (mascota, dueño, usuario, etc.)
├── services/          → Comunicación con el backend (no implementado aún)
├── directives/        → Directivas personalizadas (opcional)
├── pipes/             → Formateo de datos en la vista
├── pages/             → Páginas principales (opcional, puede integrarse con components)
└── backend/           → simula base de datos - todos los registros son presistentes

Componentes principales del sistema

LoginComponent
	Gestiona la autenticación de usuarios (administrador y empleado).
	Valida credenciales y redirige según el rol.

MascotaComponent
	Permite a los empleados registrar sus mascotas.
	Incluye formulario con validaciones (nombre, especie, edad, etc.).

CitasComponent
	Muestra el calendario o lista de citas programadas.
	Permite gestionar citas (confirmar, cancelar).

consultasComponent
	Muestra el historial médico completo de una mascota (consultas, diagnósticos, tratamientos).
	Accesible desde el perfil de la mascota o desde una cita completada.
	Resalta citas segun estado.

DashboardComponent
	Página principal tras el login.

Recepcionista: gestiona citas y registros.
Admin: acceso completo.

🔹 Elementos de soporte clave
Pipe de estado de cita
	Transforma valores técnicos (pendiente, completada, etc.) en etiquetas legibles y visualmente diferenciadas.

Directiva de resaltado de citas
Destaca visualmente las citas por estado en la consulta.

Formularios reactivos
	Usados en todos los formularios (registro de mascota, nueva cita, etc.) con validaciones integradas.
	Estos componentes y elementos cubren todos los flujos clave:
	✅ Autenticación
	✅ Registro de mascotas
	✅ Gestión de citas
	✅ Consulta de historial clínico
	Y están diseñados para escalar y adaptarse a los roles de los usuarios.
	
Cómo ejecutar el proyecto
	1.	tener instalado Node.js y Angular CLI.
	2.	terminal cd "carpeta del proyecto".
	3.	Ejecuta:
		npm install
		npm install @ng-bootstrap/ng-bootstrap --legacy-peer-deps
		cd backend
		node server.js  // inicaliza el servidor con la database - db.json

		luego ejecuta 
		ng serve --open
	4.	Se abrirá automáticamente tu navegador en: http://localhost:4200

pruebas de usabilidad

1. Login exitoso (admin)
Ingresar usuario:admin control total
contraseña:1234
Redirige a
/dashboard
✅
Login exitoso (veterinario1)
Ingresar usuario:veterinario1 control restringido
contraseña:1234
Redirige a
/dashboard
✅

2. Login fallido
Ingresar credenciales incorrectas
Muestra mensaje:
"Usuario o contraseña incorrectos"
✅
3. Registrar nueva mascota
Completar formulario con datos válidos
Aparece mensaje "Mascota registrada", formulario se limpia
✅
4. Crear cita usuario veterinario1 no todos los campos son editables
Seleccionar mascota registrada → auto rellenado de los campos propietrario y telefono, llenar fecha/hora servicio estado → guardar
Cita creada exitosamente
✅
4. Crear cita usuario admin todos los campos son editables
Seleccionar mascota registrada → auto rellenado de los campos propietrario y telefono, llenar fecha/hora servicio estado → guardar
Cita creada exitosamente
✅
5. Editar cita solo admin mode
en la columna acciones Hacer clic en "Editar" en el registro deseado → cambiar estado → guardar
Cambios reflejados en la lista
✅
6. Eliminar cita solo modo admin
Confirmar eliminación
Cita desaparece de la lista
✅
7. Filtro por nombre de mascota
Escribir "Luna" en buscador
Solo muestra citas de "Luna"
✅
8. Logout
Cerrar sesión
Redirige a login, sesión limpia en