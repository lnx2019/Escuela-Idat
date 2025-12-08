# 🏫 Escuela-IDAT - Instrucciones para el Despliegue

Este documento explica cómo configurar, ejecutar y probar la aplicación del proyecto en la rama `EFIF3`.

---

## 📂 1. Preparar el repositorio

Abre una terminal y ejecuta los siguientes comandos:

```bash
# Ir a la carpeta de trabajo
cd carpeta-de-trabajo

# Inicializar Git (si no se ha hecho previamente)
git init

# Agregar repositorio remoto
git remote add origin https://github.com/lnx2019/Escuela-Idat.git

# Traer todas las ramas y cambios
git fetch --all

# Cambiar a la rama EFIF3
git checkout EFIF3

# Clonar la rama EFIF3 (opcional)
git clone -b EFIF3 https://github.com/lnx2019/Escuela-Idat.git

📦 2. Instalar dependencias

Instala las dependencias principales:

npm install


Instala dependencias adicionales solo si es necesario:

npm install @angular/localize@20.3.9
npm install @ng-bootstrap/ng-bootstrap@19.0.1

⚙️ 3. Iniciar el backend

Ejecuta el backend en una terminal:

# Método recomendado
npm --prefix backend start

# Método tradicional
cd backend
node server.mjs

🌐 4. Iniciar la aplicación Angular

Abre otra terminal y ejecuta:

ng serve --open


Esto levantará la aplicación en tu navegador por defecto.

🧪 5. Testeo de la aplicación

Se crearon usuarios de prueba para facilitar las pruebas:

👤 Usuario administrador por defecto
usuario: admin
password: 123456

📝 Creación de nuevos usuarios

Puedes crear usuarios con rol estudiante o instructor mediante el formulario de registro antes de iniciar sesión.

Pasos para probar la funcionalidad:

Crear una cuenta completando los campos requeridos.

Registrar el usuario.

Iniciar sesión con el nuevo usuario y probar las funcionalidades según su rol.